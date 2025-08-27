import StyleHeader from '@/components/styleHeader';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import prisma from '@/server/db';
import { User } from '@prisma/client';
import React from 'react';

const colors = [
  ['bg-red-500', 'text-red-500'],
  ['bg-orange-500', 'text-orange-500'],
  ['bg-lime-500', 'text-lime-500'],
  ['bg-emerald-500', 'text-emerald-500'],
  ['bg-cyan-500', 'text-cyan-500'],
  ['bg-blue-500', 'text-blue-500'],
  ['bg-violet-500', 'text-violet-500'],
  ['bg-fuchsia-500', 'text-fuchsia-500'],
];

const Top = ({
  results,
  show,
}: {
  results: { genre: string | undefined; count: number }[];
  show: number;
}) => {
  return results.slice(0, show).map((result, idx) => (
    <div key={result.genre} className="flex w-fit flex-col items-center gap-1">
      <div
        className={cn(
          'w-fit rounded-md px-4 py-1 text-white',
          colors[idx % colors.length]![0]
        )}
      >
        {result.genre}
      </div>
      <div className="text-sm">
        <span className={cn(colors[idx % colors.length]![1])}>
          {result.count}
        </span>{' '}
        <span className="text-base-500">Entries</span>
      </div>
    </div>
  ));
};

const GenreOverview = async ({ profileUser }: { profileUser: User }) => {
  const topGenres = await prisma.entryGenre.groupBy({
    by: ['genreId'],
    where: {
      entry: {
        userEntries: {
          some: {
            userId: profileUser.id,
            status: 'completed',
          },
        },
      },
    },
    _count: {
      genreId: true,
    },
    orderBy: {
      _count: {
        genreId: 'desc',
      },
    },
  });

  const results = await Promise.all(
    topGenres.map(async genreGroup => {
      const genre = await prisma.genre.findUnique({
        where: { id: genreGroup.genreId },
      });

      return {
        genre: genre?.name,
        count: genreGroup._count.genreId,
      };
    })
  );

  const totalEntries = results.reduce((sum, genre) => sum + genre.count, 0);

  return (
    <div className="flex flex-col items-center gap-4 lg:items-start">
      <StyleHeader>Genre Overview</StyleHeader>
      <div className="flex w-full flex-col items-end justify-between gap-2 2xl:w-[250px]">
        <div className="flex w-full flex-wrap gap-4 xl:hidden">
          <Top show={5} results={results} />
        </div>
        <div className="hidden w-full flex-wrap gap-2 xl:flex">
          <Top show={3} results={results} />
        </div>

        <div className="flex h-4 w-full overflow-clip rounded-md shadow-sm">
          {results.map((result, idx) => (
            <Tooltip key={result.genre}>
              <TooltipTrigger asChild>
                <div
                  className={cn('h-4', colors[idx % colors.length]![0])}
                  style={{ width: `${(result.count / totalEntries) * 100}%` }}
                ></div>
              </TooltipTrigger>
              <TooltipContent>
                {result.genre} ({result.count})
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenreOverview;
