'use client';
import AddLog from '@/components/addLog';
import SidebarLayout from '@/components/layouts/sidebar';
import { Sidebar, SidebarButton, SidebarFooter } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import UserDisplay from '@/components/userDisplay';
import { validateSessionToken } from '@/server/auth/validateSession';
import { Home, Plus, UsersRound } from 'lucide-react';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { AuthUserProvider } from '../_components/AuthUserContext';
import { SidebarButtons } from '../_components/sidebar';
import BaseLayout from '@/components/layouts/base';
import { User } from '@prisma/client';
import { useAppStore } from '../state';

export const LoggedIn = ({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) => {
  const { sidebarOpen } = useAppStore();
  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        // header={
        //   <div className="flex w-full justify-between">
        //     <UserDisplay user={user} />
        //     <AddLog>
        //       <Button className="flex min-w-[40px] justify-center lg:hidden">
        //         <Plus />
        //         Log Media
        //       </Button>
        //     </AddLog>
        //   </div>
        // }
        headerProps={{ className: '[&>svg]:size-7 p-0' }}
      >
        <SidebarButtons />
        <SidebarFooter>
          <div className="text-sm font-normal text-base-400">
            {process.env.GIT_COMMIT
              ? `${process.env.GIT_COMMIT}@${process.env.GIT_BRANCH}`
              : 'dev'}
          </div>
          <AddLog>
            <Button className="hidden lg:flex" size="sm" variant={'outline'}>
              <Plus className="size-4 stroke-base-600" />
              Log Media
            </Button>
          </AddLog>
        </SidebarFooter>
      </Sidebar>

      <main>{children}</main>
      <Toaster />
    </>
  );
};
