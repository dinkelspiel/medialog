import { createTRPCRouter } from '@/server/api/trpc';
import z from 'zod';
import { protectedProcedure } from '../trpc';
import {
  safeUserSelect,
} from '@/server/auth/validateSession';
import prisma from '@/server/db';
import { ExtendedUserEntry } from '@/app/(app)/dashboard/state';
import { revalidatePath } from 'next/cache';
import { getDefaultWhereForTranslations } from './dashboard_';
import { UserEntryStatus, UserEntryVisibility } from '@/prisma/generated/browser';
import { TRPCError } from '@trpc/server';
import { pushDailyStreak } from '@/server/user/user';

export const userEntryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        entryId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userEntry = await prisma.userEntry.create({
        data: {
          entryId: input.entryId,
          userId: ctx.user.id,
          rating: 0,
          progress: 0,
          notes: '',
        },
        include: {
          entry: {
            include: {
              translations: getDefaultWhereForTranslations(ctx.user),
            },
          },
          user: {
            select: safeUserSelect(),
          },
        },
      });

      return {
        message: 'Added user entry',
        userEntry,
      } satisfies {
        message: string;
        userEntry: ExtendedUserEntry;
      };
    }),
  update: protectedProcedure
    .input(
      z.object({
        userEntryId: z.number(),
        status: z
          .string()
          .optional()
          .refine(
            e =>
              Object.values(UserEntryStatus).includes(e as UserEntryStatus) ||
              e === undefined,
            {
              message: 'Invalid status',
            }
          ),
        rating: z.number().min(0).max(100).optional(),
        notes: z.string().optional(),
        progress: z.number().optional(),
        visibility: z
          .string()
          .optional()
          .refine(
            e =>
              Object.values(UserEntryVisibility).includes(e as any) ||
              e === undefined,
            {
              message: 'Invalid visibility',
            }
          ),
        watchedAt: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let userEntry = await prisma.userEntry.findFirst({
        where: {
          id: input.userEntryId,
          userId: ctx.user.id,
        },
        include: {
          entry: true,
        },
      });

      if (!userEntry) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No user entry on user with id',
        });
      }

      if (input.progress && input.progress >= userEntry.entry.length) {
        const additionalData = `completed|${
          (await prisma.userEntry.count({
            where: {
              userId: ctx.user.id,
              entryId: userEntry.entryId,
            },
          })) - 1
        }`;

        if (
          (await prisma.userActivity.count({
            where: {
              userId: ctx.user.id,
              entryId: userEntry.entryId,
              additionalData,
            },
          })) === 0
        ) {
          await prisma.userActivity.create({
            data: {
              userId: ctx.user.id,
              entryId: userEntry.entryId,
              type: 'statusUpdate',
              additionalData,
            },
          });
        }
      } else if (input.progress) {
        await prisma.userActivity.create({
          data: {
            userId: ctx.user.id,
            entryId: userEntry.entryId,
            type: 'progressUpdate',
            additionalData: input.progress.toString(),
          },
        });
      } else if (input.status) {
        await prisma.userActivity.create({
          data: {
            userId: ctx.user.id,
            entryId: userEntry.entryId,
            type: 'statusUpdate',
            additionalData: `${input.status}|${
              (await prisma.userEntry.count({
                where: {
                  userId: ctx.user.id,
                  entryId: userEntry.entryId,
                },
              })) - 1
            }`,
          },
        });
      } else if (input.notes && input.rating) {
        const lastActivity = await prisma.userActivity.findFirst({
          where: {
            userId: ctx.user.id,
            type: {
              not: 'reviewed',
            },
          },
        });

        if (
          lastActivity &&
          lastActivity.additionalData.includes('completed') &&
          lastActivity.type === 'statusUpdate'
        ) {
          await prisma.userActivity.delete({
            where: {
              id: lastActivity.id,
            },
          });

          await prisma.userActivity.create({
            data: {
              userId: ctx.user.id,
              entryId: userEntry.entryId,
              type: 'completeReview',
              additionalData: `${
                (await prisma.userEntry.count({
                  where: {
                    userId: ctx.user.id,
                    entryId: userEntry.entryId,
                  },
                })) - 1
              }`,
            },
          });
        } else if (
          (
            await prisma.userEntry.findFirst({
              where: {
                id: userEntry.id,
              },
            })
          )?.rating === 0
        ) {
          await prisma.userActivity.create({
            data: {
              userId: ctx.user.id,
              entryId: userEntry.entryId,
              type: 'reviewed',
              additionalData: `${
                (await prisma.userEntry.count({
                  where: {
                    userId: ctx.user.id,
                    entryId: userEntry.entryId,
                  },
                })) - 1
              }`,
            },
          });
        }
      }

      if (input.watchedAt) {
        await prisma.userActivity.create({
          data: {
            type: 'progressUpdate',
            userId: ctx.user.id,
            entryId: userEntry.entryId,
            additionalData: '',
            createdAt: input.watchedAt,
          },
        });
      }

      const updateUserEntry = await prisma.userEntry.update({
        where: {
          id: input.userEntryId,
          userId: ctx.user.id,
        },
        data: {
          status: ((): UserEntryStatus | undefined => {
            if (input.progress && input.progress >= userEntry.entry.length) {
              return 'completed';
            }

            if (input.status) {
              return input.status as UserEntryStatus;
            } else {
              return undefined;
            }
          })(),
          notes: input.notes,
          rating: input.rating,
          progress: input.progress,
          watchedAt: ((): Date | undefined => {
            if (input.watchedAt) {
              return input.watchedAt;
            }

            if (input.progress && input.progress >= userEntry.entry.length) {
              return new Date();
            }

            if (input.status === 'completed') {
              return new Date();
            } else {
              return undefined;
            }
          })(),
          visibility: input.visibility as UserEntryVisibility,
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

      await pushDailyStreak(ctx.user);

      return {
        message: 'Updated user entry',
        userEntry: updateUserEntry,
      };
    }),
  remove: protectedProcedure
    .input(
      z.object({
        userEntryId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.userEntry.delete({
        where: {
          id: input.userEntryId,
          userId: ctx.user.id,
        },
      });

      return { message: 'Removed user entry' };
    }),
  get: protectedProcedure
    .input(
      z.object({
        id: z
          .object({
            entryId: z.number(),
          })
          .or(
            z.object({
              userEntryId: z.number(),
            })
          ),
      })
    )
    .query(async ({ ctx, input }) => {
      const userEntry = await prisma.userEntry.findFirst({
        where:
          'entryId' in input.id
            ? {
                userId: ctx.user.id,
                entryId: input.id.entryId,
              }
            : {
                id: input.id.userEntryId,
                userId: ctx.user.id,
              },
        include: {
          entry: {
            include: {
              translations: getDefaultWhereForTranslations(ctx.user),
            },
          },
          user: {
            select: safeUserSelect(),
          },
        },
      });
      return userEntry satisfies ExtendedUserEntry | null;
    }),
});
