import Logo from '@/components/icons/logo';
import { Sidebar, SidebarButton, SidebarFooter } from '@/components/sidebar';
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
    <html lang="en">
      <body
        className={`grid grid-cols-1 grid-rows-[70px,1fr] lg:grid-rows-1 lg:grid-cols-[256px,1fr] min-h-[100dvh]`}
      >
        <Sidebar
          header={
            <div className="flex gap-x-2">
              <Logo className="size-9" />
              <div className="flex justify-between flex-col pb-[1px]">
                <div className="font-normal tracking-[-.005em] leading-none">
                  Medialog
                </div>
                <div className="text-sm font-normal text-muted-foreground leading-none tracking-[.01em]">
                  @{user?.username}
                </div>
              </div>
            </div>
          }
          headerProps={{ className: '[&>svg]:size-7 p-0' }}
        >
          <SidebarButton href="/dashboard">
            <Home size={20} />
            Home
          </SidebarButton>
          <SidebarButton href="/community">
            <UsersRound size={20} />
            Community
          </SidebarButton>
        </Sidebar>

        <main className="p-3 flex flex-col gap-4">{children}</main>
      </body>
    </html>
  );
};

export default Layout;
