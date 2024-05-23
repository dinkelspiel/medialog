import {
  Header,
  HeaderDescription,
  HeaderHeader,
  HeaderTitle,
} from '@/components/header';
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
    </>
  );
};

export default Page;
