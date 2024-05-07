'use client';
import { ExtendedUserEntry } from '@/app/(app)/dashboard/state';
import SubmitButton from '@/components/submitButton';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { saveUserEntry } from '@/server/user/entries';
import { Entry, User, UserEntry, UserEntryStatus } from '@prisma/client';
import { Bookmark, Check, Eye, Pause, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

const ModifyUserEntry = ({
  userEntry,
  setOpen,
  setUserEntry,
}: {
  userEntry: UserEntry & { user: User } & { entry: Entry };
  setOpen: (value: boolean) => void;
  setUserEntry: (userEntry: ExtendedUserEntry) => void;
}) => {
  const [rating, setRating] = useState(userEntry.rating);
  const [notes, setNotes] = useState(userEntry.notes);

  const [state, formAction] = useFormState(saveUserEntry, {});

  useEffect(() => {
    if (state.message) {
      setOpen(false);
      setUserEntry({ ...userEntry, notes, rating });
      toast.success(state.message);
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

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

  if (userEntry.watchedAt !== null) {
    return (
      <div className="grid h-full w-full grow grid-rows-[max-content,max-content,1fr,max-content]">
        <div className="mb-8 w-fit break-all pt-4 text-lg font-semibold tracking-tight lg:pt-0 xl:w-max">
          {userEntry.entry.originalTitle}
        </div>
        <div className="flex flex-row items-center gap-3 border-b border-b-gray-200 py-3 text-sm">
          <div className="w-max text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>Rating</TooltipTrigger>
                <TooltipContent>{rating / 20}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
        <div className="flex items-center justify-between">
          <form action={formAction}>
            <input type="hidden" value={userEntry.id} name="userEntryId" />
            <input type="hidden" value={rating} name="rating" />
            <input type="hidden" value={notes} name="notes" />
            <SubmitButton className="w-max px-4">Save</SubmitButton>
          </form>
          <Button size={'sm'} variant={'ghost'} className="[&>svg]:size-4">
            <Trash2 className="stroke-red-500" />
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="grid h-full w-full grow grid-rows-[max-content,1fr]">
        <div className="mb-8 w-fit break-all pt-4 text-lg font-semibold tracking-tight lg:pt-0 xl:w-max">
          {userEntry.entry.originalTitle}
        </div>
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
      </div>
    );
  }
};

export default ModifyUserEntry;
