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
import SmallRating from '../smallRating';
import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '@/server/api/root';
import { getMinutesToHuman } from '@/lib/minutesToHuman';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import AddToList from '../addToList';
import { capitalizeFirst } from '@/lib/capitalizeFirst';
import { SafeUser } from '@/server/auth/validateSession';
import EditUserEntry from './entry/editUserEntry';

const EntryView = ({
  host,
  authUser,
  entryPage,
  addToListSuccess,
}: {
  host: 'client' | 'server';
  authUser?: SafeUser;
  entryPage: inferRouterOutputs<AppRouter>['entries']['getEntryPage'];
  addToListSuccess?: () => Promise<void>;
}) => {
  const title = getUserTitleFromEntry(entryPage.entry);

  return (
    <div className="grid h-full w-full grid-rows-[250px,1fr]">
      <div
        style={{ backgroundImage: `url(${entryPage.entry.backdropPath})` }}
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
                  {entryPage.entry.releaseDate.getUTCFullYear()}
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
              src={entryPage.entry.posterPath}
              alt={`Poster for ${title}`}
            />
            <div className="flex gap-2">
              {authUser && <EditUserEntry host={host} entryPage={entryPage} />}

              {authUser && (
                <AddToList
                  onSuccess={addToListSuccess}
                  entryId={entryPage.entry.id}
                  userLists={entryPage.userListsByUser}
                  userListsWithEntry={entryPage.userListsWithEntryByUser}
                >
                  <Button size="sm" variant={'outline'} className="size-9">
                    <ListPlus className="size-4 stroke-base-600" />
                    <div className="sr-only">Add to list</div>
                  </Button>
                </AddToList>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {Math.max(...entryPage.ratings) > 0 && (
              <div className="flex w-full flex-row items-end justify-between gap-2 2xl:w-[250px]">
                <SmallRating rating={20} className="pb-1" />
                <div className="flex w-[135px] flex-row items-end gap-0.5 border-b border-b-base-200 pb-1">
                  {entryPage.ratings.map((ratingPercentage, idx) => (
                    <div
                      key={idx}
                      className="w-full bg-base-300"
                      style={{ height: 110 * ratingPercentage }}
                    ></div>
                  ))}
                </div>
                <SmallRating rating={100} className="pb-1" />
              </div>
            )}
            <Card className="flex flex-col gap-2 px-3 py-2">
              <div className="text-sm">
                <div className="font-bold">Format</div>
                <div>{entryPage.entry.category}</div>
              </div>
              <div className="text-sm">
                <div className="font-bold">
                  {(() => {
                    switch (entryPage.entry.category) {
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
                  {['Movie', 'Series'].includes(entryPage.entry.category)
                    ? getMinutesToHuman(entryPage.entry.length)
                    : entryPage.entry.length}
                </div>
              </div>
              <div className="text-sm">
                <div className="font-bold">Release Date</div>
                <div>{entryPage.entry.releaseDate.toDateString()}</div>
              </div>
            </Card>
          </div>
        </div>
        <div className="flex flex-col gap-6 px-4 pt-6 md:w-[710px]">
          {entryPage.entry.tagline && (
            <p className="text-lg font-medium italic">
              ‟{entryPage.entry.tagline}
            </p>
          )}
          {entryPage.entry.overview && (
            <p className="text-lg leading-relaxed">
              {entryPage.entry.overview}
            </p>
          )}
          {entryPage.reviews.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex w-full justify-between border-b border-b-base-200 pb-2 font-dm-serif text-3xl font-semibold">
                Reviews
              </div>
              {entryPage.reviews.map(review => (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div>
                      <span className="text-base-600">Review by </span>
                      <span className="font-semibold">
                        {review.user.username}
                      </span>
                    </div>
                    <SmallRating rating={review.rating} />
                  </div>
                  <div>
                    {getReviewPreview(review.notes)[0]}
                    {review.notes.length >
                      getReviewPreview(review.notes)[0].length && (
                      <span>
                        {!getReviewPreview(review.notes)[1] && '...'}{' '}
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="text-base-600 hover:underline">
                              More
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader className="sr-only">
                              <DialogTitle className="sr-only">
                                Review for{' '}
                                {getUserTitleFromEntry(entryPage.entry)} by{' '}
                                {review.user.username}
                              </DialogTitle>
                            </DialogHeader>
                            {review.notes}
                          </DialogContent>
                        </Dialog>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// The second item in the array is if two periods was chosen
const getReviewPreview = (review: string): [string, boolean] => {
  const twoPeriods = review.split('.').slice(0, 2).join('.') + '.';
  const length128 = review.slice(0, 128);

  if (twoPeriods.length < 256) {
    return [twoPeriods, true];
  }
  return [length128, false];
};

export default EntryView;
