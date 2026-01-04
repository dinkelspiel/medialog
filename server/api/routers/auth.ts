import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import z from "zod";
import prisma from "@/server/db";
import bcrypt from "bcrypt";
import { addMonths } from "@/lib/addMonths";
import { generateToken } from "@/lib/generateToken";
import { TRPCError } from "@trpc/server";
import { serialize } from "cookie";

const genericLoginError = "Invalid email or password";

export const authRouter = createTRPCRouter({
  login: publicProcedure
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
          code: "BAD_REQUEST",
          message: genericLoginError,
        });
      }

      if (
        !bcrypt.compareSync(
          input.password,
          user.password.replace(/^\$2y/, "$2a")
        )
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: genericLoginError,
        });
      }

      const session = await prisma.session.create({
        data: {
          userId: user.id,
          expiry: addMonths(new Date(), 6),
          ipAddress: (
           ctx.headers.get("x-forwarded-for") ?? "127.0.0.1"
          ).split(",")[0]!,
          userAgent:
           ctx.headers.get("User-Agent") ?? "No user agent found",
          token: generateToken(64),
        },
      });

      // Maybe make this http only?
      const cookie = serialize('mlSessionToken', session.token, {
        // httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 31 * 6)
      })

      ctx.res.setHeader('Set-Cookie', cookie)

      return {
        message: "Login successful",
      };
    }),
  signUp: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(3, { message: "Username must be at least 3 characters long" })
          .max(25, { message: "Username must not exceed 25 characters" })
          .regex(/^[a-zA-Z0-9_]+$/, {
            message:
              "Username may only contain letters, numbers, and underscores",
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
          code: "BAD_REQUEST",
          message: "User already exists with same email or username",
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
          user.password.replace(/^\$2y/, "$2a")
        )
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: genericLoginError,
        });
      }

      const session = await prisma.session.create({
        data: {
          userId: user.id,
          expiry: addMonths(new Date(), 6),
          ipAddress: (
            ctx.headers.get("x-forwarded-for") ?? "127.0.0.1"
          ).split(",")[0]!,
          userAgent:
            ctx.headers.get("User-Agent") ?? "No user agent found",
          token: generateToken(64),
        },
      });

      // Maybe make this http only?
      const cookie = serialize('mlSessionToken', session.token, {
        // httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 31 * 6)
      })

      ctx.res.setHeader('Set-Cookie', cookie)

      return {
        message: "Sign up successfull",
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
          code: "BAD_REQUEST",
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
          code: "BAD_REQUEST",
          message: "Invalid forgot password",
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

      ctx.res.setHeader("Set-Cookie", "mlSessionToken=deleted; Expires=Thu, 01 Jan 1970 00:00:00 GMT");

      return {
        message: "Updated password",
      };
    }),
});
