import { Book, Film, Tv } from 'lucide-react';
import SmallRating from './smallRating';
import { Entry, User, UserEntry } from '@prisma/client';
import { HTMLProps } from 'react';

const UserEntryCard = ({
  userEntry,
  ...props
}: {
  userEntry: UserEntry & { user: User } & { entry: Entry };
} & HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className="relative aspect-[2/3] w-full cursor-pointer rounded-lg bg-cover shadow-md"
      style={{ backgroundImage: `url(${userEntry.entry.posterPath})` }}
      {...props}
    >
      <div className="p-2">
        {(() => {
          switch (userEntry.entry.category) {
            case 'Book':
              return <Book className="size-5 stroke-white" />;
            case 'Movie':
              return <Film className="size-5 stroke-white" />;
            case 'Series':
              return <Tv className="size-5 stroke-white" />;
          }
        })()}
      </div>
      <div className="select-none text-transparent">
        {userEntry.entry.originalTitle}
      </div>
      <div className="absolute top-[40%] flex h-[60%] w-full flex-col justify-end rounded-bl-lg rounded-br-lg bg-gradient-to-t from-slate-900 to-transparent object-cover p-2">
        <div className="text-left font-semibold text-white">
          {userEntry.entry.originalTitle}
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm text-slate-400">
            {userEntry.entry.releaseDate.getFullYear()}
          </div>
          <div className="text-white">
            <SmallRating rating={userEntry.rating} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEntryCard;
