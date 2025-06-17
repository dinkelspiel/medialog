import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { Category, UserEntry, UserList } from '@prisma/client';
import z from 'zod';
import { protectedProcedure } from '../trpc';
import { searchEntries } from '@/server/meilisearch';
import prisma from '@/server/db';
import { getDefaultWhereForTranslations } from './dashboard_';
import { validateSessionToken } from '@/server/auth/validateSession';
import { TRPCError } from '@trpc/server';

export const entriesRouter = createTRPCRouter({
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
        input.categories as Category[]
      );

      return entries;
    }),
  getEntryPage: publicProcedure
    .input(
      z.object({
        entryId: z.number(),
      })
    )
    .query(async ({ input }) => {
      // Entry Model
      const authUser = await validateSessionToken();
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

      // Ratings Graph
      let ratings = [];
      const totalRatings = await prisma.userEntry.count({
        where: {
          entryId: input.entryId,
          status: 'completed',
        },
      });
      for (let ratingThreshold = 0; ratingThreshold <= 10; ratingThreshold++) {
        if (totalRatings > 0) {
          ratings[ratingThreshold - 1] =
            (await prisma.userEntry.count({
              where: {
                entryId: input.entryId,
                status: 'completed',
                rating: {
                  gt: (ratingThreshold - 1) * 10,
                  lte: ratingThreshold * 10,
                },
              },
            })) / totalRatings;
        } else {
          ratings[ratingThreshold - 1] = 0;
        }
      }

      ratings[0] = (ratings[0] ?? 0) + (ratings[-1] ?? 0);
      delete ratings[-1];

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
