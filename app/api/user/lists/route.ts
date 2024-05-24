import { numberSuffix } from '@/lib/numberSuffix';
import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import { NextRequest } from 'next/server';
import z from 'zod';

export const GET = async (request: NextRequest) => {
  const user = await validateSessionToken();

  if (!user) {
    return Response.json({ error: 'You are not logged in' }, { status: 400 });
  }

  const lists = await prisma.userList.findMany({
    where: {
      userId: user.id,
    },
  });

  return Response.json(lists);
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const schema = z.object({
    initialEntryId: z.number(),
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

  const initialEntry = await prisma.entry.findUnique({
    where: {
      id: data.data.initialEntryId,
    },
  });

  if (!initialEntry) {
    return Response.json(
      { error: 'No entry with id for initialEntry' },
      { status: 400 }
    );
  }

  const amountOfLists = await prisma.userList.count({
    where: {
      userId: user.id,
    },
  });

  await prisma.userList.create({
    data: {
      name: `${user.username}'s ${numberSuffix(amountOfLists + 1)} list`,
      userId: user.id,
      type: 'unordered',
      description: `My ${numberSuffix(amountOfLists + 1)} list`,
      entries: {
        create: {
          entryId: initialEntry.id,
          order: 1,
        },
      },
    },
  });

  return Response.json({
    message: 'Created list',
  });
};
