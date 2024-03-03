"use client";

import Header from "@/components/header";
import React, { useEffect, useState } from "react";
import { useUserContext } from "../../user-provider";
import Entry from "@/components/entry";
import { UserEntry } from "@/interfaces/userEntry";
import { Activity } from "@/interfaces/activity";
import UserEntryStatus from "@/interfaces/userEntryStatus";
import { numberSuffix } from "@/lib/numberSuffix";
import Rating from "@/components/rating";
import SmallRating from "@/components/smallRating";
import Calendar from "@/components/icons/calendar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useMediaQuery } from "usehooks-ts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProfileSidebar } from "./sidebar";
import { ProfileHeader } from "./header";

export type UserType = {
  username: string;
  followingCount: number;
  followersCount: number;
  watched: number;
  isViewerFollowing: boolean;
};

export type ProfileType = {
  username: string;
  watched: number;
  watchedThisYear: number;
  favorites: UserEntry[];
  activity: Activity[];
  watchlistCount: number;
  watchlist: {
    coverUrl: string;
  }[];
  ratingsCount: number;
  ratings: number[];
  diary: {
    [month: string]: {
      entryName: string;
      franchiseName: string;
      entries: number;
      day: number;
    }[];
  };
  dailyStreak: number;
  dailyStreakUpdated: boolean;
  isViewerFollowing: boolean;
  following: UserType[];
  followers: UserType[];
};

const Profile404 = () => {
  let { user } = useUserContext();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-3">
        <span className="text-2xl font-semibold">
          The user you requested could not be found.
        </span>

        {user !== undefined && (
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

const Profile = ({ params }: { params: { username: string } }) => {
  const { user } = useUserContext();
  const [profile, setProfile] = useState<ProfileType | undefined | null>(
    undefined,
  );
  const isDesktop = useMediaQuery("(min-width: 1024px)", {
    defaultValue: true,
    initializeWithValue: false,
  });

  const generateActivityInfo = (activity: Activity): JSX.Element => {
    let text = "";
    switch (activity.type) {
      case "status_update":
        const rewatch = parseInt(activity.additionalData.split("|")[1]);
        switch (activity.additionalData.split("|")[0] as UserEntryStatus) {
          case "planning":
            if (rewatch === 0) {
              text = "Plans to watch";
            } else {
              text = `Plans to watch, for the ${numberSuffix(rewatch)},`;
            }
            break;
          case "watching":
            if (rewatch === 0) {
              text = `Started ${activity.franchiseCategory === "book" ? "reading" : "watching"}`;
            } else {
              text = `Is for the ${numberSuffix(rewatch + 1)} time ${activity.franchiseCategory === "book" ? "reading" : "watching"}`;
            }
            break;
          case "dnf":
            if (rewatch === 0) {
              text = "Did not finish";
            } else {
              text = `Did not finish their ${numberSuffix(rewatch)} rewatch`;
            }
            break;
          case "paused":
            if (rewatch === 0) {
              text = "Paused";
            } else {
              text = `Paused their ${numberSuffix(rewatch)} rewatch`;
            }
            break;
          case "completed":
            if (rewatch === 0) {
              text = "Completed";
            } else {
              text = `Completed their ${numberSuffix(rewatch)} rewatch`;
            }
            break;
        }
        break;
      case "reviewed":
        if (activity.additionalData == "0") {
          text = "Reviewed";
        } else {
          text = `Reviewed their ${numberSuffix(parseInt(activity.additionalData))} rewatch`;
        }
        break;
      case "rewatch":
        text = `Started their ${numberSuffix(parseInt(activity.additionalData))} rewatch`;
        break;
      case "complete_review":
        if (activity.additionalData == "0") {
          text = "Completed and reviewed";
        } else {
          text = `Completed and reviewed their ${numberSuffix(parseInt(activity.additionalData))} rewatch`;
        }
        break;
    }
    return (
      <>
        {text}
        <span className="ps-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{activity.createdAtHuman}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{new Date(activity.createdAt).toDateString()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      </>
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      let response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          `/users/@${params.username}/profile?viewer-username=${user ? user.username : ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 404) {
        setProfile(null);
      } else {
        setProfile((await response.json()) as ProfileType);
      }
    };

    fetchProfile();
  }, [user]);

  if (profile === null) return <Profile404></Profile404>;
  if (profile === undefined) return <div></div>;

  return (
    <div className="scrollable-grid-item grid grid-rows-[max-content,1fr] gap-4 p-2 lg:grid-rows-[73px,1fr] lg:px-8 lg:py-6">
      <ProfileHeader {...{ profile, setProfile }} />
      <div className="col-span-2 flex justify-center">
        <div className="grid w-max grid-cols-1 gap-16 lg:grid-cols-[1fr,250px]">
          <div className="flex flex-col gap-6 lg:min-w-[716px]">
            <div className="flex flex-col gap-4">
              <div className="border-b border-b-slate-200 pb-2 text-lg font-medium">
                Favorites
              </div>
              {profile.favorites.length > 0 && (
                <div className="grid w-[calc(100dvw-16px)] grid-cols-4 gap-3 lg:w-full">
                  {profile.favorites.map((userEntry, idx) => (
                    <Entry
                      key={`userEntry-${idx}`}
                      {...{
                        id: userEntry.id,
                        title: `${userEntry.franchiseName}${userEntry.entries > 1 ? `: ${userEntry.entryName}` : ""}`,
                        coverUrl: userEntry.coverUrl,
                        releaseYear: 2023,
                        rating: userEntry.rating,
                      }}
                    />
                  ))}
                </div>
              )}
              {profile.favorites.length === 0 &&
                (user !== undefined && profile.username === user.username ? (
                  <div className="text-lg">
                    Rate your favorites{" "}
                    <Link href="/dashboard">
                      <span className="font-semibold">here</span>
                    </Link>
                  </div>
                ) : (
                  <div className="text-lg">No favorites found</div>
                ))}
            </div>
            {!isDesktop && <ProfileSidebar profile={profile} />}
            <div className="flex flex-col gap-4">
              <div className="border-b border-b-slate-200 pb-2 text-lg font-medium">
                Recent Activity
              </div>
              {profile.activity.length > 0 && (
                <div className="flex flex-col gap-3">
                  {profile.activity.map((activity, idx) => {
                    return (
                      <div
                        key={`activity-${idx}`}
                        className="grid w-[calc(100dvw-16px)] grid-cols-[53px,1fr] gap-4 lg:w-full lg:grid-cols-[80px,1fr]"
                      >
                        <img
                          src={activity.coverUrl}
                          className="h-[80px] w-[53px] rounded-md lg:h-[120px] lg:w-[80px]"
                        />
                        <div className="flex h-full flex-col justify-center gap-3 border-b border-b-slate-200 pb-3 lg:border-b-0 lg:pb-0">
                          <div className="space-x-3">
                            <span className="text-base font-semibold lg:text-2xl">
                              {activity.franchiseName}
                              {activity.entries > 1 &&
                                `: ${activity.entryName}`}
                            </span>
                            <span className="text-sm font-medium text-slate-500">
                              2023
                            </span>
                          </div>
                          <div className="mr-auto">
                            {activity.type == "reviewed" ||
                              (activity.type == "complete_review" && (
                                <SmallRating rating={activity.rating} />
                              ))}
                          </div>
                          <div>{generateActivityInfo(activity)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {profile.activity.length === 0 && (
                <div className="text-lg">No recent activity found</div>
              )}
            </div>
          </div>
          {isDesktop && <ProfileSidebar profile={profile} />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
