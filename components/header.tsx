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
    <div className={cn('flex flex-col xl:w-max w-full', className)} {...props}>
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
        'xl:w-max w-full scroll-m-20 text-2xl font-semibold tracking-tight',
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
      className={cn('xl:w-max w-full text-muted-foreground', className)}
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
      className={cn('flex justify-end w-full items-center gap-2', className)}
      {...props}
    >
      {children}
    </div>
  );
};
