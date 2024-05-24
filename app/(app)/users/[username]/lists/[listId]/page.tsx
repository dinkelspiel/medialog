import {
  Header,
  HeaderDescription,
  HeaderHeader,
  HeaderTitle,
} from '@/components/header';
import UserEntryCard from '@/components/userEntryCard';
import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import Link from 'next/link';
import React from 'react';
import CompletionProgress from './progress';

const Page = async ({
  params,
}: {
  params: { listId: string; username: string };
}) => {
  const authUser = await validateSessionToken();
  const targetUser = await prisma.user.findFirst({
    where: {
      username: params.username,
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

  let completed = 0;

  if (authUser) {
    const userEntries = await prisma.userEntry.findMany({
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
      },
    });

    completed = userEntries.filter(
      e => userEntries.find(f => f.entryId === e.entryId)!.id === e.id
    ).length;
  }

  if (!list) {
    return <div>No list with id on user</div>;
  }

  return (
    <>
      <Header>
        <HeaderHeader>
          <HeaderTitle>{list.name} </HeaderTitle>
          <HeaderDescription>
            A list by{' '}
            <Link href={`/@${targetUser.username}`} className="text-sky-500">
              @{targetUser.username}
            </Link>
          </HeaderDescription>
        </HeaderHeader>
      </Header>
      <div className="mx-auto flex w-full flex-col-reverse gap-16 px-4 pb-8 pt-4 md:w-fit lg:grid min-[1330px]:grid-cols-[1fr,250px]">
        <div className="grid w-full grid-cols-3 gap-4  md:grid-cols-4 lg:w-[716px]">
          {list.entries
            .sort((a, b) => a.order - b.order)
            .map(e => (
              <UserEntryCard
                {...{
                  title: e.entry.originalTitle,
                  backgroundImage: e.entry.posterPath,
                  category: e.entry.category,
                  releaseDate: e.entry.releaseDate,
                  rating: 0,
                }}
              />
            ))}
        </div>
        <div className="flex flex-col gap-6">
          <div className="text-base text-gray-700">{list.description}</div>
          {authUser && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between border-b border-b-slate-200 pb-2 text-lg font-semibold">
                You've completed
                <span className="ms-auto font-normal text-slate-500">
                  {((completed / list!.entries.length) * 100).toFixed(0)}%
                </span>
              </div>
              <CompletionProgress
                max={list!.entries.length}
                current={completed}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
