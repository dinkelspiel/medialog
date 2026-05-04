'use client';

import { Header } from '@/components/header';
import HeaderLayout from '@/components/layouts/header';
import ModifyUserEntry from '@/components/modifyUserEntry';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useInfiniteScroll } from '@/components/useInfiniteScroll';
import { useMediaTypeFilters } from '@/components/useMediaTypeFilters';
import { UserEntryCardObject } from '@/components/userEntryCard';
import { mediaTypeFiltersToCategories } from '@/lib/mediaTypeFilters';
import { api } from '@/trpc/react';
import { UserList } from '@/prisma/generated/browser';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { SidebarButtons } from '../_components/sidebar';
import { FilterView } from './_components/FilterView';
import { useDashboardStore } from './state';
import { useDebounceValue } from 'usehooks-ts';
import { cn } from '@/lib/utils';

const Page = () => {
  return <Dashboard />;
};

const Dashboard = () => {
  const {
    filterStatus,
    filterTitle,
    filterStyle,
    filterRatingRange,

    userEntries,
    setUserEntries,
    setUserEntry,
    removeUserEntry,

    selectedUserEntry,
    setSelectedUserEntry,
  } = useDashboardStore();
  const { filters: mediaTypeFilters } = useMediaTypeFilters();

  const debouncedFilterTitle = useDebounceValue(filterTitle, 200);
  const entries = api.dashboard.getEntries.useInfiniteQuery(
    {
      limit: 60,
      filterStatus,
      filterCategories: mediaTypeFiltersToCategories(mediaTypeFilters),
      filterTitle: debouncedFilterTitle[0],
      filterStyle,
      filterRatingRange,
    },
    {
      initialCursor: 0,
      getNextPageParam: lastPage => lastPage.nextCursor,
    }
  );
  const pagedUserEntries = useMemo(
    () => entries.data?.pages.flatMap(page => page.userEntries) ?? [],
    [entries.data]
  );

  useEffect(() => {
    setUserEntries(pagedUserEntries);
  }, [pagedUserEntries, setUserEntries]);

  const loadMore = useCallback(() => {
    void entries.fetchNextPage();
  }, [entries]);

  useInfiniteScroll({
    enabled: !!entries.hasNextPage && !entries.isFetchingNextPage,
    onLoadMore: loadMore,
  });

  const userEntriesRef = useRef<HTMLDivElement>(null);
  const [userEntriesWidth, setUserEntriesWidth] = useState(0);

  useEffect(() => {
    const handleResize = () =>
      setUserEntriesWidth(userEntriesRef.current?.clientWidth ?? 0);
    const animationFrame = window.requestAnimationFrame(handleResize);
    window.addEventListener('resize', handleResize);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Lists
  const [listsWithUserEntry, setListsWithUserEntry] = useState<UserList[]>([]);
  const [userLists, setUserLists] = useState<UserList[]>([]);

  const fetchUserLists = useCallback(async () => {
    const listsResponse = await (await fetch(`/api/user/lists`)).json();

    if (listsResponse.error) {
      toast.error(`Error fetching userLists: ${listsResponse.error}`);
    } else {
      setUserLists(listsResponse);
    }
  }, []);

  const fetchUserListsWithEntry = useCallback(async (userEntryId: number) => {
    // Fetch both in parallel instead of sequentially
    const [entryListsResponse, listsResponse] = await Promise.all([
      fetch(`/api/user/entries/${userEntryId}/lists`).then(r => r.json()),
      fetch(`/api/user/lists`).then(r => r.json()),
    ]);

    if (entryListsResponse.error) {
      toast.error(
        `Error fetching entry userLists: ${entryListsResponse.error}`
      );
    } else {
      setListsWithUserEntry(entryListsResponse);
    }

    if (listsResponse.error) {
      toast.error(`Error fetching userLists: ${listsResponse.error}`);
    } else {
      setUserLists(listsResponse);
    }
  }, []);

  useEffect(() => {
    if (selectedUserEntry === undefined) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      fetchUserListsWithEntry(selectedUserEntry ?? 0);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [fetchUserListsWithEntry, selectedUserEntry]);

  // Memoize click handler to prevent recreation on each render
  const handleCardClick = useCallback(
    (userEntryId: number) => {
      setSelectedUserEntry(userEntryId);
      setListsWithUserEntry([]);
      fetchUserListsWithEntry(userEntryId);
    },
    [setSelectedUserEntry, fetchUserListsWithEntry]
  );

  return (
    <HeaderLayout className="gap-0">
      <Header titleComponent="My Media" sidebarContent={<SidebarButtons />}>
        <FilterView className="hidden lg:flex" />
      </Header>
      <div
        ref={userEntriesRef}
        className="grid h-fit justify-center bg-base-100 p-4 xl:col-span-1"
      >
        <FilterView className="flex pb-4 lg:hidden" />
        <div
          className="grid h-fit w-fit max-w-5xl gap-2"
          style={{
            gridTemplateColumns: `repeat(${Math.max(3, Math.floor(Math.min(userEntriesWidth, 1024) / 148))}, minmax(0, 1fr))`,
          }}
        >
          {userEntries.map(userEntry => (
            <UserEntryCardObject
              key={'ue' + userEntry.id}
              userEntry={userEntry}
              onClick={() => handleCardClick(userEntry.id)}
              className={cn(
                'lg:min-w-33',
                userEntry.status === 'planning' && filterStatus === 'all'
                  ? 'opacity-70'
                  : 'opacity-100'
              )}
            />
          ))}
        </div>
        {entries.isLoading && (
          <div className="flex h-32 items-center justify-center gap-3">
            <Loader2 className="size-4 animate-spin" /> Loading entries...
          </div>
        )}
        {!entries.isLoading && userEntries.length === 0 && (
          <div className="flex h-32 items-center justify-center text-sm text-base-500">
            No entries found
          </div>
        )}
        {entries.isFetchingNextPage && (
          <div className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="size-4 animate-spin" /> Loading more entries...
          </div>
        )}
        {!entries.hasNextPage && userEntries.length > 0 && (
          <div className="relative py-12">
            <div className="h-px w-full bg-base-200"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 px-4 text-center font-semibold">
              You have reached the end.
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedUserEntry}
        onOpenChange={() => setSelectedUserEntry(undefined)}
      >
        <DialogContent className="h-full w-full max-w-200 min-[600px]:h-250 min-[800px]:w-200">
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
