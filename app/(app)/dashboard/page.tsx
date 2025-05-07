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
  SlidersHorizontal,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { SidebarButtons } from '../_components/sidebar';
import HeaderLayout from '@/components/layouts/header';

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
    setUserEntriesWidth((userEntriesRef.current as any).clientWidth ?? 0);
    const handleResize = () =>
      setUserEntriesWidth((userEntriesRef.current as any).clientWidth ?? 0);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Shortcut for search

  const searchTitleRef = useRef(null);

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

        (searchTitleRef.current as any).focus();
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

  const FilterView = ({ className }: { className: string }) => (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative w-full lg:w-[356px]">
        <Input
          ref={searchTitleRef}
          value={filterTitle}
          onChange={e => setFilterTitle(e.target.value)}
          className="flex w-full lg:w-[356px]"
          placeholder="Search by title..."
        />
        <div className="absolute right-[5.2px] top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-600 lg:flex">
          <Command className="size-3" /> K
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={'sm'} variant={'outline'}>
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={filterStyle}
            onValueChange={e => setFilterStyle(e as FilterStyle)}
          >
            <DropdownMenuRadioItem value="rating">
              Rating (High to Low)
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="az">A-Z</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="completed">
              Completed
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="updated">
              Recently Updated
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet>
        <SheetTrigger asChild>
          <Button size={'sm'} variant={'outline'}>
            <SlidersHorizontal className="stroke-neutral-600" />
            Filter
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Entries</SheetTitle>
            <SheetDescription>
              Customize shown entries these filters
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Status</h3>
              <RadioGroup
                value={filterStatus}
                onValueChange={e =>
                  setFilterStatus(e as UserEntryStatus | undefined)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="planning" id="planning" />
                  <Label htmlFor="planning">Planning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="watching" id="watching" />
                  <Label htmlFor="watching">Watching</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paused" id="paused" />
                  <Label htmlFor="paused">Paused</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dnf" id="dnf" />
                  <Label htmlFor="dnf">Did not finish</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="completed" id="completed" />
                  <Label htmlFor="completed">Completed</Label>
                </div>
              </RadioGroup>
            </div>

            {/* <div className="space-y-3">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium">Rating Range</h3>
              <span className="text-sm text-muted-foreground">
                {ratingRange[0]} - {ratingRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[0, 10]}
              max={10}
              step={0.5}
              value={ratingRange}
              onValueChange={setRatingRange}
              className="py-4"
            />
          </div> */}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <HeaderLayout className="gap-0">
      <Header
        className="col-span-2"
        titleComponent="My Media"
        sidebarContent={<SidebarButtons />}
      >
        <FilterView className="hidden lg:flex" />
      </Header>
      <div
        ref={userEntriesRef}
        className="col-span-2 grid justify-center bg-neutral-100 p-4 xl:col-span-1"
      >
        <FilterView className="flex pb-4 lg:hidden" />
        <div
          className="grid w-fit max-w-[1024px] gap-3"
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
