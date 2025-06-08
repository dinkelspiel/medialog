'use client';

import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
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
import { AuthUser, validateSessionToken } from '@/server/auth/validateSession';
import { User, UserEntry, UserFollow } from '@prisma/client';
import FollowButton from './followButton';
import { useAuthUser } from '../../../_components/AuthUserContext';
import { Stats } from './stats';
import { SidebarButtons } from '@/app/(app)/_components/sidebar';

export const ProfileHeader = ({
  profileUser,
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
}) => {
  const authUser = useAuthUser();
  const FollowEditProfile = () => {
    return (
      authUser &&
      authUser.id !== profileUser.id && <FollowButton user={profileUser} />
    );
  };

  return (
    <Header
      titleComponent={
        <div>
          {authUser && authUser.username === profileUser.username
            ? 'Your profile'
            : `${profileUser.username}'s profile`}
        </div>
      }
      className="col-span-2"
      sidebarContent={<SidebarButtons />}
    >
      <div className="flex w-full flex-row items-center justify-between lg:w-max lg:justify-start">
        <div className="block lg:hidden">
          <FollowEditProfile />
        </div>
      </div>
      <div className="grid w-full flex-1 grid-cols-3 flex-row items-center justify-center">
        <div className="hidden lg:block">
          <FollowEditProfile />
        </div>
        <Stats className="hidden lg:flex" profileUser={profileUser} />
      </div>
    </Header>
  );
};
