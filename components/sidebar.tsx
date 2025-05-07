'use client';

import { cn } from '../lib/utils';
import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Library, Menu } from 'lucide-react';
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
      className={cn(
        'sticky top-0 flex h-[100dvh] w-0 flex-col overflow-hidden border-r border-r-slate-200 bg-slate-50 p-0 py-3 transition-all duration-200',
        {
          'w-[250px] px-3': true, //open,
        }
      )}
    >
      <div className="flex h-[52px] w-[250px] items-center gap-3 border-b border-dashed border-b-slate-200 pb-3">
        <div className="flex size-[40px] items-center justify-center rounded-lg border border-slate-200 p-1 shadow-sm">
          <div className="flex h-full w-full items-center justify-center rounded-[4px] bg-slate-900">
            <Library className="flex size-4 items-center justify-center stroke-white" />
          </div>
        </div>
        <div className="text-sm font-medium">Medialog</div>
      </div>
      <ul className="box-border flex h-full flex-col pt-3">{children}</ul>
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
    className={cn(`flex h-full flex-col justify-end gap-2`, className)}
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
  const path = usePathname();

  return (
    // <Button
    //   variant={
    //     pathname.endsWith(href)
    //       ? ((selectedVariant as any) ?? 'default')
    //       : 'ghost'
    //   }
    //   className={cn(
    //     `w-full select-none justify-start`,
    //     {
    //       'text-white': pathname.endsWith(href),
    //       'text-muted-foreground': !pathname.endsWith(href),
    //     },
    //     className
    //   )}
    //   tabIndex={-1}
    //   {...props}
    // >
    //   {children}
    // </Button>
    <Button
      variant={path.includes(href ?? '') ? 'outline' : 'ghost'}
      size={'sm'}
      className={cn('w-full justify-start gap-3', {
        'text-slate-600': !path.includes(href ?? ''),
      })}
    >
      {children}
    </Button>
  );
};
