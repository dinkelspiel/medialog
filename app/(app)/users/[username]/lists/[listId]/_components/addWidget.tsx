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
import { useListState } from '../state';
import { UserList } from '@prisma/client';
import { useEffect } from 'react';

const AddWidget = ({ list }: { list: UserList }) => {
  const { setCreateTimedChallengeOpen, setList } = useListState();

  useEffect(() => {
    setList(list);
  }, [list]);

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
