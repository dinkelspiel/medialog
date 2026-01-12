'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { User, UserEntry, UserFollow } from '@/prisma/generated/browser';
import Link from 'next/link';
import React, { useState } from 'react';
import FollowButton from './followButton';
import { useAuthUser } from '@/app/(app)/_components/AuthUserContext';

const UserCard = ({
  user,
}: {
  user: User & { following: UserFollow[]; followers: UserFollow[] };
}) => {
  const authUser = useAuthUser();
  return (
    <React.Fragment key={user.username}>
      <Link href={`/@${user.username}`}>
        <div className="flex flex-col">
          <div className="font-semibold">{user.username}</div>
          <div className="text-sm text-base-500">
            {user.followers.filter(e => e.isFollowing).length} followers,
            following {user.following.filter(e => e.isFollowing).length}
          </div>
        </div>
      </Link>
      <div className="flex flex-row justify-end">
        {authUser && authUser.username !== user.username && (
          <FollowButton user={user} />
        )}
      </div>
    </React.Fragment>
  );
};

const UserList = ({
  users,
}: {
  users: (UserFollow & {
    follow: User & { following: UserFollow[]; followers: UserFollow[] };
  } & { user: User & { following: UserFollow[]; followers: UserFollow[] } })[];
}) => {
  return (
    <div className="py-6">
      <div className="grid grid-cols-[1fr_96px] items-center gap-3">
        {users
          .filter(e => e.isFollowing)
          .map(user => {
            if (user.follow) {
              return <UserCard key={user.follow.id} user={user.follow} />;
            }

            if (user.user) {
              return <UserCard key={user.user.id} user={user.user} />;
            }
          })}
      </div>
    </div>
  );
};

export const Stats = ({
  profileUser,
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
  className?: string;
}) => {
  const authUser = useAuthUser();
  const [page, setPage] = useState<'Following' | 'Followers'>('Followers');

  return (
    <div className={cn('flex justify-center', className ?? '')}>
      <div className="grid w-full grid-cols-[1fr_1fr_2fr] items-center justify-between px-6 sm:flex sm:w-max sm:flex-row sm:justify-start sm:gap-6 sm:px-0">
        <div className="flex flex-col">
          <div className="text-center text-2xl font-semibold">
            {
              profileUser.userEntries.filter(e => e.status === 'completed')
                .length
            }
          </div>
          <div className="text-center text-sm text-base-500">Watched</div>
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
          <div className="whitespace-nowrap text-center text-sm text-base-500">
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
                <div className="text-center text-sm text-base-500">
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
                <div className="text-center text-sm text-base-500">
                  Followers
                </div>
              </div>
            </div>
          </SheetTrigger>
          <SheetContent className="max-w-[450px]! min-[450px]:max-w-dvw">
            <SheetHeader>
              <SheetTitle className="flex flex-row gap-6">
                <div
                  className={cn(
                    `cursor-pointer px-2 pb-1 text-lg font-semibold text-base-500`,
                    {
                      'border-b border-b-black text-base-900':
                        page === 'Following',
                    }
                  )}
                  onClick={() => setPage('Following')}
                >
                  Following
                </div>
                <div
                  className={cn(
                    `cursor-pointer px-2 pb-1 text-lg font-semibold text-base-500`,
                    {
                      'border-b border-b-black text-base-900':
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
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
