import prisma from '@/server/db';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { getDefaultWhereForTranslations } from './dashboard_';
import {
  safeUserSelect,
  validateSessionTokenFromHeaders,
} from '@/server/auth/validateSession';
import { subMonths } from 'date-fns';
import { z } from 'zod';
import { Category } from '@/prisma/generated/browser';

const categoriesSchema = z.array(
  z.string().refine(e => ['Book', 'Movie', 'Series'].includes(e))
);

export const communityRouter = createTRPCRouter({
  getUserActivity: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        categories: categoriesSchema,
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const authUser = await validateSessionTokenFromHeaders(ctx.headers);

      const limit = 10;

      const activity = await prisma.userActivity.findMany({
        where: {
          userId: input.userId,
          NOT: {
            type: 'progressUpdate',
          },
          entry: {
            category: {
              in: input.categories as Category[],
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        skip: input.cursor ? 1 : 0,
        include: {
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
  getFeed: publicProcedure
    .input(
      z.object({
        categories: categoriesSchema,
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const authUser = await validateSessionTokenFromHeaders(ctx.headers);

      const limit = 50;

      const activity = await prisma.userActivity.findMany({
        where: {
          NOT: {
            type: 'progressUpdate',
          },
          entry: {
            category: {
              in: input.categories as Category[],
            },
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
  getTrending: publicProcedure
    .input(
      z.object({
        categories: categoriesSchema,
      })
    )
    .query(async ({ctx, input}) => {
    const authUser = await validateSessionTokenFromHeaders(ctx.headers);
    const oneMonthAgo = subMonths(new Date(), 1);

    const counts = await prisma.userActivity.groupBy({
      by: ['entryId'],
      where: {
        createdAt: { gte: oneMonthAgo },
        entry: {
          category: {
            in: input.categories as Category[],
          },
        },
      },
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
      where: { entryId: { in: entryIds }, rating: { not: null } },
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
          hasUserEntry:
            'userEntries' in entry &&
            Array.isArray(entry.userEntries) &&
            entry.userEntries.length > 0,
          averageRating: avgMap.get(c.entryId) ?? null,
        };
      })
      .filter(e => e.userEntriesPastMonth > 0);
  }),
});
