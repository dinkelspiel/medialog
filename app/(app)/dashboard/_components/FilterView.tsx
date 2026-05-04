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
import { cn } from '@/lib/utils';
import { Command, Dices, SlidersHorizontal, SortDesc } from 'lucide-react';
import { FilterStyle, useDashboardStore } from '../state';
import { Entry, UserEntry, UserEntryStatus } from '@/prisma/generated/browser';
import { useEffect, useRef } from 'react';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';

export const shouldBeFiltered = (
  userEntry: UserEntry & { entry: Entry },
  filterState?: {
    filterStatus: string;
    filterRatingRange: [number, number];
  }
) => {
  const state = filterState ?? useDashboardStore.getState();

  if (state.filterStatus !== 'all' && userEntry.status !== state.filterStatus) {
    return true;
  }

  if (
    ((userEntry.rating === null &&
      (state.filterRatingRange[0] !== 0 || state.filterRatingRange[1] !== 100)) ||
      (userEntry.rating !== null &&
        (userEntry.rating > state.filterRatingRange[1] ||
          userEntry.rating < state.filterRatingRange[0]))) &&
    state.filterStatus !== 'planning'
  ) {
    return true;
  }

  return false;
};
export const FilterView = ({ className }: { className: string }) => {
  const {
    userEntries,
    filterStatus,
    setFilterStatus,
    filterTitle,
    setFilterTitle,
    filterStyle,
    setFilterStyle,
    filterRatingRange,
    setFilterRatingRange,
    setSelectedUserEntry,
  } = useDashboardStore();

  // Shortcut for search

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
          value={filterTitle}
          onChange={e => setFilterTitle(e.target.value)}
          className="flex w-full lg:w-89"
          placeholder="Search by title..."
        />
        <div className="absolute right-[5.2px] top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-base-200 bg-white px-2 py-0.5 text-xs font-medium text-base-600 lg:flex">
          <Command className="size-3" /> K
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={'sm'} variant={'outline'} disabled={!!filterTitle}>
            <SortDesc className="stroke-base-600" />
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
            <DropdownMenuRadioItem value="rating-desc">
              Rating (High to Low)
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="rating-asc">
              Rating (Low to High)
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
            <div
              className={cn('space-y-1 transition-all duration-150', {
                'pointer-events-none opacity-50': filterStatus === 'planning',
              })}
            >
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">Rating Range</h3>
                <span className="text-sm text-base-500">
                  {filterRatingRange[0] / 20} - {filterRatingRange[1] / 20}
                </span>
              </div>
              <DualRangeSlider
                defaultValue={[0, 100]}
                max={100}
                // step={0.1}
                value={filterRatingRange}
                onValueChange={setFilterRatingRange}
                className="py-4"
              />
            </div>
          </div>
          <div className="flex h-full flex-col justify-end">
            <Button
              className="w-full"
              size={'sm'}
              variant={'outline'}
              disabled={(() => {
                const availableEntries = userEntries.filter(userEntry => {
                  return !shouldBeFiltered(userEntry);
                });
                return availableEntries.length === 0;
              })()}
              onClick={() => {
                const availableEntries = userEntries.filter(userEntry => {
                  return !shouldBeFiltered(userEntry);
                });

                const index = Math.floor(Math.random() * availableEntries.length);
                setSelectedUserEntry(availableEntries[index]!.id);
              }}
            >
              <Dices className="stroke-base-600" />
              Pick Random
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
