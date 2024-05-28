import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';

export const PATCH = async (
  request: Request,
  params: { listId: string; entryId: string }
) => {
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

  const entry = await prisma.userListEntry.findFirst({
    where: {
      listId: list.id,
      entryId: Number(params.entryId),
    },
  });

  if (!entry) {
    return Response.json(
      { error: 'No entry with id in list exists' },
      { status: 400 }
    );
  }

  await prisma.userListEntry.findMany({
    where: {
      listId: list.id,
    },
  });
};
