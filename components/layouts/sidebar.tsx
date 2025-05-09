import { getTheme } from '@/app/_components/theme';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

const SidebarLayout = async ({ children }: { children: ReactNode }) => {
  const theme = await getTheme();

  return (
    <div
      className={cn(
        `font-geist theme-${theme} bg-base-100 grid min-h-[100dvh] grid-cols-1 lg:grid-cols-[max-content,1fr] lg:grid-rows-[70px,1fr]`
      )}
    >
      {children}
    </div>
  );
};

export default SidebarLayout;
