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
    <div
      className={cn(
        'grid h-screen grid-rows-[max-content,1fr] gap-4 overflow-y-scroll',
        className
      )}
    >
      {children}
    </div>
  );
};

export default HeaderLayout;
