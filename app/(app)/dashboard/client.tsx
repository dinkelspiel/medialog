'use client';

import {
  Header,
  HeaderContent,
  HeaderDescription,
  HeaderHeader,
  HeaderTitle,
} from '@/components/header';
import UserEntryComponent from './userEntry';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Entry, User, UserEntry, UserEntryStatus } from '@prisma/client';
import { AArrowDown, Eye, Menu, Pen, Star } from 'lucide-react';
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
import { useEffect } from 'react';
import { FilterStyle, useDashboardStore } from './state';

const Dashboard = ({
  userEntries: originalUserEntries,
}: {
  userEntries: (UserEntry & { entry: Entry } & { user: User })[];
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
  } = useDashboardStore();

  useEffect(() => {
    setUserEntries(originalUserEntries);
  }, [originalUserEntries]);

  return (
    <>
      <Header>
        <HeaderHeader>
          <HeaderTitle>My Media</HeaderTitle>
          <HeaderDescription>
            Search through your entire media catalogue
          </HeaderDescription>
        </HeaderHeader>
        <HeaderContent>
          <Tabs
            value={filterStyle}
            onValueChange={e => setFilterStyle(e as FilterStyle)}
            className="lg:block hidden"
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
              <TabsTrigger value={'watched'}>
                <Eye className="size-3" />
                Watched
              </TabsTrigger>
              <TabsTrigger value={'updated'}>
                <Pen className="size-3" />
                Updated
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                size={'icon'}
                className="size-9 [&>svg]:size-4"
              >
                <Menu />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="me-4 z-50">
              <div className="grid gap-2">
                <Input
                  placeholder="Title"
                  name="title"
                  value={filterTitle}
                  onChange={e => setFilterTitle(e.target.value)}
                />
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
        </HeaderContent>
      </Header>
      <div className="grid justify-center">
        <div className="grid grid-cols-3 min-[700px]:grid-cols-4 min-[1100px]:grid-cols-5 min-[1300px]:grid-cols-6 min-[1500px]:grid-cols-7 w-fit gap-4">
          {userEntries
            .sort((a, b) => {
              switch (filterStyle) {
                case 'rating':
                  return b.rating - a.rating;
                case 'az':
                  return a.entry.originalTitle.localeCompare(
                    b.entry.originalTitle
                  );
                case 'watched':
                  if (a.watchedAt === null || b.watchedAt === null) {
                    return 0;
                  }
                  return b.watchedAt.getTime() - a.watchedAt.getTime();
                case 'updated':
                  return b.updatedAt.getTime() - a.updatedAt.getTime();
              }
            })
            .map(userEntry => {
              if (
                filterTitle !== '' &&
                !userEntry.entry.originalTitle
                  .toLowerCase()
                  .includes(filterTitle.toLowerCase())
              ) {
                return;
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
                <UserEntryComponent userEntry={userEntry} key={userEntry.id} />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
