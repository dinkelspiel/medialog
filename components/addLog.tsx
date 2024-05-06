'use client';

import React, { ReactNode, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
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

const AddLog = ({ children }: { children: ReactNode }) => {
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

  const {
    data: queryResults,
    error: queryError,
    isLoading: queryIsLoading,
  } = useSWR<Entry[], { error: string }>(
    `/api/entries?q=${queryTitle}&take=8&categories=${generateQueryCategories()}`,
    fetcher
  );

  const {
    data: externalQueryResults,
    error: externalQueryError,
    isLoading: externalQueryIsLoading,
  } = useSWR<
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
    `/api/import/search?q=${queryTitle}&categories=${generateQueryCategories()}&take=4&excludeExisting=true`,
    fetcher
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="top-[50px] max-w-[700px] translate-y-0">
        <DialogHeader>
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
        <div className="grid grid-cols-4 gap-4">
          {queryResults &&
            queryResults.map(e => (
              <UserEntryCard
                key={e.posterPath}
                title={e.originalTitle}
                backgroundImage={e.posterPath}
                releaseDate={new Date(e.releaseDate)}
                category={e.category}
                rating={0}
              />
            ))}
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          {(externalQueryIsLoading || queryIsLoading) && (
            <Loader2 className="animate-spin" />
          )}
        </div>
        {externalQueryResults && externalQueryResults.length > 0 && (
          <>
            {!(
              queryResults &&
              externalQueryResults.length > 0 &&
              queryResults.length === 0
            ) && (
              <div className="relative">
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
            <div className="grid grid-cols-4 gap-4">
              {externalQueryResults.map(e => (
                <UserEntryCard
                  key={e.posterPath}
                  title={e.title}
                  backgroundImage={e.posterPath}
                  releaseDate={new Date(e.releaseDate)}
                  category={e.category as Category}
                  rating={0}
                />
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddLog;
