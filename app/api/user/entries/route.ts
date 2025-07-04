import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';
import z from 'zod';

export const GET = async (request: NextRequest) => {
  const user = await validateSessionToken();

  if (!user) {
    return Response.json({ error: 'You are not logged in' }, { status: 400 });
  }

  const query = request.nextUrl.searchParams.get('q');

  return Response.json(
    (
      await prisma.userEntry.findMany({
        where: {
          userId: user.id,
          entry: {
            alternativeTitles: {
              some: {
                title: {
                  contains: query ?? '',
                },
              },
            },
          },
        },
      })
    ).map(e => e.id)
  );
};

export const POST = async (request: NextRequest) => {};
