import {
  Entry,
  UserEntry,
  UserList,
  UserListChallengeTimed,
  UserListEntry,
} from '@prisma/client';
import { Clock, UserRound } from 'lucide-react';
import React from 'react';
import EditTimedChallenge from './editTimedChallenge';
import { useListState } from '../../state';
import CompletionProgress from '../progress';
import { useAuthUser } from '@/app/(app)/_components/AuthUserContext';
import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';

const TimedChallenges = async ({
  userEntries,
  list,
}: {
  userEntries: {
    id: number;
    entryId: number;
    watchedAt: Date | null;
  }[];
  list: UserList & { entries: UserListEntry[] };
}) => {
  const authUser = await validateSessionToken();
  if (!authUser) return;

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

  return timedChallenges.map(challenge => {
    const now = new Date();
    const isBetween = now >= challenge.from && now <= challenge.to;
    const completed = challenge.to < now;
    const before = now < challenge.from;

    const options = { month: 'short', day: 'numeric' };
    const fromString = challenge.from.toLocaleDateString(
      'en-US',
      options as any
    );
    const toString = challenge.to.toLocaleDateString('en-US', options as any);

    const completedBetweenDates = userEntries
      .filter(e => userEntries.find(f => f.entryId === e.entryId)!.id === e.id)
      .filter(e => !!e.watchedAt)
      .filter(
        e => e.watchedAt! > challenge.from && e.watchedAt! < challenge.to
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
                    (completedBetweenDates.length / list!.entries.length) *
                    100
                  ).toFixed(0)}
                  %
                </div>
              </div>
            )}
            {authUser && authUser.id === list.userId && (
              <EditTimedChallenge challenge={challenge} />
            )}
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
                (completedBetweenDates.length / list!.entries.length) * 100
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
                          (user.userEntries.length / list!.entries.length) *
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
  });
};

export default TimedChallenges;
