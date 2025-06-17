import prisma from '@/server/db';
import { UserList } from '@prisma/client';
import { Vote } from 'lucide-react';
import React from 'react';
import EditPoll from './editPoll';
import { Button } from '@/components/ui/button';
import SubmitVote from './submitVote';
import { validateSessionToken } from '@/server/auth/validateSession';
import {
  getDefaultWhereForTranslations,
  getUserTitleFromEntry,
} from '@/server/api/routers/dashboard_';
import { EntryRedirect } from '@/app/(app)/_components/EntryIslandContext';

const Polls = async ({ list }: { list: UserList }) => {
  const authUser = await validateSessionToken();
  const polls = await prisma.userListPoll.findMany({
    where: {
      listId: list.id,
    },
  });

  let authUserHasVoted: Record<number, boolean> = {};

  let totalVotes: Record<number, number> = {};
  let votes: Record<
    number,
    Record<
      string,
      {
        votes: number;
        entryId: number;
        entrySlug: string;
      }
    >
  > = {};

  for (const poll of polls) {
    const voteCounts = await prisma.userListPollVote.groupBy({
      by: ['entryId'],
      where: {
        pollId: poll.id,
      },
      _count: {
        entryId: true,
      },
    });
    votes[poll.id] = Object.fromEntries(
      await Promise.all(
        voteCounts.map(async count => {
          const entry = (await prisma.entry.findFirst({
            where: {
              id: count.entryId,
            },
            include: {
              translations: getDefaultWhereForTranslations(authUser),
            },
          }))!;

          totalVotes[poll.id] =
            (totalVotes[poll.id] ?? 0) + count._count.entryId;

          return [
            getUserTitleFromEntry(entry),
            {
              votes: count._count.entryId,
              entryId: entry.id,
              entrySlug: entry.slug,
            },
          ];
        })
      )
    );

    if (authUser) {
      authUserHasVoted[poll.id] = !!(await prisma.userListPollVote.findFirst({
        where: {
          pollId: poll.id,
          userId: authUser.id,
        },
      }));
    }
  }

  return polls.map(poll => {
    const now = new Date();
    const isBetween = now >= poll.from && now <= poll.to;
    const completed = poll.to < now;
    const before = now < poll.from;

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    let daysUntil = Math.ceil(
      (poll.from.getTime() - now.getTime()) / millisecondsPerDay
    );
    const daysLeft = Math.ceil(
      (poll.to.getTime() - now.getTime()) / millisecondsPerDay
    );

    const options = { month: 'short', day: 'numeric' };
    const fromString = poll.from.toLocaleDateString('en-US', options as any);
    const toString = poll.to.toLocaleDateString('en-US', options as any);

    return (
      <div className="flex flex-col gap-2" key={poll.id}>
        <div className="flex items-end justify-between gap-2 border-b border-b-base-200 pb-2 text-lg font-semibold">
          <Vote className="mb-1 size-4" />
          <span className="">{poll.name}</span>
          <span className="ms-auto flex h-fit gap-2 text-sm font-normal text-base-500">
            <div className="flex h-[28px] items-end whitespace-nowrap text-base-500">
              {isBetween && `${daysLeft}d left`}
              {completed && 'Voting has finished'}
              {before && `${daysUntil}d until start`}
            </div>
            {authUser && authUser.id === list.userId && (
              <EditPoll poll={poll} />
            )}
          </span>
        </div>
        <div className="flex items-center justify-between">
          {authUser && isBetween && (
            <SubmitVote poll={poll} hasVoted={authUserHasVoted[poll.id]!} />
          )}
        </div>
        <div className="flex flex-col gap-1">
          {Object.entries(votes[poll.id]!)!
            .sort((a, b) => b[1].votes - a[1].votes)
            .filter(e => e[1].votes > 0)
            .map((vote, idx) => (
              <div className="flex justify-between text-sm">
                <EntryRedirect
                  entryId={vote[1].entryId}
                  entrySlug={vote[1].entrySlug}
                >
                  <div className="flex items-center gap-1">
                    <span>{idx + 1}.</span> {vote[0]}
                  </div>
                </EntryRedirect>
                <div className="text-base-500">
                  {parseInt(
                    ((vote[1].votes / totalVotes[poll.id]!) * 100).toString()
                  )}
                  %
                </div>
              </div>
            ))}
          {!before && (
            <div className="text-sm">{!totalVotes[poll.id] && 'No votes'}</div>
          )}
          {before && <div className="text-sm">Voting hasn't opened yet</div>}
        </div>
      </div>
    );
  });
};

export default Polls;
