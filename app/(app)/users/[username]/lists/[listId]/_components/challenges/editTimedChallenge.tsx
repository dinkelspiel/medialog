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
import ModifyTimedChallenge from './modifyTimedChallenge';
import { Pen } from 'lucide-react';
import { UserListChallengeTimed } from '@prisma/client';

const EditTimedChallenge = ({
  challenge,
}: {
  challenge: UserListChallengeTimed;
}) => {
  const [open, setOpen] = useState(false);
  const { list } = useListState();
  const [error, setError] = useState<ReactNode | undefined>(undefined);

  const editChallengeTimed = api.list.editChallengeTimed.useMutation({
    onError(error, variables, context) {
      setError(error.message);
    },
    onSuccess() {
      toast.success('Updated Timed Challenge');
      setOpen(false);
    },
  });
  if (!list) return;

  return (
    <ModifyTimedChallenge
      title={`Edit ${challenge.name}`}
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
      defaults={challenge}
      onSubmit={(name, from, to) => {
        editChallengeTimed.mutate({
          challengeId: challenge.id,
          name,
          from: from.toISOString(),
          to: to.toISOString(),
        });
      }}
    />
  );
};

export default EditTimedChallenge;
