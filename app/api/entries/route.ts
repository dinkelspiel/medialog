import { getDefaultWhereForTranslations } from '@/server/api/routers/dashboard_';
import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import { Category } from '@prisma/client';
import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const user = await validateSessionToken();

  if (!user) {
    return Response.json({ error: 'You are not logged in' }, { status: 400 });
  }

  const query = request.nextUrl.searchParams.get('q');
  const take = request.nextUrl.searchParams.get('take')
    ? Number(request.nextUrl.searchParams.get('take'))
    : undefined;
  const categories = request.nextUrl.searchParams.get('categories')
    ? (request.nextUrl.searchParams.get('categories')!.split(',') as Category[])
    : undefined;

  return Response.json(
    await prisma.entry.findMany({
      where: {
        category: categories
          ? {
              in: categories.filter(e => !!e),
            }
          : undefined,
        OR: [
          {
            translations: {
              some: {
                name: {
                  contains: query ?? '',
                },
              },
            },
          },
          {
            originalTitle: {
              contains: query ?? '',
            },
          },
        ],
      },
      include: {
        translations: getDefaultWhereForTranslations(user),
      },
      take,
      orderBy: {
        userEntries: {
          _count: 'desc',
        },
      },
    })
  );
};
