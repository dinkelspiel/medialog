import prisma from '@/server/db';
import axios from 'axios';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get('tmdbId');

  if (id === null) {
    return Response.json({ error: 'No tmdbId provided' }, { status: 400 });
  }

  if (process.env.TMDB_ACCESS_TOKEN === undefined) {
    return Response.json(
      { error: 'No TMDB Access Token provided' },
      { status: 400 }
    );
  }

  const options = {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };

  const details = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    options
  );
  const altTitles = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}/alternative_titles?language=en-US`,
    options
  );
  const credits = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
    options
  );
  const watchProviders = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}/watch/providers?language=en-US`,
    options
  );

  const creditsData = credits.data;

  const data: any = details.data;
  if (data.status_message) {
    return Response.json({
      error: data.status_message,
    });
  }

  data['alternative_titles'] = altTitles.data['titles'];
  data['cast'] = creditsData['cast'];
  data['crew'] = creditsData['crew'];
  data['watch_providers'] = watchProviders.data['results'];

  let entry = await prisma.entry.findFirst({
    where: {
      foreignId: data.id.toString(),
      category: 'Movie',
    },
  });

  if (entry) {
    return Response.json(
      {
        error: 'TMDB Movie with id already imported',
      },
      { status: 400 }
    );
  }

  let collectionId = undefined;

  if (data.belongs_to_collection) {
    const existingCollection = await prisma.collection.findFirst({
      where: {
        foreignId: data.belongs_to_collection.id.toString(),
      },
    });

    if (!existingCollection) {
      collectionId = (
        await prisma.collection.create({
          data: {
            name: data.belongs_to_collection.name,
            foreignId: data.belongs_to_collection.id.toString(),
            posterPath:
              'https://image.tmdb.org/t/p/original/' +
              data.belongs_to_collection.poster_path,
            backdropPath:
              'https://image.tmdb.org/t/p/original/' +
              data.belongs_to_collection.backdrop_path,
            category: 'Movie',
          },
        })
      ).id;
    } else {
      collectionId = existingCollection.id;
    }
  }

  entry = await prisma.entry.create({
    data: {
      originalTitle: data.original_title,
      foreignId: data.id.toString(),
      collectionId,
      posterPath: 'https://image.tmdb.org/t/p/original/' + data.poster_path,
      tagline: data.tagline,
      overview: data.overview,
      backdropPath: 'https://image.tmdb.org/t/p/original/' + data.backdrop_path,
      category: 'Movie',
      releaseDate: new Date(data.release_date),
      length: data.runtime,
      originalLanguageId: (
        await prisma.language.findFirst({
          where: {
            iso_639_1: data.original_language,
          },
        })
      )?.id!,
    },
  });

  for (const genre of data.genres) {
    let existingGenre = await prisma.genre.findFirst({
      where: {
        foreignId: genre.id.toString(),
      },
    });

    if (!existingGenre) {
      existingGenre = await prisma.genre.create({
        data: {
          foreignId: genre.id.toString(),
          name: genre.name,
        },
      });
    }

    await prisma.entryGenre.create({
      data: {
        genreId: existingGenre.id,
        entryId: entry.id,
      },
    });
  }

  const handleWatchProvider = async (
    provider: any,
    type: 'rent' | 'buy' | 'flatrate',
    countryISO: string
  ) => {
    let existingWatchProvider = await prisma.watchProvider.findFirst({
      where: {
        foreignId: provider.provider_id.toString(),
      },
    });

    if (!existingWatchProvider) {
      existingWatchProvider = await prisma.watchProvider.create({
        data: {
          foreignId: provider.provider_id.toString(),
          name: provider.provider_name,
          logoPath: provider.logo_path,
        },
      });
    }

    const language = await prisma.country.findFirst({
      where: {
        iso_3166_1: countryISO,
      },
    });

    if (!language) {
      return;
    }

    await prisma.entryWatchProvider.create({
      data: {
        watchProviderId: existingWatchProvider.id,
        entryId: entry.id,
        type,
        countryId: language.id,
      },
    });
  };

  for (const watchProviderCountry of Object.keys(data.watch_providers)) {
    const watchProvider = data.watch_providers[watchProviderCountry];

    if (watchProvider.rent) {
      for (const provider of watchProvider.rent) {
        await handleWatchProvider(provider, 'rent', watchProviderCountry);
      }
    }

    if (watchProvider.buy) {
      for (const provider of watchProvider.buy) {
        await handleWatchProvider(provider, 'buy', watchProviderCountry);
      }
    }

    if (watchProvider.flatrate) {
      for (const provider of watchProvider.flatrate) {
        await handleWatchProvider(provider, 'flatrate', watchProviderCountry);
      }
    }
  }

  for (const person of data.cast) {
    let existingPerson = await prisma.person.findFirst({
      where: {
        foreignId: person.id.toString(),
      },
    });

    if (!existingPerson) {
      existingPerson = await prisma.person.create({
        data: {
          name: person.name,
          foreignId: person.id.toString(),
          gender: person.gender,
          profilePath: person.profile_path,
        },
      });
    }

    await prisma.entryCast.create({
      data: {
        personId: existingPerson.id,
        entryId: entry.id,
        character: person.character,
      },
    });
  }

  for (const person of data.crew) {
    // Check for person

    let existingPerson = await prisma.person.findFirst({
      where: {
        foreignId: person.id.toString(),
      },
    });

    if (!existingPerson) {
      existingPerson = await prisma.person.create({
        data: {
          name: person.name,
          foreignId: person.id.toString(),
          gender: person.gender,
          profilePath: person.profile_path,
        },
      });
    }

    // Check for Department

    let existingDepartment = await prisma.department.findFirst({
      where: {
        name: person.department,
      },
    });

    if (!existingDepartment) {
      existingDepartment = await prisma.department.create({
        data: {
          name: person.department,
        },
      });
    }

    // Check for job

    let existingJob = await prisma.job.findFirst({
      where: {
        name: person.job,
      },
    });

    if (!existingJob) {
      existingJob = await prisma.job.create({
        data: {
          name: person.job,
        },
      });
    }

    await prisma.entryCrew.create({
      data: {
        personId: existingPerson.id,
        entryId: entry.id,
        departmentId: existingDepartment.id,
        jobId: existingJob.id,
      },
    });
  }

  for (const productionCompany of data.production_companies) {
    let existingCompany = await prisma.company.findFirst({
      where: {
        foreignId: productionCompany.id.toString(),
      },
    });

    if (!existingCompany) {
      const country = await prisma.country.findFirst({
        where: {
          iso_3166_1: productionCompany.origin_country,
        },
      });

      if (!productionCompany.origin_country) {
        continue;
      }

      existingCompany = await prisma.company.create({
        data: {
          foreignId: productionCompany.id.toString(),
          logo: productionCompany.logo_path ?? '',
          name: productionCompany.name,
          country: {
            connectOrCreate: {
              where: {
                id: country?.id,
              },
              create: {
                iso_3166_1: productionCompany.origin_country,
                name:
                  'Forgotten Country Added ' + productionCompany.origin_country,
              },
            },
          },
        },
      });
    }

    await prisma.entryProductionCompany.create({
      data: {
        entryId: entry.id,
        companyId: existingCompany.id,
      },
    });
  }

  for (const productionCountry of data.production_countries) {
    await prisma.entryProductionCountry.create({
      data: {
        entryId: entry.id,
        countryId: (
          await prisma.country.findFirst({
            where: {
              iso_3166_1: productionCountry.iso_3166_1,
            },
          })
        )?.id!,
      },
    });
  }

  for (const spokenLanguages of data.spoken_languages) {
    await prisma.entrySpokenLanguage.create({
      data: {
        entryId: entry.id,
        languageId: (
          await prisma.language.findFirst({
            where: {
              iso_639_1: spokenLanguages.iso_639_1,
            },
          })
        )?.id!,
      },
    });
  }

  for (const alternativeTitle of data.alternative_titles) {
    await prisma.entryAlternativeTitle.create({
      data: {
        entryId: entry.id!,
        countryId: (
          await prisma.country.findFirst({
            where: {
              iso_3166_1: alternativeTitle.iso_3166_1,
            },
          })
        )?.id!,
        title: alternativeTitle.title,
      },
    });
  }

  return Response.json({
    message: `Imported movie ${data.title}`,
    entry: entry,
  });
};
