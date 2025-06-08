import { SidebarButtons } from '@/app/(app)/_components/sidebar';
import { Header, HeaderDescription } from '@/components/header';
import UserEntryCard from '@/components/userEntryCard';
import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import Link from 'next/link';
import AddMedia from './_components/addMedia';
import EditableDescription from './_components/editableDescription';
import EditableName from './_components/editableName';
import CompletionProgress from './_components/progress';
import HeaderLayout from '@/components/layouts/header';
import SettingsView from './_components/settings';
import { Badge } from '@/components/ui/badge';
import AddWidget from './_components/addWidget';
import type { Metadata, ResolvingMetadata } from 'next';
import { Clock, Pen, UserRound } from 'lucide-react';
import { UserEntry } from '@prisma/client';
import { Button } from '@/components/ui/button';
import EditTimedChallenge from './_components/challenges/editTimedChallenge';

export type Props = {
  params: { listId: string; username: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const list = await prisma.userList.findFirst({
    where: {
      id: Number(params.listId),
      user: {
        username: params.username,
      },
    },
  });
  if (!list) {
    return {
      title: `Invalid list - Medialog`,
    };
  }
  return {
    title: `${list?.name} by @${params.username} - Medialog`,
  };
}

const Page = async ({ params }: Props) => {
  const authUser = await validateSessionToken();
  const targetUser = await prisma.user.findFirst({
    where: {
      username: params.username,
    },
    select: {
      id: true,
      username: true,
    },
  });

  if (!targetUser) {
    return <div>No user with username found</div>;
  }

  const list = await prisma.userList.findFirst({
    where: {
      id: Number(params.listId),
      userId: targetUser.id,
    },
    include: {
      entries: {
        include: {
          entry: true,
        },
      },
    },
  });

  if (!list) {
    return <div>No list with id on user</div>;
  }

  const timedChallenges = await prisma.userListChallengeTimed.findMany({
    where: {
      listId: list.id,
    },
  });

  let followerProgress: Record<
    number,
    {
      username: string;
      userEntries: {
        id: number;
      }[];
    }[]
  > = {};

  for (const challenge of timedChallenges) {
    if (!authUser) continue;
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            followers: {
              some: {
                userId: authUser.id,
                isFollowing: true,
              },
            },
          },
          {
            id: authUser.id,
          },
        ],
      },
      select: {
        username: true,
        userEntries: {
          select: {
            id: true,
          },
          where: {
            entry: {
              userListEntries: {
                some: {
                  listId: list?.id,
                },
              },
            },
            status: 'completed',
            AND: [
              {
                watchedAt: {
                  gt: challenge.from,
                },
              },
              {
                watchedAt: {
                  lt: challenge.to,
                },
              },
            ],
          },
        },
      },
    });
    followerProgress[challenge.id] = users;
  }

  let completed = 0;

  let userEntries: { id: number; entryId: number; watchedAt: Date | null }[] =
    [];
  if (authUser) {
    userEntries = await prisma.userEntry.findMany({
      where: {
        userId: authUser.id,
        status: 'completed',
        entry: {
          userListEntries: {
            some: {
              listId: list?.id,
            },
          },
        },
      },
      select: {
        id: true,
        entryId: true,
        watchedAt: true,
      },
    });

    completed = userEntries.filter(
      e => userEntries.find(f => f.entryId === e.entryId)!.id === e.id
    ).length;
  }

  return (
    <HeaderLayout>
      <Header
        titleComponent={
          <div>
            {authUser && authUser?.id === targetUser.id && (
              <EditableName userList={list} />
            )}
            {!(authUser && authUser?.id === targetUser.id) && list.name}
          </div>
        }
        sidebarContent={<SidebarButtons />}
      >
        <HeaderDescription>
          A list by{' '}
          <Link href={`/@${targetUser.username}`} className="text-sky-500">
            @{targetUser.username}
          </Link>
        </HeaderDescription>
      </Header>
      <div className="mx-auto flex w-full flex-col-reverse gap-16 pb-8 pt-4 md:w-fit min-[1330px]:grid min-[1330px]:grid-cols-[1fr,250px]">
        <div className="grid h-fit w-full grid-cols-3 gap-3 px-4 ps-4  md:grid-cols-4 min-[1330px]:w-[716px] min-[1330px]:pe-4">
          {!(authUser && authUser?.id === targetUser.id) &&
            list.entries
              .sort((a, b) => a.order - b.order)
              .map((e, idx) => (
                <UserEntryCard
                  {...{
                    entryTitle: e.entry.originalTitle,
                    backgroundImage: e.entry.posterPath,
                    category: e.entry.category,
                    releaseDate: e.entry.releaseDate,
                    rating: 0,
                    topRight:
                      list.type === 'ordered' ? <Badge>{idx + 1}</Badge> : '',
                  }}
                />
              ))}
          {authUser && authUser?.id === targetUser.id && (
            <AddMedia userList={list} user={targetUser} />
          )}
        </div>
        <div className="flex flex-col gap-6 px-4 min-[1330px]:px-0">
          {authUser && authUser?.id === targetUser.id && (
            <EditableDescription userList={list} />
          )}
          {!(authUser && authUser?.id === targetUser.id) && (
            <div className="h-max text-base text-base-700">
              {list.description}
            </div>
          )}

          {authUser && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between border-b border-b-base-200 pb-2 text-lg font-semibold">
                You've completed
                <span className="ms-auto flex items-end text-sm font-normal text-base-500">
                  {((completed / list!.entries.length) * 100).toFixed(0)}%
                </span>
              </div>
              <CompletionProgress
                max={list!.entries.length}
                current={(completed / list!.entries.length) * 100}
              />
            </div>
          )}
          {timedChallenges.map(challenge => {
            const now = new Date();
            const isBetween = now >= challenge.from && now <= challenge.to;
            const completed = challenge.to < now;
            const before = now < challenge.from;

            const options = { month: 'short', day: 'numeric' };
            const fromString = challenge.from.toLocaleDateString(
              'en-US',
              options as any
            );
            const toString = challenge.to.toLocaleDateString(
              'en-US',
              options as any
            );

            const completedBetweenDates = userEntries
              .filter(
                e => userEntries.find(f => f.entryId === e.entryId)!.id === e.id
              )
              .filter(e => !!e.watchedAt)
              .filter(
                e =>
                  e.watchedAt! > challenge.from && e.watchedAt! < challenge.to
              );

            return (
              <div className="flex flex-col gap-2" key={challenge.id}>
                <div className="flex items-center justify-between gap-2 border-b border-b-base-200 pb-2 text-lg font-semibold">
                  <Clock className="size-4" /> {challenge.name}
                  <span className="ms-auto flex h-full gap-2 text-sm font-normal text-base-500">
                    {isBetween && (
                      <div className="flex h-[28px] items-end">
                        <div className="text-base-500">
                          {(
                            (completedBetweenDates.length /
                              list!.entries.length) *
                            100
                          ).toFixed(0)}
                          %
                        </div>
                      </div>
                    )}
                    <EditTimedChallenge challenge={challenge} />
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    Complete every media between{' '}
                    <span className="text-primary">{fromString}</span> and{' '}
                    <span className="text-primary">
                      {toString} {completed && '(Completed)'}{' '}
                      {before && '(Not started)'}
                    </span>
                  </div>
                </div>
                {isBetween && (
                  <>
                    <CompletionProgress
                      max={list!.entries.length}
                      current={
                        (completedBetweenDates.length / list!.entries.length) *
                        100
                      }
                    />
                    <div className="flex flex-col gap-1">
                      {followerProgress[challenge.id]!.sort(
                        (a, b) => b.userEntries.length - a.userEntries.length
                      )
                        .filter(e => e.userEntries.length > 0)
                        .map(user => (
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1">
                              {user.username === authUser!.username && (
                                <UserRound className="size-3" />
                              )}{' '}
                              {user.username}
                            </div>
                            <div className="text-base-500">
                              {parseInt(
                                (
                                  (user.userEntries.length /
                                    list!.entries.length) *
                                  100
                                ).toString()
                              )}
                              %
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
          <div className="flex gap-2">
            <AddWidget list={list} />
            <SettingsView list={list} user={targetUser} />
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
};

export default Page;
