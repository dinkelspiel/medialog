import { getUserTitleFromEntry } from '@/server/api/routers/dashboard';
import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';

export type Diary = Record<
  string,
  {
    title: string;
    day: number;
  }[]
>;

export const getUserDiary = async (userId: number): Promise<Diary> => {
  const authUser = await validateSessionToken();
  const userEntries = await prisma.userEntry.findMany({
    where: {
      userId,
      status: 'completed',
    },
    orderBy: {
      watchedAt: 'desc',
    },
    take: 10,
    include: {
      entry: {
        include: {
          translations: {
            where: {
              language: {
                id: authUser
                  ? (authUser.showMediaMetaInId ?? undefined)
                  : undefined,
                iso_639_1: !authUser ? 'en' : undefined,
              },
            },
          },
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
      title: getUserTitleFromEntry(userEntry.entry),
      day: userEntry.watchedAt!.getDate(),
    });
  });

  const sortedDiary: Diary = {};
  for (const key in diary) {
    sortedDiary[key] = diary[key]!.sort((a, b) => b.day - a.day);
  }

  return sortedDiary;
};
