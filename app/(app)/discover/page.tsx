'use client';

import { EntryRedirect } from '@/app/(app)/_components/EntryIslandContext';
import { SidebarButtons } from '@/app/(app)/_components/sidebar';
import { Header } from '@/components/header';
import InLibrary from '@/components/inLibrary';
import HeaderLayout from '@/components/layouts/header';
import SmallRating from '@/components/smallRating';
import { Button } from '@/components/ui/button';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useInfiniteScroll } from '@/components/useInfiniteScroll';
import { useMediaTypeFilters } from '@/components/useMediaTypeFilters';
import UserEntryCard from '@/components/userEntryCard';
import { mediaTypeFiltersToCategories } from '@/lib/mediaTypeFilters';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { Command, Loader2, SlidersHorizontal, SortDesc } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

type DiscoverSort = 'az' | 'rating';
type DiscoverLibraryStatus = 'all' | 'in-library' | 'not-in-library';

const DiscoverFilters = ({
  sort,
  setSort,
  query,
  setQuery,
  libraryStatus,
  setLibraryStatus,
  ratingRange,
  setRatingRange,
  className,
}: {
  sort: DiscoverSort;
  setSort: (sort: DiscoverSort) => void;
  query: string;
  setQuery: (query: string) => void;
  libraryStatus: DiscoverLibraryStatus;
  setLibraryStatus: (status: DiscoverLibraryStatus) => void;
  ratingRange: [number, number];
  setRatingRange: (range: [number, number]) => void;
  className?: string;
}) => {
  const searchTitleRef = useRef<HTMLInputElement>(null);

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

        searchTitleRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative w-full lg:w-89">
        <Input
          ref={searchTitleRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex w-full lg:w-89"
          placeholder="Search by title..."
        />
        <div className="absolute right-[5.2px] top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-base-200 bg-white px-2 py-0.5 text-xs font-medium text-base-600 lg:flex">
          <Command className="size-3" /> K
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={'sm'} variant={'outline'} disabled={!!query}>
            <SortDesc className="stroke-base-600" />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={sort}
            onValueChange={value => setSort(value as DiscoverSort)}
          >
            <DropdownMenuRadioItem value="az">A-Z</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="rating">Rating</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet>
        <SheetTrigger asChild>
          <Button size={'sm'} variant={'outline'}>
            <SlidersHorizontal className="stroke-base-600" />
            Filter
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Filter Entries</SheetTitle>
            <SheetDescription>
              Customize shown entries these filters
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 py-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Library</h3>
              <RadioGroup
                value={libraryStatus}
                onValueChange={value =>
                  setLibraryStatus(value as DiscoverLibraryStatus)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="library-all" />
                  <Label htmlFor="library-all">Either</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-library" id="library-in" />
                  <Label htmlFor="library-in">In my library</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-in-library" id="library-not-in" />
                  <Label htmlFor="library-not-in">Not in my library</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-1 transition-all duration-150">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Rating Range</h3>
                <span className="text-sm text-base-500">
                  {ratingRange[0] / 20} - {ratingRange[1] / 20}
                </span>
              </div>
              <DualRangeSlider
                defaultValue={[0, 100]}
                max={100}
                value={ratingRange}
                onValueChange={setRatingRange}
                className="py-4"
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const Page = () => {
  const [sort, setSort] = useState<DiscoverSort>('rating');
  const [query, setQuery] = useState('');
  const [libraryStatus, setLibraryStatus] = useState<DiscoverLibraryStatus>('all');
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 100]);
  const debouncedQuery = useDebounceValue(query, 200);
  const { filters } = useMediaTypeFilters();

  const discover = api.entries.discover.useInfiniteQuery(
    {
      query: debouncedQuery[0],
      categories: mediaTypeFiltersToCategories(filters),
      sort,
      libraryStatus,
      ratingRange,
      limit: 60,
    },
    {
      initialCursor: 0,
      getNextPageParam: lastPage => lastPage.nextCursor,
    }
  );
  const entries = useMemo(
    () => discover.data?.pages.flatMap(page => page.items) ?? [],
    [discover.data]
  );

  const loadMore = useCallback(() => {
    void discover.fetchNextPage();
  }, [discover]);

  useInfiniteScroll({
    enabled: !!discover.hasNextPage && !discover.isFetchingNextPage,
    onLoadMore: loadMore,
  });

  const entriesRef = useRef<HTMLDivElement>(null);
  const [entriesWidth, setEntriesWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setEntriesWidth(entriesRef.current?.clientWidth ?? 0);
    };

    const animationFrame = window.requestAnimationFrame(handleResize);
    window.addEventListener('resize', handleResize);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <HeaderLayout className="gap-0">
      <Header titleComponent="Discover" sidebarContent={<SidebarButtons />}>
        <DiscoverFilters
          className="hidden items-center gap-2 lg:flex"
          sort={sort}
          setSort={setSort}
          query={query}
          setQuery={setQuery}
          libraryStatus={libraryStatus}
          setLibraryStatus={setLibraryStatus}
          ratingRange={ratingRange}
          setRatingRange={setRatingRange}
        />
      </Header>
      <div
        ref={entriesRef}
        className="grid h-fit justify-center bg-base-100 p-4 xl:col-span-1"
      >
        <DiscoverFilters
          className="flex w-full flex-col gap-2 pb-4 sm:flex-row lg:hidden"
          sort={sort}
          setSort={setSort}
          query={query}
          setQuery={setQuery}
          libraryStatus={libraryStatus}
          setLibraryStatus={setLibraryStatus}
          ratingRange={ratingRange}
          setRatingRange={setRatingRange}
        />
        {discover.isLoading && (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="size-4 animate-spin" />
          </div>
        )}
        {!discover.isLoading && entries.length === 0 && (
          <div className="flex h-32 items-center justify-center text-sm text-base-500">
            No entries found
          </div>
        )}
        <div
          className="grid h-fit w-fit max-w-5xl gap-2"
          style={{
            gridTemplateColumns: `repeat(${Math.max(3, Math.floor(Math.min(entriesWidth, 1024) / 148))}, minmax(0, 1fr))`,
          }}
        >
          {entries.map(entry => (
            <EntryRedirect
              key={entry.id}
              entryId={entry.id}
              entrySlug={entry.slug}
              className="block"
            >
              <UserEntryCard
                entryTitle={
                  entry.translations.length !== 0
                    ? entry.translations[0]!.name
                    : entry.originalTitle
                }
                backgroundImage={entry.posterPath}
                releaseDate={entry.releaseDate}
                category={entry.category}
                rating={entry.averageRating}
                customStars={<SmallRating rating={entry.averageRating} />}
                topRight={entry.userEntries.length > 0 && <InLibrary />}
                className="lg:min-w-33"
              />
            </EntryRedirect>
          ))}
        </div>
        {discover.isFetchingNextPage && (
          <div className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="size-4 animate-spin" /> Loading more entries...
          </div>
        )}
        {!discover.hasNextPage && entries.length > 0 && (
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