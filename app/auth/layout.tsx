import { validateSessionToken } from '@/server/auth/validateSession';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { getTheme } from '../_components/theme';

const Layout = async ({ children }: { children: ReactNode }) => {
  const theme = await getTheme();

  return (
    <html lang="en">
      <body className={`theme-${theme} min-h-[100dvh]`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
};

export default Layout;
