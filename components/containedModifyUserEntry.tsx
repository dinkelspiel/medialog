import React, { ReactNode, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import ModifyUserEntry from './modifyUserEntry';
import { api, RouterOutputs } from '@/trpc/react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ContainedModifyUserEntry = ({
  children,
  id,
  open: controlledOpen,
  setOpen: controlledSetOpen,
}: {
  children?: ReactNode;
  id: { userEntryId: number } | { entryId: number };
  open?: boolean;
  setOpen?: (value: boolean) => void;
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const router = useRouter();

  const isControlled =
    controlledOpen !== undefined && controlledSetOpen !== undefined;

  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? controlledSetOpen : setUncontrolledOpen;

  const utils = api.useUtils();
  const userEntryQuery = api.userEntry.get.useQuery(
    {
      id,
    },
    {
      enabled: open,
    }
  );
  const [userEntry, setUserEntry] = useState<
    RouterOutputs['userEntry']['get'] | null
  >(null);
  useEffect(() => {
    setUserEntry(userEntryQuery.data ? userEntryQuery.data : null);
  }, [userEntryQuery.data]);

  const entryId =
    !!id && 'entryId' in id ? id.entryId : userEntryQuery.data?.entryId;

  const userLists = api.userList.getListsByUser.useQuery();
  const userListsWithEntry = api.userList.getListsWithEntryByUser.useQuery(
    {
      entryId: entryId ?? 0,
    },
    {
      enabled: !!entryId && open,
    }
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="h-full w-full max-w-[800px] min-[600px]:h-[600px] min-[800px]:w-[800px]">
        {(userEntryQuery.isPending ||
          userLists.isPending ||
          userListsWithEntry.isPending) && <Loader2 className="animate-spin" />}

        {userEntry && userLists.data && userListsWithEntry.data && (
          <ModifyUserEntry
            userEntry={userEntry}
            setOpen={setOpen}
            setUserEntry={userEntry => setUserEntry(userEntry)}
            removeUserEntry={async () => {
              utils.entries.getEntryPage.invalidate();
              utils.entries.search.invalidate();
              utils.dashboard.invalidate();
              router.refresh();
            }}
            userLists={userLists.data}
            userListsWithEntry={userListsWithEntry.data}
            refetchUserLists={async () => {
              utils.userList.getListsByUser.invalidate();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContainedModifyUserEntry;
