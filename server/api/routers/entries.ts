import { createTRPCRouter } from '@/server/api/trpc';
import { Category } from '@prisma/client';
import z from 'zod';
import { protectedProcedure } from '../trpc';
import { searchEntries } from '@/server/meilisearch';
import prisma from '@/server/db';
import { getDefaultWhereForTranslations } from './dashboard_';

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
      console.log(entries[0]);

      return entries;
    }),
});
