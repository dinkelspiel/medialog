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
    <html lang="en">
      <body
        className={cn(
          `theme-${theme} font-geist min-h-[100dvh] bg-base-50`,
          className
        )}
      >
        {children}
      </body>
    </html>
  );
};

export default BaseLayout;
