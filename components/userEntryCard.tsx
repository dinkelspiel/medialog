import { ExtendedUserEntry } from '@/app/(app)/dashboard/state';
import { cn } from '@/lib/utils';
import { Category } from '@/prisma/generated/browser';
import { Book, Film, Star, Tv } from 'lucide-react';
import Image from 'next/image';
import React, { HTMLProps, memo, ReactNode } from 'react';
import SmallRating from './smallRating';
import { getUserTitleFromEntry } from '@/server/api/routers/dashboard_';
import { Badge } from './ui/badge';

const UserEntryCard = ({
  entryTitle,
  backgroundImage,
  category,
  releaseDate,
  rating,
  className,
  customStars,
  hoverCard,
  topRight,
  variant,
  ...props
}: {
  entryTitle: ReactNode;
  backgroundImage: string;
  category: Category;
  releaseDate: Date;
  rating: number;
  customStars?: ReactNode;
  hoverCard?: ReactNode;
  topRight?: ReactNode;
  variant?: "sm" | "default"
} & HTMLProps<HTMLDivElement>) => {
  // return <img src={backgroundImage} className="aspect-2/3 w-full"></img>;

  return (
    <div
      className={cn(
        'group relative z-10 aspect-2/3 cursor-pointer overflow-clip rounded-lg bg-cover shadow-sm shadow-base-400 transition-all duration-200 hover:-translate-y-[4px] hover:scale-[101%] hover:shadow-md active:brightness-[0.8]',
        className
      )}
      {...props}
    >
      <Image
        src={backgroundImage}
        alt=""
        fill
        sizes="(max-width: 768px) 33vw, 150px"
        className="object-cover"
        loading="lazy"
      />
      <div className="absolute top-0 flex h-[20%] w-full flex-col justify-end rounded-bl-lg rounded-br-lg bg-linear-to-b from-base-900/50 to-transparent"></div>
      <div className="absolute top-0 p-2">
        {(() => {
          switch (category) {
            case 'Book':
              return (
                <Badge className="flex gap-1 border border-amber-300 bg-amber-700/50 px-1 text-xs text-amber-300">
                  <Book className="size-3 stroke-amber-300" />
                  {variant !== "sm" && "Book"}
                </Badge>
              );
            case 'Movie':
              return (
                <Badge className="flex gap-1 border border-blue-300 bg-blue-700/50 px-1 text-xs text-blue-300">
                  <Film className="size-3 stroke-blue-300" />
                  {variant !== "sm" && "Movie"}
                </Badge>
              );
            case 'Series':
              return (
                <Badge className="flex gap-1 border border-green-300 bg-green-700/50 px-1 text-xs text-green-300">
                  <Tv className="size-3 stroke-green-300" />
                  {variant !== "sm" && "Tv"}
                </Badge>
              );
          }
        })()}
      </div>
      {hoverCard && (
        <div className="duration-400 absolute right-1 top-1 z-10 -translate-y-4 rounded-sm border border-base-100 bg-white opacity-0 shadow-sm transition-all hover:bg-base-50 hover:text-base-900 group-hover:translate-y-0 group-hover:opacity-100">
          {hoverCard}
        </div>
      )}
      <div className="absolute right-0 top-0 flex p-2">{topRight}</div>

      <div className="select-none text-transparent">{entryTitle}</div>
      <div className="absolute top-[40%] hidden h-[60%] w-full flex-col justify-end rounded-bl-lg rounded-br-lg bg-linear-to-t from-base-900 to-transparent object-cover p-2 opacity-0 transition-all duration-200 group-hover:opacity-100 md:flex">
        <div className="text-left text-sm font-semibold text-white sm:text-base">
          {entryTitle}
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm text-base-400">
            {isNaN(releaseDate.getFullYear()) ? '' : releaseDate.getFullYear()}
          </div>
          {!!customStars && customStars}
          {!customStars && (
            <>
              <div className="hidden text-white sm:block">
                <SmallRating rating={rating} />
              </div>
              <div className="flex items-center gap-1 text-white sm:hidden">
                <span className="text-sm">{(rating / 20).toFixed(1)}</span>
                <Star strokeWidth={0} className="size-4 fill-primary" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const UserEntryCardObject = memo(function UserEntryCardObject({
  userEntry,
  variant,
  ...props
}: {
  userEntry: ExtendedUserEntry;
  variant?: "sm" | "default"
} & HTMLProps<HTMLDivElement>) {
  return (
    <UserEntryCard
      {...{
        entryTitle: getUserTitleFromEntry(userEntry.entry),
        backgroundImage: userEntry.entry.posterPath,
        releaseDate: userEntry.entry.releaseDate,
        category: userEntry.entry.category,
        rating: userEntry.rating,
        variant
      }}
      {...props}
    />
  );
});

export default memo(UserEntryCard);
