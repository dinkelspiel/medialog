'use client';

import { Book, Film, Library, Loader2, Tv } from 'lucide-react';
import { Dispatch, Fragment, ReactNode, SetStateAction, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Toggle } from './ui/toggle';

import { ExtendedUserEntry } from '@/app/(app)/dashboard/state';
import { cn } from '@/lib/utils';
import { Category, Entry, EntryTranslation } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDebounceValue, useMediaQuery } from 'usehooks-ts';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import UserEntryCard from './userEntryCard';
import ExternalUserEntry from './userEntryExternal';
import { api } from '@/trpc/react';
import { getUserTitleFromEntry } from '@/server/api/routers/dashboard_';
import { Badge } from './ui/badge';
import ModifyUserEntry from './modifyUserEntry';
import ContainedModifyUserEntry from './containedModifyUserEntry';
import InLibrary from './inLibrary';

const AddLog = ({
  children,
  override,
}: {
  children: ReactNode;
  override?: {
    addAction?: (entryId: number) => Promise<void>;
    title?: string;
  };
}) => {
  const [activeUserEntry, setActiveUserEntry] = useState<
    ExtendedUserEntry | undefined
  >(undefined);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [open, setOpen] = useState(false);
  const [userEntryOpen, setUserEntryOpen] = useState(false);

  const router = useRouter();
  const utils = api.useUtils();

  const addUserEntry = api.userEntry.create.useMutation({
    onSuccess: async data => {
      if (!('message' in data)) {
        return;
      } else if (data.message) {
        toast.success(data.message);
        data.userEntry.entry.releaseDate = new Date(
          data.userEntry.entry.releaseDate
        );

        setUserEntryOpen(true);
        setActiveUserEntry(data.userEntry);
        utils.entries.search.invalidate();
        utils.dashboard.invalidate();

        router.refresh();
      }
    },
    onError: error => {
      toast.error('Failed to add user entry! ' + error.message);
    },
  });

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
                <AddLogContent
                  title={override?.title ?? 'Add Log'}
                  addAction={
                    override
                      ? override?.addAction
                        ? (entryId: number) => {
                            setOpen(false);
                            override!.addAction!(entryId);
                          }
                        : (entryId: number) => addUserEntry.mutate({ entryId })
                      : (entryId: number) => addUserEntry.mutate({ entryId })
                  }
                />
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
                <AddLogContent
                  title={override?.title ?? 'Add Log'}
                  addAction={
                    override
                      ? override?.addAction
                        ? (entryId: number) => {
                            setOpen(false);
                            override!.addAction!(entryId);
                          }
                        : (entryId: number) => addUserEntry.mutate({ entryId })
                      : (entryId: number) => addUserEntry.mutate({ entryId })
                  }
                />
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

const CategoryToggles = ({
  queryCategories,
  setQueryCategories,
}: {
  queryCategories: {
    movie: boolean;
    series: boolean;
    book: boolean;
  };
  setQueryCategories: Dispatch<
    SetStateAction<{
      movie: boolean;
      series: boolean;
      book: boolean;
    }>
  >;
}) => {
  return (
    <>
      <Toggle
        size={'sm'}
        className="w-full"
        pressed={queryCategories.movie}
        onPressedChange={(e: boolean) =>
          setQueryCategories({
            ...queryCategories,
            movie: e,
          })
        }
      >
        <Film className="size-4" />
        Movies
      </Toggle>
      <Toggle
        size={'sm'}
        className="w-full"
        pressed={queryCategories.book}
        onPressedChange={(e: boolean) =>
          setQueryCategories({
            ...queryCategories,
            book: e,
          })
        }
      >
        <Book className="size-4" />
        Books
      </Toggle>
      <Toggle
        size={'sm'}
        className="w-full whitespace-nowrap"
        pressed={queryCategories.series}
        onPressedChange={(e: boolean) =>
          setQueryCategories({
            ...queryCategories,
            series: e,
          })
        }
      >
        <Tv className="size-4" />
        Tv Series
      </Toggle>
    </>
  );
};

const AddLogContent = ({
  addAction,
  title,
}: {
  addAction: (entryId: number) => void;
  title: string;
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

  const generateQueryCategories = (): string[] => {
    let q = [];
    if (queryCategories.book) {
      q.push('Book');
    }
    if (queryCategories.movie) {
      q.push('Movie');
    }
    if (queryCategories.series) {
      q.push('Series');
    }
    return q;
  };

  const debouncedQueryTitle = useDebounceValue(queryTitle, 500);

  const {
    data: queryResults,
    isLoading: queryIsLoading,
    isError: queryIsError,
    error: queryError,
  } = api.entries.search.useQuery({
    query: debouncedQueryTitle[0],
    limit: 8,
    categories: generateQueryCategories(),
  });

  const {
    data: externalQueryResults,
    isLoading: externalQueryIsLoading,
    isError: externalIsError,
    error: externalQueryError,
  } = api.import.search.useQuery({
    query: debouncedQueryTitle[0],
    categories: generateQueryCategories(),
    take: 12,
    excludeExisting: true,
  });

  const importBook = api.import.book.useMutation({
    onMutate: data => setImporting(data.olId.toString()),
    onSuccess: data => {
      setImporting(undefined);
      addAction(data.entry.id!);
    },
    onError: data => {
      toast.error(data.message);
    },
  });

  const importMovie = api.import.movie.useMutation({
    onMutate: data => setImporting(data.tmdbId.toString()),
    onSuccess: data => {
      setImporting(undefined);
      addAction(data.entry.id!);
    },
    onError: data => {
      toast.error(data.message);
    },
  });

  const importSeries = api.import.series.useMutation({
    onMutate: data => setImporting(data.tmdbId.toString()),
    onSuccess: data => {
      setImporting(undefined);
      addAction(data.entry.id!);
    },
    onError: data => {
      toast.error(data.message);
    },
  });

  const [importing, setImporting] = useState<string | undefined>(undefined);

  return (
    <>
      <DialogHeader className="hidden lg:block">
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <Input
            placeholder="Search Media"
            value={queryTitle}
            onChange={e => setQueryTitle(e.target.value)}
          />
          <div className="hidden flex-row gap-2 lg:flex">
            <CategoryToggles
              queryCategories={queryCategories}
              setQueryCategories={setQueryCategories}
            />
          </div>
        </div>
        <div className="flex flex-row gap-2 lg:hidden">
          <CategoryToggles
            queryCategories={queryCategories}
            setQueryCategories={setQueryCategories}
          />
        </div>
      </div>
      {!queryIsLoading &&
        !queryIsError &&
        !externalQueryIsLoading &&
        queryResults &&
        externalQueryResults &&
        queryResults.length === 0 &&
        externalQueryResults.length === 0 && (
          <div className="relative flex justify-center pt-4 text-xs uppercase">
            <span className="bg-white px-2 text-base-500">
              No Results Found
            </span>
          </div>
        )}

      <div className="no-scrollbar max-h-[calc(100dvh-100px)] overflow-y-scroll lg:max-h-[calc(100dvh-220px)]">
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-4">
          {queryResults &&
            queryResults
              .slice(0, isDesktop ? 8 : 6)
              .map(entry => ({
                entry,
                callback:
                  entry.userEntries.length > 0
                    ? (children: ReactNode) => (
                        <ContainedModifyUserEntry
                          key={entry.posterPath}
                          id={{ entryId: entry.id }}
                        >
                          {children}
                        </ContainedModifyUserEntry>
                      )
                    : (children: ReactNode) => (
                        <Fragment key={entry.posterPath}>{children}</Fragment>
                      ),
              }))
              .map(({ entry, callback }) =>
                callback(
                  <UserEntryCard
                    entryTitle={getUserTitleFromEntry(entry)}
                    backgroundImage={entry.posterPath}
                    releaseDate={new Date(entry.releaseDate)}
                    category={entry.category}
                    rating={0}
                    onClick={() => {
                      if (entry.userEntries.length === 0) {
                        addAction(entry.id);
                      }
                    }}
                    topRight={entry.userEntries.length > 0 && <InLibrary />}
                  />
                )
              )}
        </div>
        {externalIsError && (
          <div className="relative flex justify-center text-xs uppercase">
            {externalQueryError.message}
          </div>
        )}
        {queryIsError && (
          <div className="relative flex justify-center text-xs uppercase">
            {queryError.message}
          </div>
        )}
        {(externalQueryIsLoading || queryIsLoading) && (
          <div className="relative flex justify-center text-xs uppercase">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {externalQueryResults && externalQueryResults.length > 0 && (
          <>
            {externalQueryResults.length > 0 && (
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-base-500">
                    OR VIA IMPORT
                  </span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-4">
              {externalQueryResults
                // .slice(
                //   0,
                //   (isDesktop ? 8 : 12) -
                //     (queryResults ? queryResults.length : 0)
                // )
                .map(e => (
                  <div
                    key={e.foreignId}
                    className={cn({
                      'relative overflow-clip rounded-lg':
                        importing === e.foreignId.toString(),
                    })}
                  >
                    <UserEntryCard
                      entryTitle={e.title}
                      backgroundImage={e.posterPath}
                      releaseDate={new Date(e.releaseDate)}
                      category={e.category as Category}
                      rating={0}
                      className={cn({
                        'blur-[2px] brightness-50':
                          importing === e.foreignId.toString(),
                      })}
                      onClick={() => {
                        switch (e.category) {
                          case 'Series':
                            importSeries.mutate({
                              tmdbId: e.foreignId as number,
                            });
                            break;
                          case 'Movie':
                            importMovie.mutate({
                              tmdbId: e.foreignId as number,
                            });
                            break;
                          case 'Book':
                            importBook.mutate({ olId: e.foreignId as string });
                            break;
                        }
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
