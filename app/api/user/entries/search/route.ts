import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const user = await validateSessionToken();

  if (!user) {
    return Response.json({ error: 'You are not logged in' }, { status: 400 });
  }

  const query = request.nextUrl.searchParams.get('q');

  if (!query) {
    return Response.json({ error: 'No query provided' }, { status: 400 });
  }

  return Response.json(
    (
      await prisma.userEntry.findMany({
        where: {
          userId: user.id,
          entry: {
            alternativeTitles: {
              some: {
                title: {
                  contains: query,
                },
              },
            },
          },
        },
      })
    ).map(e => e.id)
  );
};
