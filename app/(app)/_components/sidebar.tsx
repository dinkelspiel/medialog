import { SidebarButton } from '@/components/sidebar';
import { Toggle } from '@/components/ui/toggle';
import { useMediaTypeFilters } from '@/components/useMediaTypeFilters';
import { Book, Compass, Film, Home, Tv, UsersRound } from 'lucide-react';

export const SidebarButtons = () => (
  <>
    <SidebarButton href="/dashboard">
      <Home className="size-4 stroke-base-600" />
      Home
    </SidebarButton>
    <SidebarButton href="/discover">
      <Compass className="size-4 stroke-base-600" />
      Discover
    </SidebarButton>
    <SidebarButton href="/community/feed">
      <UsersRound className="size-3" />
      Community
    </SidebarButton>
  </>
);

export const SidebarCategoryFilters = () => {
  const { filters, setFilters } = useMediaTypeFilters();

  return (
    <div className="flex flex-col gap-2 border-t border-dashed border-t-base-200 pt-3">
      <div className="px-2 text-xs font-medium uppercase text-base-400">
        Categories
      </div>
      <Toggle
        size="sm"
        className="w-full justify-start"
        pressed={filters.movie}
        onPressedChange={movie => setFilters({ ...filters, movie })}
      >
        <Film className="size-4" />
        Movies
      </Toggle>
      <Toggle
        size="sm"
        className="w-full justify-start"
        pressed={filters.book}
        onPressedChange={book => setFilters({ ...filters, book })}
      >
        <Book className="size-4" />
        Books
      </Toggle>
      <Toggle
        size="sm"
        className="w-full justify-start whitespace-nowrap"
        pressed={filters.series}
        onPressedChange={series => setFilters({ ...filters, series })}
      >
        <Tv className="size-4" />
        Tv Series
      </Toggle>
    </div>
  );
};
