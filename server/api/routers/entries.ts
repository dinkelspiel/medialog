import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { Category, UserEntry, UserList } from '@/prisma/generated/browser';
import z from 'zod';
import { protectedProcedure } from '../trpc';
import { searchEntries } from '@/server/meilisearch';
import prisma from '@/server/db';
import { getDefaultWhereForTranslations } from './dashboard_';
import { validateSessionTokenFromHeaders } from '@/server/auth/validateSession';
import { TRPCError } from '@trpc/server';

export const entriesRouter = createTRPCRouter({
  discover: protectedProcedure
    .input(
      z.object({
        categories: z.array(
          z.string().refine(e => ['Book', 'Movie', 'Series'].includes(e))
        ),
        sort: z.enum(['az', 'rating']),
        limit: z.number().default(120),
      })
    )
    .query(async ({ input, ctx }) => {
      const entries = await prisma.entry.findMany({
        where: {
          category: {
            in: input.categories as Category[],
          },
        },
        include: {
          translations: getDefaultWhereForTranslations(ctx.user),
          userEntries: true,
        },
        orderBy: input.sort === 'az' ? { originalTitle: 'asc' } : undefined,
        take: input.sort === 'az' ? input.limit : undefined,
      });

      return entries
        .map(entry => {
          const ratedUserEntries = entry.userEntries.filter(
            userEntry => userEntry.rating !== null
          );
          const averageRating =
            ratedUserEntries.reduce((sum, userEntry) => sum + userEntry.rating!, 0) /
            ratedUserEntries.length;

          return {
            ...entry,
            averageRating: Number.isNaN(averageRating) ? 0 : averageRating,
            ratingCount: ratedUserEntries.length,
            userEntries: entry.userEntries.filter(
              userEntry => userEntry.userId === ctx.user.id
            ),
          };
        })
        .sort((a, b) => {
          if (input.sort === 'az') return 0;
          if (b.averageRating === a.averageRating) {
            return b.ratingCount - a.ratingCount;
          }
          return b.averageRating - a.averageRating;
        })
        .slice(0, input.limit);
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
