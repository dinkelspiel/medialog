import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

const HeaderLayout = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`flex min-h-screen flex-col gap-4`, className)}>
      {children}
    </div>
  );
};

export default HeaderLayout;
