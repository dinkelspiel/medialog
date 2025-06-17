import { createTRPCRouter } from '@/server/api/trpc';
import { protectedProcedure } from '../trpc';
import { unstable_cache } from 'next/cache';
import prisma from '@/server/db';
import {
  safeUserSelect,
  validateSessionToken,
} from '@/server/auth/validateSession';
import { Entry, EntryTranslation } from '@prisma/client';
import {
  getDefaultWhereForTranslations,
  getUserTitleFromEntry,
} from './dashboard_';

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
    let highestRatedEntries = await prisma.entry.findMany({
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
      .map(entry => ({
        ...entry,
        average:
          entry.userEntries.reduce(
            (sum: number, entry) => sum + entry.rating,
            0
          ) / entry.userEntries.length,
      }))
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
    ).map(entry => ({
      ...entry,
      average:
        entry.userEntries.reduce(
          (sum: number, entry) => sum + entry.rating,
          0
        ) / entry.userEntries.length,
    }));
  },
  ['dashboard-top-completed'],
  {
    tags: ['dashboard-top-completed'],
    revalidate: 86400,
  }
);

export const dashboardRouter = createTRPCRouter({
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
