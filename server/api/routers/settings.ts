import { createTRPCRouter } from '@/server/api/trpc';
import prisma from '@/server/db';
import { Theme } from '@prisma/client';
import z from 'zod';
import { protectedProcedure } from '../trpc';

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
