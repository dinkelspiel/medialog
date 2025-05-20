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
});
