import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import { NextRequest } from 'next/server';

export const GET = async (
  request: NextRequest,
  { params: _params }: { params: Promise<{ userEntryId: string }> }
) => {
  const params = await _params;
  const user = await validateSessionToken();

  if (!user) {
    return Response.json({ error: 'You are not logged in' }, { status: 400 });
  }

  const userEntry = await prisma.userEntry.findUnique({
    where: {
      id: Number(params.userEntryId),
    },
    include: {
      entry: {
        include: {
          userListEntries: {
            include: {
              list: true,
            },
          },
        },
      },
    },
  });

  if (!userEntry) {
    return Response.json({ error: 'No user entry with id' }, { status: 400 });
  }

  const lists = userEntry!.entry.userListEntries
    .map(e => e.list)
    .filter(e => e.userId === user.id);

  return Response.json(
    lists.filter((e, idx) => lists.findIndex(f => f.id === e.id) === idx)
  );
};
