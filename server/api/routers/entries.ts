import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { Category, UserEntry, UserList } from '@/prisma/generated/browser';
import z from 'zod';
import { protectedProcedure } from '../trpc';
import { searchEntries } from '@/server/meilisearch';
import prisma from '@/server/db';
import { getDefaultWhereForTranslations } from './dashboard_';
import { validateSessionTokenFromHeaders } from '@/server/auth/validateSession';
import { TRPCError } from '@trpc/server';

const discoverLibraryStatusSchema = z.enum([
  'all',
  'in-library',
  'not-in-library',
]);

const getAverageRating = (userEntries: UserEntry[]) => {
  const ratedUserEntries = userEntries.filter(
    userEntry => userEntry.rating !== null
  );
  const averageRating =
    ratedUserEntries.reduce((sum, userEntry) => sum + userEntry.rating!, 0) /
    ratedUserEntries.length;

  return {
    averageRating: Number.isNaN(averageRating) ? 0 : averageRating,
    ratingCount: ratedUserEntries.length,
  };
};

const getLibraryWhere = (
  userId: number,
  libraryStatus: z.infer<typeof discoverLibraryStatusSchema>
) => {
  if (libraryStatus === 'in-library') {
    return {
      some: {
        userId,
      },
    };
  }

  if (libraryStatus === 'not-in-library') {
    return {
      none: {
        userId,
      },
    };
  }

  return undefined;
};

const isRatingInRange = (
  averageRating: number,
  ratingRange: [number, number]
) => averageRating >= ratingRange[0] && averageRating <= ratingRange[1];

