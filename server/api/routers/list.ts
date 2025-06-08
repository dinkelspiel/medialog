import { createTRPCRouter } from '@/server/api/trpc';
import prisma from '@/server/db';
import { Theme, UserListType } from '@prisma/client';
import z from 'zod';
import { protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { revalidatePath } from 'next/cache';

export const listRouter = createTRPCRouter({
  setType: protectedProcedure
    .input(
      z.object({
        listId: z.number(),
        type: z
          .string()
          .refine(value => Object.keys(UserListType).includes(value)),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const list = await prisma.userList.findFirst({
        where: {
          id: input.listId,
        },
      });
      if (!list) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No list with id',
        });
      }

      if (list.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not your list',
        });
      }

      await prisma.userList.update({
        where: {
          id: list.id,
        },
        data: {
          type: input.type as UserListType,
        },
      });
      revalidatePath(`/users/${ctx.user.username}/lists/${input.listId}`);
    }),

  createChallengeTimed: protectedProcedure
    .input(
      z.object({
        listId: z.number(),
        name: z.string(),
        from: z.string(),
        to: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const list = await prisma.userList.findFirst({
        where: {
          id: input.listId,
        },
      });
      if (!list) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No list with id',
        });
      }

      if (list.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not your list',
        });
      }

      if (new Date(input.to) < new Date(input.from)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "To can't be before from",
        });
      }

      await prisma.userListChallengeTimed.create({
        data: {
          name: input.name,
          from: new Date(input.from),
          to: new Date(input.to),
          listId: input.listId,
        },
      });
      revalidatePath(`/users/${ctx.user.username}/lists/${input.listId}`);
    }),

  editChallengeTimed: protectedProcedure
    .input(
      z.object({
        challengeId: z.number(),
        name: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const challengeTimed = await prisma.userListChallengeTimed.findFirst({
        where: {
          id: input.challengeId,
        },
        include: {
          list: true,
        },
      });
      if (!challengeTimed) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No challenge with id',
        });
      }

      if (challengeTimed.list.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not your list',
        });
      }

      let to = input.to ? input.to : challengeTimed.to;
      let from = input.from ? input.from : challengeTimed.from;

      if (new Date(to) < new Date(from)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "To can't be before from",
        });
      }

      await prisma.userListChallengeTimed.update({
        where: {
          id: input.challengeId,
        },
        data: {
          name: input.name ? input.name : challengeTimed.name,
          from: new Date(from),
          to: new Date(to),
        },
      });
      revalidatePath(
        `/users/${ctx.user.username}/lists/${challengeTimed.listId}`
      );
    }),
});
