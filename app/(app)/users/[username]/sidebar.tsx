'use client';

import { useMediaQuery } from 'usehooks-ts';
import SmallRating from '@/components/smallRating';
import { Entry, User, UserEntry, UserFollow } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Diary } from './diary';
import { Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const ProfileSidebar = ({
  profileUser,
  ratings,
  totalRatings,
  className,
  diary,
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

  var startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between border-b border-b-slate-200 pb-2 text-lg font-medium">
          Watchlist
          <span className="ms-auto text-slate-500">
            {
              profileUser.userEntries.filter(e => e.status === 'planning')
                .length
            }
          </span>
        </div>
        <div className="flex flex-row justify-center">
          {profileUser.userEntries
            .filter(e => e.status === 'planning')
            .slice(0, 4)
            .map((watchlist, idx) => (
              <img
                key={watchlist.id}
                src={watchlist.entry.posterPath}
                className={cn(
                  `${idx !== 0 && 'ms-[-24px]'} h-[120px] w-[80px] rounded-md shadow-lg`
                )}
                style={{ zIndex: idx }}
              />
            ))}
        </div>

        {profileUser.userEntries.filter(e => e.status === 'watching').length >
          0 && (
          <div className="flex flex-col gap-4">
            <div className="flex w-full justify-between border-b border-b-slate-200 pb-2 text-lg font-medium">
              In Progress
              <span className="ms-auto text-slate-500">
                {
                  profileUser.userEntries.filter(e => e.status === 'watching')
                    .length
                }
              </span>
            </div>
            {profileUser.userEntries
              .filter(e => e.status === 'watching')
              .map(entry => (
                <div className="flex flex-col gap-1.5">
                  {entry.entry.originalTitle}
                  <Progress
                    value={(entry.progress / entry.entry.length) * 100}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-4 lg:items-start">
        <div className="flex w-full justify-between border-b border-b-slate-200 pb-2 text-lg font-medium">
          Ratings
          <span className="ms-auto text-slate-500">{totalRatings}</span>
        </div>
        <div className="flex w-full flex-row items-end justify-between gap-2 2xl:w-[250px]">
          <SmallRating rating={20} className="pb-1" />
          <div className="flex w-[135px] flex-row items-end gap-0.5 border-b border-b-slate-200 pb-1">
            {ratings.map((ratingPercentage, idx) => (
              <div
                key={idx}
                className="w-full bg-slate-300"
                style={{ height: 110 * ratingPercentage }}
              ></div>
            ))}
          </div>
          <SmallRating rating={100} className="pb-1" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {profileUser.dailyStreakLength != 0 &&
          !(
            profileUser.dailyStreakUpdated.getTime() > startOfDay.getTime()
          ) && (
            <div className="w-full rounded-md border bg-red-500 py-1 text-center text-white">
              Daily streak hasn't been updated
            </div>
          )}
        <div className="flex w-full justify-between border-b border-b-slate-200 pb-2 text-lg font-medium">
          Diary
          <span className="ms-auto text-slate-500">
            {profileUser.dailyStreakLength} Day Streak
          </span>
        </div>
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
            <div className="grid grid-cols-[42px,1fr] gap-2">
              <div className="flex flex-col items-center gap-1">
                <Calendar />
                <div className="text-center text-[11px] font-semibold text-black">
                  {month.split('-')[0]!}
                </div>
              </div>
              <div className="grid grid-cols-[17.5px,1fr] gap-2 text-sm font-medium">
                {diary[month]!.map(day => (
                  <>
                    <div className="text-slate-500">{day.day}</div>
                    <div className="whitespace-break-spaces">{day.title}</div>
                  </>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
