'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Header,
  HeaderContent,
  HeaderDescription,
  HeaderHeader,
  HeaderTitle,
} from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
import { validateSessionToken } from '@/server/auth/validateSession';
import { User, UserEntry, UserFollow } from '@prisma/client';
import FollowButton from './followButton';

export const ProfileHeader = ({
  user,
  profileUser,
}: {
  user: User | null;
  profileUser: User & {
    userEntries: UserEntry[];
    followers: (UserFollow & {
      user: User & { following: UserFollow[]; followers: UserFollow[] };
    })[];
    following: (UserFollow & {
      follow: User & { following: UserFollow[]; followers: UserFollow[] };
    })[];
  };
}) => {
  const [page, setPage] = useState<'Following' | 'Followers'>('Followers');

  const FollowEditProfile = () => {
    return (
      user &&
      user.id !== profileUser.id && (
        <FollowButton user={profileUser} authUser={user} />
      )
    );
  };

  return (
    <Header className="col-span-2 h-max flex-col items-center justify-center gap-6 lg:flex-row">
      <div className="flex w-full flex-row items-center justify-between lg:w-max lg:justify-start">
        <HeaderHeader className="pt-4 text-center lg:pt-0 lg:text-left">
          <HeaderTitle>{profileUser.username}</HeaderTitle>
          <HeaderDescription>
            {profileUser.username}'s profile
          </HeaderDescription>
        </HeaderHeader>
        <div className="block lg:hidden">
          <FollowEditProfile />
        </div>
      </div>
      <div className="flex w-full flex-1 flex-row items-center justify-center lg:justify-between">
        <div className="hidden lg:block">
          <FollowEditProfile />
        </div>
        <div className="grid w-full grid-cols-[1fr,1fr,2fr] justify-between px-6 sm:flex sm:w-max sm:flex-row sm:justify-start sm:gap-6 sm:px-0">
          <div className="flex flex-col">
            <div className="text-center text-2xl font-semibold">
              {profileUser.userEntries.length}
            </div>
            <div className="text-center text-sm text-slate-500">Watched</div>
          </div>
          <div className="flex flex-col">
            <div className="text-center text-2xl font-semibold">
              {
                profileUser.userEntries.filter(e =>
                  e.watchedAt
                    ? e.watchedAt?.getTime() >
                      new Date(new Date().getFullYear().toString()).getTime()
                    : false
                ).length
              }
            </div>
            <div className="text-center text-sm text-slate-500">This Year</div>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <div className="grid cursor-pointer grid-cols-2 sm:flex sm:flex-row sm:gap-6">
                <div
                  className="flex flex-col"
                  onMouseOver={() => setPage('Following')}
                >
                  <div className="text-center text-2xl font-semibold">
                    {profileUser.following.filter(e => e.isFollowing).length}
                  </div>
                  <div className="text-center text-sm text-slate-500">
                    Following
                  </div>
                </div>
                <div
                  className="flex flex-col"
                  onMouseOver={() => setPage('Followers')}
                >
                  <div className="text-center text-2xl font-semibold">
                    {profileUser.followers.filter(e => e.isFollowing).length}
                  </div>
                  <div className="text-center text-sm text-slate-500">
                    Followers
                  </div>
                </div>
              </div>
            </SheetTrigger>
            <SheetContent className="!max-w-[450px] min-[450px]:max-w-[100dvw]">
              <SheetHeader>
                <SheetTitle className="flex flex-row gap-6">
                  <div
                    className={cn(
                      `cursor-pointer px-2 pb-1 text-lg font-semibold text-slate-500`,
                      {
                        'border-b border-b-black text-black':
                          page === 'Following',
                      }
                    )}
                    onClick={() => setPage('Following')}
                  >
                    Following
                  </div>
                  <div
                    className={cn(
                      `cursor-pointer px-2 pb-1 text-lg font-semibold text-slate-500`,
                      {
                        'border-b border-b-black text-black':
                          page === 'Followers',
                      }
                    )}
                    onClick={() => setPage('Followers')}
                  >
                    Followers
                  </div>
                </SheetTitle>
              </SheetHeader>
              <UserList
                users={
                  (page === 'Followers'
                    ? profileUser.followers
                    : profileUser.following) as (UserFollow & {
                    follow: User & {
                      following: UserFollow[];
                      followers: UserFollow[];
                    };
                  } & {
                    user: User & {
                      following: UserFollow[];
                      followers: UserFollow[];
                    };
                  })[]
                }
                authUser={user}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </Header>
  );
};

const UserList = ({
  users,
  authUser,
}: {
  users: (UserFollow & {
    follow: User & { following: UserFollow[]; followers: UserFollow[] };
  } & { user: User & { following: UserFollow[]; followers: UserFollow[] } })[];
  authUser: User | null;
}) => {
  return (
    <div className="py-6">
      <div className="grid grid-cols-[1fr,96px] items-center gap-3">
        {users
          .filter(e => e.isFollowing)
          .map(user => {
            if (user.follow) {
              return <UserCard user={user.follow} authUser={authUser} />;
            }

            if (user.user) {
              return <UserCard user={user.user} authUser={authUser} />;
            }
          })}
      </div>
    </div>
  );
};

const UserCard = ({
  user,
  authUser,
}: {
  user: User & { following: UserFollow[]; followers: UserFollow[] };
  authUser: User | null;
}) => {
  return (
    <React.Fragment key={user.username}>
      <Link href={`/@${user.username}`}>
        <div className="flex flex-col">
          <div className="font-semibold">{user.username}</div>
          <div className="text-sm text-slate-500">
            {user.followers.filter(e => e.isFollowing).length} followers,
            following {user.following.filter(e => e.isFollowing).length}
          </div>
        </div>
      </Link>
      <div className="flex flex-row justify-end">
        {authUser && authUser.username !== user.username && (
          <FollowButton user={user} authUser={authUser} />
        )}
      </div>
    </React.Fragment>
  );
};
