import SmallRating from '@/components/smallRating';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Entry, User, UserEntry } from '@prisma/client';
import React from 'react';

const UserEntryComponent = ({
  userEntry,
}: {
  userEntry: UserEntry & { user: User } & { entry: Entry };
}) => {
  return (
    <div
      className="w-full aspect-[2/3] rounded-lg bg-cover shadow-md relative cursor-pointer"
      style={{ backgroundImage: `url(${userEntry.entry.posterPath})` }}
    >
      <div className="text-transparent">{userEntry.entry.originalTitle}</div>
      <div className="absolute top-[40%] h-[60%] w-full rounded-bl-lg rounded-br-lg flex flex-col justify-end bg-gradient-to-t from-slate-900 to-transparent object-cover p-2">
        <div className="text-white font-semibold">
          {userEntry.entry.originalTitle}
        </div>
        <div className="flex flex-row justify-between items-center">
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

export default UserEntryComponent;
