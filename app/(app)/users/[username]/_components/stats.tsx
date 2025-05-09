'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { User, UserEntry, UserFollow } from '@prisma/client';
import Link from 'next/link';
import React, { useState } from 'react';
import FollowButton from './followButton';
import { useAuthUser } from '@/app/(app)/_components/AuthUserContext';

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
          <div className="text-base-500 text-sm">
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

export const Stats = ({
  profileUser,
  user,
  className,
}: {
  profileUser: User & {
    userEntries: UserEntry[];
    followers: (UserFollow & {
      user: User & { following: UserFollow[]; followers: UserFollow[] };
    })[];
    following: (UserFollow & {
      follow: User & { following: UserFollow[]; followers: UserFollow[] };
    })[];
  };
  user: User | null;
  className?: string;
}) => {
  const [page, setPage] = useState<'Following' | 'Followers'>('Followers');

  return (
    <div className={cn('flex justify-center', className ?? '')}>
      <div className="grid w-full grid-cols-[1fr,1fr,2fr] items-center justify-between px-6 sm:flex sm:w-max sm:flex-row sm:justify-start sm:gap-6 sm:px-0">
        <div className="flex flex-col">
          <div className="text-center text-2xl font-semibold">
            {
              profileUser.userEntries.filter(e => e.status === 'completed')
                .length
            }
          </div>
          <div className="text-base-500 text-center text-sm">Watched</div>
        </div>
        <div className="flex flex-col">
          <div className="text-center text-2xl font-semibold">
            {
              profileUser.userEntries.filter(
                e =>
                  (e.watchedAt
                    ? e.watchedAt?.getTime() >
                      new Date(new Date().getFullYear().toString()).getTime()
                    : false) && e.status === 'completed'
              ).length
            }
          </div>
          <div className="text-base-500 whitespace-nowrap text-center text-sm">
            This Year
          </div>
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
                <div className="text-base-500 text-center text-sm">
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
                <div className="text-base-500 text-center text-sm">
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
                    `text-base-500 cursor-pointer px-2 pb-1 text-lg font-semibold`,
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
                    `text-base-500 cursor-pointer px-2 pb-1 text-lg font-semibold`,
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
  );
};
