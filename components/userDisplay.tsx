'use client';

import { User } from '@prisma/client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from './icons/logo';
import { LogOut } from 'lucide-react';
import { logout } from '@/server/auth/logout';

const UserDisplay = ({ user }: { user: User }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex gap-x-3">
          <Logo className="size-[41px]" />
          <div className="flex justify-center items-start flex-col pb-[1px]">
            <div className="text-xs font-normal">Medialog</div>
            <div className="text-base font-semibold">@{user.username}</div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-3 w-[232px]">
        <form action={logout} className="w-full">
          <button type="submit" className="w-full">
            <DropdownMenuItem>
              <LogOut className="size-3 me-2" />
              Log out
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDisplay;
