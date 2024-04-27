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
        <div className="flex gap-x-2">
          <Logo className="size-9" />
          <div className="flex justify-between flex-col pb-[1px] items-start">
            <div className="font-normal tracking-[-.005em] leading-none">
              Medialog
            </div>
            <div className="text-sm font-normal text-muted-foreground leading-none tracking-[.01em]">
              @{user.username}
            </div>
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
