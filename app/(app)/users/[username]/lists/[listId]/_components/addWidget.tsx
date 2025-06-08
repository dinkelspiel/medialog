'use client';

import { Button } from '@/components/ui/button';
import { Clock, Plus, Vote } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CreateTimedChallenge from './challenges/createTimedChallenge';
import { StateList, useListState } from '../state';
import { UserList, UserListEntry } from '@prisma/client';
import { useEffect } from 'react';
import CreatePoll from './polls/createPoll';

const AddWidget = ({ list }: { list: StateList }) => {
  const { setCreateTimedChallengeOpen, setCreatePollOpen, setList } =
    useListState();

  useEffect(() => {
    setList(list);
  }, [list]);

  return (
    <>
      <CreateTimedChallenge />
      <CreatePoll />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'outline'} size={'sm'} className="w-full">
            <Plus className="stroke-base-600" />
            Add Widget
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-[1330px]:w-[206px]">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Challanges</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setCreateTimedChallengeOpen(true);
              }}
            >
              <Clock className="size-4 stroke-base-600" /> Timed Challenge
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setCreatePollOpen(true);
              }}
            >
              <Vote className="size-4 stroke-base-600" /> Vote
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default AddWidget;
