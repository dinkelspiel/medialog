'use client';

import React, { ReactNode, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useListState } from '../../state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { api } from '@/trpc/react';
import Error from '@/components/error';
import { toast } from 'sonner';
import ModifyTimedChallenge from './modifyPoll';
import { Pen } from 'lucide-react';
import { UserListChallengeTimed, UserListPoll } from '@/prisma/generated/client';
import ModifyPoll from './modifyPoll';

const EditPoll = ({ poll }: { poll: UserListPoll }) => {
  const [open, setOpen] = useState(false);
  const { list } = useListState();
  const [error, setError] = useState<ReactNode | undefined>(undefined);

  const editPoll = api.list.editPoll.useMutation({
    onError(error, variables, context) {
      setError(error.message);
    },
    onSuccess() {
      toast.success('Updated Poll');
      setOpen(false);
    },
  });

  const deletePoll = api.list.deletePoll.useMutation({
    onError(error, variables, context) {
      setError(error.message);
    },
    onSuccess() {
      toast.success('Deleted Poll');
      setOpen(false);
    },
  });
  if (!list) return;

  return (
    <ModifyPoll
      title={`Edit ${poll.name}`}
      submit={'Save'}
      trigger={
        <Button variant={'ghost'} size={'xs'}>
          <Pen className="stroke-base-600" />
        </Button>
      }
      open={open}
      setOpen={open => setOpen(open)}
      setError={error => setError(error)}
      error={error}
      defaults={poll}
      onSubmit={(name, from, to) => {
        editPoll.mutate({
          pollId: poll.id,
          name,
          from: from.toISOString(),
          to: to.toISOString(),
        });
      }}
      onDelete={() =>
        deletePoll.mutate({
          pollId: poll.id,
        })
      }
    />
  );
};

export default EditPoll;
