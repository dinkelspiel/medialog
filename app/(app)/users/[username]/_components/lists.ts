import prisma from '@/server/db';
import { Category } from '@/prisma/generated/browser';

export type Lists = {
  id: number;
  posterUrls: string[];
  name: string;
  mediaCount: number;
}[];

export const getUserLists = async (
  userId: number,
  categories: Category[]
): Promise<Lists> => {
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
        where: {
          entry: {
            category: {
              in: categories,
            },
          },
        },
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
