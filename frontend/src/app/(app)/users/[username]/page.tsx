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

type ProfileType = {
  username: string;
  watched: number;
  watchedThisYear: number;
  following: number;
  followers: number;
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
      day: number;
    }[];
  };
};

const Profile = ({ params }: { params: { username: string } }) => {
  const { user } = useUserContext();
  const [profile, setProfile] = useState<ProfileType>();

  const generateActivityInfo = (activity: Activity): string => {
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
    return `${text} ${activity.createdAt}`;
  };

  useEffect(() => {
    console.log(params.username);
    const fetchProfile = async () => {
      if (user === undefined) return;

      setProfile(
        (await (
          await fetch(
            process.env.NEXT_PUBLIC_API_URL +
              `/users/@${params.username}/profile`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          )
        ).json()) as ProfileType,
      );
    };

    fetchProfile();
  }, [user]);

  if (user === undefined) return <div></div>;
  if (profile === undefined) return <div>Profile</div>;

  return (
    <div className="scrollable-grid-item grid grid-rows-[73px,1fr] gap-4 px-8 py-6">
      <Header
        title={profile.username}
        subtext={`${profile.username}'s profile`}
        className="col-span-2"
      >
        <div className="flex flex-row gap-6">
          <div className="flex flex-col">
            <div className="text-center text-2xl font-semibold">
              {profile.watched}
            </div>
            <div className="text-center text-sm text-slate-500">Watched</div>
          </div>
          <div className="flex flex-col">
            <div className="text-center text-2xl font-semibold">
              {profile.watchedThisYear}
            </div>
            <div className="text-center text-sm text-slate-500">This Year</div>
          </div>
          <div className="flex flex-col">
            <div className="text-center text-2xl font-semibold">
              {profile.following}
            </div>
            <div className="text-center text-sm text-slate-500">Following</div>
          </div>
          <div className="flex flex-col">
            <div className="text-center text-2xl font-semibold">
              {profile.followers}
            </div>
            <div className="text-center text-sm text-slate-500">Followers</div>
          </div>
        </div>
      </Header>
      <div className="col-span-2 flex justify-center">
        <div className="grid w-max grid-cols-[1fr,250px] gap-16">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="text-lg font-medium">Favorites</div>
              <div className="flex flex-row gap-3">
                {profile.favorites.map((userEntry, idx) => (
                  <Entry
                    key={`userEntry-${idx}`}
                    {...{
                      id: userEntry.id,
                      title: `${userEntry.franchiseName}: ${userEntry.entryName}`,
                      coverUrl: userEntry.coverUrl,
                      releaseYear: 2023,
                      rating: userEntry.rating,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-lg font-medium">Recent Activity</div>
              <div className="flex flex-col gap-3">
                {profile.activity.map((activity, idx) => {
                  return (
                    <div
                      key={`activity-${idx}`}
                      className="grid grid-cols-[80px,1fr] gap-4"
                    >
                      <img
                        src={activity.coverUrl}
                        className="h-[120px] w-[80px] rounded-md"
                      />
                      <div className="flex h-full flex-col justify-center gap-3">
                        <div className="space-x-3">
                          <span className="text-2xl font-semibold">
                            {activity.franchiseName}: {activity.entryName}
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
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-lg font-medium">
                Watchlist
                <span className="ms-auto text-slate-500">
                  {profile.watchlistCount}
                </span>
              </div>
              <div className="flex flex-row">
                {profile.watchlist.map((watchlist, idx) => (
                  <img
                    src={watchlist.coverUrl}
                    className={`${idx !== 0 && "ms-[-24px]"} h-[120px] w-[80px] rounded-md shadow-lg`}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-lg font-medium">
                Ratings
                <span className="ms-auto text-slate-500">
                  {profile.ratingsCount}
                </span>
              </div>
              <div className="flex w-[250px] flex-row items-end gap-2">
                <SmallRating rating={20} />
                <div className="flex w-[250px] flex-row items-end gap-0.5">
                  {profile.ratings.map((ratingPercentage) => (
                    <div
                      className="w-full bg-slate-300"
                      style={{ height: 70 * ratingPercentage }}
                    ></div>
                  ))}
                </div>
                <SmallRating rating={100} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-lg font-medium">
                Diary
              </div>
              {Object.keys(profile.diary).map((month) => (
                <div className="grid grid-cols-[42px,1fr] gap-2">
                  <div className="relative h-max w-max">
                    <div className="absolute top-1/2 w-full -translate-y-[2px] text-center text-xs font-semibold text-white">
                      {month}
                    </div>
                    <Calendar />
                  </div>
                  <div className="grid grid-cols-[max-content,1fr] gap-2 text-sm font-medium">
                    {profile.diary[month].map((day) => (
                      <>
                        <div className="text-slate-500">{day.day}</div>
                        <div>
                          {day.franchiseName}: {day.entryName}
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
