import { validateSessionToken } from '@/server/auth/validateSession';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className={`min-h-[100dvh]`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
};

export default Layout;
