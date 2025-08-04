import prisma from '@/server/db';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import z from 'zod';

export const userListRouter = createTRPCRouter({
  getListsByUser: protectedProcedure.query(async ({ ctx, input }) => {
    return prisma.userList.findMany({
      where: {
        userId: ctx.user.id,
      },
    });
  }),
  getListsWithEntryByUser: protectedProcedure
    .input(
      z.object({
        entryId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return prisma.userList.findMany({
        where: {
          userId: ctx.user.id,
          entries: {
            some: {
              entryId: input.entryId,
            },
          },
        },
      });
    }),
});
