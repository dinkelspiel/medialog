import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const BaseLayout = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <html lang="en">
      <body className={cn('min-h-[100dvh]', inter.className, className)}>
        {children}
      </body>
    </html>
  );
};

export default BaseLayout;
