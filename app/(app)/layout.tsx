import Sidebar from '@/components/sidebar';
import React, { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`grid grid-cols-1 grid-rows-[70px,1fr] lg:grid-rows-1 lg:grid-cols-[256px,1fr] min-h-[100dvh]`}
      >
        <Sidebar />
        {children}
      </body>
    </html>
  );
};

export default Layout;
