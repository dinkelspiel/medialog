import { cn } from '../lib/utils';
import React from 'react';
import { Button } from './ui/button';
import { PanelLeft, Settings, UserRound } from 'lucide-react';

export const Header = ({
  className,
  title,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { title: string }) => {
  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-b-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-3">
        <Button
          size={'icon'}
          variant={'ghost'}
          onClick={() => 'setOpen(!open)'}
        >
          <PanelLeft className="stroke-slate-600" />
        </Button>
        <div className="text-sm font-medium text-slate-600">{title}</div>
      </div>
      {children}
      <div className="flex items-center gap-3">
        <Button size={'icon'} variant={'ghost'}>
          <Settings className="stroke-slate-600" />
        </Button>
        <Button variant={'outline'}>
          <UserRound className="size-4" /> {'Test'}
        </Button>
      </div>
    </div>
  );
};

export const HeaderHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      <Button size={'icon'} variant={'ghost'} onClick={() => 'setOpen(!open)'}>
        <PanelLeft className="stroke-slate-600" />
      </Button>
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
      className={cn('text-sm font-medium text-slate-600', className)}
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
