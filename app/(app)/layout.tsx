import BaseLayout from '@/components/layouts/base';
import SidebarLayout from '@/components/layouts/sidebar';
import { validateSessionToken } from '@/server/auth/validateSession';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { AuthUserProvider } from './_components/AuthUserContext';
import { LoggedIn } from './_components/loggedIn';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  EntryIsland,
  EntryIslandProvider,
} from './_components/EntryIslandContext';

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await validateSessionToken();

  if (user) {
    return (
      <AuthUserProvider user={user}>
        <EntryIslandProvider>
          <TooltipProvider>
            <SidebarLayout>
              <EntryIsland />
              <LoggedIn user={user}>{children}</LoggedIn>
            </SidebarLayout>
          </TooltipProvider>
        </EntryIslandProvider>
      </AuthUserProvider>
    );
  } else {
    return (
      <BaseLayout>
        <TooltipProvider>
          <AuthUserProvider user={null}>
            <main className="flex flex-col gap-4">{children}</main>
            <Toaster />
          </AuthUserProvider>
        </TooltipProvider>
      </BaseLayout>
    );
  }
};

export default Layout;
