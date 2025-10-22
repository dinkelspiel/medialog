import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import z from 'zod';
import prisma from '@/server/db';
import { addMeilisearchEntryByEntryId } from '@/server/meilisearch';
import axios from 'axios';
import { TRPCError } from '@trpc/server';
import { Agent, setGlobalDispatcher } from 'undici';
import logger from '@/server/logger';
import { Entry } from '@prisma/client';

type ExternalSearch = {
  title: string;
  category: 'Series' | 'Movie' | 'Book';
  releaseDate: Date;
  author: string;
  foreignId: number | string;
  posterPath: string;
};

export const importRouter = createTRPCRouter({
  book: publicProcedure
    .input(
      z.object({
        olId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
        timeout: 60_000,
      };

      const work = (
        await axios.get(
          `https://openlibrary.org/works/${input.olId}.json`,
          options
        )
      ).data;

      let editionsData = (
        await axios.get(
          `https://openlibrary.org/works/${input.olId}/editions.json`,
          options
        )
      ).data;

      if (work.error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: work.error as string,
        });
      }

      let editions = editionsData.entries;

      for (let offset = 50; offset < editionsData.size; offset += 50) {
        editionsData = (
          await axios.get(
            `https://openlibrary.org/works/${input.olId}/editions.json?offset=${offset}`,
            options
          )
        ).data;

        editions = [...editions, ...editionsData.entries];
      }

      let fallbackNumberOfPages = 0;
      let fallbackLanguages = [];
      let earliestPublishDate = new Date();
      let edition: any | undefined = undefined;

      for (let editionData of editions) {
        if (editionData.languages) {
          fallbackLanguages = editionData.languages;
        }
        if (editionData.number_of_pages) {
          fallbackNumberOfPages = editionData.number_of_pages;
        }
        if (
          editionData.publish_date !== undefined &&
          new Date(editionData.publish_date).getTime() <
            earliestPublishDate.getTime()
        ) {
          earliestPublishDate = new Date(editionData.publish_date);
          edition = editionData;
        }
      }

      let entry = await prisma.entry.findFirst({
        where: {
          foreignId: work.key.split('/')[work.key.split('/').length - 1],
          category: 'Book',
        },
      });

      if (entry) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'OpenLibrary book with same work id already imported',
        });
      }

      if (!edition) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Work has no editions',
        });
      }

      const createData = {
        originalTitle: edition.title,
        foreignId: work.key.split('/')[work.key.split('/').length - 1],
        posterPath: `https://covers.openlibrary.org/b/id/${work.covers ? work.covers[0] : ''}-L.jpg`,
        tagline: '',
        overview: work.description
          ? typeof work.description === 'object'
            ? work.description.value
            : work.description
          : '',
        backdropPath: '',
        category: 'Book' as any,
        length: edition.number_of_pages ?? fallbackNumberOfPages ?? 0,
        releaseDate: earliestPublishDate,
        originalLanguageId: (
          await prisma.language.findFirst({
            where: {
              iso_639_2:
                (edition.languages ?? fallbackLanguages)
                  ? (edition.languages ?? fallbackLanguages).length > 0
                    ? (edition.languages ?? fallbackLanguages)[0].key.split(
                        '/'
                      )[
                        (edition.languages ?? fallbackLanguages)[0].key.split(
                          '/'
                        ).length - 1
                      ]
                    : 'eng'
                  : 'eng',
            },
          })
        )?.id!,
      };
      let entryId: number | null = null;
      try {
        entry = await prisma.entry.create({
          data: createData,
        });
        entryId = entry.id;

        for (const languageKey of edition.languages ?? fallbackLanguages) {
          const language = await prisma.language.findFirst({
            where: {
              iso_639_2:
                languageKey.key.split('/')[
                  languageKey.key.split('/').length - 1
                ],
            },
          });

          await prisma.entrySpokenLanguage.create({
            data: {
              entryId: entry.id,
              languageId: language?.id!,
            },
          });
        }

        for (const editionData of editions) {
          const language = await prisma.language.findFirst({
            where: {
              iso_639_2:
                (editionData.languages ?? fallbackLanguages)
                  ? (editionData.languages ?? fallbackLanguages).length > 0
                    ? (editionData.languages ?? fallbackLanguages)[0].key.split(
                        '/'
                      )[
                        (editionData.languages ??
                          fallbackLanguages)[0].key.split('/').length - 1
                      ]
                    : 'eng'
                  : 'eng',
            },
          });

          if (!language || language?.id === entry.originalLanguageId) {
            continue;
          }

          await prisma.entryAlternativeTitle.create({
            data: {
              entryId: entry.id,
              languageId: language.id!,
              title: editionData.title!,
            },
          });
        }

        await addMeilisearchEntryByEntryId(entry!.id);

        return {
          message: `Imported book ${entry.originalTitle}`,
          entry,
        };
      } catch (error) {
        logger.error(error);
        logger.error('Error importing book: ' + edition.title);

        if (entryId) {
          await prisma.entry.delete({
            where: {
              id: entryId,
            },
          });
          logger.error('Removed entry.');
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'An error occurred while importing the book. If the issue persists please contact an administrator.',
        });
      }
    }),
  movie: publicProcedure
    .input(
      z.object({
        tmdbId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (process.env.TMDB_ACCESS_TOKEN === undefined) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No TMDB Access Token provided',
        });
      }

      const options = {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
      };

      const details = await axios.get(
        `https://api.themoviedb.org/3/movie/${input.tmdbId}?language=en-US`,
        options
      );
      const altTitles = await axios.get(
        `https://api.themoviedb.org/3/movie/${input.tmdbId}/alternative_titles?language=en-US`,
        options
      );
      const translations = await axios.get(
        `https://api.themoviedb.org/3/movie/${input.tmdbId}/translations?language=en-US`,
        options
      );
      const credits = await axios.get(
        `https://api.themoviedb.org/3/movie/${input.tmdbId}/credits?language=en-US`,
        options
      );
      const watchProviders = await axios.get(
        `https://api.themoviedb.org/3/movie/${input.tmdbId}/watch/providers?language=en-US`,
        options
      );

      const creditsData = credits.data;

      const data: any = details.data;
      if (data.status_message) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: data.status_message,
        });
      }

      data['alternative_titles'] = altTitles.data['titles'];
      data['translations'] = translations.data['translations'];
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
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'TMDB Movie with id already imported',
        });
      }

      let collectionId: number | undefined = undefined;

      if (data.belongs_to_collection) {
        const existingCollection = await prisma.collection.findFirst({
          where: {
            foreignId: data.belongs_to_collection.id.toString(),
            category: 'Movie',
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
          backdropPath:
            'https://image.tmdb.org/t/p/original/' + data.backdrop_path,
          category: 'Movie',
          releaseDate: new Date(data.release_date),
          length: data.runtime,
          originalLanguageId: (
            await prisma.language.findFirst({
              where: {
                iso_639_1: data.original_language ?? 'en',
              },
            })
          )?.id!,
        },
      });

      try {
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
              await handleWatchProvider(
                provider,
                'flatrate',
                watchProviderCountry
              );
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
                        'Forgotten Country Added ' +
                        productionCompany.origin_country,
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
          const language = await prisma.language.findFirst({
            where: {
              iso_639_1: spokenLanguages.iso_639_1,
            },
          });

          if (!language) {
            logger.warn(
              `Spoken language ${spokenLanguages.iso_639_1} not found in database`
            );
            continue;
          }

          await prisma.entrySpokenLanguage.create({
            data: {
              entryId: entry.id,
              languageId: language.id,
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

        for (const translation of data.translations) {
          if (!translation.data.name) continue;

          await prisma.entryTranslation.create({
            data: {
              entryId: entry.id!,
              countryId: (
                await prisma.country.findFirst({
                  where: {
                    iso_3166_1: translation.iso_3166_1,
                  },
                })
              )?.id!,
              languageId: (
                await prisma.language.findFirst({
                  where: {
                    iso_639_1: translation.iso_639_1,
                  },
                })
              )?.id!,
              name: translation.data.name,
              overview: translation.data.overview ?? '',
              homepage: translation.data.homepage ?? '',
              tagline: translation.data.tagline ?? '',
            },
          });
        }

        await addMeilisearchEntryByEntryId(entry!.id);

        return {
          message: `Imported movie ${data.title}`,
          entry,
        };
      } catch (error) {
        logger.error(error);
        logger.error('Error importing movie: ' + entry.originalTitle);
        await prisma.entry.delete({
          where: {
            id: entry.id,
          },
        });
        logger.error('Removed entry.');

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'An error occurred while importing the movie. If the issue persists please contact an administrator.',
        });
      }
    }),
  series: publicProcedure
    .input(
      z.object({
        tmdbId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (process.env.TMDB_ACCESS_TOKEN === undefined) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No TMDB Access Token provided',
        });
      }

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
      };

      const details = await axios.get(
        `https://api.themoviedb.org/3/tv/${input.tmdbId}?language=en-US`,
        options
      );
      const altTitles = await axios.get(
        `https://api.themoviedb.org/3/tv/${input.tmdbId}/alternative_titles?language=en-US`,
        options
      );
      const translations = await axios.get(
        `https://api.themoviedb.org/3/tv/${input.tmdbId}/translations?language=en-US`,
        options
      );
      const watchProviders = await axios.get(
        `https://api.themoviedb.org/3/tv/${input.tmdbId}/watch/providers?language=en-US`,
        options
      );

      const data: any = details.data;
      if (data.status_message) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: data.status_message,
        });
      }

      data['alternative_titles'] = altTitles.data['results'];
      data['translations'] = translations.data['translations'];
      data['watch_providers'] = watchProviders.data['results'];

      for (var i = 0; i < data.seasons.length; i++) {
        const credits = await fetch(
          `https://api.themoviedb.org/3/tv/${input.tmdbId}/season/${data.seasons[i].season_number}/credits?language=en-US`,
          options
        );
        const creditsData: any = await credits.json();

        data.seasons[i].cast = creditsData.cast;
        data.seasons[i].crew = creditsData.crew;
        data.seasons[i].episodes = undefined;

        const translations = await fetch(
          `https://api.themoviedb.org/3/tv/${input.tmdbId}/season/${data.seasons[i].season_number}/translations?language=en-US`,
          options
        );
        const translationsData: any = await translations.json();

        data.seasons[i].translations = translationsData.translations;
      }

      // return Response.json(data);

      let entry = await prisma.entry.findFirst({
        where: {
          category: 'Series',
          collection: {
            foreignId: data.id.toString(),
          },
        },
      });

      if (entry) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'TMDB Series with id already imported',
        });
      }

      let collectionId: number | undefined = undefined;

      let collection = await prisma.collection.findFirst({
        where: {
          foreignId: data.id.toString(),
          category: 'Series',
        },
      });

      if (!collection) {
        collection = await prisma.collection.create({
          data: {
            name: data.original_name,
            foreignId: data.id.toString(),
            posterPath:
              'https://image.tmdb.org/t/p/original/' + data.poster_path,
            backdropPath:
              'https://image.tmdb.org/t/p/original/' + data.backdrop_path,
            category: 'Series',
          },
        });
      }

      collectionId = collection.id;

      try {
        let firstSeason: Entry | undefined = undefined;
        for (const season of data.seasons) {
          const existingEntry = await prisma.entry.findFirst({
            where: {
              foreignId: season.season_number.toString(),
              collection: {
                foreignId: data.id.toString(),
              },
              category: 'Series',
            },
          });

          if (existingEntry) {
            continue;
          }

          entry = await prisma.entry.create({
            data: {
              originalTitle: `${data.original_name}: ${season.name}`,
              foreignId: season.season_number.toString(),
              collectionId,
              posterPath:
                'https://image.tmdb.org/t/p/original/' + season.poster_path,
              tagline: data.tagline,
              overview:
                season.overview.length > 0 ? season.overview : data.overview,
              backdropPath:
                'https://image.tmdb.org/t/p/original/' + data.backdrop_path,
              category: 'Series',
              releaseDate: new Date(season.air_date),
              length: season.episode_count,
              originalLanguageId: (
                await prisma.language.findFirst({
                  where: {
                    iso_639_1: data.original_language ?? 'en',
                  },
                })
              )?.id!,
            },
          });

          if (season.season_number == 1) {
            firstSeason = entry;
          }

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
                entryId: entry?.id!,
                type,
                countryId: language.id,
              },
            });
          };

          for (const watchProviderCountry of Object.keys(
            data.watch_providers
          )) {
            const watchProvider = data.watch_providers[watchProviderCountry];

            if (watchProvider.rent) {
              for (const provider of watchProvider.rent) {
                await handleWatchProvider(
                  provider,
                  'rent',
                  watchProviderCountry
                );
              }
            }

            if (watchProvider.buy) {
              for (const provider of watchProvider.buy) {
                await handleWatchProvider(
                  provider,
                  'buy',
                  watchProviderCountry
                );
              }
            }

            if (watchProvider.flatrate) {
              for (const provider of watchProvider.flatrate) {
                await handleWatchProvider(
                  provider,
                  'flatrate',
                  watchProviderCountry
                );
              }
            }
          }

          for (const person of season.cast) {
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

          for (const person of season.crew) {
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

              if (!country) {
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
                          'Forgotten Country Added ' +
                          productionCompany.origin_country,
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
                )?.id,
                title: `${alternativeTitle.title}: ${season.name}`,
              },
            });
          }

          for (const translation of season.translations) {
            const collectionTranslation = data.translations.find(
              (e: any) => e.iso_639_1 === translation.iso_639_1
            );
            if (!collectionTranslation.data.name) {
              logger.error(
                `No name for collection ${entry.id} ${translation.name}`
              );
              continue;
            }

            let seasonTitle = translation.data.name
              ? translation.data.name
              : parseInt(entry.foreignId) > 0
                ? 'Season ' + entry.foreignId
                : 'Specials';

            let title = '';
            if (
              (seasonTitle as string).includes(collectionTranslation.data.name)
            ) {
              title = seasonTitle;
            } else {
              title =
                collectionTranslation.data.name +
                (seasonTitle === collectionTranslation.data.name
                  ? ''
                  : `: ${seasonTitle}`);
            }

            await prisma.entryTranslation.create({
              data: {
                entryId: entry!.id!,
                countryId: (
                  await prisma.country.findFirst({
                    where: {
                      iso_3166_1: translation.iso_3166_1,
                    },
                  })
                )?.id!,
                languageId: (
                  await prisma.language.findFirst({
                    where: {
                      iso_639_1: translation.iso_639_1,
                    },
                  })
                )?.id!,
                name: title,
                overview: translation.data.overview ?? '',
                homepage: translation.data.homepage ?? '',
                tagline: translation.data.tagline ?? '',
              },
            });
          }
        }

        await addMeilisearchEntryByEntryId(entry!.id);

        return {
          message: `Imported series ${data.original_name}`,
          entry: firstSeason!,
        };
      } catch (error) {
        logger.error(error);
        logger.error('Error importing series: ' + collection.name);
        await prisma.collection.delete({
          where: {
            id: collection.id,
          },
        });
        logger.error('Removed collection.');

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'An error occurred while importing the series. If the issue persists please contact an administrator.',
        });
      }
    }),
  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        excludeExisting: z.boolean(),
        take: z.number().default(10),
        categories: z.array(z.string()).default(['Book', 'Series', 'Movie']),
      })
    )
    .query(async ({ input, ctx }) => {
      setGlobalDispatcher(new Agent({ connect: { timeout: 50_000 } }));

      if (!input.query) {
        return [] as unknown as ExternalSearch[];
      }

      const openLibrary = (
        await axios.get(
          `https://openlibrary.org/search.json?title=${input.query.replace(' ', '+')}&limit=${input.take}`,
          {
            timeout: 60_000,
          }
        )
      ).data.docs
        .map((ol: any) => {
          let releaseDate = new Date();
          let releaseDateFallback: string | undefined = undefined;

          if (ol.first_publish_year) {
            releaseDate = new Date(ol.first_publish_year.toString());
          } else {
            releaseDateFallback = 'No release date';
          }

          return {
            title: ol.title,
            category: 'Book',
            releaseDate: releaseDateFallback ?? releaseDate,
            author: ol.author_name ? ol.author_name[0] : '',
            foreignId: ol.key.split('/')[ol.key.split('/').length - 1],
            posterPath: ol.cover_edition_key
              ? `https://covers.openlibrary.org/b/olid/${ol.cover_edition_key}-L.jpg`
              : '',
          };
        })
        .filter((e: any) => !!new Date(e.releaseDate))
        .filter(() => input.categories.includes('Book'));

      const options = {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        },
      };

      const tmdb = (
        await axios.get(
          `https://api.themoviedb.org/3/search/multi?query=${input.query}&include_adult=false&language=en-US&page=1`,
          options
        )
      ).data.results
        .map((tmdb: any) => ({
          title: tmdb.original_title ?? tmdb.name,
          category: tmdb.media_type === 'tv' ? 'Series' : 'Movie',
          releaseDate:
            tmdb.media_type === 'tv'
              ? new Date(tmdb.first_air_date).toDateString()
              : new Date(tmdb.release_date).toDateString(),
          author: '',
          foreignId: tmdb.id,
          posterPath: 'https://image.tmdb.org/t/p/original/' + tmdb.poster_path,
        }))
        .filter((tmdb: any) => input.categories.includes(tmdb.category))
        // .map((e: any) =>
        //   e.releaseDate === 'Invalid Date' ? { ...e, releaseDate: new Date() } : e
        // );
        .filter((e: any) => e.releaseDate !== 'Invalid Date');

      if (input.excludeExisting) {
        let finalMedia: any[] = [];
        for (const media of [...openLibrary, ...tmdb]) {
          const existing = await prisma.entry.findFirst({
            where: {
              OR: [
                {
                  foreignId: media.foreignId.toString(),
                  category: media.category,
                },
                {
                  collection: {
                    foreignId: media.foreignId.toString(),
                    category: media.category,
                  },
                },
              ],
            },
          });

          if (!existing) {
            finalMedia.push(media);
          }
        }

        return finalMedia.slice(0, input.take) as ExternalSearch[];
      }

      return [...openLibrary, ...tmdb].slice(0, input.take) as ExternalSearch[];
    }),
});
