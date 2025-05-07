'use client';

import {
  Header,
  HeaderContent,
  HeaderDescription,
  HeaderHeader,
  HeaderTitle,
} from '@/components/header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Entry,
  User,
  UserEntry,
  UserEntryStatus,
  UserList,
} from '@prisma/client';
import {
  AArrowDown,
  Command,
  Eye,
  Filter,
  Loader2,
  Menu,
  PanelLeft,
  Pen,
  Settings,
  Star,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useRef, useState } from 'react';
import { FilterStyle, useDashboardStore } from './state';
import ModifyUserEntry from '@/components/modifyUserEntry';
import UserEntryCard, { UserEntryCardObject } from '@/components/userEntryCard';
import { useMediaQuery } from 'usehooks-ts';
import { toast } from 'sonner';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import SmallRating from '@/components/smallRating';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/trpc/react';

const Page = () => {
  const {
    data,
    isPending: dataIsPending,
    error: dataError,
  } = api.dashboard.get.useQuery();

  if (dataIsPending) {
    return <Loader2 className="size-4 animate-spin" />;
  }

  if (!data) {
    return <div>{JSON.stringify(dataError.message)}</div>;
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
  topRatedNotCompleted,
  topCompletedNotCompleted,
}: {
  userEntries: (UserEntry & { entry: Entry } & { user: User })[];
  topCompletedNotCompleted: Entry[];
  topRatedNotCompleted: Entry[];
}) => {
  const {
    filterStatus,
    setFilterStatus,
    filterTitle,
    setFilterTitle,
    filterStyle,
    setFilterStyle,

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
    const handleResize = () =>
      setUserEntriesWidth((userEntriesRef.current as any).clientWidth ?? 0);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Shortcut for search

  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        (navigator?.platform?.toLowerCase().includes('mac')
          ? e.metaKey
          : e.ctrlKey) &&
        e.key === 'k'
      ) {
        e.preventDefault();
        e.stopPropagation();

        setFilterOpen(currentValue => {
          return !currentValue;
        });
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
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

  const InformationView = () => {
    const CustomStars = ({ rating }: { rating: number }) => (
      <>
        <div className="hidden text-white 2xl:block">
          <SmallRating rating={rating} />
        </div>
        <div className="flex items-center gap-1 text-white 2xl:hidden">
          <span className="text-sm">{(rating / 20).toFixed(1)}</span>
          <Star strokeWidth={0} className="size-4 fill-primary" />
        </div>
      </>
    );

    if (selectedUserEntry) {
      return (
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
            fetchUserListsWithEntry(selectedUserEntry);
          }}
        />
      );
    } else {
      return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium">
              Highest rated media you haven’t completed
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {topRatedNotCompleted?.map(e => (
                <UserEntryCard
                  key={'tr' + e.id}
                  {...{
                    title: e.originalTitle,
                    backgroundImage: e.posterPath,
                    category: e.category,
                    releaseDate: new Date(e.releaseDate),
                    rating: (e as any).average,
                    customStars: <CustomStars rating={(e as any).average} />,
                  }}
                />
              ))}
            </div>
            {/* <div className="flex w-full justify-end">
              <div className="text-sm">See more</div>
            </div> */}
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium">
              Most popular media you haven’t completed
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {topCompletedNotCompleted?.map(e => (
                <UserEntryCard
                  key={'tc' + e.id}
                  {...{
                    title: e.originalTitle,
                    backgroundImage: e.posterPath,
                    category: e.category,
                    releaseDate: new Date(e.releaseDate),
                    rating: 0,
                    customStars: <CustomStars rating={(e as any).average} />,
                  }}
                />
              ))}
            </div>
            {/* <div className="flex w-full justify-end">
              <div className="text-sm">See more</div>
            </div> */}
          </div>
        </div>
      );
    }
  };

  // Mobile

  const isXl = useMediaQuery('(min-width: 1280px)');
  const [informationViewOpen, setInformationViewOpenValue] = useState(false);

  const setInformationViewOpen = (open: boolean) => {
    if (!open) {
      setSelectedUserEntry(undefined);
    }

    setInformationViewOpenValue(open);
  };

  useEffect(() => {
    if (selectedUserEntry === undefined) {
      return;
    }

    if (isXl) {
      return;
    }

    setInformationViewOpen(true);
  }, [selectedUserEntry]);

  useEffect(() => {
    setInformationViewOpen(false);
  }, []);

  return (
    <>
      <Header title="My Media">
        <Tabs
          value={filterStyle}
          onValueChange={e => setFilterStyle(e as FilterStyle)}
          className="hidden lg:block"
        >
          <TabsList>
            <TabsTrigger value={'rating'}>
              <Star className="size-3" />
              Rating
            </TabsTrigger>
            <TabsTrigger value={'az'}>
              <AArrowDown className="size-3" />
              A-Z
            </TabsTrigger>
            <TabsTrigger value={'completed'}>
              <Eye className="size-3" />
              Completed
            </TabsTrigger>
            <TabsTrigger value={'updated'}>
              <Pen className="size-3" />
              Updated
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              size={'icon'}
              className="size-9 [&>svg]:size-4"
            >
              <Filter />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="z-50 me-4">
            <div className="grid gap-2">
              <div className="relative">
                <Input
                  placeholder="Title"
                  name="title"
                  value={filterTitle}
                  onChange={e => setFilterTitle(e.target.value)}
                />
                <div className="absolute right-[5.2px] top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-600">
                  <Command className="size-3" /> K
                </div>
              </div>
              <Select
                value={filterStatus}
                onValueChange={e =>
                  setFilterStatus(e as UserEntryStatus | undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="watching">Watching</SelectItem>
                    <SelectItem value="dnf">Did not finish</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <Button
                    variant={'ghost'}
                    size={'sm'}
                    className="w-full"
                    onClick={() => setFilterStatus(undefined)}
                  >
                    Clear
                  </Button>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
      </Header>
      <div
        ref={userEntriesRef}
        className="col-span-2 grid justify-center p-4 xl:col-span-1"
      >
        <div
          className="grid w-fit gap-3"
          style={{
            gridTemplateColumns: `repeat(${Math.floor(userEntriesWidth / 148)}, minmax(0, 1fr))`,
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
                  filterStatus !== undefined &&
                  userEntry.status !== filterStatus
                ) {
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
                  />
                );
              })}
        </div>
      </div>
      <div className="sticky top-[81px] hidden h-[calc(100dvh-81px)] bg-[#F5F5F5] p-4 shadow-[inset_0_0px_8px_0_rgb(0_0_0_/_0.02)] shadow-gray-200 xl:block">
        <InformationView />
      </div>
      <Drawer open={informationViewOpen} onOpenChange={setInformationViewOpen}>
        <DrawerContent className="top-[50px] mt-0 p-6">
          <InformationView />
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Page;
