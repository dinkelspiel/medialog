import HeaderLayout from '@/components/layouts/header';
import SmallRating from '@/components/smallRating';
import UserEntryCard from '@/components/userEntryCard';
import { numberSuffix } from '@/lib/numberSuffix';
import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import { getDailyStreak } from '@/server/user/user';
import { Entry, UserActivity, UserEntryStatus } from '@prisma/client';
import Link from 'next/link';
import { ReactNode } from 'react';
import { getUserDiary } from './_components/diary';
import { ProfileHeader } from './_components/header';
import { ProfileSidebar } from './_components/sidebar';
import { Stats } from './_components/stats';
import { ServerEntryTitleForUser } from './_components/serverUserEntryTitle';
import { getDefaultWhereForTranslations } from '@/server/api/routers/dashboard_';
import { getUserLists } from './_components/lists';
import { Metadata, ResolvingMetadata } from 'next';
import ActivityHistory from './_components/activityHistory';
import { EntryRedirect } from '../../_components/EntryIslandContext';

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
            <span className="text-base text-base-500">
              Return to your profile
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export type Props = {
  params: { username: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: `${params.username}'s profile - Medialog`,
  };
}

const Profile = async ({ params }: { params: { username: string } }) => {
  const authUser = await validateSessionToken();
  const profileUserExists = await prisma.user.findFirst({
    where: {
      username: params.username,
    },
  });

  const generateActivityInfo = (
    activity: UserActivity & { entry: Entry }
  ): ReactNode => {
    let text = '';
    switch (activity.type) {
      case 'statusUpdate':
        // eslint-disable-next-line no-case-declarations
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
              text = 'Paused watching';
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

  if (profileUserExists === null) return <Profile404></Profile404>;

  await getDailyStreak(profileUserExists);

  const profileUser = (await prisma.user.findFirst({
    where: {
      username: params.username,
    },
    include: {
      userEntries: {
        select: {
          id: true,
          rating: true,
          status: true,
          progress: true,
          watchedAt: true,
          entry: {
            select: {
              id: true,
              originalTitle: true,
              slug: true,
              posterPath: true,
              length: true,
            },
          },
        },
      },
      followers: {
        include: {
          user: {
            include: {
              followers: true,
              following: true,
            },
          },
        },
      },
      following: {
        include: {
          follow: {
            include: {
              followers: true,
              following: true,
            },
          },
        },
      },
    },
  }))!;

  const favorites = await prisma.userEntry.findMany({
    where: {
      userId: profileUser.id,
      status: 'completed',
    },
    orderBy: {
      rating: 'desc',
    },
    take: 4,
    select: {
      notes: false,
      rating: true,
      entry: {
        select: {
          id: true,
          slug: true,
          originalTitle: true,
          posterPath: true,
          releaseDate: true,
          category: true,
          translations: getDefaultWhereForTranslations(authUser),
        },
      },
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

  let ratings = [];
  const totalRatings = await prisma.userEntry.count({
    where: {
      userId: profileUser.id,
      status: 'completed',
    },
  });
  for (let ratingThreshold = 0; ratingThreshold <= 10; ratingThreshold++) {
    if (totalRatings > 0) {
      ratings[ratingThreshold - 1] =
        (await prisma.userEntry.count({
          where: {
            userId: profileUser.id,
            status: 'completed',
            rating: {
              gt: (ratingThreshold - 1) * 10,
              lte: ratingThreshold * 10,
            },
          },
        })) / totalRatings;
    } else {
      ratings[ratingThreshold - 1] = 0;
    }
  }

  ratings[0] = (ratings[0] ?? 0) + (ratings[-1] ?? 0);
  delete ratings[-1];

  const diary = await getUserDiary(profileUser.id);

  const lists = await getUserLists(profileUser.id);

  return (
    <HeaderLayout>
      <ProfileHeader profileUser={profileUser as any} />
      <div className="col-span-2 mx-auto pb-4">
        <div className="block py-2 lg:hidden">
          <Stats profileUser={profileUser as any} />
        </div>
        <div className="grid w-fit grid-cols-1 gap-16 min-[1330px]:grid-cols-[1fr,250px]">
          <div className="flex flex-col gap-6 px-4 md:w-[710px]">
            <div className="flex flex-col gap-4">
              <div className="flex w-full justify-between border-b border-b-base-200 pb-2 font-dm-serif text-3xl font-semibold">
                Favorites
              </div>
              {favorites.length > 0 && (
                <>
                  <div className="hidden grid-cols-4 gap-3 sm:grid">
                    {favorites.map((userEntry, idx) => (
                      <EntryRedirect
                        className="hover:no-underline"
                        entryId={userEntry.entry.id}
                        entrySlug={userEntry.entry.slug}
                      >
                        <UserEntryCard
                          key={`userEntry-${idx}`}
                          {...{
                            entryTitle: (
                              <ServerEntryTitleForUser
                                entryId={userEntry.entry.id}
                              />
                            ),
                            backgroundImage: userEntry.entry.posterPath,
                            releaseDate: userEntry.entry.releaseDate,
                            rating: userEntry.rating,
                            category: userEntry.entry.category,
                          }}
                        />
                      </EntryRedirect>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:hidden">
                    {favorites.slice(0, 3).map((userEntry, idx) => (
                      <UserEntryCard
                        key={`userEntry-${idx}`}
                        {...{
                          entryTitle: (
                            <ServerEntryTitleForUser
                              entryId={userEntry.entry.id}
                            />
                          ),
                          backgroundImage: userEntry.entry.posterPath,
                          releaseDate: userEntry.entry.releaseDate,
                          rating: userEntry.rating,
                          category: userEntry.entry.category,
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
              {favorites.length === 0 &&
                (authUser !== undefined &&
                profileUser.id === (authUser ? authUser.id : -1) ? (
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
            <ProfileSidebar
              profileUser={profileUser as any}
              ratings={ratings}
              totalRatings={totalRatings}
              className="flex min-[1330px]:hidden"
              diary={diary}
              lists={lists}
            />

            <ActivityHistory profileUser={profileUser} />

            <div className="flex flex-col gap-4">
              <div className="flex w-full justify-between border-b border-b-base-200 pb-2 font-dm-serif text-3xl font-semibold">
                Recent Activity
              </div>
              {activity.length > 0 && (
                <div className="flex flex-col gap-3">
                  {activity.map((activity, idx) => {
                    return (
                      <EntryRedirect
                        key={`activity-${idx}`}
                        entryId={activity.entry.id}
                        entrySlug={activity.entry.slug}
                      >
                        <div className="group grid w-full grid-cols-[max-content,1fr] gap-4 2xl:w-full 2xl:grid-cols-[max-content,1fr]">
                          <img
                            src={activity.entry.posterPath}
                            className="aspect-2/3 h-[80px] rounded-md 2xl:h-[100px]"
                          />
                          <div className="flex h-full flex-col justify-center gap-3 pb-3 2xl:border-b-0 2xl:pb-0">
                            <div className="space-x-3">
                              <span className="text-lg font-semibold group-hover:underline">
                                <ServerEntryTitleForUser
                                  entryId={activity.entry.id}
                                />
                              </span>
                              <span className="text-sm font-medium text-base-500">
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
                            <div className="flex justify-between">
                              {generateActivityInfo(activity)}
                            </div>
                          </div>
                        </div>
                      </EntryRedirect>
                    );
                  })}
                </div>
              )}
              {activity.length === 0 && (
                <div className="text-lg">No recent activity found</div>
              )}
            </div>
          </div>
          <ProfileSidebar
            profileUser={profileUser as any}
            ratings={ratings}
            totalRatings={totalRatings}
            className="hidden min-[1330px]:flex"
            diary={diary}
            lists={lists}
          />
        </div>
      </div>
    </HeaderLayout>
  );
};

export default Profile;
