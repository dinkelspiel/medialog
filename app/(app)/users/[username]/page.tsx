import React, { ReactNode } from 'react';
import { numberSuffix } from '@/lib/numberSuffix';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import UserEntryCard from '@/components/userEntryCard';
import SmallRating from '@/components/smallRating';
import { Entry, UserActivity, UserEntryStatus } from '@prisma/client';
import { ProfileHeader } from './header';

const Profile404 = async () => {
  const user = await validateSessionToken();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-3">
        <span className="text-2xl font-semibold">
          The user you requested could not be found.
        </span>

        {user !== null && (
          <Link href={`/@${user.username}`}>
            <span className="text-base text-slate-500">
              Return to your profile
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

const Profile = async ({ params }: { params: { username: string } }) => {
  const user = await validateSessionToken();
  const profileUser = await prisma.user.findFirst({
    where: {
      username: params.username,
    },
    include: {
      userEntries: true,
      followers: {
        include: {
          user: true,
        },
      },
      following: {
        include: {
          user: true,
        },
      },
    },
  });

  const generateActivityInfo = (
    activity: UserActivity & { entry: Entry }
  ): ReactNode => {
    let text = '';
    switch (activity.type) {
      case 'statusUpdate':
        const rewatch = parseInt(activity.additionalData.split('|')[1]!);
        switch (activity.additionalData.split('|')[0] as UserEntryStatus) {
          case 'planning':
            if (rewatch === 0) {
              text = 'Plans to watch';
            } else {
              text = `Plans to watch, for the ${numberSuffix(rewatch)},`;
            }
            break;
          case 'watching':
            if (rewatch === 0) {
              text = `Started ${activity.entry.category === 'Book' ? 'reading' : 'watching'}`;
            } else {
              text = `Is for the ${numberSuffix(rewatch + 1)} time ${activity.entry.category === 'Book' ? 'reading' : 'watching'}`;
            }
            break;
          case 'dnf':
            if (rewatch === 0) {
              text = 'Did not finish';
            } else {
              text = `Did not finish their ${numberSuffix(rewatch)} rewatch`;
            }
            break;
          case 'paused':
            if (rewatch === 0) {
              text = 'Paused';
            } else {
              text = `Paused their ${numberSuffix(rewatch)} rewatch`;
            }
            break;
          case 'completed':
            if (rewatch === 0) {
              text = 'Completed';
            } else {
              text = `Completed their ${numberSuffix(rewatch)} rewatch`;
            }
            break;
        }
        break;
      case 'reviewed':
        if (activity.additionalData.split('|')[0] == '0') {
          text = 'Reviewed';
        } else {
          text = `Reviewed their ${numberSuffix(parseInt(activity.additionalData.split('|')[0]!))} rewatch`;
        }
        break;
      case 'rewatch':
        text = `Started their ${numberSuffix(parseInt(activity.additionalData))} rewatch`;
        break;
      case 'completeReview':
        if (activity.additionalData.split('|')[0] == '0') {
          text = 'Completed and reviewed';
        } else {
          text = `Completed and reviewed their ${numberSuffix(parseInt(activity.additionalData.split('|')[0]!))} rewatch`;
        }
        break;
    }
    return (
      <>
        {text}
        <span className="ps-1">{activity.createdAt.toDateString()}</span>
      </>
    );
  };

  if (profileUser === null) return <Profile404></Profile404>;

  const favorites = await prisma.userEntry.findMany({
    where: {
      userId: profileUser.id,
      status: 'completed',
    },
    orderBy: {
      rating: 'desc',
    },
    take: 4,
    include: {
      entry: true,
    },
  });

  const activity = await prisma.userActivity.findMany({
    where: {
      userId: profileUser.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
    include: {
      entry: true,
    },
  });

  return (
    <div className="scrollable-grid-item grid grid-rows-[max-content,1fr] gap-4 p-2 lg:grid-rows-[73px,1fr] lg:px-8 lg:py-6">
      <ProfileHeader user={user} profileUser={profileUser} />
      <div className="col-span-2 flex justify-center">
        <div className="grid w-max grid-cols-1 gap-16 lg:grid-cols-[1fr,250px]">
          <div className="flex flex-col gap-6 lg:min-w-[716px]">
            <div className="flex flex-col gap-4">
              <div className="border-b border-b-slate-200 pb-2 text-lg font-medium">
                Favorites
              </div>
              {favorites.length > 0 && (
                <div className="grid w-[calc(100dvw-16px)] grid-cols-4 gap-3 lg:w-full">
                  {favorites.map((userEntry, idx) => (
                    <UserEntryCard
                      key={`userEntry-${idx}`}
                      {...{
                        title: userEntry.entry.originalTitle,
                        backgroundImage: userEntry.entry.posterPath,
                        releaseDate: userEntry.entry.releaseDate,
                        rating: userEntry.rating,
                        category: userEntry.entry.category,
                      }}
                    />
                  ))}
                </div>
              )}
              {favorites.length === 0 &&
                (user !== undefined &&
                profileUser.id === (user ? user.id : -1) ? (
                  <div className="text-lg">
                    Rate your favorites{' '}
                    <Link href="/dashboard">
                      <span className="font-semibold">here</span>
                    </Link>
                  </div>
                ) : (
                  <div className="text-lg">No favorites found</div>
                ))}
            </div>
            {/* {!isDesktop && <ProfileSidebar profile={profile} />} */}
            <div className="flex flex-col gap-4">
              <div className="border-b border-b-slate-200 pb-2 text-lg font-medium">
                Recent Activity
              </div>
              {activity.length > 0 && (
                <div className="flex flex-col gap-3">
                  {activity.map((activity, idx) => {
                    return (
                      <div
                        key={`activity-${idx}`}
                        className="grid w-[calc(100dvw-16px)] grid-cols-[53px,1fr] gap-4 lg:w-full lg:grid-cols-[80px,1fr]"
                      >
                        <img
                          src={activity.entry.posterPath}
                          className="h-[80px] w-[53px] rounded-md lg:h-[120px] lg:w-[80px]"
                        />
                        <div className="flex h-full flex-col justify-center gap-3 border-b border-b-slate-200 pb-3 lg:border-b-0 lg:pb-0">
                          <div className="space-x-3">
                            <span className="text-base font-semibold lg:text-2xl">
                              {activity.entry.originalTitle}
                            </span>
                            <span className="text-sm font-medium text-slate-500">
                              {activity.entry.releaseDate.getFullYear()}
                            </span>
                          </div>
                          <div className="mr-auto">
                            {activity.type === 'reviewed' ||
                              (activity.type === 'completeReview' && (
                                <SmallRating
                                  rating={parseInt(
                                    activity.additionalData.split('|')[1]!
                                  )}
                                />
                              ))}
                          </div>
                          <div>{generateActivityInfo(activity)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {activity.length === 0 && (
                <div className="text-lg">No recent activity found</div>
              )}
            </div>
          </div>
          {/* {isDesktop && <ProfileSidebar profile={profile} />} */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
