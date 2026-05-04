import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import { ReactNode } from 'react';
import { ServerEntryTitleForUser } from './serverUserEntryTitle';
import { getDefaultWhereForTranslations } from '@/server/api/routers/dashboard_';
import { Category } from '@/prisma/generated/browser';

export type Diary = Record<
  string,
  {
    entryId: number;
    entrySlug: string;
    title: ReactNode;
    day: number;
  }[]
>;

export const getUserDiary = async (
  userId: number,
  categories: Category[]
): Promise<Diary> => {
  const authUser = await validateSessionToken();
  const userEntries = await prisma.userEntry.findMany({
    where: {
      userId,
      status: 'completed',
      entry: {
        category: {
          in: categories,
        },
      },
    },
    orderBy: {
      watchedAt: 'desc',
    },
    take: 10,
    include: {
      entry: {
        include: {
          translations: getDefaultWhereForTranslations(authUser),
        },
      },
    },
  });

  const diary: Diary = {};

  userEntries.forEach(userEntry => {
    const monthMinusYear =
      userEntry // Example NOV-2024
        .watchedAt!.toLocaleString('default', { month: 'short' })
        .toUpperCase()
        .slice(0, 3) +
      '-' +
      userEntry.watchedAt!.getFullYear();
    if (!diary[monthMinusYear]) {
      diary[monthMinusYear] = [];
    }
    diary[monthMinusYear]!.push({
      entrySlug: userEntry.entry.slug,
      entryId: userEntry.entry.id,
      title: <ServerEntryTitleForUser entryId={userEntry.entry.id} />,
      day: userEntry.watchedAt!.getDate(),
    });
  });

  const sortedDiary: Diary = {};
  for (const key in diary) {
    sortedDiary[key] = diary[key]!.sort((a, b) => b.day - a.day);
  }

  return sortedDiary;
};
