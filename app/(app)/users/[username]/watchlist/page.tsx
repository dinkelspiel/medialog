'use client';

import { EntryRedirect, useEntryIsland } from '@/app/(app)/_components/EntryIslandContext';
import { Header } from '@/components/header';
import HeaderLayout from '@/components/layouts/header';
import { useInfiniteScroll } from '@/components/useInfiniteScroll';
import { useMediaTypeFilters } from '@/components/useMediaTypeFilters';
import { UserEntryCardObject } from '@/components/userEntryCard';
import { mediaTypeFiltersToCategories } from '@/lib/mediaTypeFilters';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { SidebarButtons } from '../../../_components/sidebar';
import { FilterView } from '../../../dashboard/_components/FilterView';
import { useDashboardStore } from '../../../dashboard/state';

const Page = () => {
  const params = useParams<{ username: string }>();
  const username = decodeURIComponent(params?.username ?? '');
  const { data, isPending: dataIsPending } = api.dashboard.getUserByUsername.useQuery({
    username,
  });

  if (dataIsPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <div>User not found</div>;
  }

  return <Watchlist username={data.username} />;
};

const Watchlist = ({ username }: { username: string }) => {
  const entryIsland = useEntryIsland();
  const {
    filterStatus,
    filterTitle,
    filterStyle,
    filterRatingRange,
    userEntries,
    setUserEntries,
    selectedUserEntry,
    setSelectedUserEntry,
  } = useDashboardStore();
  const { filters: mediaTypeFilters } = useMediaTypeFilters();

  const debouncedFilterTitle = useDebounceValue(filterTitle, 200);
  const entries = api.dashboard.getEntriesByUsername.useInfiniteQuery(
    {
      username,
      limit: 60,
      filterStatus,
      filterCategories: mediaTypeFiltersToCategories(mediaTypeFilters),
      filterTitle: debouncedFilterTitle[0],
      filterStyle,
      filterRatingRange,
    },
    {
      initialCursor: 0,
      getNextPageParam: lastPage => lastPage?.nextCursor,
    }
  );
  const pagedUserEntries = useMemo(
    () => entries.data?.pages.flatMap(page => page?.userEntries ?? []) ?? [],
    [entries.data]
  );

  useEffect(() => {
    setUserEntries(pagedUserEntries);
  }, [pagedUserEntries, setUserEntries]);

  useEffect(() => {
    setSelectedUserEntry(undefined);
  }, [setSelectedUserEntry, username]);

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
    const handleResize = () => {
      setUserEntriesWidth(userEntriesRef.current?.clientWidth ?? 0);
    };

    const animationFrame = window.requestAnimationFrame(handleResize);
    window.addEventListener('resize', handleResize);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (selectedUserEntry === undefined) {
      return;
    }

    const userEntry = userEntries.find(e => e.id === selectedUserEntry);

    if (!userEntry) {
      return;
    }

    setSelectedUserEntry(undefined);
    entryIsland?.setOpen(true, userEntry.entry.id, userEntry.entry.slug);
  }, [entryIsland, selectedUserEntry, setSelectedUserEntry, userEntries]);

  return (
    <HeaderLayout className="gap-0">
      <Header titleComponent={`${username}'s media`} sidebarContent={<SidebarButtons />}>
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
            <EntryRedirect
              key={'ue' + userEntry.id}
              entryId={userEntry.entry.id}
              entrySlug={userEntry.entry.slug}
              className="block"
            >
              <UserEntryCardObject
                userEntry={userEntry}
                className={cn(
                  'lg:min-w-33',
                  userEntry.status === 'planning' && filterStatus === 'all'
                    ? 'opacity-70'
                    : 'opacity-100'
                )}
              />
              </EntryRedirect>
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
    </HeaderLayout>
  );
};

export default Page;