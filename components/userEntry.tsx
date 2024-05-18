'use client';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import UserEntryCard from '@/components/userEntryCard';
import {
  Entry,
  User,
  UserEntry,
  UserList,
  UserListEntry,
} from '@prisma/client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import {
  ExtendedUserEntry,
  useDashboardStore,
} from '../app/(app)/dashboard/state';
import ModifyUserEntry from '@/components/modifyUserEntry';
import { toast } from 'sonner';

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

  const [lists, setLists] = useState<UserList[]>([]);
  const [listsWithEntry, setListsWithEntry] = useState<UserList[]>([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    refetchUserLists();
  }, [open]);

  const refetchUserLists = async () => {
    const entryListsResponse = await (
      await fetch(`/api/user/entries/${userEntry.id}/lists`)
    ).json();
    const listsResponse = await (await fetch(`/api/user/lists`)).json();

    if (entryListsResponse.error) {
      toast.error(
        `Error fetching entry userLists: ${entryListsResponse.error}`
      );
    } else {
      setListsWithEntry(entryListsResponse);
    }

    if (listsResponse.error) {
      toast.error(`Error fetching userLists: ${listsResponse.error}`);
    } else {
      setLists(listsResponse);
    }
  };

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
                  userLists={lists}
                  userListsWithEntry={listsWithEntry}
                  refetchUserLists={refetchUserLists}
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
                  userLists={lists}
                  userListsWithEntry={listsWithEntry}
                  refetchUserLists={refetchUserLists}
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
