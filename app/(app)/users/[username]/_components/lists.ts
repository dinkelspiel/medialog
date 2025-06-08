import { getDefaultWhereForTranslations } from '@/server/api/routers/dashboard_';
import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';

export type Lists = {
  id: number;
  posterUrls: string[];
  name: string;
  mediaCount: number;
}[];

export const getUserLists = async (userId: number): Promise<Lists> => {
  const authUser = await validateSessionToken();
  const lists = await prisma.userList.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
    include: {
      entries: {
        include: {
          entry: true,
        },
      },
    },
  });

  return lists.map(list => ({
    id: list.id,
    posterUrls: list.entries.map(entry => entry.entry.posterPath).slice(0, 4),
    name: list.name,
    mediaCount: list.entries.length,
  }));
};
