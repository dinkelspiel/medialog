import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import z from 'zod';
import { protectedProcedure } from '../trpc';
import { Octokit } from 'octokit';
import { createAppAuth } from '@octokit/auth-app';
import prisma from '@/server/db';
import bcrypt from 'bcrypt';
import { addMonths } from '@/lib/addMonths';
import { cookies, headers } from 'next/headers';
import { generateToken } from '@/lib/generateToken';
import { TRPCError } from '@trpc/server';

const genericLoginError = 'Invalid email or password';

export const authRouter = createTRPCRouter({
  login: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: genericLoginError,
        });
      }

      if (
        !bcrypt.compareSync(
          input.password,
          user.password.replace(/^\$2y/, '$2a')
        )
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: genericLoginError,
        });
      }

      const session = await prisma.session.create({
        data: {
          userId: user.id,
          expiry: addMonths(new Date(), 6),
          ipAddress: (
            (await headers()).get('x-forwarded-for') ?? '127.0.0.1'
          ).split(',')[0]!,
          userAgent:
            (await headers()).get('User-Agent') ?? 'No user agent found',
          token: generateToken(64),
        },
      });

      (await cookies()).set('mlSessionToken', session.token, {
        expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 31 * 6,
      });

      return {
        message: 'Login successful',
      };
    }),
  signUp: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(3, { message: 'Username must be at least 3 characters long' })
          .max(25, { message: 'Username must not exceed 25 characters' })
          .regex(/^[a-zA-Z0-9_]+$/, {
            message:
              'Username may only contain letters, numbers, and underscores',
          }),
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            {
              username: input.username,
            },
            {
              email: input.email,
            },
          ],
        },
      });

      if (user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User already exists with same email or username',
        });
      }

      user = await prisma.user.create({
        data: {
          username: input.username,
          email: input.email,
          password: bcrypt.hashSync(input.password, 10),
        },
      });

      if (
        !bcrypt.compareSync(
          input.password,
          user.password.replace(/^\$2y/, '$2a')
        )
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: genericLoginError,
        });
      }

      const session = await prisma.session.create({
        data: {
          userId: user.id,
          expiry: addMonths(new Date(), 6),
          ipAddress: (
            (await headers()).get('x-forwarded-for') ?? '127.0.0.1'
          ).split(',')[0]!,
          userAgent:
            (await headers()).get('User-Agent') ?? 'No user agent found',
          token: generateToken(64),
        },
      });

      (await cookies()).set('mlSessionToken', session.token, {
        expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 31 * 6,
      });

      return {
        message: 'Sign up successfull',
      };
    }),
  forgotPassword: publicProcedure
    .input(
      z.object({
        password: z.string(),
        confirmPassword: z.string(),
        forgotPasswordId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.password != input.confirmPassword) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "Passwords don't match",
        });
      }

      const forgotPassword = await prisma.userForgotPassword.findFirst({
        where: {
          id: input.forgotPasswordId,
          used: false,
        },
      });

      if (!forgotPassword) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid forgot password',
        });
      }

      await prisma.userForgotPassword.update({
        where: {
          id: input.forgotPasswordId,
        },
        data: {
          used: true,
        },
      });

      await prisma.user.update({
        where: {
          id: forgotPassword.userId,
        },
        data: {
          password: bcrypt.hashSync(input.password, 10),
        },
      });

      (await cookies()).delete('mlSessionToken');

      return {
        message: 'Updated password',
      };
    }),
});
