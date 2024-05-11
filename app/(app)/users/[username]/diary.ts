import prisma from '@/server/db';

export type Diary = Record<
  string,
  {
    title: string;
    day: number;
  }[]
>;

export const getUserDiary = async (userId: number): Promise<Diary> => {
  const userEntries = await prisma.userEntry.findMany({
    where: {
      userId,
      status: 'completed',
    },
    orderBy: {
      id: 'desc',
    },
    take: 10,
    include: {
      entry: true,
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
      title: userEntry.entry.originalTitle,
      day: userEntry.watchedAt!.getDate(),
    });
  });

  const sortedDiary: Diary = {};
  for (const key in diary) {
    sortedDiary[key] = diary[key]!.sort((a, b) => b.day - a.day);
  }

  return sortedDiary;
};
