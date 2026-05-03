'use client';

import { EntryRedirect, useEntryIsland } from '@/app/(app)/_components/EntryIslandContext';
import { Header } from '@/components/header';
import HeaderLayout from '@/components/layouts/header';
import { UserEntryCardObject } from '@/components/userEntryCard';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { SidebarButtons } from '../../../_components/sidebar';
import { FilterView, shouldBeFiltered } from '../../../dashboard/_components/FilterView';
import { ExtendedUserEntry, useDashboardStore } from '../../../dashboard/state';

const Page = () => {
  const params = useParams<{ username: string }>();
  const username = decodeURIComponent(params?.username ?? '');
  const { data, isPending: dataIsPending } = api.dashboard.getByUsername.useQuery({
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

  return <Watchlist userEntries={data.userEntries} username={data.user.username} />;
};

const Watchlist = ({
  userEntries: originalUserEntries,
  username,
}: {
  userEntries: ExtendedUserEntry[];
  username: string;
}) => {
  const entryIsland = useEntryIsland();
  const {
    filterStatus,
    filterCategories,
    filterTitle,
    filterStyle,
    filterRatingRange,
    userEntries,
    setUserEntries,
    selectedUserEntry,
    setSelectedUserEntry,
  } = useDashboardStore();

  useEffect(() => {
    setUserEntries(originalUserEntries);
    setSelectedUserEntry(undefined);
  }, [originalUserEntries, setSelectedUserEntry, setUserEntries]);

  const debouncedFilterTitle = useDebounceValue(filterTitle, 200);

  const search = api.entries.search.useQuery({
    query: debouncedFilterTitle[0],
    limit: 999,
    categories: filterCategories,
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

  const filteredAndSortedEntries = useMemo(() => {
    if (!userEntries) return [];

    const filterState = { filterStatus, filterRatingRange, filterCategories };

    return userEntries
      .filter(userEntry => {
        if (search.data && filterTitle !== '') {
          const entry = search.data.find(e => e.id === userEntry.entryId);
          if (!entry) return false;
          return (entry._rankingScore ?? 0) > 0.5;
        }
        if (shouldBeFiltered(userEntry, filterState)) return false;
        return true;
      })
      .sort((a, b) => {
        if (filterTitle !== '' && search.data && !search.isPending) {
          const aEntry = search.data.find(e => e.id === a.entryId);
          const bEntry = search.data.find(e => e.id === b.entryId);
          return (
            (bEntry ? (bEntry._rankingScore ?? 0) : 0) -
            (aEntry ? (aEntry._rankingScore ?? 0) : 0)
          );
        }

        switch (filterStyle) {
          case 'rating-desc':
            if (b.rating === a.rating) return b.id - a.id;
            return (b.rating ?? 0) - (a.rating ?? 0);
          case 'rating-asc':
            if (b.rating === a.rating) return b.id - a.id;
            return (a.rating === 0 || a.rating === null ? 999 : a.rating) - (b.rating ?? 0);
          case 'az':
            return a.entry.originalTitle.localeCompare(b.entry.originalTitle);
          case 'completed':
            if (a.watchedAt === null || b.watchedAt === null) return 0;
            return b.watchedAt.getTime() - a.watchedAt.getTime();
          case 'updated':
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
        }
      });
  }, [userEntries, search.data, search.isPending, filterTitle, filterStyle, filterStatus, filterRatingRange, filterCategories]);

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
          {filteredAndSortedEntries.map(userEntry => (
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
      </div>
    </HeaderLayout>
  );
};

export default Page;