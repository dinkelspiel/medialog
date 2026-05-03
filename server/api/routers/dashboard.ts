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
