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
import TimedChallenges from './_components/challenges/timedChallenges';
import Polls from './_components/polls/polls';
import PopulateState from './_components/populateState';
import { getDefaultWhereForTranslations } from '@/server/api/routers/dashboard_';

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
          entry: {
            include: {
              translations: getDefaultWhereForTranslations(authUser),
            },
          },
        },
      },
    },
  });

  if (!list) {
    return <div>No list with id on user</div>;
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
      <PopulateState list={list} />
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
          <TimedChallenges list={list} userEntries={userEntries} />
          <Polls list={list} />
          {authUser && authUser.id === list.userId && (
            <div className="flex gap-2">
              <AddWidget list={list} />
              <SettingsView list={list} user={targetUser} />
            </div>
          )}
        </div>
      </div>
    </HeaderLayout>
  );
};

export default Page;
