import { ExtendedUserEntry } from '@/app/(app)/dashboard/state';
import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import { Book, Film, Star, Tv } from 'lucide-react';
import { HTMLProps, ReactElement } from 'react';
import SmallRating from './smallRating';

const UserEntryCard = ({
  title,
  backgroundImage,
  category,
  releaseDate,
  rating,
  className,
  customStars,
  hoverCard,
  ...props
}: {
  title: string;
  backgroundImage: string;
  category: Category;
  releaseDate: Date;
  rating: number;
  customStars?: ReactElement;
  hoverCard?: ReactElement;
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
        <div className="duration-400 absolute right-1 top-1 -translate-y-4 rounded-sm border border-base-100 bg-white bg-white opacity-0 shadow-sm transition-all hover:bg-base-50 hover:text-base-900 group-hover:translate-y-0 group-hover:opacity-100">
          {hoverCard}
        </div>
      )}

      <div className="select-none text-transparent">{title}</div>
      <div className="absolute top-[40%] flex h-[60%] w-full flex-col justify-end rounded-bl-lg rounded-br-lg bg-gradient-to-t from-base-900 to-transparent object-cover p-2">
        <div className="text-left text-sm font-semibold text-white sm:text-base">
          {title}
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
      title:
        userEntry.entry.alternativeTitles.length !== 0
          ? userEntry.entry.alternativeTitles[0]!.title
          : userEntry.entry.originalTitle + 'a',
      backgroundImage: userEntry.entry.posterPath,
      releaseDate: userEntry.entry.releaseDate,
      category: userEntry.entry.category,
      rating: userEntry.rating,
    }}
    {...props}
  />
);

export default UserEntryCard;
