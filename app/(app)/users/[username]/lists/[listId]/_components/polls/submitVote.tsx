'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserListPoll } from '@/prisma/generated/browser';
import React, { useState } from 'react';
import { useListState } from '../../state';
import { getUserTitleFromEntry } from '@/server/api/routers/dashboard_';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const SubmitVote = ({
  poll,
  hasVoted,
}: {
  poll: UserListPoll;
  hasVoted: boolean;
}) => {
  const { list } = useListState();

  const [entryId, setEntryId] = useState<string | undefined>(undefined);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const submitVote = api.list.submitVote.useMutation({
    onError(error, variables, context) {
      toast.error(error.message);
    },
    onSuccess() {
      setOpen(false);
      toast.success('Submitted vote');
      router.refresh();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={'sm'}
          className="w-full"
          variant={!hasVoted ? 'default' : 'outline'}
        >
          {!hasVoted ? 'Submit my vote' : 'Recast vote'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit your vote for {poll.name}</DialogTitle>
        </DialogHeader>
        <RadioGroup value={entryId} onValueChange={e => setEntryId(e)}>
          {list?.entries.map(e => (
            <div className="flex items-center gap-2" key={e.id}>
              <RadioGroupItem
                value={e.entryId.toString()}
                id={e.entryId.toString()}
              />
              <Label htmlFor={e.entryId.toString()}>
                {getUserTitleFromEntry(e.entry)} (
                {e.entry.releaseDate.getFullYear()})
              </Label>
            </div>
          ))}
        </RadioGroup>
        <DialogFooter>
          <Button
            size={'sm'}
            disabled={!entryId}
            onClick={() => {
              if (!entryId) return;

              submitVote.mutate({
                pollId: poll.id,
                entryId: parseInt(entryId),
              });
            }}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitVote;
