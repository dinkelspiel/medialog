'use client';

import React, { Dispatch, SetStateAction, ReactNode, useState } from 'react';
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
import { UserListChallengeTimed, UserListPoll } from '@/prisma/generated/browser';

const ModifyPoll = ({
  open,
  setOpen,
  onSubmit,
  onDelete,
  error,
  setError,
  trigger,
  defaults,
  title,
  submit,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (name: string, from: Date, to: Date) => void;
  onDelete?: () => void;
  setError: (open: ReactNode | undefined) => void;
  error: ReactNode | undefined;
  trigger?: ReactNode;
  defaults?: UserListPoll;
  title: string;
  submit: string;
}) => {
  const { list } = useListState();

  const [name, setName] = useState(defaults ? defaults.name : '');
  const [from, setFrom] = useState<Date | null>(
    defaults ? defaults.from : null
  );
  const [to, setTo] = useState<Date | null>(defaults ? defaults.to : null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={e => {
            e.preventDefault();

            if (!list) return;

            if (!from || !to) {
              setError('From and To are required');
              return;
            }

            onSubmit(name, from, to);
          }}
        >
          <div className="grid gap-3 py-3">
            <div className="grid gap-1.5">
              <Label>Name</Label>
              <Input
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>From</Label>
                <DateTimePicker date={from} setDate={setFrom} />
              </div>
              <div className="grid gap-1.5">
                <Label>To</Label>
                <DateTimePicker date={to} setDate={setTo} />
              </div>
            </div>
          </div>

          {error && <Error title={error}></Error>}

          <DialogFooter>
            {defaults && (
              <Button
                onClick={() => (onDelete ? onDelete() : {})}
                variant={'destructive'}
                type="button"
                size="sm"
              >
                Delete
              </Button>
            )}
            <Button type="submit" size="sm">
              {submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyPoll;
