import { getTheme } from '@/app/_components/theme';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';
import BaseLayout from './base';

const SidebarLayout = async ({ children }: { children: ReactNode }) => {
  const theme = await getTheme();

  return (
    <BaseLayout>
      <div
        className={cn(
          `font-geist theme-${theme} grid min-h-[100dvh] grid-cols-1 bg-base-100 lg:grid-cols-[max-content,1fr] lg:grid-rows-[70px,1fr]`
        )}
      >
        {children}
      </div>
    </BaseLayout>
  );
};

export default SidebarLayout;
