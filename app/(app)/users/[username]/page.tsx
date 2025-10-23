import HeaderLayout from "@/components/layouts/header";
import {
  safeUserSelect,
  validateSessionToken,
} from "@/server/auth/validateSession";
import prisma from "@/server/db";
import { getDailyStreak } from "@/server/user/user";
import Link from "next/link";
import { getUserDiary } from "./_components/diary";
import { ProfileHeader } from "./_components/header";
import { ProfileSidebar } from "./_components/sidebar";
import { Stats } from "./_components/stats";
import { getDefaultWhereForTranslations } from "@/server/api/routers/dashboard_";
import { getUserLists } from "./_components/lists";
import { Metadata } from "next";
import ActivityHistory from "./_components/activityHistory";
import Showcase from "./_components/showcase";
import Activity from "@/components/activity";
import StyleHeader from "@/components/styleHeader";

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
  params: Promise<{ username: string }>;
};

export async function generateMetadata({
  params: _params,
}: Props): Promise<Metadata> {
  const params = await _params;
  return {
    title: `${params.username}'s profile - Medialog`,
  };
}

const Profile = async ({
  params: _params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const params = await _params;
  const authUser = await validateSessionToken();
  const profileUserExists = await prisma.user.findFirst({
    where: {
      username: params.username,
    },
  });

  if (profileUserExists === null) return <Profile404></Profile404>;

  await getDailyStreak(profileUserExists);

  const profileUser = (await prisma.user.findFirst({
    where: {
      username: params.username,
    },
    select: {
      ...safeUserSelect(),
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
            select: {
              ...safeUserSelect(),
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
      status: "completed",
    },
    orderBy: {
      rating: "desc",
    },
    take: 4,
    select: {
      notes: false,
      rating: true,
      entry: {
        include: {
          translations: getDefaultWhereForTranslations(authUser),
        },
      },
    },
  });

  const recentlyWatched = await prisma.userEntry.findMany({
    where: {
      userId: profileUser.id,
      status: "completed",
    },
    orderBy: {
      watchedAt: "desc",
    },
    take: 4,
    select: {
      notes: false,
      rating: true,
      entry: {
        include: {
          translations: getDefaultWhereForTranslations(authUser),
        },
      },
    },
  });

  const activity = await prisma.userActivity.findMany({
    where: {
      userId: profileUser.id,
      NOT: {
        type: "progressUpdate",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    include: {
      entry: {
        include: {
          translations: getDefaultWhereForTranslations(authUser),
        },
      },
    },
  });

  const ratings = [];
  const totalRatings = await prisma.userEntry.count({
    where: {
      userId: profileUser.id,
      status: "completed",
    },
  });
  for (let ratingThreshold = 0; ratingThreshold <= 10; ratingThreshold++) {
    if (totalRatings > 0) {
      ratings[ratingThreshold - 1] =
        (await prisma.userEntry.count({
          where: {
            userId: profileUser.id,
            status: "completed",
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
            <Showcase
              title={"Favorites"}
              userEntries={favorites}
              profileUser={profileUser}
            />
            <Showcase
              title={"Latest Completions"}
              userEntries={recentlyWatched}
              profileUser={profileUser}
            />

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
              <StyleHeader>Recent Activity</StyleHeader>
              {activity.length > 0 && (
                <div className="flex flex-col gap-3">
                  {activity.map((activity, idx) => {
                    return (
                      <Activity
                        activity={activity}
                        title={
                          activity.entry.translations[0]?.name ||
                          activity.entry.originalTitle
                        }
                        key={idx}
                      />
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
