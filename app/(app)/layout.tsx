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
import { AuthUserProvider } from './_components/AuthUserContext';
import { SidebarButtons } from './_components/sidebar';
import BaseLayout from '@/components/layouts/base';
import { LoggedIn } from './_components/loggedIn';

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await validateSessionToken();

  if (user) {
    return (
      <AuthUserProvider
        user={{ id: user.id, username: user.username, email: user.email }}
      >
        <SidebarLayout>
          <LoggedIn user={user}>{children}</LoggedIn>
        </SidebarLayout>
      </AuthUserProvider>
    );
  } else {
    return (
      <BaseLayout>
        <AuthUserProvider user={null}>
          <main className="flex flex-col gap-4">{children}</main>
          <Toaster />
        </AuthUserProvider>
      </BaseLayout>
    );
  }
};

export default Layout;
