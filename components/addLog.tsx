'use client';

import { ReactNode, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Toggle } from './ui/toggle';
import { Book, Film, Loader2, Tv } from 'lucide-react';

import useSWR from 'swr';
import fetcher from '@/client/fetcher';
import { Category, Entry } from '@prisma/client';
import UserEntryCard from './userEntryCard';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ExtendedUserEntry } from '@/app/(app)/dashboard/state';
import ExternalUserEntry from './userEntryExternal';

const AddLog = ({ children }: { children: ReactNode }) => {
  const [activeUserEntry, setActiveUserEntry] = useState<
    ExtendedUserEntry | undefined
  >(undefined);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [open, setOpen] = useState(false);
  const [userEntryOpen, setUserEntryOpen] = useState(false);

  const addUserEntry = async (entryId: number) => {
    fetch(`/api/user/entries`, {
      method: 'POST',
      body: JSON.stringify({
        entryId,
      }),
    })
      .then(data => data.json())
      .then(data => {
        if (data.message) {
          toast.success(data.message);
          data.userEntry.entry.releaseDate = new Date(
            data.userEntry.entry.releaseDate
          );
          setOpen(false);
          setUserEntryOpen(true);
          setActiveUserEntry(data.userEntry);
        } else {
          toast.error(data.error);
        }
      })
      .catch(() => {
        toast.error('Failed to add user entry!');
      });
  };

  return (
    <>
      {(() => {
        if (isDesktop) {
          return (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild className="hidden lg:block">
                {children}
              </DialogTrigger>
              <DialogContent className="top-[50px] max-h-[calc(100dvh-100px)] max-w-[700px] translate-y-0">
                <AddLogContent addUserEntry={addUserEntry} />
              </DialogContent>
            </Dialog>
          );
        } else {
          return (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild className="block lg:hidden">
                {children}
              </DrawerTrigger>
              <DrawerContent className="top-[50px] mt-0 gap-4 p-4">
                <AddLogContent addUserEntry={addUserEntry} />
              </DrawerContent>
            </Drawer>
          );
        }
      })()}

      {activeUserEntry !== undefined && (
        <ExternalUserEntry
          openOverride={[userEntryOpen, setUserEntryOpen]}
          userEntry={activeUserEntry}
          setUserEntry={setActiveUserEntry}
        />
      )}
    </>
  );
};

