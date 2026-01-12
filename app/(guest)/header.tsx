'use client';

import Logo from '@/components/icons/logo';
import { cn } from '@/lib/utils';
import { User } from '@/prisma/generated/browser';
import { ChevronRight, Menu } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useAuthUser } from '../(app)/_components/AuthUserContext';

const Header = () => {
  const authUser = useAuthUser();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-4 z-10 flex w-[calc(100dvw-2rem)] gap-6 rounded-2xl border border-solid border-base-700 bg-base-800 p-1 shadow-xl md:mx-0 md:w-fit">
        <div className="flex h-9 w-full items-center justify-between gap-0 md:justify-start">
          <div className="mr-2 flex h-9 w-9 items-center justify-center rounded-xl">
            <Logo className="size-9 rounded-xl" />
          </div>
          <Link href={'/blog'}>
            <span className="hidden h-full cursor-pointer items-center px-3 text-sm font-medium leading-[130%] tracking-[-0.005em] text-white hover:opacity-80 md:flex">
              Blog
            </span>
          </Link>
          <Link href={'/blog'}>
            <span className="hidden h-full cursor-pointer items-center px-3 text-sm font-medium leading-[130%] tracking-[-0.005em] text-white hover:opacity-80 md:flex">
              About
            </span>
          </Link>
          <div className="flex h-full w-fit items-center gap-x-2">
            <Link
              className="inline h-full"
              href={authUser ? '/dashboard' : '/auth/login'}
            >
              <span className="ml-2 flex h-full cursor-pointer items-center rounded-xl bg-white px-3 text-sm font-medium leading-[130%] tracking-[-0.005em] text-base-900 hover:opacity-80">
                {authUser ? 'Go to app' : 'Sign in'}
              </span>
            </Link>
            <nav className="flex h-9 w-9 items-center justify-center md:hidden">
              <button
                className="hover:bg-base-700/80 flex h-9 w-9 items-center justify-center rounded-xl"
                onClick={() => setOpen(!open)}
              >
                <Menu className="size-4 stroke-white" />
              </button>
            </nav>
          </div>
        </div>
      </header>
      <div
        className={cn(
          'box-base-100 fixed top-[calc(32px+45.6px)] flex h-0 w-11/12 origin-top select-none  flex-col overflow-hidden rounded-xl bg-[#292929] px-1 shadow-lg duration-500 md:hidden md:w-fit',
          {
            'h-fit border border-solid border-base-700 py-1 shadow-xl ease-in-out':
              open,
          }
        )}
      >
        <Link className="[&amp;>div]:last:border-none" href="/blog">
          <div className="box-base-100 flex w-full items-center justify-between gap-x-[2px] border-b border-white/6 px-4 py-3">
            <span className="body-small flex h-full cursor-pointer items-center text-white hover:opacity-[.8]">
              Blog
            </span>
          </div>
          <div className="h-full w-full "></div>
        </Link>
        <Link className="[&amp;>div]:last:border-none" href="/about">
          <div className="box-base-100 flex w-full items-center justify-between gap-x-[2px] px-4 py-3">
            <span className="body-small flex h-full cursor-pointer items-center text-white hover:opacity-[.8]">
              About
            </span>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Header;
