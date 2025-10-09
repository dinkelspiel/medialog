'use client';
import { ExtendedUserEntry } from '@/app/(app)/dashboard/state';
import SubmitButton from '@/components/submitButton';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { UserEntryStatus, UserEntryVisibility, UserList } from '@prisma/client';
import {
  Bookmark,
  Check,
  ChevronDown,
  Eye,
  ListPlus,
  Pause,
  Save,
  Trash2,
  UsersRound,
  X,
} from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { DateTimePicker } from './ui/date-time-picker';
import { api } from '@/trpc/react';
import { getUserTitleFromEntry } from '@/server/api/routers/dashboard_';
import { EntryRedirect } from '@/app/(app)/_components/EntryIslandContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { capitalizeFirst } from '@/lib/capitalizeFirst';
import AddToList from './addToList';

const ModifyUserEntry = ({
  userEntry,
  userLists,
  userListsWithEntry,
  refetchUserLists,
  setOpen,
  setUserEntry,
  removeUserEntry: removeUserEntryClient,
}: {
  userEntry: ExtendedUserEntry;
  userLists: UserList[];
  userListsWithEntry: UserList[];
  refetchUserLists: () => Promise<void>;
  setOpen: (value: boolean) => void;
  setUserEntry: (userEntry: ExtendedUserEntry) => void;
  removeUserEntry: (userEntry: ExtendedUserEntry) => void;
}) => {
  const [rating, setRating] = useState(userEntry.rating);
  const [notes, setNotes] = useState(userEntry.notes);
  const [watchedAt, setWatchedAt] = useState<Date | null>(
    userEntry.watchedAt ? userEntry.watchedAt : new Date()
  );

  const utils = api.useUtils();

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [addListsOpen, setAddListsOpen] = useState(false);

  const [removeUserEntryOpen, setRemoveUserEntryOpen] = useState(false);

  useEffect(() => {
    setNotes(userEntry.notes);
    setRating(userEntry.rating);
  }, [userEntry]);

  const updateUserEntry = api.userEntry.update.useMutation({
    onSuccess(data) {
      toast.success(data.message);
      setUserEntry({
        ...data.userEntry,
        entry: {
          ...data.userEntry.entry,
          releaseDate: new Date(data.userEntry.entry.releaseDate),
        },
      });
      utils.entries.getEntryPage.invalidate();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const removeUserEntry = api.userEntry.remove.useMutation({
    onSuccess(data) {
      toast.success(data.message);
      utils.dashboard.invalidate();
      utils.entries.getEntryPage.invalidate();
      removeUserEntryClient(userEntry);
      setOpen(false);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const updateStatus = async (status: UserEntryStatus) => {
    setUserEntry({
      ...userEntry,
      watchedAt: status === 'completed' ? new Date() : null,
      status,
    });
    updateUserEntry.mutate({
      userEntryId: userEntry.id,
      status,
    });
  };

  const updateProgress = async (progress: number) => {
    if (progress === userEntry.progress) return;
    setUserEntry({
      ...userEntry,
      watchedAt: progress >= userEntry.entry.length ? new Date() : null,
      status:
        progress >= userEntry.entry.length ? 'completed' : userEntry.status,
      progress,
    });
    updateUserEntry.mutate({
      userEntryId: userEntry.id,
      progress,
    });
  };

  const updateVisibility = async (visibility: UserEntryVisibility) => {
    setUserEntry({
      ...userEntry,
      visibility,
    });
    updateUserEntry.mutate({
      userEntryId: userEntry.id,
      visibility,
    });
  };

  const Header = () => (
    <DialogHeader>
      <div className="grid w-full grid-cols-[max-content,1fr] gap-4 pb-4 pt-4 lg:pt-0">
        <img
          src={userEntry.entry.posterPath}
          className="aspect-[2/3] w-[100px] rounded-lg shadow-md"
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-2">
            <EntryRedirect
              entryId={userEntry.entry.id}
              entrySlug={userEntry.entry.slug}
            >
              <DialogTitle>
                <div className="text-lg font-semibold tracking-tight lg:pt-0">
                  {getUserTitleFromEntry(userEntry.entry)}
                </div>
              </DialogTitle>
            </EntryRedirect>
            <div className="pb-[2px] text-sm text-base-500">
              {userEntry.entry.releaseDate.getFullYear()}
            </div>
          </div>
          {userEntry.entry.tagline && (
            <div className="text-sm font-normal italic text-base-500">
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
    </DialogHeader>
  );

  const Footer = ({ children }: { children?: ReactNode }) => (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      <Dialog open={removeUserEntryOpen} onOpenChange={setRemoveUserEntryOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="size-3 stroke-white" /> Remove
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to remove this review?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="w-full"
              variant={'outline'}
              onClick={() => setRemoveUserEntryOpen(false)}
            >
              No
            </Button>
            <SubmitButton
              size={'default'}
              isPending={removeUserEntry.isPending}
              onClick={() =>
                removeUserEntry.mutate({
                  userEntryId: userEntry.id,
                })
              }
            >
              Yes
            </SubmitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-2 lg:flex-row">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full lg:w-fit"
              size="sm"
              role="combobox"
              aria-expanded={addListsOpen}
            >
              {(() => {
                switch (userEntry.visibility) {
                  case 'public':
                    return <Eye className="size-3" />;
                  case 'friends':
                    return <UsersRound className="size-3" />;
                  case 'private':
                    return <X className="size-3" />;
                }
              })()}{' '}
              {capitalizeFirst(userEntry.visibility)}{' '}
              <ChevronDown className="size-3 stroke-base-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {Object.values(UserEntryVisibility).map(visiblity => (
                <DropdownMenuItem onClick={() => updateVisibility(visiblity)}>
                  {(() => {
                    switch (visiblity) {
                      case 'public':
                        return <Eye className="size-3" />;
                      case 'friends':
                        return <UsersRound className="size-3" />;
                      case 'private':
                        return <X className="size-3" />;
                    }
                  })()}
                  {capitalizeFirst(visiblity)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <AddToList
          onSuccess={() => refetchUserLists()}
          entryId={userEntry.entryId}
          userLists={userLists}
          userListsWithEntry={userListsWithEntry}
        >
          <Button variant="outline" size="sm" role="combobox">
            <ListPlus className="size-3" /> Add to list
          </Button>
        </AddToList>
        {children}
      </div>
    </div>
  );

  if (userEntry.watchedAt !== null) {
    return (
      <div className="grid h-full grow grid-rows-[max-content,max-content,1fr,max-content]">
        <Header />
        <div className="flex flex-row items-center gap-3 border-b border-b-base-200 py-3 text-sm">
          <div className="w-max text-base-500">Rating</div>
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
        <div className="flex h-full flex-col items-center gap-4 py-3 text-sm">
          <Textarea
            className="h-full resize-none"
            // border-none p-0 shadow-none focus-visible:ring-0
            placeholder="Write your review"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            name="notes"
          />
          <div className="flex w-full flex-col justify-start gap-6 lg:flex-row">
            <div className="flex items-center gap-2">
              <Label>Watched</Label>
              <DateTimePicker date={watchedAt} setDate={setWatchedAt} />
            </div>
            <div className="hidden items-center gap-2 lg:flex">
              <Label>Created</Label>
              {new Date(userEntry.createdAt.toString()).toDateString()}
            </div>
            <div className="hidden items-center gap-2 lg:flex">
              <Label>Updated</Label>
              {new Date(userEntry.updatedAt.toString()).toDateString()}
            </div>
          </div>
        </div>
        <Footer>
          <SubmitButton
            isPending={updateUserEntry.isPending}
            onClick={() =>
              updateUserEntry.mutate({
                userEntryId: userEntry.id,
                rating,
                notes,
                watchedAt: watchedAt ? watchedAt : undefined,
              })
            }
            className="w-full px-6 lg:w-fit"
            size={'sm'}
          >
            <Save className="size-3" />
            Save
          </SubmitButton>
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
                'flex h-0 items-center gap-2 overflow-hidden px-2 py-0 text-base-500 transition-all duration-500',
                { 'h-[48px] py-2': userEntry.status === 'watching' }
              )}
            >
              <Input
                defaultValue={userEntry.progress}
                className="text-base-900"
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
