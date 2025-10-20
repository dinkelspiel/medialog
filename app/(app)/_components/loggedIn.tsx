'use client';
import AddLog from '@/components/addLog';
import { Sidebar, SidebarFooter } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { SidebarButtons } from '../_components/sidebar';
import { useAppStore } from '../state';
import { Feedback } from './feedback';
import { Plus } from 'lucide-react';

export const LoggedIn = ({
  children,
}: {
  user: { id: number; username: string };
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
          <Feedback />
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
