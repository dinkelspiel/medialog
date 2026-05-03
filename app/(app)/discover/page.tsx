'use client';

import { EntryRedirect } from '@/app/(app)/_components/EntryIslandContext';
import { SidebarButtons } from '@/app/(app)/_components/sidebar';
import { Header } from '@/components/header';
import InLibrary from '@/components/inLibrary';
import HeaderLayout from '@/components/layouts/header';
import SmallRating from '@/components/smallRating';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toggle } from '@/components/ui/toggle';
import { useMediaTypeFilters } from '@/components/useMediaTypeFilters';
import UserEntryCard from '@/components/userEntryCard';
import {
  MediaTypeFilters,
  mediaTypeFiltersToCategories,
} from '@/lib/mediaTypeFilters';
import { Category } from '@/prisma/generated/browser';
import { api } from '@/trpc/react';
import { Book, Film, Loader2, SortDesc, Tv } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type DiscoverSort = 'az' | 'rating';

const categoryOptions: {
  category: Category;
  filterKey: keyof MediaTypeFilters;
  label: string;
  icon: typeof Film;
}[] = [
  { category: 'Movie', filterKey: 'movie', label: 'Movies', icon: Film },
  { category: 'Book', filterKey: 'book', label: 'Books', icon: Book },
  { category: 'Series', filterKey: 'series', label: 'Tv Series', icon: Tv },
];

const DiscoverFilters = ({
  filters,
  setFilters,
  sort,
  setSort,
  className,
}: {
  filters: MediaTypeFilters;
  setFilters: (filters: MediaTypeFilters) => void;
  sort: DiscoverSort;
  setSort: (sort: DiscoverSort) => void;
  className?: string;
}) => {
  const toggleCategory = (
    filterKey: keyof MediaTypeFilters,
    pressed: boolean
  ) => {
    setFilters({
      ...filters,
      [filterKey]: pressed,
    });
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={'sm'} variant={'outline'}>
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
      {categoryOptions.map(({ category, filterKey, label, icon: Icon }) => (
        <Toggle
          key={category}
          size={'sm'}
          className="w-full whitespace-nowrap lg:w-auto"
          pressed={filters[filterKey]}
          onPressedChange={pressed => toggleCategory(filterKey, pressed)}
        >
          <Icon className="size-4" />
          {label}
        </Toggle>
      ))}
    </div>
  );
};

const Page = () => {
  const [sort, setSort] = useState<DiscoverSort>('rating');
  const { filters, setFilters } = useMediaTypeFilters();

  const { data: entries, isPending } = api.entries.discover.useQuery({
    categories: mediaTypeFiltersToCategories(filters),
    sort,
    limit: 180,
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
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
        />
      </Header>
      <div
        ref={entriesRef}
        className="grid h-fit justify-center bg-base-100 p-4 xl:col-span-1"
      >
        <DiscoverFilters
          className="flex w-full flex-col gap-2 pb-4 sm:flex-row lg:hidden"
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
        />
        {isPending && (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="size-4 animate-spin" />
          </div>
        )}
        {!isPending && entries?.length === 0 && (
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
          {entries?.map(entry => (
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
      </div>
    </HeaderLayout>
  );
};

export default Page;