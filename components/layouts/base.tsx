import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

const BaseLayout = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <html lang="en">
      <body className={cn('font-geist min-h-[100dvh]', className)}>
        {children}
      </body>
    </html>
  );
};

export default BaseLayout;
