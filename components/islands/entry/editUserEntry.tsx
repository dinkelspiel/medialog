'use client';

import { useAuthUser } from '@/app/(app)/_components/AuthUserContext';
import ModifyUserEntry from '@/components/modifyUserEntry';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { capitalizeFirst } from '@/lib/capitalizeFirst';
import { AppRouter } from '@/server/api/root';
import { api } from '@/trpc/react';
import { UserEntry } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const EditUserEntry = ({
  entryPage,
  host,
}: {
  host: 'client' | 'server';
  entryPage: inferRouterOutputs<AppRouter>['entries']['getEntryPage'];
}) => {
  const utils = api.useUtils();
  const authUser = useAuthUser();
  const router = useRouter();
  if (!authUser) return;
  const [open, setOpen] = useState(false);
  const [userEntry, setUserEntry] = useState<UserEntry | null>(null);

  useEffect(() => {
    setUserEntry(entryPage.userEntry);
  }, [entryPage.userEntry]);

  const addUserEntry = api.userEntry.create.useMutation({
    onSuccess(data) {
      toast.success(data.message);
      if (host === 'server') {
        router.refresh();
        return;
      }

      utils.entries.getEntryPage.invalidate();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  if (!userEntry) {
    return (
      <Button
        size="sm"
        className="w-full"
        variant={'outline'}
        onClick={() => {
          addUserEntry.mutate({ entryId: entryPage.entry.id });
        }}
      >
        Add to Watchlist
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full" variant={'outline'}>
          {capitalizeFirst(userEntry.status)}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-full w-full max-w-[800px] min-[600px]:h-[600px] min-[800px]:w-[800px]">
        <ModifyUserEntry
          userEntry={{
            ...userEntry,
            entry: entryPage.entry,
            user: authUser,
          }}
          setOpen={setOpen}
          setUserEntry={setUserEntry}
          removeUserEntry={async () => {
            if (host === 'server') {
              router.refresh();
              return;
            }
            utils.entries.getEntryPage.invalidate();
          }}
          userLists={entryPage.userListsByUser}
          userListsWithEntry={entryPage.userListsWithEntryByUser}
          refetchUserLists={async () => {
            if (host === 'server') {
              router.refresh();
              return;
            }
            utils.entries.getEntryPage.invalidate();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserEntry;
