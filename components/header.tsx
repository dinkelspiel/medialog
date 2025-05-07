import { cn } from '../lib/utils';
import React, { ReactNode } from 'react';
import { Button } from './ui/button';
import { Menu, PanelLeft, Plus, Settings, UserRound } from 'lucide-react';
import { useAuthUser } from '@/app/(app)/_components/AuthUserContext';
import Link from 'next/link';
import { Sheet, SheetTrigger } from './ui/sheet';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import AddLog from './addLog';

export const Header = ({
  className,
  title,
  children,
  sidebarContent,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  sidebarContent: ReactNode;
}) => {
  const user = useAuthUser();
  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b border-b-neutral-200 bg-neutral-50 p-3',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          size={'icon'}
          variant={'ghost'}
          className="hidden lg:flex"
          onClick={() => 'setOpen(!open)'}
        >
          <PanelLeft className="stroke-neutral-600" />
        </Button>
        <div className="whitespace-nowrap text-sm font-medium text-neutral-600">
          {title}
        </div>
      </div>
      {children}
      <div className="hidden items-center gap-3 lg:flex">
        <Button size={'icon'} variant={'ghost'}>
          <Settings className="stroke-neutral-600" />
        </Button>
        <Link href={`/@${user && user.username}`}>
          <Button variant={'outline'}>
            <UserRound className="size-4" /> {user && user.username}
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-3 lg:hidden">
        <AddLog>
          <Button className="flex lg:hidden" size="sm" variant={'outline'}>
            <Plus className="size-4 stroke-neutral-600" />
            Log Media
          </Button>
        </AddLog>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              size={'icon'}
              variant={'ghost'}
              className="flex aspect-square lg:hidden"
            >
              <Menu className="stroke-neutral-600" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="flex flex-col gap-2 p-4">{sidebarContent}</div>
            <div className="flex flex-col gap-2 p-4">
              <Button size={'sm'} variant={'outline'}>
                <Settings className="stroke-neutral-600" /> Settings
              </Button>
              <Link href={`/@${user && user.username}`} className="w-full">
                <Button variant={'outline'} size="sm" className="w-full">
                  <UserRound className="size-4" /> {user && user.username}
                </Button>
              </Link>
            </div>
          </DrawerContent>
        </Drawer>
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
        <PanelLeft className="stroke-neutral-600" />
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
      className={cn('text-sm font-medium text-neutral-600', className)}
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
