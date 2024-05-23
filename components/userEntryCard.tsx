import { Book, Film, Star, Tv } from 'lucide-react';
import SmallRating from './smallRating';
import { Category } from '@prisma/client';
import { HTMLProps } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ExtendedUserEntry } from '@/app/(app)/dashboard/state';

const UserEntryCard = ({
  title,
  backgroundImage,
  category,
  releaseDate,
  rating,
  className,
  ...props
}: {
  title: string;
  backgroundImage: string;
  category: Category;
  releaseDate: Date;
  rating: number;
} & HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'relative aspect-[2/3] w-full cursor-pointer overflow-clip rounded-lg bg-cover shadow-md shadow-gray-400',
        className
      )}
      style={{ backgroundImage: `url(${backgroundImage})` }}
      {...props}
    >
      <div className="absolute top-0 flex h-[20%] w-full flex-col justify-end rounded-bl-lg rounded-br-lg bg-gradient-to-b from-slate-900/50 to-transparent"></div>
      <div className="absolute top-0 p-2">
        {(() => {
          switch (category) {
            case 'Book':
              return <Book className="size-5 stroke-white" />;
            case 'Movie':
              return <Film className="size-5 stroke-white" />;
            case 'Series':
              return <Tv className="size-5 stroke-white" />;
          }
        })()}
      </div>

      <div className="select-none text-transparent">{title}</div>
      <div className="absolute top-[40%] flex h-[60%] w-full flex-col justify-end rounded-bl-lg rounded-br-lg bg-gradient-to-t from-slate-900 to-transparent object-cover p-2">
        <div className="text-left text-sm font-semibold text-white sm:text-base">
          {title}
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm text-slate-400">
            {releaseDate.getFullYear()}
          </div>
          <div className="hidden text-white sm:block">
            <SmallRating rating={rating} />
          </div>
          <div className="flex items-center gap-1 text-white sm:hidden">
            <span className="text-sm">{rating / 20}</span>
            <Star strokeWidth={0} className="size-4 fill-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserEntryCardObject = ({
  userEntry,
  ...props
}: {
  userEntry: ExtendedUserEntry;
} & HTMLProps<HTMLDivElement>) => (
  <UserEntryCard
    {...{
      title: userEntry.entry.originalTitle,
      backgroundImage: userEntry.entry.posterPath,
      releaseDate: userEntry.entry.releaseDate,
      category: userEntry.entry.category,
      rating: userEntry.rating,
    }}
    {...props}
  />
);

export default UserEntryCard;
