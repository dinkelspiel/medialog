import { useEntryIsland } from '@/app/(app)/_components/EntryIslandContext';
import { getUserTitleFromEntry } from '@/server/api/routers/dashboard_';
import { api } from '@/trpc/react';
import { ListPlus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Button } from '../ui/button';
import { Entry, EntryTranslation } from '@prisma/client';
import { Card } from '../ui/card';
import { Label } from '../ui/label';

const EntryView = ({
  entry,
}: {
  entry: Entry & { translations: EntryTranslation[] };
}) => {
  const title = getUserTitleFromEntry(entry);

  return (
    <div className="grid h-full w-full grid-rows-[250px,1fr]">
      <div
        style={{ backgroundImage: `url(${entry.backdropPath})` }}
        className="relative h-full w-full bg-cover"
      >
        <div className="absolute top-[40%] z-0 flex h-[60%] w-full flex-col justify-end rounded-bl-lg rounded-br-lg bg-gradient-to-t from-base-900 to-transparent object-cover p-2">
          <div className="mx-auto grid h-full w-fit grid-cols-1 bg-cover pb-4 xl:gap-16 min-[1330px]:grid-cols-[250px,1fr]">
            <div></div>
            <div className="flex h-full flex-col justify-end gap-6 px-4 md:w-[710px]">
              <div className="flex items-end gap-6">
                <div className="z-10 font-dm-serif text-4xl font-semibold text-white">
                  {title}
                </div>
                <div className={'text-lg text-base-200'}>
                  {entry.releaseDate.getUTCFullYear()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto grid h-fit w-fit grid-cols-1 xl:gap-16 min-[1330px]:grid-cols-[250px,1fr]">
        <div
          style={{ marginTop: `-${377 / 2}px` }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <Image
              width={250}
              height={377}
              className="z-10 rounded-lg border-2 border-base-200 shadow-md shadow-base-300"
              src={entry.posterPath}
              alt={`Poster for ${title}`}
            />
            <div className="flex gap-2">
              <Button size="sm" className="w-full" variant={'outline'}>
                Add to Watchlist
              </Button>
              <Button size="sm" variant={'outline'} className="size-9">
                <ListPlus className="size-4 stroke-base-600" />
              </Button>
            </div>
          </div>
          <div>
            <Card className="flex flex-col gap-2 px-3 py-2">
              <div className="text-sm">
                <div className="font-bold">Format</div>
                <div>{entry.category}</div>
              </div>
              <div className="text-sm">
                <div className="font-bold">
                  {(() => {
                    switch (entry.category) {
                      case 'Series':
                        return 'Episodes';
                      case 'Movie':
                        return 'Runtime';
                      case 'Book':
                        return 'Pages';
                    }
                  })()}
                </div>
                <div>
                  {entry.length} {entry.category === 'Movie' && 'm'}
                </div>
              </div>
              <div className="text-sm">
                <div className="font-bold">Release Date</div>
                <div>{entry.releaseDate.toDateString()}</div>
              </div>
            </Card>
          </div>
        </div>
        <div className="flex flex-col gap-6 px-4 pt-6 md:w-[710px]">
          {entry.tagline && (
            <p className="text-lg font-medium italic">‟{entry.tagline}</p>
          )}
          {entry.overview && (
            <p className="text-lg leading-relaxed">{entry.overview}</p>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex w-full justify-between border-b border-b-base-200 pb-2 font-dm-serif text-3xl font-semibold">
              Reviews
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryView;
