"use client";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Entry, User, UserEntry, UserList } from "@/prisma/generated/browser";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { ExtendedUserEntry } from "../app/(app)/dashboard/state";
import ModifyUserEntry from "@/components/modifyUserEntry";
import { toast } from "sonner";
import { Dialog, DialogContent } from "./ui/dialog";
import ContainedModifyUserEntry from "./containedModifyUserEntry";

const ExternalUserEntry = ({
  userEntry,
  openOverride,
  setUserEntry,
}: {
  userEntry: ExtendedUserEntry;
  openOverride?:
    | [open: boolean, setOpen: Dispatch<SetStateAction<boolean>>]
    | undefined;
  setUserEntry: (userEntry: ExtendedUserEntry) => void;
}) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
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

  if (isDesktop) {
    return (
      <ContainedModifyUserEntry
        open={open}
        setOpen={setOpen}
        id={{ userEntryId: userEntry.id }}
      />
    );
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="top-[50px] mt-0 p-6">
          <ModifyUserEntry
            userEntry={userEntry}
            setOpen={setOpen}
            setUserEntry={setUserEntry}
            removeUserEntry={() => {}}
            userLists={lists}
            userListsWithEntry={listsWithEntry}
            refetchUserLists={refetchUserLists}
          />
        </DrawerContent>
      </Drawer>
    );
  }
};

export default ExternalUserEntry;
