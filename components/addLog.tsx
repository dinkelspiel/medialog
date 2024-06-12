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

import { Category, Entry } from '@prisma/client';
import UserEntryCard from './userEntryCard';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { useDebounceValue, useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ExtendedUserEntry } from '@/app/(app)/dashboard/state';
import ExternalUserEntry from './userEntryExternal';
import { useRouter } from 'next/navigation';
import { dataTagSymbol, useMutation, useQuery } from '@tanstack/react-query';

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

  const addUserEntry = useMutation({
    mutationKey: ['addUserEntry'],
    mutationFn: (data: { entryId: number }) =>
      fetch(`/api/user/entries`, {
        method: 'POST',
        body: JSON.stringify({
          entryId: data.entryId,
        }),
      }),
    onSuccess: async (result, variables, context) => {
      const data = await result.json();

      if (data.message) {
        toast.success(data.message);
        data.userEntry.entry.releaseDate = new Date(
          data.userEntry.entry.releaseDate
        );
        setOpen(false);
        setUserEntryOpen(true);
        setActiveUserEntry(data.userEntry);

        router.refresh();
      } else {
        toast.error(data.error);
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

  const debouncedQueryTitle = useDebounceValue(queryTitle, 500);

  const {
    data: queryResults,
    isLoading: queryIsLoading,
    isError: queryIsError,
    error: queryError,
  } = useQuery<Entry[]>({
    queryFn: () =>
      fetch(
        `/api/entries?q=${debouncedQueryTitle[0]}&take=8&categories=${generateQueryCategories()}`
      ).then(res => res.json()),
    queryKey: [
      'internalSearch',
      debouncedQueryTitle,
      generateQueryCategories(),
    ],
  });

  const {
    data: externalQueryResults,
    isLoading: externalQueryIsLoading,
    isError: externalIsError,
    error: externalQueryError,
  } = useQuery<
    {
      title: string;
      category: Category;
      releaseDate: Date;
      author: string;
      foreignId: number;
      posterPath: string;
    }[]
  >({
    queryFn: () =>
      fetch(
        `/api/import/search?q=${debouncedQueryTitle[0]}&categories=${generateQueryCategories()}&take=12&excludeExisting=true`
      ).then(res => res.json()),
    queryKey: [
      'externalSearch',
      debouncedQueryTitle,
      generateQueryCategories(),
    ],
  });

  const importMedia = useMutation({
    mutationKey: ['importMedia'],
    mutationFn: (data: { foreignId: string; category: Category }) =>
      fetch(
        `/api/import/${data.category.toLowerCase()}?${data.category === 'Book' ? 'olId' : 'tmdbId'}=${data.foreignId}`
      ),
    onMutate: data => setImporting(data.foreignId),
    onSuccess: async (result, variables, context) => {
      const data = await result.json();
      setImporting(undefined);
      if (data.message) {
        addAction(data.entry.id!);
      } else {
        toast.error(data.error);
      }
    },
    onError: async (error, variables, context) => {
      toast.error(error.message);
    },
  });

  const [importing, setImporting] = useState<string | undefined>(undefined);

  return (
    <>
      <DialogHeader className="hidden lg:block">
        <DialogTitle>{title}</DialogTitle>
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
        !queryIsError &&
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
                  onClick={() => addAction(e.id)}
                />
              ))}
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
                        importMedia.mutate({
                          foreignId: e.foreignId.toString(),
                          category: e.category,
                        });
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
