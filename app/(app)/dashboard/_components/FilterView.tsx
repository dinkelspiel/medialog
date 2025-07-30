import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Category, UserEntryStatus } from '@prisma/client';
import { useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';
import { shouldBeFiltered } from '../page';

export const FilterView = ({ className }: { className: string }) => {
  const {
    userEntries,
    filterStatus,
    setFilterStatus,
    filterCategories,
    toggleFilterCategory,
    filterTitle,
    setFilterTitle,
    filterStyle,
    setFilterStyle,
    filterRatingRange,
    setFilterRatingRange,
    setSelectedUserEntry,
  } = useDashboardStore();

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

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative w-full lg:w-[356px]">
        <Input
          ref={searchTitleRef}
          value={filterTitle}
          onChange={e => setFilterTitle(e.target.value)}
          className="flex w-full lg:w-[356px]"
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
                onValueChange={(e: any) =>
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
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Categories</h3>
              <div className="grid gap-2">
                {Object.keys(Category).map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      value={category}
                      id={category}
                      checked={filterCategories.includes(category as Category)}
                      onCheckedChange={() =>
                        toggleFilterCategory(category as Category)
                      }
                    />
                    <Label htmlFor={category}>{category}</Label>
                  </div>
                ))}
              </div>
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

                let index = Math.floor(Math.random() * availableEntries.length);
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
