import prisma from '@/server/db';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { getDefaultWhereForTranslations } from './dashboard_';
import {
  safeUserSelect,
  validateSessionToken,
} from '@/server/auth/validateSession';
import { subMonths } from 'date-fns';
import { z } from 'zod';

export const communityRouter = createTRPCRouter({
  getFeed: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ input }) => {
      const authUser = await validateSessionToken();

      const limit = 50;

      let activity = await prisma.userActivity.findMany({
        where: {
          NOT: {
            type: 'progressUpdate',
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: {
          user: {
            select: safeUserSelect(),
          },
          entry: {
            include: {
              translations: getDefaultWhereForTranslations(authUser),
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (activity.length > limit) {
        const nextItem = activity.pop();
        nextCursor = nextItem!.id;
      }

      return {
        activity,
        nextCursor,
      };
    }),
  getTrending: publicProcedure.query(async ({}) => {
    const authUser = await validateSessionToken();
    const oneMonthAgo = subMonths(new Date(), 1);

    const counts = await prisma.userEntry.groupBy({
      by: ['entryId'],
      where: { createdAt: { gte: oneMonthAgo }, status: 'completed' },
      _count: { entryId: true },
      orderBy: { _count: { entryId: 'desc' } },
      take: 4,
    });

    if (counts.length === 0) return [];

    const entryIds = counts.map(c => c.entryId);

    const entries = await prisma.entry.findMany({
      where: { id: { in: entryIds } },
      select: {
        id: true,
        originalTitle: true,
        posterPath: true,
        releaseDate: true,
        category: true,
        slug: true,
        _count: { select: { userEntries: true } },
        userEntries: authUser
          ? {
              where: { userId: authUser.id },
              take: 1,
              select: { id: true },
            }
          : false,
        translations: getDefaultWhereForTranslations(authUser),
      },
    });

    const averages = await prisma.userEntry.groupBy({
      by: ['entryId'],
      where: { entryId: { in: entryIds }, rating: { gt: 0 } },
      _avg: { rating: true },
    });

    const avgMap = new Map(averages.map(a => [a.entryId, a._avg.rating]));
    const entryMap = new Map(entries.map(e => [e.id, e]));

    return counts
      .map(c => {
        const entry = entryMap.get(c.entryId)!;
        return {
          entry,
          userEntriesPastMonth: c._count.entryId,
          hasUserEntry: !!(entry as any).userEntries?.length,
          averageRating: avgMap.get(c.entryId) ?? null,
        };
      })
      .filter(e => e.userEntriesPastMonth > 0);
  }),
});
