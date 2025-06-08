'use client';

import { api } from '@/trpc/react';
import { ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { useListState } from '../../state';
import ModifyPoll from './modifyPoll';

const CreatePoll = () => {
  const { createPollOpen, setCreatePollOpen, list } = useListState();
  const [error, setError] = useState<ReactNode | undefined>(undefined);

  const createPoll = api.list.createPoll.useMutation({
    onError(error, variables, context) {
      setError(error.message);
    },
    onSuccess() {
      toast.success('Created Poll');
      setCreatePollOpen(false);
    },
  });
  if (!list) return;

  return (
    <ModifyPoll
      title={'Add Poll'}
      submit={'Create'}
      open={createPollOpen}
      setOpen={open => setCreatePollOpen(open)}
      setError={error => setError(error)}
      error={error}
      onSubmit={(name, from, to) => {
        createPoll.mutate({
          listId: list.id,
          name,
          from: from.toISOString(),
          to: to.toISOString(),
        });
      }}
    />
  );
};

export default CreatePoll;
