import { createTRPCRouter } from '@/server/api/trpc';
import { protectedProcedure } from '../trpc';
import { unstable_cache } from 'next/cache';
import prisma from '@/server/db';
import {
  safeUserSelect,
  validateSessionToken,
  validateSessionTokenFromHeaders,
} from '@/server/auth/validateSession';
import {
  getDefaultWhereForTranslations,
  getUserTitleFromEntry,
} from './dashboard_';
import { publicProcedure } from '../trpc';
import z from 'zod';
import { Category } from '@/prisma/generated/browser';

const userEntryStatusFilterSchema = z.enum([
  'all',
  'planning',
  'watching',
  'paused',
  'dnf',
  'completed',
]);

const userEntrySortSchema = z.enum([
  'rating-desc',
  'rating-asc',
  'az',
  'completed',
  'updated',
]);

const userEntriesPageInput = z.object({
  cursor: z.number().nullish(),
  limit: z.number().default(60),
  filterStatus: userEntryStatusFilterSchema,
  filterCategories: z.array(
    z.string().refine(e => ['Book', 'Movie', 'Series'].includes(e))
  ),
  filterTitle: z.string().default(''),
  filterStyle: userEntrySortSchema,
  filterRatingRange: z.tuple([z.number(), z.number()]),
});

const getUserEntryOrderBy = (filterStyle: z.infer<typeof userEntrySortSchema>) => {
  switch (filterStyle) {
    case 'rating-desc':
      return [{ rating: 'desc' as const }, { id: 'desc' as const }];
    case 'rating-asc':
      return [{ rating: 'asc' as const }, { id: 'desc' as const }];
    case 'az':
      return [{ entry: { originalTitle: 'asc' as const } }, { id: 'desc' as const }];
    case 'completed':
      return [{ watchedAt: 'desc' as const }, { id: 'desc' as const }];
    case 'updated':
      return [{ updatedAt: 'desc' as const }, { id: 'desc' as const }];
  }
};

const getUserEntriesPage = async ({
  authUser,
  input,
  userId,
}: {
  authUser: NonNullable<Awaited<ReturnType<typeof validateSessionTokenFromHeaders>>>;
  input: z.infer<typeof userEntriesPageInput>;
  userId: number;
}) => {
  const offset = input.cursor ?? 0;
  const title = input.filterTitle.trim();
  const entryWhere = {
    category: {
      in: input.filterCategories as Category[],
    },
    OR:
      title === ''
        ? undefined
        : [
            {
              originalTitle: {
                contains: title,
              },
            },
            {
              translations: {
                some: {
                  name: {
                    contains: title,
                  },
                },
              },
            },
          ],
  };
  const shouldFilterRating =
    input.filterStatus !== 'planning' &&
    (input.filterRatingRange[0] !== 0 || input.filterRatingRange[1] !== 100);
  const userEntries = await prisma.userEntry.findMany({
    where: {
      userId,
      status:
        input.filterStatus === 'all'
          ? undefined
          : input.filterStatus,
      rating: shouldFilterRating
        ? {
            gte: input.filterRatingRange[0],
            lte: input.filterRatingRange[1],
          }
        : undefined,
      entry: entryWhere,
    },
    include: {
      user: {
        select: safeUserSelect(),
      },
      entry: {
        include: {
          userEntries: {
            where: {
              userId,
            },
          },
          translations: getDefaultWhereForTranslations(authUser),
        },
      },
    },
    orderBy: getUserEntryOrderBy(input.filterStyle),
    skip: offset,
    take: input.limit + 1,
  });

  return {
    userEntries: userEntries.slice(0, input.limit),
    nextCursor: userEntries.length > input.limit ? offset + input.limit : undefined,
  };
};

export const getUserTitleFromEntryId = async (entryId: number) => {
  const user = await validateSessionToken();

  const entry = await prisma.entry.findFirst({
    where: {
      id: entryId,
    },
    include: {
      translations: getDefaultWhereForTranslations(user),
    },
  });
  if (!entry) {
    return null;
  }

  return getUserTitleFromEntry(entry);
};

