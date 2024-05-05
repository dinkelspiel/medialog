import SidebarLayout from '@/components/layouts/sidebar';
import { Sidebar, SidebarButton } from '@/components/sidebar';
import UserDisplay from '@/components/userDisplay';
import { validateSessionToken } from '@/server/auth/validateSession';
import { Home, UsersRound } from 'lucide-react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await validateSessionToken();

  if (!user) {
    return redirect('/auth/login');
  }

  return (
    <SidebarLayout>
      <Sidebar
        header={<UserDisplay user={user} />}
        headerProps={{ className: '[&>svg]:size-7 p-0' }}
      >
        <SidebarButton href="/dashboard">
          <Home className="size-3" />
          Home
        </SidebarButton>
        <SidebarButton href="/community">
          <UsersRound className="size-3" />
          Community
        </SidebarButton>
      </Sidebar>

      <main className="flex flex-col gap-4 px-5 py-4">{children}</main>
      <Toaster />
    </SidebarLayout>
  );
};

export default Layout;
