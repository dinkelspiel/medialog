import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import z from 'zod';

export const PATCH = async (
  request: Request,
  params: { listId: string; entryId: string }
) => {
  const body = await request.json();

  const schema = z.object({
    order: z.number(),
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

  const list = await prisma.userList.findUnique({
    where: {
      id: Number(params.listId),
    },
    include: {
      entries: true,
    },
  });

  if (!list) {
    return Response.json({ error: 'No list with id exists' }, { status: 400 });
  }

  const entryId = Number(params.entryId);

  const entry = await prisma.userListEntry.findUnique({
    where: { id: entryId, listId: list.id },
  });

  if (!entry) {
    return Response.json(
      { error: `UserListEntry with id ${entryId} not found.` },
      { status: 400 }
    );
  }

  const currentEntryIndex = list.entries.findIndex(e => e.id === entryId);
  if (currentEntryIndex === -1) {
    return Response.json(
      { error: `UserListEntry with id ${entryId} is not in the list.` },
      { status: 400 }
    );
  }

  const currentOrder = list.entries[currentEntryIndex]!.order;

  if (currentOrder === data.data.order) {
    return;
  }

  const updates = [];

  if (currentOrder < data.data.order) {
    for (let i = currentEntryIndex + 1; i < list.entries.length; i++) {
      const e = list.entries[i]!;
      if (e.order > data.data.order) break;
      updates.push(
        prisma.userListEntry.update({
          where: { id: e.id },
          data: { order: e.order - 1 },
        })
      );
    }
  } else {
    for (let i = currentEntryIndex - 1; i >= 0; i--) {
      const e = list.entries[i]!;
      if (e.order < data.data.order) break;
      updates.push(
        prisma.userListEntry.update({
          where: { id: e.id },
          data: { order: e.order + 1 },
        })
      );
    }
  }

  updates.push(
    prisma.userListEntry.update({
      where: { id: entryId },
      data: { order: data.data.order },
    })
  );

  await prisma.$transaction(updates);

  return Response.json(
    { error: `Successfully updated order of list entries` },
    { status: 200 }
  );
};
