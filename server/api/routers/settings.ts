import { createTRPCRouter } from '@/server/api/trpc';
import { protectedProcedure } from '../trpc';
import { unstable_cache } from 'next/cache';
import prisma from '@/server/db';
import z from 'zod';
import { Theme } from '@prisma/client';

export const settingsRouter = createTRPCRouter({
  setTheme: protectedProcedure
    .input(
      z.object({
        theme: z.string().refine(value => Object.keys(Theme).includes(value)),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await prisma.user.update({
        data: {
          theme: input.theme as Theme,
        },
        where: {
          id: ctx.user.id,
        },
      });
    }),
});
