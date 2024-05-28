import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import Dashboard from './client';
import { redirect } from 'next/navigation';
import { revalidateTag, unstable_cache } from 'next/cache';

const getTop3RatedNotCompleted = unstable_cache(
  async (userId: number) => {
    let highestRatedEntries = await prisma.entry.findMany({
      include: {
        userEntries: true,
      },
    });

    const userEntries = await prisma.userEntry.findMany({
      where: {
        userId: userId,
        OR: [
          {
            status: 'watching',
          },
          {
            status: 'completed',
          },
        ],
      },
    });

    return highestRatedEntries
      .map(entry => ({
        ...entry,
        average:
          entry.userEntries.reduce(
            (sum: number, entry) => sum + entry.rating,
            0
          ) / entry.userEntries.length,
      }))
      .filter(e => userEntries.find(f => f.entryId === e.id) === undefined)
      .filter(e => e.average)
      .filter(
        e =>
          highestRatedEntries.find(f => f.collectionId === e.collectionId)
            ?.id === e.id || e.collectionId === null
      )
      .sort((a, b) => b.average - a.average)
      .slice(0, 3);
  },
  ['dashboard-top-rated'],
  {
    tags: ['dashboard-top-rated'],
  }
);

const getTop3CompletedNotCompleted = unstable_cache(
  async (userId: number) => {
    return (
      await prisma.entry.findMany({
        where: {
          NOT: {
            userEntries: {
              some: {
                userId,
                OR: [
                  {
                    status: 'watching',
                  },
                  {
                    status: 'completed',
                  },
                ],
              },
            },
          },
          userEntries: {
            some: {
              NOT: {
                userId,
              },
              OR: [
                {
                  status: 'watching',
                },
                {
                  status: 'completed',
                },
              ],
            },
          },
        },
        include: {
          userEntries: true,
        },
        orderBy: {
          userEntries: {
            _count: 'desc',
          },
        },
        take: 3,
      })
    ).map(entry => ({
      ...entry,
      average:
        entry.userEntries.reduce(
          (sum: number, entry) => sum + entry.rating,
          0
        ) / entry.userEntries.length,
    }));
  },
  ['dashboard-top-completed'],
  {
    tags: ['dashboard-top-completed'],
  }
);

const Page = async () => {
  const user = await validateSessionToken();

  if (!user) {
    return redirect('/auth/login');
  }

  const userEntries = await prisma.userEntry.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      user: true,
      entry: {
        include: {
          userEntries: {
            where: {
              userId: user?.id,
            },
          },
        },
      },
    },
  });

  const topCompleted = await getTop3CompletedNotCompleted(user.id);
  const topRated = await getTop3RatedNotCompleted(user.id);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] 2xl:grid-cols-[1fr,600px]">
      <Dashboard
        userEntries={userEntries}
        topRatedNotCompleted={topRated}
        topCompletedNotCompleted={topCompleted}
      />
    </div>
  );
};

export default Page;
