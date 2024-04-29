import prisma from '@/server/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get('id');

  if (id === null) {
    return Response.json({ error: 'No id provided' }, { status: 400 });
  }

  if (process.env.TMDB_ACCESS_TOKEN === undefined) {
    return Response.json(
      { error: 'No TMDB Access Token provided' },
      { status: 400 }
    );
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };

  const details = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=sv-SE`,
    options
  );
  const altTitles = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/alternative_titles?language=sv-SE`,
    options
  );
  const credits = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?language=sv-SE`,
    options
  );
  const watchProviders = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/watch/providers`,
    options
  );

  const creditsData = await credits.json();

  const data = await details.json();
  data['alternative_titles'] = (await altTitles.json())['titles'];
  data['cast'] = creditsData['cast'];
  data['crew'] = creditsData['crew'];
  data['watch_providers'] = (await watchProviders.json())['results'];

  let entry = await prisma.entry.findFirst({
    where: {
      tmdbId: data.id,
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
        tmdbId: data.belongs_to_collection.id,
      },
    });

    if (!existingCollection) {
      collectionId = (
        await prisma.collection.create({
          data: {
            name: data.belongs_to_collection.name,
            tmdbId: data.belongs_to_collection.id,
            posterPath: data.belongs_to_collection.poster_path,
            backdropPath: data.belongs_to_collection.backdropPath,
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
      tmdbId: data.id,
      collectionId,
      posterPath: data.poster_path,
      tagline: data.tagline,
      overview: data.overview,
      backdropPath: data.backdrop_path,
      category: 'Movie',
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
        tmdbId: genre.id,
      },
    });

    if (!existingGenre) {
      existingGenre = await prisma.genre.create({
        data: {
          tmdbId: genre.id,
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
        tmdbId: provider.provider_id,
      },
    });

    if (!existingWatchProvider) {
      existingWatchProvider = await prisma.watchProvider.create({
        data: {
          tmdbId: provider.id,
          name: provider.name,
          logoPath: provider.logo_path,
        },
      });
    }

    await prisma.entryWatchProvider.create({
      data: {
        watchProviderId: existingWatchProvider.id,
        entryId: entry.id,
        type,
        countryId: (
          await prisma.country.findFirst({
            where: {
              iso_3166_1: countryISO,
            },
          })
        )?.id!,
      },
    });
  };

  for (const watchProviderCountry of Object.keys(data.watch_providers)) {
    const watchProvider = data.watch_providers[watchProviderCountry];

    for (const provider of watchProvider.rent) {
      await handleWatchProvider(provider, 'rent', watchProviderCountry);
    }

    for (const provider of watchProvider.buy) {
      await handleWatchProvider(provider, 'buy', watchProviderCountry);
    }

    for (const provider of watchProvider.flatrate) {
      await handleWatchProvider(provider, 'flatrate', watchProviderCountry);
    }
  }

  for (const person of data.cast) {
    let existingPerson = await prisma.person.findFirst({
      where: {
        tmdbId: person.id,
      },
    });

    if (!existingPerson) {
      existingPerson = await prisma.person.create({
        data: {
          name: person.name,
          tmdbId: person.id,
          gender: person.gender,
          profilePath: person.profilePath,
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
        tmdbId: person.id,
      },
    });

    if (!existingPerson) {
      existingPerson = await prisma.person.create({
        data: {
          name: person.name,
          tmdbId: person.id,
          gender: person.gender,
          profilePath: person.profilePath,
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
        tmdbId: productionCompany.id,
      },
    });

    if (!existingCompany) {
      existingCompany = await prisma.company.create({
        data: {
          tmdbId: productionCompany.id,
          logo: productionCompany.logo_path,
          name: productionCompany.name,
          countryId: (
            await prisma.country.findFirst({
              where: {
                iso_3166_1: productionCompany.origin_country,
              },
            })
          )?.id!,
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

  return Response.json(data);
};
