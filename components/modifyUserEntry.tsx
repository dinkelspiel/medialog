'use client';
import { ExtendedUserEntry } from '@/app/(app)/dashboard/state';
import SubmitButton from '@/components/submitButton';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { removeUserEntry, saveUserEntry } from '@/server/user/entries';
import {
  Entry,
  User,
  UserEntry,
  UserEntryStatus,
  UserList,
} from '@prisma/client';
import {
  Bookmark,
  Check,
  ExternalLink,
  Eye,
  Pause,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';
import { Badge } from './ui/badge';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from './ui/dialog';

const ModifyUserEntry = ({
  userEntry,
  userLists,
  userListsWithEntry,
  refetchUserLists,
  setOpen,
  setUserEntry,
  removeUserEntry: removeUserEntryClient,
}: {
  userEntry: UserEntry & { user: User } & { entry: Entry };
  userLists: UserList[];
  userListsWithEntry: UserList[];
  refetchUserLists: () => Promise<void>;
  setOpen: (value: boolean) => void;
  setUserEntry: (userEntry: ExtendedUserEntry) => void;
  removeUserEntry: (userEntry: ExtendedUserEntry) => void;
}) => {
  const [rating, setRating] = useState(userEntry.rating);
  const [notes, setNotes] = useState(userEntry.notes);

  const [saveUserEntryState, saveUserEntryAction] = useFormState(
    saveUserEntry,
    {}
  );
  const [removeUserEntryState, removeUserEntryAction] = useFormState(
    removeUserEntry,
    {}
  );

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [addListsOpen, setAddListsOpen] = useState(false);

  const [removeUserEntryOpen, setRemoveUserEntryOpen] = useState(false);

  useEffect(() => {
    setNotes(userEntry.notes);
    setRating(userEntry.rating);
  }, [userEntry]);

  useEffect(() => {
    if (saveUserEntryState.message) {
      setUserEntry({ ...userEntry, notes, rating });
      toast.success(saveUserEntryState.message);
    }

    if (saveUserEntryState.error) {
      toast.error(saveUserEntryState.error);
    }
  }, [saveUserEntryState]);

  useEffect(() => {
    if (removeUserEntryState.message) {
      removeUserEntryClient(userEntry);
      setOpen(false);
      toast.success(removeUserEntryState.message);
    }

    if (removeUserEntryState.error) {
      toast.error(removeUserEntryState.error);
    }
  }, [removeUserEntryState]);

  const updateStatus = async (status: UserEntryStatus) => {
    setUserEntry({
      ...userEntry,
      watchedAt: status === 'completed' ? new Date() : null,
      status,
    });
    const response = await (
      await fetch(`/api/user/entries/${userEntry.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
        }),
      })
    ).json();

    if (response.error) {
      toast.error(response.error);
    } else if (response.message) {
      toast.success(response.message);
      setUserEntry({
        ...response.userEntry,
        entry: {
          ...response.userEntry.entry,
          releaseDate: new Date(response.userEntry.entry.releaseDate),
        },
      });
    }
  };

  const updateProgress = async (progress: number) => {
    setUserEntry({
      ...userEntry,
      watchedAt: progress >= userEntry.entry.length ? new Date() : null,
      status:
        progress >= userEntry.entry.length ? 'completed' : userEntry.status,
      progress,
    });
    const response = await (
      await fetch(`/api/user/entries/${userEntry.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          progress,
        }),
      })
    ).json();

    if (response.error) {
      toast.error(response.error);
    } else if (response.message) {
      setUserEntry({
        ...response.userEntry,
        entry: {
          ...response.userEntry.entry,
          releaseDate: new Date(response.userEntry.entry.releaseDate),
        },
      });
    }
  };

  const createNewList = async () => {
    const response = await (
      await fetch(`/api/user/lists`, {
        method: 'POST',
        body: JSON.stringify({
          initialEntryId: userEntry.entryId,
        }),
      })
    ).json();

    if (response.error) {
      toast.error(`Error when creating list: ${response.error}`);
    } else {
      refetchUserLists().then(() => toast.success(response.message));
    }
  };

  const addEntryToList = async (userList: UserList) => {
    const response = await (
      await fetch(`/api/user/lists/${userList.id}/entries`, {
        method: 'POST',
        body: JSON.stringify({
          entryId: userEntry.entryId,
        }),
      })
    ).json();

    if (response.error) {
      toast.error(`Error when adding entry to list: ${response.error}`);
    } else {
      refetchUserLists().then(() => {
        setAddListsOpen(false);
        toast.success(response.message);
      });
    }
  };

  const Header = () => (
    <div className="grid w-full grid-cols-[max-content,1fr] gap-4 pb-4 pt-4 lg:pt-0">
      <img
        src={userEntry.entry.posterPath}
        className="aspect-[2/3] w-[100px] rounded-lg shadow-md"
      />
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <div className="text-lg font-semibold tracking-tight lg:pt-0">
            {userEntry.entry.originalTitle}
          </div>
          <div className="pb-[2px] text-sm text-muted-foreground">
            {userEntry.entry.releaseDate.getFullYear()}
          </div>
        </div>
        {userEntry.entry.tagline && (
          <div className="text-sm font-normal italic text-muted-foreground">
            "{userEntry.entry.tagline}"
          </div>
        )}
        <div className="break-all text-sm font-normal">
          {userEntry.entry.overview.slice(0, isDesktop ? 190 : 150) +
            (userEntry.entry.overview.length > (isDesktop ? 190 : 150)
              ? '...'
              : '')}
        </div>
      </div>
    </div>
  );

  const Footer = ({ children }: { children?: ReactNode }) => (
    <div className="flex items-center justify-between">
      <Dialog open={removeUserEntryOpen} onOpenChange={setRemoveUserEntryOpen}>
        <DialogTrigger asChild>
          <Button variant={'ghost'} className="[&>svg]:size-4">
            <Trash2 className="stroke-red-500" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            Are you sure you want to remove this review?
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={'outline'}
              onClick={() => setRemoveUserEntryOpen(false)}
            >
              No
            </Button>
            <form action={removeUserEntryAction}>
              <input type="hidden" value={userEntry.id} name="userEntryId" />
              <SubmitButton size={'default'}>Yes</SubmitButton>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex gap-4">
        <Popover open={addListsOpen} onOpenChange={setAddListsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={addListsOpen}
            >
              <Plus className="size-3" /> Add to list
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <div className="border-b p-1">
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  className="w-full"
                  onClick={() => {
                    setAddListsOpen(false);
                    createNewList();
                  }}
                >
                  <Plus /> New list
                </Button>
              </div>
              {userLists.length !== 0 && (
                <CommandGroup>
                  {userLists.map(list => (
                    <div className="flex justify-between gap-1" key={list.id}>
                      <CommandItem
                        key={list.id}
                        value={list.name}
                        onSelect={() => {
                          addEntryToList(list);
                        }}
                        className="w-full"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            userListsWithEntry.find(e => e.id === list.id) !==
                              undefined
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {list.name}
                      </CommandItem>
                      <Button variant={'ghost'} className="w-10">
                        <Link
                          href={`/@${userEntry.user.username}/lists/${list.id}`}
                        >
                          <ExternalLink className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </CommandGroup>
              )}
            </Command>
          </PopoverContent>
        </Popover>
        {children}
      </div>
    </div>
  );

  if (userEntry.watchedAt !== null) {
    return (
      <div className="grid h-full grow grid-rows-[max-content,max-content,1fr,max-content]">
        <Header />
        <div className="flex flex-row items-center gap-3 border-b border-b-gray-200 py-3 text-sm">
          <div className="w-max text-muted-foreground">Rating</div>
          <Badge className="min-w-[50px] max-w-[50px] justify-center">
            {rating / 20}
          </Badge>
          <div className="w-full">
            <Slider
              value={[rating]}
              onValueChange={e => setRating(Number(e[0]))}
              className="w-full"
              name="rating"
              step={1}
              min={0}
              max={100}
            />
          </div>
        </div>
        <div className="flex h-full flex-row items-center gap-2 py-3 text-sm">
          <Textarea
            className="h-full resize-none border-none p-0 shadow-none focus-visible:ring-0"
            placeholder="Write your review"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            name="notes"
          />
        </div>
        <Footer>
          <form action={saveUserEntryAction}>
            <input type="hidden" value={userEntry.id} name="userEntryId" />
            <input type="hidden" value={rating} name="rating" />
            <input type="hidden" value={notes} name="notes" />
            <SubmitButton className="w-max px-6" size={'sm'}>
              <Save className="size-3" />
              Save
            </SubmitButton>
          </form>
        </Footer>
      </div>
    );
  } else {
    return (
      <div className="grid h-full w-full grow grid-rows-[max-content,1fr]">
        <Header />
        <div className="flex flex-col gap-2">
          <Button
            variant={userEntry.status === 'planning' ? 'default' : 'outline'}
            onClick={() => updateStatus('planning')}
          >
            <Bookmark />{' '}
            <div className="w-full">
              Planning to{' '}
              {userEntry.entry.category === 'Book' ? 'read' : 'watch'}
            </div>
          </Button>
          <div
            className={cn('w-full', {
              'flex flex-col rounded-lg border bg-white shadow-sm':
                userEntry.status === 'watching',
            })}
          >
            <Button
              className={cn('w-full', {
                'shadow-sm': userEntry.status === 'watching',
              })}
              variant={userEntry.status === 'watching' ? 'default' : 'outline'}
              onClick={() => updateStatus('watching')}
            >
              <Eye />{' '}
              <div className="w-full">
                {userEntry.entry.category === 'Book' ? 'Reading' : 'Watching'}
              </div>
            </Button>
            <div
              className={cn(
                'flex h-0 items-center gap-2 overflow-hidden px-2 py-0 text-muted-foreground transition-all duration-500',
                { 'h-[48px] py-2': userEntry.status === 'watching' }
              )}
            >
              <Input
                defaultValue={userEntry.progress}
                className="text-black"
                onBlur={e => {
                  if (Number(e.target.value) < 0) {
                    return;
                  }
                  updateProgress(Number(e.target.value));
                }}
                type="number"
              />
              <div>/</div>
              <div>{userEntry.entry.length}</div>
            </div>
          </div>

          <div
            className={cn('w-full', {
              'flex flex-col rounded-lg border bg-white shadow-sm':
                userEntry.status === 'paused',
            })}
          >
            <Button
              className={cn('w-full', {
                'shadow-sm': userEntry.status === 'paused',
              })}
              variant={userEntry.status === 'paused' ? 'default' : 'outline'}
              onClick={() => updateStatus('paused')}
            >
              <Pause /> <div className="w-full">Paused</div>
            </Button>
            <div
              className={cn(
                'flex h-0 items-center justify-center gap-2 overflow-hidden px-2 py-0 transition-all duration-500',
                { 'h-auto py-2': userEntry.status === 'paused' }
              )}
            >
              <div>{userEntry.progress}</div>
              <div>/</div>
              <div>{userEntry.entry.length}</div>
            </div>
          </div>

          <div
            className={cn('w-full', {
              'flex flex-col rounded-lg border bg-white shadow-sm':
                userEntry.status === 'dnf',
            })}
          >
            <Button
              className={cn('w-full', {
                'shadow-sm': userEntry.status === 'dnf',
              })}
              variant={userEntry.status === 'dnf' ? 'default' : 'outline'}
              onClick={() => updateStatus('dnf')}
            >
              <X /> <div className="w-full">Did not finish</div>
            </Button>
            <div
              className={cn(
                'flex h-0 items-center justify-center gap-2 overflow-hidden px-2 py-0 transition-all duration-500',
                { 'h-auto py-2': userEntry.status === 'dnf' }
              )}
            >
              <div>{userEntry.progress}</div>
              <div>/</div>
              <div>{userEntry.entry.length}</div>
            </div>
          </div>

          <Button
            variant={userEntry.status === 'completed' ? 'default' : 'outline'}
            onClick={() => updateStatus('completed')}
          >
            <Check /> <div className="w-full">Completed</div>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
};

export default ModifyUserEntry;
