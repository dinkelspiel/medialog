import { createTRPCRouter } from '@/server/api/trpc';
import prisma from '@/server/db';
import { Theme } from '@/prisma/generated/browser';
import z from 'zod';
import { protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

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
  setShowMediaMetaIn: protectedProcedure
    .input(
      z.object({
        iso_639_2: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const language = await prisma.language.findFirst({
        where: {
          iso_639_2: input.iso_639_2,
        },
      });
      if (!language) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid iso_639_2 code',
        });
      }
      await prisma.user.update({
        data: {
          showMediaMetaInId: language.id,
        },
        where: {
          id: ctx.user.id,
        },
      });
    }),
  getLanguages: protectedProcedure.query(async () => {
    return await prisma.language.findMany();
  }),
});
