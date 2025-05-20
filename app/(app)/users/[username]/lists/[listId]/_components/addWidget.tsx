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
import CreateTimedChallenge from './challenges/timedChallenge';
import { useListState } from '../state';

const AddWidget = () => {
  const { setCreateTimedChallengeOpen } = useListState();

  return (
    <>
      <CreateTimedChallenge />
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
            <DropdownMenuItem>
              <Vote className="size-4 stroke-base-600" /> Vote
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default AddWidget;
