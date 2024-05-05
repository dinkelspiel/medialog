import { cn } from '../lib/utils';
import React from 'react';

export const Header = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('flex flex-row', className)} {...props}>
      {children}
    </div>
  );
};

export const HeaderHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('flex w-full flex-col xl:w-max', className)} {...props}>
      {children}
    </div>
  );
};

export const HeaderTitle = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'w-full scroll-m-20 text-2xl font-semibold tracking-tight xl:w-max',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const HeaderDescription = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('w-full text-muted-foreground xl:w-max', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const HeaderContent = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('flex w-full items-center justify-end gap-2', className)}
      {...props}
    >
      {children}
    </div>
  );
};
