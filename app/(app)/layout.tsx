import Logo from '@/components/icons/logo';
import SidebarLayout from '@/components/layouts/sidebar';
import { Sidebar, SidebarButton, SidebarFooter } from '@/components/sidebar';
import UserDisplay from '@/components/userDisplay';
import { validateSessionToken } from '@/server/auth/validateSession';
import { Home, KeyRound, UsersRound } from 'lucide-react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

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

      <main className="px-5 py-4 flex flex-col gap-4">{children}</main>
    </SidebarLayout>
  );
};

export default Layout;
