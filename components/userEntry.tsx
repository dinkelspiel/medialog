'use client';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import UserEntryCard from '@/components/userEntryCard';
import { Entry, User, UserEntry } from '@prisma/client';
import { Dispatch, SetStateAction, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import {
  ExtendedUserEntry,
  useDashboardStore,
} from '../app/(app)/dashboard/state';
import ModifyUserEntry from '@/components/modifyUserEntry';

const UserEntryComponent = ({
  userEntry,
  openOverride,
  hideCard,
  setUserEntry,
}: {
  userEntry: UserEntry & { user: User } & { entry: Entry };
  hideCard?: boolean;
  openOverride?:
    | [open: boolean, setOpen: Dispatch<SetStateAction<boolean>>]
    | undefined;
  setUserEntry: (userEntry: ExtendedUserEntry) => void;
}) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [open, setOpen] = openOverride ?? useState(false);

  return (
    <>
      {!hideCard && (
        <UserEntryCard
          title={userEntry.entry.originalTitle}
          backgroundImage={userEntry.entry.posterPath}
          category={userEntry.entry.category}
          releaseDate={userEntry.entry.releaseDate}
          rating={userEntry.rating}
          onClick={() => setOpen(true)}
        />
      )}

      {(() => {
        if (isDesktop) {
          return (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent className="!max-w-[550px]">
                <ModifyUserEntry
                  userEntry={userEntry}
                  setOpen={setOpen}
                  setUserEntry={setUserEntry}
                />
              </SheetContent>
            </Sheet>
          );
        } else {
          return (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerContent className="top-[50px] mt-0 p-6">
                <ModifyUserEntry
                  userEntry={userEntry}
                  setOpen={setOpen}
                  setUserEntry={setUserEntry}
                />
              </DrawerContent>
            </Drawer>
          );
        }
      })()}
    </>
  );
};

export default UserEntryComponent;
