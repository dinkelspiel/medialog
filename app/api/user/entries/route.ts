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

export const POST = async (request: NextRequest) => {
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

  const userEntry = await prisma.userEntry.create({
    data: {
      entryId: data.data.entryId,
      userId: user.id,
      rating: 0,
      progress: 0,
      notes: '',
    },
    include: {
      entry: true,
      user: true,
    },
  });

  revalidatePath('/dashboard');

  return Response.json({
    message: 'Added user entry',
    userEntry,
  });
};
