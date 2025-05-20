import { createTRPCRouter } from '@/server/api/trpc';
import z from 'zod';
import { protectedProcedure } from '../trpc';
import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import { ExtendedUserEntry } from '@/app/(app)/dashboard/state';
import { revalidatePath } from 'next/cache';

export const userEntryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        entryId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await validateSessionToken();

      if (!user) {
        return Response.json(
          { error: 'You are not logged in' },
          { status: 400 }
        );
      }

      const userEntry = await prisma.userEntry.create({
        data: {
          entryId: input.entryId,
          userId: user.id,
          rating: 0,
          progress: 0,
          notes: '',
        },
        include: {
          entry: {
            include: {
              translations: {
                where: {
                  language: {
                    id: user
                      ? (user.showMediaMetaInId ?? undefined)
                      : undefined,
                    iso_639_1: !user ? 'en' : undefined,
                  },
                },
              },
            },
          },
          user: true,
        },
      });

      revalidatePath('/dashboard');

      return {
        message: 'Added user entry',
        userEntry,
      } satisfies {
        message: string;
        userEntry: ExtendedUserEntry;
      };
    }),
});
