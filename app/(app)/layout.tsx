import { Sidebar, SidebarButton, SidebarFooter } from '@/components/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { CornerDownLeft, Home, Shield, UsersRound } from 'lucide-react';
import React, { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`grid grid-cols-1 grid-rows-[70px,1fr] lg:grid-rows-1 lg:grid-cols-[256px,1fr] min-h-[100dvh]`}
      >
        <Sidebar header={<>Medialog</>}>
          <SidebarButton href="/dashboard">
            <Home size={20} />
            Home
          </SidebarButton>
        </Sidebar>

        <main className="px-6 py-4 flex flex-col gap-4">{children}</main>
      </body>
    </html>
  );
};

export default Layout;
