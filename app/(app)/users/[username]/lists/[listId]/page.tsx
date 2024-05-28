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
import CompletionProgress from './progress';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import EditableDescription from './editableDescription';
import AddMedia from './addMedia';

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
          <HeaderTitle>
            {authUser && authUser?.id === targetUser.id && (
              <input defaultValue={list.name} />
            )}
            {!(authUser && authUser?.id === targetUser.id) && list.name}
          </HeaderTitle>
          <HeaderDescription>
            A list by{' '}
            <Link href={`/@${targetUser.username}`} className="text-sky-500">
              @{targetUser.username}
            </Link>
          </HeaderDescription>
        </HeaderHeader>
      </Header>
      <div className="mx-auto flex w-full flex-col-reverse gap-16 pb-8 pt-4 md:w-fit xl:grid xl:grid-cols-[1fr,250px] xl:gap-4">
        <div className="grid w-full grid-cols-3 gap-4 px-4 ps-4  md:grid-cols-4 xl:w-[716px] xl:pe-4">
          {!(authUser && authUser?.id === targetUser.id) &&
            list.entries
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
          {authUser && authUser?.id === targetUser.id && (
            <AddMedia userList={list} user={targetUser} />
          )}
        </div>
        <div className="flex flex-col gap-6 px-4 xl:ps-0">
          {authUser && authUser?.id === targetUser.id && (
            <EditableDescription description={list.description} />
          )}
          {!(authUser && authUser?.id === targetUser.id) && (
            <div className="h-max text-base text-gray-700">
              {list.description}
            </div>
          )}

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
                current={(completed / list!.entries.length) * 100}
              />
            </div>
          )}
          {/* <Button variant={'outline'}>
            <Plus />
            Add
          </Button> */}
        </div>
      </div>
    </>
  );
};

export default Page;
