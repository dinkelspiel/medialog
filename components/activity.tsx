import { EntryRedirect } from '@/app/(app)/_components/EntryIslandContext';
import { Entry, UserActivity, UserEntryStatus } from '@prisma/client';
import React from 'react';
import SmallRating from './smallRating';
import { numberSuffix } from '@/lib/numberSuffix';
import Link from 'next/link';

const generateActivityInfo = (
  activity: UserActivity & { entry: Entry }
): string => {
  let text = '';
  switch (activity.type) {
    case 'statusUpdate':
      // eslint-disable-next-line no-case-declarations
      const rewatch = parseInt(activity.additionalData.split('|')[1]!);
      switch (activity.additionalData.split('|')[0] as UserEntryStatus) {
        case 'planning':
          {
            const verb = activity.entry.category === 'Book' ? 'read' : 'watch';
            if (rewatch === 0) {
              text = `Plans to ${verb}`;
            } else {
              text = `Plans to ${verb}, for the ${numberSuffix(rewatch)},`;
            }
          }
          break;
        case 'watching':
          {
            const verb =
              activity.entry.category === 'Book' ? 'reading' : 'watching';
            if (rewatch === 0) {
              text = `Started ${verb}`;
            } else {
              text = `Is for the ${numberSuffix(rewatch + 1)} time ${verb}`;
            }
          }
          break;
        case 'dnf':
          {
            const verb =
              activity.entry.category === 'Book' ? 'reread' : 'rewatch';
            if (rewatch === 0) {
              text = 'Did not finish';
            } else {
              text = `Did not finish their ${numberSuffix(rewatch)} ${verb}`;
            }
          }
          break;
        case 'paused':
          if (rewatch === 0) {
            text = `Paused ${activity.entry.category === 'Book' ? 'reading' : 'watching'}`;
          } else {
            text = `Paused their ${numberSuffix(rewatch)} ${activity.entry.category === 'Book' ? 'reread' : 'rewatch'}`;
          }
          break;
        case 'completed':
          if (rewatch === 0) {
            text = 'Completed';
          } else {
            text = `Completed their ${numberSuffix(rewatch)} ${activity.entry.category === 'Book' ? 'reread' : 'rewatch'}`;
          }
          break;
      }
      break;
    case 'reviewed':
      if (activity.additionalData.split('|')[0] == '0') {
        text = 'Reviewed';
      } else {
        text = `Reviewed their ${numberSuffix(parseInt(activity.additionalData.split('|')[0]!))} ${activity.entry.category === 'Book' ? 'reread' : 'rewatch'}`;
      }
      break;
    case 'rewatch':
      text = `Started their ${numberSuffix(parseInt(activity.additionalData))} ${activity.entry.category === 'Book' ? 'reread' : 'rewatch'}`;
      break;
    case 'completeReview':
      if (activity.additionalData.split('|')[0] == '0') {
        text = 'Completed and reviewed';
      } else {
        text = `Completed and reviewed their ${numberSuffix(parseInt(activity.additionalData.split('|')[0]!))} ${activity.entry.category === 'Book' ? 'reread' : 'rewatch'}`;
      }
      break;
  }
  return text;
};

const Activity = ({
  activity,
  title,
  username,
}: {
  activity: UserActivity & { entry: Entry };
  title: string;
  username?: string;
}) => {
  const contents = () => (
    <div className="group grid w-full grid-cols-[max-content_1fr] gap-4 2xl:w-full 2xl:grid-cols-[max-content_1fr]">
      <img
        src={activity.entry.posterPath}
        className="aspect-2/3 h-[80px] rounded-md 2xl:h-[100px]"
      />
      <div className="flex h-full flex-col justify-center gap-1.5 pb-3 2xl:border-b-0 2xl:pb-0">
        <div className="flex flex-col justify-between lg:flex-row">
          <div className="flex gap-[0.5ch]">
            {username && (
              <Link
                className="inline font-medium hover:underline"
                href={`/@${username}`}
              >
                {username}
              </Link>
            )}{' '}
            {username
              ? generateActivityInfo(activity).toLowerCase()
              : generateActivityInfo(activity)}
          </div>
          <div>{activity.createdAt.toDateString()}</div>
        </div>
        {parseInt(activity.additionalData.split('|')[1]!) != 0 && (
          <div className="mr-auto">
            {activity.type === 'reviewed' ||
              (activity.type === 'completeReview' && (
                <SmallRating
                  rating={parseInt(activity.additionalData.split('|')[1]!)}
                />
              ))}
          </div>
        )}
        <div className="flex flex-col justify-start gap-3 lg:flex-row lg:items-center">
          {username && (
            <EntryRedirect
              entryId={activity.entry.id}
              entrySlug={activity.entry.slug}
            >
              <span className="text-lg font-semibold hover:underline">
                {title}
              </span>
            </EntryRedirect>
          )}
          {!username && (
            <span className="text-lg font-semibold group-hover:underline">
              {title}
            </span>
          )}
          <span className="text-sm font-medium text-base-500">
            {activity.entry.releaseDate.getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );

  if (username) {
    return contents();
  }

  return (
    <EntryRedirect
      entryId={activity.entry.id}
      entrySlug={activity.entry.slug}
      className="w-full"
    >
      {contents()}
    </EntryRedirect>
  );
};

export default Activity;