export const entriesRouter = createTRPCRouter({
  discover: protectedProcedure
    .input(
      z.object({
        query: z.string().default(''),
        categories: z.array(
          z.string().refine(e => ['Book', 'Movie', 'Series'].includes(e))
        ),
        sort: z.enum(['az', 'rating']),
        libraryStatus: discoverLibraryStatusSchema.default('all'),
        ratingRange: z.tuple([z.number(), z.number()]).default([0, 100]),
        cursor: z.number().nullish(),
        limit: z.number().default(60),
      })
    )
    .query(async ({ input, ctx }) => {
      const offset = input.cursor ?? 0;
      const query = input.query.trim();
      const libraryWhere = getLibraryWhere(ctx.user.id, input.libraryStatus);
      const entryWhere = {
        category: {
          in: input.categories as Category[],
        },
        userEntries: libraryWhere,
        OR:
          query === ''
            ? undefined
            : [
                {
                  originalTitle: {
                    contains: query,
                  },
                },
                {
                  translations: {
                    some: {
                      name: {
                        contains: query,
                      },
                    },
                  },
                },
              ],
      };

      if (input.sort === 'rating') {
        const ratings = await prisma.userEntry.groupBy({
          by: ['entryId'],
          where: {
            rating: {
              not: null,
            },
            entry: entryWhere,
          },
          _avg: {
            rating: true,
          },
          _count: {
            rating: true,
          },
          orderBy: [
            {
              _avg: {
                rating: 'desc',
              },
            },
            {
              _count: {
                rating: 'desc',
              },
            },
          ],
        });
        const filteredRatings = ratings.filter(rating =>
          isRatingInRange(rating._avg.rating ?? 0, input.ratingRange)
        );
        const pagedRatings = filteredRatings.slice(offset, offset + input.limit + 1);
        const entries = await prisma.entry.findMany({
          where: {
            id: {
              in: pagedRatings.map(rating => rating.entryId),
            },
          },
          include: {
            translations: getDefaultWhereForTranslations(ctx.user),
            userEntries: true,
          },
        });
        const entryMap = new Map(entries.map(entry => [entry.id, entry]));
        const items = pagedRatings.slice(0, input.limit).map(rating => {
          const entry = entryMap.get(rating.entryId)!;

          return {
            ...entry,
            averageRating: rating._avg.rating ?? 0,
            ratingCount: rating._count.rating,
            userEntries: entry.userEntries.filter(
              userEntry => userEntry.userId === ctx.user.id
            ),
          };
        });

        return {
          items,
          nextCursor:
            pagedRatings.length > input.limit ? offset + input.limit : undefined,
        };
      }

      const shouldFilterRating =
        input.ratingRange[0] !== 0 || input.ratingRange[1] !== 100;
      const entries = await prisma.entry.findMany({
        where: entryWhere,
        include: {
          translations: getDefaultWhereForTranslations(ctx.user),
          userEntries: true,
        },
        orderBy: {
          originalTitle: 'asc',
        },
        skip: shouldFilterRating ? undefined : offset,
        take: shouldFilterRating ? undefined : input.limit + 1,
      });
      const entriesWithRating = entries.map(entry => {
        const rating = getAverageRating(entry.userEntries);

        return {
          ...entry,
          ...rating,
          userEntries: entry.userEntries.filter(
            userEntry => userEntry.userId === ctx.user.id
          ),
        };
      });
      const filteredEntries = shouldFilterRating
        ? entriesWithRating.filter(entry =>
            isRatingInRange(entry.averageRating, input.ratingRange)
          )
        : entriesWithRating;
      const items = filteredEntries.slice(
        shouldFilterRating ? offset : 0,
        (shouldFilterRating ? offset : 0) + input.limit
      );

      return {
        items,
        nextCursor:
          filteredEntries.length >
          (shouldFilterRating ? offset : 0) + input.limit
            ? offset + input.limit
            : undefined,
      };
    }),
  search: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        limit: z.number().default(10),
        categories: z.array(
          z.string().refine(e => ['Book', 'Movie', 'Series'].includes(e))
        ),
      })
    )
    .query(async ({ input, ctx }) => {
      // Return top entries for the specified categories if no query is specified
      if (input.query === '') {
        const entries = await prisma.entry.findMany({
          where: {
            category: {
              in: input.categories as Category[],
            },
          },
          include: {
            translations: getDefaultWhereForTranslations(ctx.user),
            userEntries: {
              where: {
                userId: ctx.user.id,
              },
            },
          },
          take: input.limit,
          orderBy: {
            userEntries: {
              _count: 'desc',
            },
          },
        });

        return entries.map(entry => ({
          ...entry,
          _rankingScore: undefined,
        }));
      }

      const entries = await searchEntries(
        input.query,
        input.limit,
        input.categories as Category[],
        ctx.headers
      );

      return entries;
    }),
  getEntryPage: publicProcedure
    .input(
      z.object({
        entryId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      // Entry Model
      const authUser = await validateSessionTokenFromHeaders(ctx.headers);
      const entry = await prisma.entry.findFirst({
        where: {
          id: input.entryId,
        },
        include: {
          userListEntries: {
            include: {
              list: true,
            },
          },
          translations: authUser
            ? getDefaultWhereForTranslations(authUser)
            : {
                where: {
                  language: {
                    iso_639_1: 'en',
                  },
                },
              },
        },
      });

      if (!entry) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No entry found with id',
        });
      }

      // Ratings Graph - Single query instead of N+1
      const ratingCounts = await prisma.userEntry.groupBy({
        by: ['rating'],
        where: {
          entryId: input.entryId,
          status: 'completed',
          rating: {
            not: null,
          },
        },
        _count: true,
      });

      const totalRatings = ratingCounts.reduce((sum, r) => sum + r._count, 0);
      const ratings: number[] = Array(10).fill(0);

      if (totalRatings > 0) {
        for (const { rating, _count } of ratingCounts) {
          const bucket = Math.min(Math.floor(rating! / 10), 9);
          ratings[bucket] += _count / totalRatings;
        }
      }

      // Reviews
      const reviews = await prisma.userEntry.findMany({
        where: {
          entryId: input.entryId,
          status: 'completed',
          NOT: {
            notes: {
              equals: '',
            },
          },
          visibility: !authUser ? 'public' : undefined,
          OR: authUser
            ? [
                {
                  visibility: 'public',
                },
                {
                  AND: [
                    {
                      visibility: 'friends',
                    },
                    {
                      user: {
                        following: {
                          some: {
                            followId: authUser.id,
                          },
                        },
                      },
                    },
                  ],
                },
                {
                  userId: {
                    equals: authUser.id,
                  },
                },
              ]
            : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      // Lists

      let userListsWithEntryByUser: UserList[] = [];
      if (authUser) {
        userListsWithEntryByUser = entry.userListEntries
          .map(e => e.list)
          .filter(e => e.userId === authUser.id);

        userListsWithEntryByUser = userListsWithEntryByUser.filter(
          (e, idx) =>
            userListsWithEntryByUser.findIndex(f => f.id === e.id) === idx
        );
      }

      let userListsByUser: UserList[] = [];
      if (authUser) {
        userListsByUser = await prisma.userList.findMany({
          where: {
            userId: authUser.id,
          },
        });
      }

      // UserEntry

      let userEntry: UserEntry | null = null;
      if (authUser) {
        userEntry = await prisma.userEntry.findFirst({
          where: {
            entryId: entry.id,
            userId: authUser.id,
          },
        });
      }

      return {
        entry: entry!,
        ratings,
        reviews,
        userListsWithEntryByUser,
        userListsByUser,
        userEntry,
      };
    }),
});
