import React, { Dispatch, SetStateAction, useState } from "react";
import { ProfileType, UserType } from "./page";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useUserContext } from "../../user-provider";
import { toast } from "sonner";
import Link from "next/link";
import FollowButton from "@/components/followButton";

export const ProfileHeader = ({
  profile,
  setProfile,
}: {
  profile: ProfileType;
  setProfile: Dispatch<SetStateAction<ProfileType | undefined | null>>;
}) => {
  const [page, setPage] = useState<"Following" | "Followers">("Followers");
  const { user } = useUserContext();

  if (user == undefined) return <div></div>;

  return (
    <Header
      title={profile.username}
      subtext={`${profile.username}'s profile`}
      className="col-span-2 h-max flex-col items-center justify-start gap-6 lg:flex-row"
    >
      <div className="flex w-full flex-1 flex-row items-center justify-between">
        <div>
          {user.username !== profile.username && (
            <FollowButton
              username={user.username}
              followUsername={profile.username}
              isViewerFollowing={profile.isViewerFollowing}
              followSuccess={() =>
                setProfile({ ...profile, isViewerFollowing: true })
              }
              unfollowSuccess={() =>
                setProfile({ ...profile, isViewerFollowing: false })
              }
            />
          )}

          {user.username === profile.username && (
            <Link href="/settings/profile">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          )}
        </div>
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
          <Sheet>
            <SheetTrigger asChild>
              <div className="flex cursor-pointer flex-row gap-6">
                <div
                  className="flex flex-col"
                  onMouseOver={() => setPage("Following")}
                >
                  <div className="text-center text-2xl font-semibold">
                    {profile.following.length}
                  </div>
                  <div className="text-center text-sm text-slate-500">
                    Following
                  </div>
                </div>
                <div
                  className="flex flex-col"
                  onMouseOver={() => setPage("Followers")}
                >
                  <div className="text-center text-2xl font-semibold">
                    {profile.followers.length}
                  </div>
                  <div className="text-center text-sm text-slate-500">
                    Followers
                  </div>
                </div>
              </div>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex flex-row gap-6">
                  <div
                    className={cn(
                      `cursor-pointer px-2 pb-1 text-lg font-semibold text-slate-500`,
                      {
                        "border-b border-b-black text-black":
                          page === "Following",
                      },
                    )}
                    onClick={() => setPage("Following")}
                  >
                    Following
                  </div>
                  <div
                    className={cn(
                      `cursor-pointer px-2 pb-1 text-lg font-semibold text-slate-500`,
                      {
                        "border-b border-b-black text-black":
                          page === "Followers",
                      },
                    )}
                    onClick={() => setPage("Followers")}
                  >
                    Followers
                  </div>
                </SheetTitle>
              </SheetHeader>
              {page === "Followers" ? (
                <UserList
                  {...{
                    profile,
                    setProfile,
                    users: profile.followers,
                    userType: "followers",
                  }}
                />
              ) : (
                <UserList
                  {...{
                    profile,
                    setProfile,
                    users: profile.following,
                    userType: "following",
                  }}
                />
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </Header>
  );
};
const UserList = ({
  users,
  profile,
  setProfile,
  userType,
}: {
  users: UserType[];
  profile: ProfileType;
  setProfile: Dispatch<SetStateAction<ProfileType | undefined | null>>;
  userType: "following" | "followers";
}) => {
  const { user: authUser } = useUserContext();

  if (authUser === undefined) return <div></div>;

  const handleSuccess = (user: UserType, isFollowing: boolean) => {
    setProfile({
      ...profile,
      [userType]: [
        ...profile[userType].filter((e) => e.username !== user.username),
        { ...user, isViewerFollowing: isFollowing },
      ],
    });
  };

  return (
    <div className="py-6">
      <div className="grid grid-cols-[1fr,96px] items-center gap-3">
        {users.map((user) => (
          <React.Fragment key={user.username}>
            <Link href={`/@${user.username}`}>
              <div className="flex flex-col">
                <div className="font-semibold">{user.username}</div>
                <div className="text-sm text-slate-500">
                  {user.followersCount} followers, following{" "}
                  {user.followingCount}
                </div>
              </div>
            </Link>
            <div className="flex flex-row justify-end">
              {user.username !== profile.username && (
                <FollowButton
                  username={authUser.username}
                  followUsername={user.username}
                  isViewerFollowing={user.isViewerFollowing}
                  followSuccess={() => handleSuccess(user, true)}
                  unfollowSuccess={() => handleSuccess(user, false)}
                />
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
