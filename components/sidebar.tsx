'use client';

import { cn } from '../lib/utils';
import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent } from './ui/sheet';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

export const Sidebar = ({
  children,
  className,
  header,
  headerProps,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  header: ReactNode;
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div
      id="sidebar"
      className={cn(
        `sticky top-0 z-40 h-auto w-full transition-transform lg:h-[100dvh]`,
        className
      )}
      {...props}
      aria-label="Sidebar"
    >
      <div className="flex h-[75px] flex-col justify-center overflow-y-auto border-b border-slate-200 bg-neutral-100 px-3 py-4 shadow-[inset_0_0px_8px_0_rgb(0_0_0_/_0.02)] dark:border-slate-700 dark:bg-slate-900 lg:h-full lg:justify-start lg:border-b-0">
        <SidebarHeader {...headerProps}>
          {header}
          <button className="flex w-full justify-end lg:hidden">
            <div className="sr-only">Öppna meny</div>
            <Menu onClick={() => setSheetOpen(true)} className="h-5 w-5" />
          </button>
        </SidebarHeader>
        <ul className="hidden h-full flex-col space-y-2 text-sm font-medium lg:flex">
          {children}
        </ul>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="flex list-none flex-col gap-2 bg-neutral-100 pt-12">
            {children}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export const SidebarHeader = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      `flex items-center gap-3 whitespace-nowrap rounded-lg text-base font-semibold text-slate-900 dark:text-white lg:mb-12 [&>svg]:size-3`,
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const SidebarButton = ({
  children,
  href,
  selectedVariant,
  ...props
}: React.HTMLAttributes<HTMLAnchorElement> & {
  href: string;
  selectedVariant?: string;
}) => (
  <li>
    <Link href={href} {...props}>
      <ClientSidebarButton selectedVariant={selectedVariant} href={href}>
        {children}
      </ClientSidebarButton>
    </Link>
  </li>
);

export const SidebarFooter = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(`flex flex-1 flex-col justify-end gap-2`, className)}
    {...props}
  >
    {children}
  </div>
);

const ClientSidebarButton = ({
  children,
  className,
  href,
  selectedVariant,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & {
  href: string;
  selectedVariant?: string;
}) => {
  const pathname = usePathname();

  return (
    <Button
      variant={
        pathname.endsWith(href)
          ? (selectedVariant as any) ?? 'default'
          : 'ghost'
      }
      className={cn(
        `w-full select-none justify-start`,
        {
          'text-white': pathname.endsWith(href),
          'text-muted-foreground': !pathname.endsWith(href),
        },
        className
      )}
      tabIndex={-1}
      {...props}
    >
      {children}
    </Button>
  );
};
