import Logo from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { validateSessionToken } from '@/server/auth/validateSession';
import { ChevronRight, Menu } from 'lucide-react';
import Link from 'next/link';
import Header from './header';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UserEntryCard, { UserEntryCardObject } from '@/components/userEntryCard';
import prisma from '@/server/db';
import { Entry, EntryAlternativeTitle } from '@/prisma/generated/browser';
import { ExtendedUserEntry } from '../(app)/dashboard/state';

const Page = async () => {
  const authUser = await validateSessionToken();

  const getEnglishTitles = async (entryId: number) => {
    return await prisma.entryTranslation.findMany({
      where: {
        entryId: parseInt(entryId.toString()),
        language: {
          iso_639_1: 'en',
        },
      },
    });
  };

  const randomMovie = (
    (await prisma.$queryRawUnsafe(
      `SELECT * FROM Entry WHERE category = "Movie" ORDER BY RAND() LIMIT 1;`
    )) as Entry[]
  )[0] as Entry | undefined;

  const movieTitles = randomMovie ? await getEnglishTitles(randomMovie.id) : [];

  const randomSeries = (
    (await prisma.$queryRawUnsafe(
      `SELECT * FROM Entry WHERE category = "Series" ORDER BY RAND() LIMIT 1;`
    )) as Entry[]
  )[0] as Entry | undefined;

  const seriesTitles = randomSeries ? await getEnglishTitles(randomSeries.id) : [];

  const randomBook = (
    (await prisma.$queryRawUnsafe(
      `SELECT * FROM Entry WHERE category = "Book" ORDER BY RAND() LIMIT 1;`
    )) as Entry[]
  )[0] as Entry | undefined;
  const bookTitles = randomBook ? await getEnglishTitles(randomBook.id) : [];

  return (
    <div className="flex w-full flex-col items-center bg-white">
      <Header />
      <div className="flex w-full flex-col items-center gap-16 bg-base-100 px-4 pt-[calc(5rem+45.6px)] md:px-12">
        <div className="flex w-[90%] max-w-[1071px] flex-col items-center gap-12 py-24 text-center lg:w-2/3">
          <div className="text-[3rem] font-medium leading-[1.15] tracking-[-.08rem] md:text-[4rem]">
            <i>Your</i> website for rating{' '}
            <span className="text-primary">Movies</span>,{' '}
            <span className="text-primary">Books</span>, and{' '}
            <span className="text-primary">TV Shows</span>
          </div>
          <Link href={authUser ? '/dashboard' : '/auth/login'}>
            <Button size={'lg'} className="w-max">
              {authUser ? 'Go to app' : 'Get started'} <ChevronRight />
            </Button>
          </Link>
        </div>
        <Image
          src={'/dashboard.png'}
          alt="Image of dashboard"
          width={2542}
          height={1439}
          className="w-full max-w-[1607px] rounded-t-2xl border border-base-200 shadow-2xl shadow-base-200"
        />
      </div>
      <div className="flex w-full flex-col items-center bg-white p-4 shadow-xl lg:p-6">
        <h2 className="w-full pb-10 pt-20 text-[32px] leading-[110%] tracking-[-.01em] md:text-[40px] lg:w-4/6 lg:text-[48px]">
          Medialog is a platform where you can rate and review{' '}
          <span className="text-primary">Movies</span>,{' '}
          <span className="text-primary">Books</span>, and{' '}
          <span className="text-primary">TV Shows</span>, all in one place
        </h2>
        <div className="grid w-full grid-cols-1 gap-6 pt-10 lg:w-4/6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Rate all your media in one place</CardTitle>
              <CardDescription className="w-1/2">
                No need to split up your book clubs and movie nights over
                multiple sites! Everything can be done right here.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3 lg:gap-6">
              {randomMovie && (
                <UserEntryCardObject
                  userEntry={
                    {
                      entry: {
                        ...randomMovie,
                        translations: movieTitles,
                      },
                    } as ExtendedUserEntry
                  }
                />
              )}
              {randomBook && (
                <UserEntryCardObject
                  userEntry={
                    {
                      entry: {
                        ...randomBook,
                        translations: bookTitles,
                      },
                    } as ExtendedUserEntry
                  }
                />
              )}
              {randomSeries && (
                <UserEntryCardObject
                  userEntry={
                    {
                      entry: {
                        ...randomSeries,
                        translations: seriesTitles,
                      },
                    } as ExtendedUserEntry
                  }
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Keep all your entries in orderly lists</CardTitle>
              <CardDescription className="w-1/2">
                Create unlimited lists to house and organize all your favorite
                media.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-6"></CardContent>
          </Card>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 gap-16 bg-base-100 px-4 pb-16 pt-8 md:grid-cols-2 md:px-12">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-3 text-3xl font-bold tracking-tighter">
            <Logo /> Medialog
          </div>
          <div className="text-sm font-normal text-base-400">
            © 2024. All rights reserved.
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-start gap-x-4 gap-y-12 md:justify-end">
          <div className="flex w-[160px] flex-col gap-2">
            <div className="text-xs uppercase text-primary">DEVELOPER</div>
            <div>
              <Link
                className="text-base-800 hover:opacity-80 "
                href={'https://github.com/dinkelspiel/medialog'}
              >
                GitHub
              </Link>
            </div>
          </div>
          <div className="flex w-[160px] flex-col gap-2">
            <div className="text-xs uppercase text-primary">LEGAL</div>
            <div>
              <a
                href="mailto:mail@keii.dev"
                className="text-base-800 hover:opacity-80 "
              >
                Mail me {'(mail@keii.dev)'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