const AddLogContent = ({
  addUserEntry,
}: {
  addUserEntry: (entryId: number) => void;
}) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [queryCategories, setQueryCategories] = useState<{
    movie: boolean;
    series: boolean;
    book: boolean;
  }>({
    movie: true,
    series: true,
    book: true,
  });
  const [queryTitle, setQueryTitle] = useState('');

  const generateQueryCategories: () => string = (): string => {
    let q = '';
    if (queryCategories.book) {
      q += 'Book,';
    }
    if (queryCategories.movie) {
      q += 'Movie,';
    }
    if (queryCategories.series) {
      q += 'Series';
    }
    return q;
  };

  const { data: queryResults, isLoading: queryIsLoading } = useSWR<
    Entry[],
    { error: string }
  >(
    `/api/entries?q=${queryTitle}&take=8&categories=${generateQueryCategories()}`,
    fetcher
  );

  const { data: externalQueryResults, isLoading: externalQueryIsLoading } =
    useSWR<
      {
        title: string;
        category: Category;
        releaseDate: Date;
        author: string;
        foreignId: number;
        posterPath: string;
      }[],
      { error: string }
    >(
      `/api/import/search?q=${queryTitle}&categories=${generateQueryCategories()}&take=12&excludeExisting=true`,
      fetcher
    );

  const importMedia = async (foreignId: string, category: Category) => {
    setImporting(foreignId);

    fetch(
      `/api/import/${category.toLowerCase()}?${category === 'Book' ? 'olId' : 'tmdbId'}=${foreignId}`
    )
      .then(data => data.json())
      .then(data => {
        if (data.message) {
          toast.success(data.message);
          setImporting(undefined);
          addUserEntry(data.entry.id);
        } else {
          toast.error(data.error);
        }
      })
      .catch(() => {
        toast.error('Failed to import media!');
      });
  };

  const [importing, setImporting] = useState<string | undefined>(undefined);

  return (
    <>
      <DialogHeader className="hidden lg:block">
        <DialogTitle>Log Media</DialogTitle>
      </DialogHeader>
      <div className="flex flex-row gap-2">
        <Input
          placeholder="Search Media"
          value={queryTitle}
          onChange={e => setQueryTitle(e.target.value)}
        />
        <Toggle
          size={'sm'}
          className="w-8"
          pressed={queryCategories.movie}
          onPressedChange={e =>
            setQueryCategories({
              ...queryCategories,
              movie: e,
            })
          }
        >
          <Film />
        </Toggle>
        <Toggle
          size={'sm'}
          className="w-8"
          pressed={queryCategories.book}
          onPressedChange={e =>
            setQueryCategories({
              ...queryCategories,
              book: e,
            })
          }
        >
          <Book />
        </Toggle>
        <Toggle
          size={'sm'}
          className="w-8"
          pressed={queryCategories.series}
          onPressedChange={e =>
            setQueryCategories({
              ...queryCategories,
              series: e,
            })
          }
        >
          <Tv />
        </Toggle>
      </div>
      {!queryIsLoading &&
        !externalQueryIsLoading &&
        queryResults &&
        externalQueryResults &&
        queryResults.length === 0 &&
        externalQueryResults.length === 0 && (
          <div className="relative flex justify-center pt-4 text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              No Results Found
            </span>
          </div>
        )}

      <div className="max-h-[calc(100dvh-100px)] overflow-y-scroll lg:max-h-[calc(100dvh-220px)]">
        <div className="grid grid-cols-3 gap-4 lg:grid-cols-4">
          {queryResults &&
            queryResults
              .slice(0, isDesktop ? 8 : 6)
              .map(e => (
                <UserEntryCard
                  key={e.posterPath}
                  title={e.originalTitle}
                  backgroundImage={e.posterPath}
                  releaseDate={new Date(e.releaseDate)}
                  category={e.category}
                  rating={0}
                  onClick={() => addUserEntry(e.id)}
                />
              ))}
        </div>
        {(externalQueryIsLoading || queryIsLoading) && (
          <div className="relative flex justify-center text-xs uppercase">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {externalQueryResults && externalQueryResults.length > 0 && (
          <>
            {!(
              queryResults &&
              externalQueryResults.length > 0 &&
              queryResults.length === 0
            ) && (
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    OR VIA IMPORT
                  </span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-4">
              {externalQueryResults
                .slice(
                  0,
                  (isDesktop ? 8 : 12) -
                    (queryResults ? queryResults.length : 0)
                )
                .map(e => (
                  <div
                    key={e.posterPath}
                    className={cn({
                      'relative overflow-clip rounded-lg':
                        importing === e.foreignId.toString(),
                    })}
                  >
                    <UserEntryCard
                      title={e.title}
                      backgroundImage={e.posterPath}
                      releaseDate={new Date(e.releaseDate)}
                      category={e.category as Category}
                      rating={0}
                      className={cn({
                        'blur-[2px] brightness-50':
                          importing === e.foreignId.toString(),
                      })}
                      onClick={() => {
                        importMedia(e.foreignId.toString(), e.category);
                      }}
                    />
                    {importing === e.foreignId.toString() && (
                      <div className="absolute top-1/2 flex w-full -translate-y-1/2 flex-col items-center justify-center gap-2">
                        <div className="text-sm font-semibold text-white">
                          IMPORTING
                        </div>
                        <Loader2 className="size-4 animate-spin stroke-white" />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AddLog;
