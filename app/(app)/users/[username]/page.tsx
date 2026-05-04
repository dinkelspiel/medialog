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
import type { ComponentProps } from "react";
import ActivityHistory from "./_components/activityHistory";
import Showcase from "./_components/showcase";
import RecentActivity from "./_components/recentActivity";
import { getMediaTypeFiltersForUser } from "@/server/api/routers/settings";
import { mediaTypeFiltersToCategories } from "@/lib/mediaTypeFilters";

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
  const categoryFilters = await getMediaTypeFiltersForUser(authUser?.id);
  const categories = mediaTypeFiltersToCategories(categoryFilters);

  const profileUser = (await prisma.user.findFirst({
    where: {
      username: params.username,
    },
    select: {
      ...safeUserSelect(),
      userEntries: {
        where: {
          entry: {
            category: {
              in: categories,
            },
          },
        },
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
              category: true,
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
      entry: {
        category: {
          in: categories,
        },
      },
      rating: {
        not: null,
      },
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
      entry: {
        category: {
          in: categories,
        },
      },
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

  const ratings = [];
  const totalRatings = await prisma.userEntry.count({
    where: {
      userId: profileUser.id,
      status: "completed",
      entry: {
        category: {
          in: categories,
        },
      },
      rating: {
        not: null,
      },
    },
  });
  for (let ratingThreshold = 0; ratingThreshold <= 10; ratingThreshold++) {
    if (totalRatings > 0) {
      ratings[ratingThreshold - 1] =
        (await prisma.userEntry.count({
          where: {
            userId: profileUser.id,
            status: "completed",
            entry: {
              category: {
                in: categories,
              },
            },
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

  const diary = await getUserDiary(profileUser.id, categories);

  const lists = await getUserLists(profileUser.id, categories);
  const profileHeaderUser = profileUser as unknown as ComponentProps<
    typeof ProfileHeader
  >['profileUser'];
  const profileSidebarUser = profileUser as unknown as ComponentProps<
    typeof ProfileSidebar
  >['profileUser'];

  return (
    <HeaderLayout>
      <ProfileHeader profileUser={profileHeaderUser} />
      <div className="col-span-2 mx-auto pb-4">
        <div className="block py-2 lg:hidden">
          <Stats profileUser={profileHeaderUser} />
        </div>
        <div className="grid w-fit grid-cols-1 gap-16 min-[1330px]:grid-cols-[1fr_250px]">
          <div className="flex flex-col gap-6 px-4 md:w-177.5">
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
              profileUser={profileSidebarUser}
              ratings={ratings}
              totalRatings={totalRatings}
              className="flex min-[1330px]:hidden"
              diary={diary}
              lists={lists}
            />
            <ActivityHistory profileUser={profileUser} categories={categories} />
            <RecentActivity userId={profileUser.id} categories={categories} />
          </div>
          <ProfileSidebar
            profileUser={profileSidebarUser}
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
