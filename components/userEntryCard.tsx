import { ExtendedUserEntry } from '@/app/(app)/dashboard/state';
import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import { Book, Film, Star, Tv } from 'lucide-react';
import { HTMLProps, ReactElement, ReactNode } from 'react';
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
} & HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'group relative aspect-[2/3] w-full cursor-pointer overflow-clip rounded-lg bg-cover shadow-md shadow-base-300',
        className
      )}
      style={{ backgroundImage: `url(${backgroundImage})` }}
      {...props}
    >
      <div className="absolute top-0 flex h-[20%] w-full flex-col justify-end rounded-bl-lg rounded-br-lg bg-opacity-50 bg-gradient-to-b from-base-900 to-transparent"></div>
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
      {hoverCard && (
        <div className="duration-400 absolute right-1 top-1 z-10 -translate-y-4 rounded-sm border border-base-100 bg-white opacity-0 shadow-sm transition-all hover:bg-base-50 hover:text-base-900 group-hover:translate-y-0 group-hover:opacity-100">
          {hoverCard}
        </div>
      )}
      <div className="absolute -top-1 right-0 p-2">{topRight}</div>

      <div className="select-none text-transparent">{entryTitle}</div>
      <div className="absolute top-[40%] flex h-[60%] w-full flex-col justify-end rounded-bl-lg rounded-br-lg bg-gradient-to-t from-base-900 to-transparent object-cover p-2">
        <div className="text-left text-sm font-semibold text-white sm:text-base">
          {entryTitle}
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm text-base-400">
            {releaseDate.getFullYear()}
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

export const UserEntryCardObject = ({
  userEntry,
  ...props
}: {
  userEntry: ExtendedUserEntry;
} & HTMLProps<HTMLDivElement>) => (
  <UserEntryCard
    {...{
      entryTitle: getUserTitleFromEntry(userEntry.entry),
      backgroundImage: userEntry.entry.posterPath,
      releaseDate: userEntry.entry.releaseDate,
      category: userEntry.entry.category,
      rating: userEntry.rating,
    }}
    {...props}
  />
);

export default UserEntryCard;
