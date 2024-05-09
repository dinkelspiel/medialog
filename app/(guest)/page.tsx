import Logo from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { validateSessionToken } from '@/server/auth/validateSession';
import { ChevronRight, Menu } from 'lucide-react';
import Link from 'next/link';
import Header from './header';
import Image from 'next/image';

const Page = async () => {
  const user = await validateSessionToken();

  return (
    <div className="flex w-full flex-col items-center bg-white">
      <Header user={user} />
      <div className="flex w-full flex-col items-center gap-[4rem] bg-neutral-100 px-[1rem] pt-[calc(5rem+45.6px)] md:px-[3rem]">
        <div className="w-[90%] text-center text-[3rem] font-medium leading-[1.15] tracking-[-.08rem] md:text-[4rem] lg:w-2/3">
          <i>Your</i> website for rating{' '}
          <span className="text-primary">Movies</span>,{' '}
          <span className="text-primary">Books</span>, and{' '}
          <span className="text-primary">TV Shows</span>
        </div>
        <Image
          src={'/dashboard.png'}
          alt="Image of dashboard"
          width={1900}
          height={970}
          className="rounded-t-2xl border border-gray-200 shadow-2xl shadow-neutral-200"
        />
      </div>
      <div className="flex w-full flex-col items-center bg-white p-6 shadow-xl">
        <h2 className="w-4/5 pb-10 pt-20 text-[32px] leading-[110%] tracking-[-.01em] md:text-[40px] lg:text-[48px]">
          Medialog is a platform where you can rate and review{' '}
          <span className="text-primary">Movies</span>,{' '}
          <span className="text-primary">Books</span>, and{' '}
          <span className="text-primary">TV Shows</span>, all in one place
        </h2>
        <div className="grid grid-cols-2 gap-6 pt-10">
          <div className="rounded-2xl border border-neutral-200 shadow-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Page;