const getTop3RatedNotCompleted = unstable_cache(
  async (userId: number) => {
    const highestRatedEntries = await prisma.entry.findMany({
      include: {
        userEntries: true,
      },
    });

    const userEntries = await prisma.userEntry.findMany({
      where: {
        userId: userId,
        OR: [
          {
            status: 'watching',
          },
          {
            status: 'completed',
          },
        ],
      },
    });

    return highestRatedEntries
      .map(entry => {
        const ratedUserEntries = entry.userEntries.filter(
          userEntry => userEntry.rating !== null
        );
        const average =
          ratedUserEntries.reduce((sum, userEntry) => sum + userEntry.rating!, 0) /
          ratedUserEntries.length;

        return {
          ...entry,
          average: Number.isNaN(average) ? 0 : average,
        };
      })
      .filter(e => userEntries.find(f => f.entryId === e.id) === undefined)
      .filter(e => e.average)
      .filter(
        e =>
          highestRatedEntries.find(f => f.collectionId === e.collectionId)
            ?.id === e.id || e.collectionId === null
      )
      .sort((a, b) => b.average - a.average)
      .slice(0, 3);
  },
  ['dashboard-top-rated'],
  {
    tags: ['dashboard-top-rated'],
    revalidate: 86400,
  }
);

const getTop3CompletedNotCompleted = unstable_cache(
  async (userId: number) => {
    return (
      await prisma.entry.findMany({
        where: {
          NOT: {
            userEntries: {
              some: {
                userId,
                OR: [
                  {
                    status: 'watching',
                  },
                  {
                    status: 'completed',
                  },
                ],
              },
            },
          },
          userEntries: {
            some: {
              NOT: {
                userId,
              },
              OR: [
                {
                  status: 'watching',
                },
                {
                  status: 'completed',
                },
              ],
            },
          },
        },
        include: {
          userEntries: true,
        },
        orderBy: {
          userEntries: {
            _count: 'desc',
          },
        },
        take: 3,
      })
    ).map(entry => {
      const ratedUserEntries = entry.userEntries.filter(
        userEntry => userEntry.rating !== null
      );
      const average =
        ratedUserEntries.reduce((sum, userEntry) => sum + userEntry.rating!, 0) /
        ratedUserEntries.length;

      return {
        ...entry,
        average: Number.isNaN(average) ? 0 : average,
      };
    });
  },
  ['dashboard-top-completed'],
  {
    tags: ['dashboard-top-completed'],
    revalidate: 86400,
  }
);

export const dashboardRouter = createTRPCRouter({
  getEntries: protectedProcedure.input(userEntriesPageInput).query(async ({ ctx, input }) => {
    return getUserEntriesPage({
      authUser: ctx.user,
      input,
      userId: ctx.user.id,
    });
  }),
  getUserByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ input }) => {
      return prisma.user.findFirst({
        where: {
          username: input.username,
        },
        select: safeUserSelect(),
      });
    }),
  getEntriesByUsername: publicProcedure
    .input(
      userEntriesPageInput.extend({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const authUser = await validateSessionTokenFromHeaders(ctx.headers);
      const user = await prisma.user.findFirst({
        where: {
          username: input.username,
        },
        select: safeUserSelect(),
      });

      if (!user) {
        return null;
      }

      return getUserEntriesPage({
        authUser: authUser ?? user,
        input,
        userId: user.id,
      });
    }),
  getByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const authUser = await validateSessionTokenFromHeaders(ctx.headers);
      const user = await prisma.user.findFirst({
        where: {
          username: input.username,
        },
        select: safeUserSelect(),
      });

      if (!user) {
        return null;
      }

      const userEntries = await prisma.userEntry.findMany({
        where: {
          userId: user.id,
        },
        include: {
          user: {
            select: safeUserSelect(),
          },
          entry: {
            include: {
              userEntries: {
                where: {
                  userId: user.id,
                },
              },
              translations: getDefaultWhereForTranslations(authUser),
            },
          },
        },
      });

      return {
        user,
        userEntries,
      };
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    const userEntries = await prisma.userEntry.findMany({
      where: {
        userId: ctx.user.id,
      },
      include: {
        user: {
          select: safeUserSelect(),
        },
        entry: {
          include: {
            userEntries: {
              where: {
                userId: ctx.user.id,
              },
            },
            translations: getDefaultWhereForTranslations(ctx.user),
          },
        },
      },
    });

    const topCompleted = await getTop3CompletedNotCompleted(ctx.user.id);
    const topRated = await getTop3RatedNotCompleted(ctx.user.id);

    return {
      userEntries,
      topRated,
      topCompleted,
    };
  }),
});
