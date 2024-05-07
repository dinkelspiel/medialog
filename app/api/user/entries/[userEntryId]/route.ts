import { UserEntryStatusArray } from '@/lib/userEntryStatus';
import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import { UserEntryStatus } from '@prisma/client';
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
      entry: true,
    },
  });

  return Response.json({
    message: 'Updated user entry',
    userEntry,
  });
};
