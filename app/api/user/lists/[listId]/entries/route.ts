import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import { UserList } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';
import z from 'zod';

export const POST = async (
  request: NextRequest,
  { params }: { params: { listId: string } }
) => {
  const body = await request.json();

  const schema = z.object({
    entryId: z.number(),
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

  const list = await prisma.userList.findFirst({
    where: {
      id: Number(params.listId),
      userId: user.id,
    },
  });

  if (!list) {
    return Response.json({ error: 'No list with id exists' }, { status: 400 });
  }

  const entry = await prisma.entry.findUnique({
    where: {
      id: data.data.entryId,
    },
  });

  if (!entry) {
    return Response.json({ error: 'No entry with id' }, { status: 400 });
  }

  const userListEntry = await prisma.userListEntry.findFirst({
    where: {
      listId: list.id,
      entryId: entry.id,
    },
  });

  if (userListEntry) {
    await prisma.userListEntry.deleteMany({
      where: {
        listId: list.id,
        entryId: entry.id,
      },
    });

    await normalizeOrderInList(list);

    return Response.json({
      message: `${entry.originalTitle} removed from list ${list.name}`,
    });
  } else {
    const order = await normalizeOrderInList(list);

    await prisma.userListEntry.create({
      data: {
        listId: list.id,
        entryId: entry.id,
        order,
      },
    });

    return Response.json({
      message: `${entry.originalTitle} added to list ${list.name}`,
    });
  }
};

/**
 *
 * @returns {number} Returns the largest order number in the list + 1
 */
const normalizeOrderInList = async (userList: UserList): Promise<number> => {
  const listEntries = (
    await prisma.userListEntry.findMany({
      where: {
        listId: userList.id,
      },
    })
  ).sort((a, b) => a.order - b.order);

  let idx = 0;
  for (const listEntry of listEntries) {
    await prisma.userListEntry.update({
      where: {
        id: listEntry.id,
      },
      data: {
        order: idx,
      },
    });

    idx++;
  }

  return idx + 1;
};
