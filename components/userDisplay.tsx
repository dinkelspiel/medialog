'use client';

import { User } from '@prisma/client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from './icons/logo';
import { LogOut, User as UserIcon } from 'lucide-react';
import { logout } from '@/server/auth/logout';
import Link from 'next/link';

const UserDisplay = ({ user }: { user: User }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex gap-x-3">
          <Logo className="size-[41px]" />
          <div className="flex flex-col items-start justify-center pb-[1px]">
            <div className="text-xs font-normal">Medialog</div>
            <div className="text-base font-semibold">@{user.username}</div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-3 w-[232px]">
        <Link href={`/@${user.username}`}>
          <DropdownMenuItem>
            <UserIcon className="me-2 size-3" />
            Go to profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <form action={logout} className="w-full">
          <button type="submit" className="w-full">
            <DropdownMenuItem>
              <LogOut className="me-2 size-3" />
              Log out
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDisplay;
