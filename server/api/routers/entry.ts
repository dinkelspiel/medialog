import { createTRPCRouter } from '@/server/api/trpc';
import z from 'zod';
import { protectedProcedure } from '../trpc';
import prisma from '@/server/db';
import { TRPCError } from '@trpc/server';

export const entryRouter = createTRPCRouter({
  getCollection: protectedProcedure
    .input(
      z.object({
        entryId: z.number()
      })
    )
    .query(async ({ input }) => {
      const entry = await prisma.entry.findFirst({where: {
        id: input.entryId
      }})

      if(!entry) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No entry with id"
        })
      }

      if(!entry.collectionId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No collection on entry"
        })
      }

      return await prisma.collection.findFirst({
        where: {
          id: entry?.collectionId
        }
      })
    }),
});
