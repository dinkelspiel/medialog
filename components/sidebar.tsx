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
        `z-40 h-auto lg:h-[100dvh] sticky top-0 w-full transition-transform`,
        className
      )}
      {...props}
      aria-label="Sidebar"
    >
      <div className="flex bg-neutral-100 shadow-[inset_0_0px_8px_0_rgb(0_0_0_/_0.02)] h-[75px] justify-center lg:justify-start border-b lg:border-b-0 lg:h-full flex-col overflow-y-auto border-slate-200 px-3 py-4 dark:border-slate-700 dark:bg-slate-900">
        <SidebarHeader {...headerProps}>
          {header}
          <button className="lg:hidden w-full justify-end flex">
            <div className="sr-only">Öppna meny</div>
            <Menu onClick={() => setSheetOpen(true)} className="w-5 h-5" />
          </button>
        </SidebarHeader>
        <ul className="space-y-2 text-sm font-medium flex-col h-full lg:flex hidden">
          {children}
        </ul>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="list-none pt-12 gap-2 flex flex-col bg-neutral-100">
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
      `lg:mb-12 flex whitespace-nowrap items-center rounded-lg text-slate-900 dark:text-white gap-3 text-base font-semibold [&>svg]:size-5`,
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
    className={cn(`flex-1 flex flex-col justify-end gap-2`, className)}
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
        `w-full justify-start select-none`,
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
