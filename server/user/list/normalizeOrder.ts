import prisma from '@/server/db';
import { UserList } from '@/prisma/generated/client';
import 'server-only';

/**
 *
 * @returns {number} Returns the largest order number in the list + 1
 */
export const normalizeOrderInList = async (
  userList: UserList
): Promise<number> => {
  const listEntries = (
    await prisma.userListEntry.findMany({
      where: {
        listId: userList.id,
      },
    })
  ).sort((a, b) => a.order - b.order);

  let idx = 0;
  for (const listEntry of listEntries) {
    await prisma.userListEntry.update({
      where: {
        id: listEntry.id,
      },
      data: {
        order: idx,
      },
    });

    idx++;
  }

  return idx + 1;
};
