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
        <div className="grid w-full grid-cols-3 gap-3 px-4 ps-4  md:grid-cols-4 min-[1330px]:w-[716px] min-[1330px]:pe-4">
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
            <div className="flex flex-col gap-4">
              <div className="flex justify-between border-b border-b-base-200 pb-2 text-lg font-semibold">
                You've completed
                <span className="ms-auto font-normal text-base-500">
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
