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

  if (!list) {
    return <div>No list with id on user</div>;
  }

  return (
    <>
      <Header>
        <HeaderHeader>
          <HeaderTitle>{list.name}</HeaderTitle>
          <HeaderDescription>
            A list by{' '}
            <Link href={`/@${targetUser.username}`} className="text-sky-500">
              @{targetUser.username}
            </Link>
          </HeaderDescription>
        </HeaderHeader>
      </Header>
      <div className="mx-auto grid w-fit grid-cols-1 gap-16 pt-4 min-[1330px]:grid-cols-[1fr,250px]">
        <div className="grid grid-cols-4 gap-4 md:w-[716px]">
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
        <div></div>
      </div>
    </>
  );
};

export default Page;
