'use client';

import { useAuthUser } from '@/app/(app)/_components/AuthUserContext';
import { cn } from '@/lib/utils';
import { UserList } from '@/prisma/generated/browser';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { Check, ExternalLink, Plus } from 'lucide-react';
import React, { ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Command, CommandGroup, CommandItem } from './ui/command';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AddToList = ({
  entryId,
  userLists,
  userListsWithEntry,
  onSuccess,
  children,
}: {
  entryId: number;
  userLists: UserList[];
  userListsWithEntry: UserList[];
  onSuccess?: () => Promise<void>;
  children: ReactNode;
}) => {
  const authUser = useAuthUser();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const createNewList = async () => {
    const response = await (
      await fetch(`/api/user/lists`, {
        method: 'POST',
        body: JSON.stringify({
          initialEntryId: entryId,
        }),
      })
    ).json();

    if (response.error) {
      toast.error(`Error when creating list: ${response.error}`);
    } else if (onSuccess) {
      onSuccess().then(() => toast.success(response.message));
    } else {
      router.refresh();
      toast.success(response.message);
    }
  };

  const addEntryToList = async (userList: UserList) => {
    const response = await (
      await fetch(`/api/user/lists/${userList.id}/entries`, {
        method: 'POST',
        body: JSON.stringify({
          entryId: entryId,
        }),
      })
    ).json();

    if (response.error) {
      toast.error(`Error when adding entry to list: ${response.error}`);
    } else if (onSuccess) {
      onSuccess().then(() => {
        setOpen(false);
        toast.success(response.message);
      });
    } else {
      router.refresh();
      setOpen(false);
      toast.success(response.message);
    }
  };
  if (!authUser) return;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <div className="border-b p-1">
            <Button
              variant={'ghost'}
              size={'sm'}
              className="w-full"
              onClick={() => {
                setOpen(false);
                createNewList();
              }}
            >
              <Plus /> New list
            </Button>
          </div>
          {userLists.length !== 0 && (
            <CommandGroup>
              {userLists.map(list => (
                <div className="flex justify-between gap-1" key={list.id}>
                  <CommandItem
                    key={list.id}
                    value={list.name}
                    onSelect={() => {
                      addEntryToList(list);
                    }}
                    className="w-full"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        userListsWithEntry.find(e => e.id === list.id) !==
                          undefined
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {list.name}
                  </CommandItem>
                  <Button variant={'ghost'} className="w-10">
                    <Link href={`/@${authUser.username}/lists/${list.id}`}>
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AddToList;
