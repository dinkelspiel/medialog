import { EntryRedirect } from '@/app/(app)/_components/EntryIslandContext';
import UserEntryCard from '@/components/userEntryCard';
import React from 'react';
import { ServerEntryTitleForUser } from './serverUserEntryTitle';
import { ExtendedUserEntry } from '@/app/(app)/dashboard/state';
import { SafeUser, validateSessionToken } from '@/server/auth/validateSession';
import Link from 'next/link';
import { Entry, EntryTranslation, User, UserEntry } from '@prisma/client';

const Showcase = async ({
  title,
  profileUser,
  userEntries,
}: {
  title: string;
  profileUser: NonNullable<SafeUser>;
  userEntries: {
    rating: number;
    entry: Entry & {
      translations: EntryTranslation[];
    };
  }[];
}) => {
  const authUser = await validateSessionToken();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-between border-b border-b-base-200 pb-2 font-dm-serif text-3xl font-semibold">
        {title}
      </div>
      {userEntries.length > 0 && (
        <>
          <div className="hidden grid-cols-4 gap-3 sm:grid">
            {userEntries.slice(0, 4).map((userEntry, idx) => (
              <EntryRedirect
                key={userEntry.entry.id}
                className="hover:no-underline"
                entryId={userEntry.entry.id}
                entrySlug={userEntry.entry.slug}
              >
                <UserEntryCard
                  key={`userEntry-${idx}`}
                  {...{
                    entryTitle: (
                      <ServerEntryTitleForUser entryId={userEntry.entry.id} />
                    ),
                    backgroundImage: userEntry.entry.posterPath,
                    releaseDate: userEntry.entry.releaseDate,
                    rating: userEntry.rating,
                    category: userEntry.entry.category,
                  }}
                />
              </EntryRedirect>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 sm:hidden">
            {userEntries.slice(0, 3).map((userEntry, idx) => (
              <EntryRedirect
                key={userEntry.entry.id}
                className="hover:no-underline"
                entryId={userEntry.entry.id}
                entrySlug={userEntry.entry.slug}
              >
                <UserEntryCard
                  key={`userEntry-${idx}`}
                  {...{
                    entryTitle: (
                      <ServerEntryTitleForUser entryId={userEntry.entry.id} />
                    ),
                    backgroundImage: userEntry.entry.posterPath,
                    releaseDate: userEntry.entry.releaseDate,
                    rating: userEntry.rating,
                    category: userEntry.entry.category,
                  }}
                />
              </EntryRedirect>
            ))}
          </div>
        </>
      )}
      {userEntries.length === 0 &&
        (authUser !== undefined &&
        profileUser.id === (authUser ? authUser.id : -1) ? (
          <div className="text-lg">
            Rate your favorites{' '}
            <Link href="/dashboard">
              <span className="font-semibold">here</span>
            </Link>
          </div>
        ) : (
          <div className="text-lg">No favorites found</div>
        ))}
    </div>
  );
};

export default Showcase;
