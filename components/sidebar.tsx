'use client';

import { Library } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

export const Sidebar = ({
  children,
  className,
  header,
  headerProps,
  sidebarOpen,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode;
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
  sidebarOpen: boolean;
}) => {
  return (
    <div
      className={cn(
        'sticky top-0 hidden h-screen w-0 flex-col overflow-hidden border-r border-r-base-200 bg-base-50 p-0 py-3 transition-all duration-200 lg:flex',
        {
          'w-[250px] px-3': sidebarOpen,
        },
        className
      )}
    >
      <div className="flex h-[52px] w-[250px] items-center gap-3 border-b border-dashed border-b-base-200 pb-3">
        {!header && (
          <>
            <div className="flex size-[40px] items-center justify-center rounded-lg border border-base-200 p-1 shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-[4px] bg-base-900">
                <Library className="flex size-4 items-center justify-center stroke-white" />
              </div>
            </div>
            <div className="text-sm font-medium">Medialog</div>
          </>
        )}
        {header}
      </div>
      <ul className="box-base-100 flex h-full flex-col pt-3">{children}</ul>
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
      `flex items-center gap-3 whitespace-nowrap rounded-lg text-base font-semibold text-base-900 dark:text-white lg:mb-12 [&>svg]:size-3`,
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
  <li className="list-none">
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
  const path = usePathname() ?? '';

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
    //       'text-base-500': !pathname.endsWith(href),
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
        'text-base-600': !path.includes(href ?? ''),
      })}
    >
      {children}
    </Button>
  );
};
