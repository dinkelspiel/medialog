'use client';

import { Header } from '@/components/header';
import HeaderLayout from '@/components/layouts/header';
import ModifyUserEntry from '@/components/modifyUserEntry';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { UserEntryCardObject } from '@/components/userEntryCard';
import { api } from '@/trpc/react';
import { Entry, UserList } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { SidebarButtons } from '../_components/sidebar';
import { FilterView } from './_components/FilterView';
import { ExtendedUserEntry, useDashboardStore } from './state';

const Page = () => {
  const { data, isPending: dataIsPending } = api.dashboard.get.useQuery();

  if (dataIsPending) {
    return <Loader2 className="size-4 animate-spin" />;
  }

  if (!data) {
    return <div>Error fetching data</div>;
  }

  return (
    <Dashboard
      userEntries={data.userEntries}
      topRatedNotCompleted={data.topRated}
      topCompletedNotCompleted={data.topCompleted}
    />
  );
};

const Dashboard = ({
  userEntries: originalUserEntries,
}: {
  userEntries: ExtendedUserEntry[];
  topCompletedNotCompleted: Entry[];
  topRatedNotCompleted: Entry[];
}) => {
  const {
    filterStatus,
    filterCategories,
    filterTitle,
    filterStyle,

    userEntries,
    setUserEntries,
    setUserEntry,
    removeUserEntry,

    selectedUserEntry,
    setSelectedUserEntry,
  } = useDashboardStore();

  useEffect(() => {
    setUserEntries(originalUserEntries);
  }, [originalUserEntries]);

  const {
    data: queryResults,
    error: queryError,
    isLoading: queryIsLoading,
  } = useQuery({
    queryKey: ['searchQuery'],
    queryFn: () =>
      fetch(`/api/user/entries?q=${filterTitle}`).then(res => res.json()),
  });

  const userEntriesRef = useRef(null);
  const [userEntriesWidth, setUserEntriesWidth] = useState(0);

  useEffect(() => {
    setUserEntriesWidth((userEntriesRef.current as any).clientWidth ?? 0);
    const handleResize = () =>
      setUserEntriesWidth((userEntriesRef.current as any).clientWidth ?? 0);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lists

  useEffect(() => {
    if (selectedUserEntry === undefined) {
      return;
    }

    fetchUserListsWithEntry(selectedUserEntry ?? 0);
  }, [selectedUserEntry]);

  const [listsWithUserEntry, setListsWithUserEntry] = useState<UserList[]>([]);
  const [userLists, setUserLists] = useState<UserList[]>([]);
  const fetchUserLists = async () => {
    const listsResponse = await (await fetch(`/api/user/lists`)).json();

    if (listsResponse.error) {
      toast.error(`Error fetching userLists: ${listsResponse.error}`);
    } else {
      setUserLists(listsResponse);
    }
  };

  const fetchUserListsWithEntry = async (userEntryId: number) => {
    const entryListsResponse = await (
      await fetch(`/api/user/entries/${userEntryId}/lists`)
    ).json();

    if (entryListsResponse.error) {
      toast.error(
        `Error fetching entry userLists: ${entryListsResponse.error}`
      );
    } else {
      setListsWithUserEntry(entryListsResponse);
    }

    fetchUserLists();
  };

  return (
    <HeaderLayout className="gap-0">
      <Header titleComponent="My Media" sidebarContent={<SidebarButtons />}>
        <FilterView className="hidden lg:flex" />
      </Header>
      <div
        ref={userEntriesRef}
        className="grid justify-center bg-base-100 p-4 xl:col-span-1"
      >
        <FilterView className="flex pb-4 lg:hidden" />
        <div
          className="grid h-fit w-fit max-w-[1024px] gap-3"
          style={{
            gridTemplateColumns: `repeat(${Math.max(3, Math.floor(Math.min(userEntriesWidth, 1024) / 148))}, minmax(0, 1fr))`,
          }}
        >
          {userEntries &&
            userEntries
              .sort((a, b) => {
                switch (filterStyle) {
                  case 'rating':
                    return b.rating - a.rating;
                  case 'az':
                    return a.entry.originalTitle.localeCompare(
                      b.entry.originalTitle
                    );
                  case 'completed':
                    if (a.watchedAt === null || b.watchedAt === null) {
                      return 0;
                    }
                    return b.watchedAt.getTime() - a.watchedAt.getTime();
                  case 'updated':
                    return (
                      new Date(b.updatedAt).getTime() -
                      new Date(a.updatedAt).getTime()
                    );
                }
              })
              .map(userEntry => {
                if (filterTitle !== '' && (queryIsLoading || queryError)) {
                  if (
                    filterTitle !== '' &&
                    !userEntry.entry.originalTitle
                      .toLowerCase()
                      .includes(filterTitle.toLowerCase())
                  ) {
                    return;
                  }
                } else if (
                  filterTitle !== '' &&
                  !queryIsLoading &&
                  queryResults
                ) {
                  if (!queryResults.includes(userEntry.id)) {
                    return;
                  }
                }

                // if (
                //   filter.creator !== undefined &&
                //   userEntry.creators.filter(
                //     creator => creator.name === filter.creator
                //   ).length === 0
                // ) {
                //   return;
                // }

                // if (
                //   filter.studio !== undefined &&
                //   userEntry.studios.filter(
                //     studio => studio.name === filter.studio
                //   ).length === 0
                // ) {
                //   return;
                // }

                if (
                  filterStatus !== 'all' &&
                  userEntry.status !== filterStatus
                ) {
                  return;
                }

                if (!filterCategories.includes(userEntry.entry.category)) {
                  return;
                }

                return (
                  <UserEntryCardObject
                    key={'ue' + userEntry.id}
                    userEntry={userEntry}
                    onClick={() => {
                      setSelectedUserEntry(userEntry.id);
                      setListsWithUserEntry([]);
                      fetchUserListsWithEntry(userEntry.id);
                    }}
                    className={
                      userEntry.status === 'planning' && filterStatus === 'all'
                        ? 'opacity-70'
                        : 'opacity-100'
                    }
                  />
                );
              })}
        </div>
      </div>

      <Dialog
        open={!!selectedUserEntry}
        onOpenChange={() => setSelectedUserEntry(undefined)}
      >
        <DialogContent className="h-full w-full max-w-[800px] min-[600px]:h-[600px] min-[800px]:w-[800px]">
          {selectedUserEntry && (
            <ModifyUserEntry
              userEntry={userEntries.find(e => e.id == selectedUserEntry)!}
              setOpen={() => {
                setSelectedUserEntry(undefined);
              }}
              setUserEntry={setUserEntry}
              removeUserEntry={removeUserEntry}
              userLists={userLists ?? []}
              userListsWithEntry={listsWithUserEntry}
              refetchUserLists={async () => {
                fetchUserLists();
                fetchUserListsWithEntry(selectedUserEntry ?? 0);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </HeaderLayout>
  );
};

export default Page;
