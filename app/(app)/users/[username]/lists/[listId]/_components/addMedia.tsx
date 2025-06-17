'use client';

import { EntryRedirect } from '@/app/(app)/_components/EntryIslandContext';
import AddLog from '@/components/addLog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UserEntryCard from '@/components/userEntryCard';
import { Entry, User, UserList, UserListEntry } from '@prisma/client';
import { ChevronDown, ChevronUp, ListEnd, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const AddMedia = ({
  userList: userListDefault,
  user,
}: {
  user: {
    id: number;
    username: string;
  };
  userList: UserList & { entries: (UserListEntry & { entry: Entry })[] };
}) => {
  const [userList, setUserList] = useState(userListDefault);
  const router = useRouter();

  const addEntryToList = async (entryId: number) => {
    const response = await (
      await fetch(`/api/user/lists/${userList.id}/entries`, {
        method: 'POST',
        body: JSON.stringify({
          entryId,
        }),
      })
    ).json();

    if (response.error) {
      toast.error(`Error when adding entry to list: ${response.error}`);
    } else {
      toast.success(response.message);
      router.refresh();
    }
  };

  const moveEntry = async (entryId: number, order: number) => {
    setUserList({
      ...userList,
      entries: [
        ...userList.entries.filter(e => e.id !== entryId),
        {
          ...userList.entries.find(e => e.id === entryId)!,
          order:
            order > userList.entries.find(e => e.id === entryId)!.order
              ? order + 0.5
              : order - 0.5,
        },
      ],
    });

    const response = await (
      await fetch(`/api/user/lists/${userList.id}/entries/${entryId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          order,
        }),
      })
    ).json();

    if (response.error) {
      toast.error(`Error when moving list entry: ${response.error}`);
    } else {
      toast.success(response.message);
      router.refresh();
    }
  };

  return (
    <>
      {userList.entries
        .sort((a, b) => a.order - b.order)
        .map((e, idx) => (
          <UserEntryCard
            key={e.id}
            {...{
              entryTitle: e.entry.originalTitle,
              backgroundImage: e.entry.posterPath,
              category: e.entry.category,
              releaseDate: e.entry.releaseDate,
              rating: 0,
              topRight:
                userList.type === 'ordered' ? <Badge>{idx + 1}</Badge> : '',
              hoverCard: (
                <>
                  <Button
                    className="h-2 px-2 py-2 [&>svg]:size-3"
                    variant={'ghost'}
                    onClick={() => {
                      moveEntry(e.id, e.order - 1);
                    }}
                  >
                    <ChevronUp />
                  </Button>
                  <Button
                    className="h-2 px-2 py-2 [&>svg]:size-3"
                    variant={'ghost'}
                    onClick={() => {
                      moveEntry(e.id, e.order + 1);
                    }}
                  >
                    <ChevronDown />
                  </Button>
                  <Button
                    className="h-2 px-2 py-2 [&>svg]:size-3"
                    variant={'ghost'}
                    onClick={() => {
                      addEntryToList(e.entryId);
                    }}
                  >
                    <X />
                  </Button>
                </>
              ),
            }}
          />
        ))}
      <AddLog
        override={{
          title: `Add entry to ${userList.name}`,
          addAction: addEntryToList,
        }}
      >
        <Button
          className="flex aspect-[2/3] h-full w-full rounded-lg lg:flex"
          variant={'outline'}
        >
          <Plus className="stroke-base-600" />
          Add Media
        </Button>
      </AddLog>
    </>
  );
};

export default AddMedia;
