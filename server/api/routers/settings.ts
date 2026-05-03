import { createTRPCRouter } from '@/server/api/trpc';
import prisma from '@/server/db';
import { Theme } from '@/prisma/generated/browser';
import z from 'zod';
import { protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import {
  DEFAULT_MEDIA_TYPE_FILTERS,
  MEDIA_TYPE_FILTERS_SETTING_NAME,
} from '@/lib/mediaTypeFilters';

const mediaTypeFiltersSchema = z.object({
  movie: z.boolean(),
  book: z.boolean(),
  series: z.boolean(),
});

const parseMediaTypeFilters = (value: string) => {
  try {
    const result = mediaTypeFiltersSchema.safeParse(JSON.parse(value));
    return result.success ? result.data : DEFAULT_MEDIA_TYPE_FILTERS;
  } catch {
    return DEFAULT_MEDIA_TYPE_FILTERS;
  }
};

const saveMediaTypeFilters = async (
  userId: number,
  filters: typeof DEFAULT_MEDIA_TYPE_FILTERS
) => {
  await prisma.$executeRaw`
    INSERT INTO UserSetting (userId, name, value, createdAt, updatedAt)
    VALUES (${userId}, ${MEDIA_TYPE_FILTERS_SETTING_NAME}, ${JSON.stringify(filters)}, NOW(), NOW())
    ON DUPLICATE KEY UPDATE value = VALUES(value), updatedAt = NOW()
  `;
};

export const settingsRouter = createTRPCRouter({
  getMediaTypeFilters: protectedProcedure.query(async ({ ctx }) => {
    const rows = await prisma.$queryRaw<{ value: string }[]>`
      SELECT value FROM UserSetting
      WHERE userId = ${ctx.user.id} AND name = ${MEDIA_TYPE_FILTERS_SETTING_NAME}
      LIMIT 1
    `;

    if (rows[0]) {
      return parseMediaTypeFilters(rows[0].value);
    }

    await saveMediaTypeFilters(ctx.user.id, DEFAULT_MEDIA_TYPE_FILTERS);
    return DEFAULT_MEDIA_TYPE_FILTERS;
  }),
  setMediaTypeFilters: protectedProcedure
    .input(mediaTypeFiltersSchema)
    .mutation(async ({ input, ctx }) => {
      await saveMediaTypeFilters(ctx.user.id, input);
      return input;
    }),
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
