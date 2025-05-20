'use client';

import React, { useState } from 'react';
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

const CreateTimedChallenge = () => {
  const { createTimedChallengeOpen, setCreateTimedChallengeOpen } =
    useListState();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <Dialog
      open={createTimedChallengeOpen}
      onOpenChange={setCreateTimedChallengeOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Timed Challenge</DialogTitle>
          <div className="grid gap-3 py-3">
            <div className="grid gap-1.5">
              <Label>Name</Label>
              <Input required />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>Start date</Label>
                <DateTimePicker date={startDate} setDate={setStartDate} />
              </div>
              <div className="grid gap-1.5">
                <Label>End date</Label>
                <DateTimePicker date={endDate} setDate={setEndDate} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm">Create</Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTimedChallenge;
