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
import { Button } from '@/components/ui/button';
import { Clock, List, ListOrdered, Plus, Settings, Vote } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

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
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'outline'} size={'sm'} className="w-full">
                  <Plus className="stroke-base-600" />
                  Add Widget
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-[1330px]:w-[206px]">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Challanges</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Clock className="size-4 stroke-base-600" /> Timed Challenge
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Vote className="size-4 stroke-base-600" /> Vote
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="aspect-square w-9 px-0"
                  variant={'outline'}
                  size={'sm'}
                >
                  <Settings className="stroke-base-600" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <Card>
                  <CardContent className="divide-y divide-base-100 p-0 pe-2 ps-4">
                    <div className="flex items-center justify-between py-2">
                      <div className="whitespace-nowrap text-sm font-medium text-base-600">
                        Order Type
                      </div>
                      <div className="w-fit">
                        <Select
                          value={'asd'}
                          // onValueChange={theme => {
                          //   setSelectedTheme(theme as Theme);
                          //   setTheme.mutate({ theme });
                          // }}
                        >
                          <SelectTrigger className="min-w-[8rem]">
                            Asd
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value={'asd'}
                              className="cursor-pointer hover:bg-base-400"
                            >
                              <div className="flex items-center gap-2">
                                <ListOrdered className="size-3 stroke-base-600" />{' '}
                                Ordered
                              </div>
                            </SelectItem>
                            <SelectItem
                              value={'asd'}
                              className="cursor-pointer hover:bg-base-400"
                            >
                              <div className="flex items-center gap-2">
                                <List className="size-3 stroke-base-600" />{' '}
                                Unordered
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
};

export default Page;
