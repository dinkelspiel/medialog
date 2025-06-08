import { UserEntryStatusArray } from '@/lib/userEntryStatus';
import { getDefaultWhereForTranslations } from '@/server/api/routers/dashboard_';
import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import { pushDailyStreak } from '@/server/user/user';
import { UserEntryStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';
import z, { date } from 'zod';

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { userEntryId: string } }
) => {
  const body = await request.json();

  const schema = z.object({
    status: z
      .string()
      .optional()
      .refine(
        e =>
          UserEntryStatusArray.includes(e as UserEntryStatus) ||
          e === undefined,
        {
          message: 'Invalid status',
        }
      ),
    rating: z.number().min(0).max(100).optional(),
    notes: z.string().optional(),
    progress: z.number().optional(),
  });

  const data = schema.safeParse(body);

  if (!data.success) {
    return Response.json(
      {
        error: Object.entries(data.error.flatten().fieldErrors)
          .map(entry => entry[0] + ' ' + entry[1].map(error => error).join(' '))
          .join(' '),
      },
      { status: 400 }
    );
  }

  const user = await validateSessionToken();

  if (!user) {
    return Response.json({ error: 'You are not logged in' }, { status: 400 });
  }

  let userEntry = await prisma.userEntry.findFirst({
    where: {
      id: Number(params.userEntryId),
      userId: user.id,
    },
    include: {
      entry: true,
    },
  });

  if (!userEntry) {
    return Response.json(
      {
        error: 'No User Entry found with id',
      },
      { status: 400 }
    );
  }

  if (data.data.progress && data.data.progress > userEntry.entry.length) {
    const additionalData = `completed|${
      (await prisma.userEntry.count({
        where: {
          userId: user.id,
          entryId: userEntry.entryId,
        },
      })) - 1
    }`;

    if (
      (await prisma.userActivity.count({
        where: {
          userId: user.id,
          entryId: userEntry.entryId,
          additionalData,
        },
      })) === 0
    ) {
      await prisma.userActivity.create({
        data: {
          userId: user.id,
          entryId: userEntry.entryId,
          type: 'statusUpdate',
          additionalData,
        },
      });
    }
  } else if (data.data.status) {
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        entryId: userEntry.entryId,
        type: 'statusUpdate',
        additionalData: `${data.data.status}|${
          (await prisma.userEntry.count({
            where: {
              userId: user.id,
              entryId: userEntry.entryId,
            },
          })) - 1
        }`,
      },
    });
  } else if (data.data.notes && data.data.rating) {
    const lastActivity = await prisma.userActivity.findFirst({
      where: {
        userId: user.id,
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
          userId: user.id,
          entryId: userEntry.entryId,
          type: 'completeReview',
          additionalData: `${
            (await prisma.userEntry.count({
              where: {
                userId: user.id,
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
          userId: user.id,
          entryId: userEntry.entryId,
          type: 'reviewed',
          additionalData: `${
            (await prisma.userEntry.count({
              where: {
                userId: user.id,
                entryId: userEntry.entryId,
              },
            })) - 1
          }`,
        },
      });
    }
  }

  userEntry = await prisma.userEntry.update({
    where: {
      id: Number(params.userEntryId),
    },
    data: {
      status: ((): UserEntryStatus | undefined => {
        if (data.data.progress && data.data.progress > userEntry.entry.length) {
          return 'completed';
        }

        if (data.data.status) {
          return data.data.status as UserEntryStatus;
        } else {
          return undefined;
        }
      })(),
      notes: data.data.notes,
      rating: data.data.rating,
      progress: data.data.progress,
      watchedAt: ((): Date | undefined => {
        if (
          data.data.progress &&
          data.data.progress >= userEntry.entry.length
        ) {
          return new Date();
        }

        if (data.data.status === 'completed') {
          return new Date();
        } else {
          return undefined;
        }
      })(),
    },
    include: {
      user: true,
      entry: {
        include: {
          userEntries: {
            where: {
              userId: user.id,
            },
          },
          translations: getDefaultWhereForTranslations(user),
        },
      },
    },
  });

  await pushDailyStreak(user);

  revalidatePath('/dashboard');

  return Response.json({
    message: 'Updated user entry',
    userEntry,
  });
};
