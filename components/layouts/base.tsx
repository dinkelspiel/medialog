import { getTheme } from '@/app/_components/settings';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

const BaseLayout = async ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const theme = await getTheme();

  return (
    <div
      className={cn(
        `theme-${theme} min-h-[100dvh] bg-base-50 font-geist`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default BaseLayout;
