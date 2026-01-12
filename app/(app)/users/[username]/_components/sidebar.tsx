import SmallRating from '@/components/smallRating';
import { Entry, User, UserEntry, UserFollow } from '@/prisma/generated/browser';
import { cn } from '@/lib/utils';
import { Diary } from './diary';
import { Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Fragment } from 'react';
import { ServerEntryTitleForUser } from './serverUserEntryTitle';
import { Lists } from './lists';
import Link from 'next/link';
import GenreOverview from './genreOverview';
import { Label } from '@/components/ui/label';
import { EntryRedirect } from '@/app/(app)/_components/EntryIslandContext';
import StyleHeader from '@/components/styleHeader';

export const ProfileSidebar = ({
  profileUser,
  ratings,
  totalRatings,
  className,
  diary,
  lists,
}: {
  profileUser: User & {
    userEntries: (UserEntry & { entry: Entry })[];
    followers: (UserFollow & { user: User })[];
    following: (UserFollow & { follow: User })[];
  };
  ratings: number[];
  totalRatings: number;
  className: string;
  diary: Diary;
  lists: Lists;
}) => {
  const monthOrder = [
    'DEC',
    'NOV',
    'OCT',
    'SEP',
    'AUG',
    'JUL',
    'JUN',
    'MAY',
    'APR',
    'MAR',
    'FEB',
    'JAN',
  ];

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between border-b border-b-base-200 pb-2 font-dm-serif text-3xl font-semibold">
          Watchlist
          <span className="ms-auto flex items-end font-geist text-sm text-base-500">
            {
              profileUser.userEntries.filter(e => e.status === 'planning')
                .length
            }
          </span>
        </div>
        <div className="flex flex-row justify-center">
          {profileUser.userEntries
            .filter(e => e.status === 'planning')
            // .sort(() => Math.random() - 0.5)
            .slice(0, 4)
            .map((watchlist, idx) => (
              <img
                key={watchlist.id}
                src={watchlist.entry.posterPath}
                className={cn(
                  `${idx !== 0 && 'ms-[-24px]'} h-[120px] w-[80px] rounded-md shadow-lg`
                )}
                alt={watchlist.entry.originalTitle}
                style={{ zIndex: idx }}
              />
            ))}
        </div>

        {profileUser.userEntries.filter(e => e.status === 'watching').length >
          0 && (
          <div className="flex flex-col gap-4">
            <StyleHeader>
              In Progress
              <span className="ms-auto flex items-end font-geist text-sm text-base-500">
                {
                  profileUser.userEntries.filter(e => e.status === 'watching')
                    .length
                }
              </span>
            </StyleHeader>
            {profileUser.userEntries
              .filter(e => e.status === 'watching')
              .map(entry => (
                <div className="flex flex-col gap-1.5" key={entry.id}>
                  <div className="whitespace-break-spaces text-sm font-medium text-base-900">
                    <EntryRedirect
                      entryId={entry.entry.id}
                      entrySlug={entry.entry.slug}
                    >
                      <ServerEntryTitleForUser entryId={entry.entry.id} />
                    </EntryRedirect>
                  </div>
                  <Progress
                    value={(entry.progress / entry.entry.length) * 100}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-4 lg:items-start">
        <StyleHeader>
          Ratings
          <span className="ms-auto flex items-end font-geist text-sm text-base-500">
            {totalRatings}
          </span>
        </StyleHeader>
        <div className="flex w-full flex-row items-end justify-between gap-2 2xl:w-[250px]">
          <SmallRating rating={20} className="pb-1" />
          <div className="flex w-[135px] flex-row items-end gap-0.5 border-b border-b-base-200 pb-1">
            {ratings.map((ratingPercentage, idx) => (
              <div
                key={idx}
                className="w-full bg-base-300"
                style={{ height: 110 * ratingPercentage }}
              ></div>
            ))}
          </div>
          <SmallRating rating={100} className="pb-1" />
        </div>
      </div>
      <GenreOverview profileUser={profileUser} />
      <div className="flex flex-col gap-4">
        <StyleHeader>
          Diary
          <span className="ms-auto flex items-end font-geist text-sm text-base-500">
            {profileUser.dailyStreakLength} Day Streak
          </span>
        </StyleHeader>
        {profileUser.dailyStreakLength != 0 &&
          !(
            profileUser.dailyStreakUpdated.getTime() > startOfDay.getTime()
          ) && (
            <div className="w-full rounded-md border bg-red-500 py-1 text-center text-sm text-white">
              Daily streak hasn{"'"}t been updated
            </div>
          )}
        {Object.keys(diary)
          .sort((a, b) => {
            const aMonth = a.split('-')[0]!;
            const aYear = Number(a.split('-')[1]!);

            const bMonth = b.split('-')[0]!;
            const bYear = Number(b.split('-')[1]!);

            if (aYear !== bYear) {
              return bYear - aYear;
            }

            return monthOrder.indexOf(aMonth) - monthOrder.indexOf(bMonth);
          })
          .map(month => (
            <div className="grid grid-cols-[42px_1fr] gap-2" key={month}>
              <div className="flex flex-col items-center gap-1">
                <Calendar />
                <div className="text-center text-[11px] font-semibold text-base-900">
                  {month.split('-')[0]!}
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 text-sm font-medium">
                {diary[month]!.map((day, idx) => (
                  <div
                    className="grid grid-cols-[17.5px_1fr] items-start gap-2"
                    key={month + day.title + idx}
                  >
                    <div className="text-base-500">{day.day}</div>
                    <EntryRedirect
                      entryId={day.entryId}
                      entrySlug={day.entrySlug}
                    >
                      <div className="whitespace-break-spaces text-base-900">
                        {day.title}
                      </div>
                    </EntryRedirect>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
      <div className="flex flex-col items-center gap-4 lg:items-start">
        <StyleHeader>
          Lists
          <span className="ms-auto flex items-end font-geist text-sm text-base-500">
            {lists.length}
          </span>
        </StyleHeader>
        <div className="flex w-full flex-col items-center gap-4 2xl:w-[250px]">
          {lists.map(list => (
            <Link
              key={list.id}
              className="group flex cursor-pointer flex-col gap-2"
              href={`/@${profileUser.username}/lists/${list.id}`}
            >
              <div className="flex flex-row justify-center rounded-md shadow-slate-900/50 ring-slate-900 ring-offset-2 transition-all duration-150 group-hover:shadow-lg group-hover:ring-4">
                {list.posterUrls.map((posterUrl, idx) => (
                  <img
                    key={posterUrl}
                    src={posterUrl}
                    className={cn(
                      `${idx !== 0 && 'ms-[-24px]'} h-[120px] w-[80px] rounded-md shadow-lg`
                    )}
                    alt={'Test'}
                    style={{ zIndex: idx }}
                  />
                ))}
              </div>
              <div className="flex justify-between gap-2 text-sm">
                <div>{list.name}</div>
                <div className="flex items-end text-sm text-base-600">
                  {list.mediaCount}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
