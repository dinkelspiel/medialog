'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { capitalizeFirst } from '@/lib/capitalizeFirst';
import { api } from '@/trpc/react';
import { UserList, UserListType } from '@prisma/client';
import { List, ListOrdered, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

const SettingsView = ({
  list,
}: {
  list: UserList;
  user: { id: number; username: string };
}) => {
  const [selectedType, setSelectedType] = useState<UserListType>(list.type);
  const router = useRouter();
  const setType = api.list.setType.useMutation({
    onSuccess: () => {
      toast.success(`Set type to ${selectedType}`);
      router.refresh();
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="aspect-square w-9 px-0"
          variant={'outline'}
          size={'sm'}
        >
          <Settings className="stroke-base-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4 p-4">
        <DialogHeader className="sr-only">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Label>Appearance</Label>
        <Card>
          <CardContent className="divide-y divide-base-100 p-0 pe-2 ps-4">
            <div className="flex items-center justify-between py-2">
              <div className="whitespace-nowrap text-sm font-medium text-base-600">
                Type
              </div>
              <div className="w-fit">
                <Select
                  value={selectedType}
                  onValueChange={type => {
                    setSelectedType(type as UserListType);
                    setType.mutate({ type, listId: list.id });
                  }}
                >
                  <SelectTrigger className="min-w-[8rem]">
                    {capitalizeFirst(selectedType)}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value={'unordered'}
                      className="cursor-pointer hover:bg-base-400"
                    >
                      <div className="flex items-center gap-2">
                        <List className="size-3 stroke-base-600" /> Unordered
                      </div>
                    </SelectItem>
                    <SelectItem
                      value={'ordered'}
                      className="cursor-pointer hover:bg-base-400"
                    >
                      <div className="flex items-center gap-2">
                        <ListOrdered className="size-3 stroke-base-600" />{' '}
                        Ordered
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsView;
