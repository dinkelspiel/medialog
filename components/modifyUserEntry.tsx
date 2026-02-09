'use client';
import { ExtendedUserEntry } from '@/app/(app)/dashboard/state';
import SubmitButton from '@/components/submitButton';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { UserEntryStatus, UserEntryVisibility, UserList } from '@/prisma/generated/browser';
import {
  Bookmark,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  ListPlus,
  Pause,
  Play,
  Star,
  Trash2,
  UsersRound,
  X,
  Calendar,
  Clock,
  MessageSquare,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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
  const [activeTab, setActiveTab] = useState<string>(
    userEntry.watchedAt !== null ? 'review' : 'status'
  );

  const utils = api.useUtils();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [removeUserEntryOpen, setRemoveUserEntryOpen] = useState(false);

  // Sync local state when userEntry changes
  const userEntryId = userEntry.id;
  useEffect(() => {
    setNotes(userEntry.notes);
    setRating(userEntry.rating);
    setActiveTab(userEntry.watchedAt !== null ? 'review' : 'status');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEntryId]);

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

  const statusConfig = [
    {
      status: 'planning' as const,
      icon: Bookmark,
      label: `Planning to ${userEntry.entry.category === 'Book' ? 'read' : 'watch'}`,
      color: 'bg-amber-500',
    },
    {
      status: 'watching' as const,
      icon: Play,
      label: userEntry.entry.category === 'Book' ? 'Reading' : 'Watching',
      color: 'bg-blue-500',
      showProgress: true,
    },
    {
      status: 'paused' as const,
      icon: Pause,
      label: 'Paused',
      color: 'bg-orange-500',
      showProgress: true,
    },
    {
      status: 'dnf' as const,
      icon: X,
      label: 'Did not finish',
      color: 'bg-red-500',
      showProgress: true,
    },
    {
      status: 'completed' as const,
      icon: Check,
      label: 'Completed',
      color: 'bg-green-500',
    },
  ];

  const visibilityIcons = {
    public: Eye,
    friends: UsersRound,
    private: EyeOff,
  };

  return (
    <div className="flex h-full flex-col">
      {/* Hero Header with Backdrop */}
      <div className="relative -mx-4.25 -mt-4.25 overflow-hidden rounded-t-lg">
        {/* Backdrop image */}
        <div className="absolute inset-0">
          <Image
            src={userEntry.entry.backdropPath}
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-base-900/40 via-base-900/60 to-white" />
        </div>

        {/* Content */}
        <div className="relative flex gap-4 p-4 pt-8 sm:p-6 sm:pt-10">
          <Image
            src={userEntry.entry.posterPath}
            alt={getUserTitleFromEntry(userEntry.entry)}
            width={120}
            height={180}
            className="aspect-2/3 w-25 rounded-lg shadow-xl ring-1 ring-white/20 sm:w-30"
          />
          <div className="flex min-w-0 flex-1 flex-col justify-end gap-1 pb-2">
            <EntryRedirect
              entryId={userEntry.entry.id}
              entrySlug={userEntry.entry.slug}
            >
              <h2 className="line-clamp-2 text-lg font-bold tracking-tight text-white drop-shadow-sm drop-shadow-neutral-500 hover:underline sm:text-xl">
                {getUserTitleFromEntry(userEntry.entry)}
              </h2>
            </EntryRedirect>
            <p className="text-sm text-base-200 drop-shadow-sm drop-shadow-neutral-500">
              {userEntry.entry.releaseDate.getFullYear()}
              {userEntry.entry.tagline && (
                <span className="hidden sm:inline"> · {userEntry.entry.tagline}</span>
              )}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-white drop-shadow-sm drop-shadow-neutral-600 sm:line-clamp-3 sm:text-sm">
              {userEntry.entry.overview}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="flex items-center gap-2 border-b border-base-200 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              {(() => {
                const Icon = visibilityIcons[userEntry.visibility];
                return <Icon className="size-4" />;
              })()}
              <span className="hidden sm:inline">{capitalizeFirst(userEntry.visibility)}</span>
              <ChevronDown className="size-3 text-base-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              {Object.values(UserEntryVisibility).map(visibility => {
                const Icon = visibilityIcons[visibility];
                return (
                  <DropdownMenuItem
                    key={visibility}
                    onClick={() => updateVisibility(visibility)}
                    className={cn(userEntry.visibility === visibility && 'bg-base-100')}
                  >
                    <Icon className="size-4" />
                    {capitalizeFirst(visibility)}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <AddToList
          onSuccess={() => refetchUserLists()}
          entryId={userEntry.entryId}
          userLists={userLists}
          userListsWithEntry={userListsWithEntry}
        >
          <Button variant="ghost" size="sm" className="gap-2">
            <ListPlus className="size-4" />
            <span className="hidden sm:inline">Add to list</span>
          </Button>
        </AddToList>

        <div className="flex-1" />

        <Dialog open={removeUserEntryOpen} onOpenChange={setRemoveUserEntryOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove from library?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-base-500">
              This will remove your rating, notes, and progress for this entry.
            </p>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setRemoveUserEntryOpen(false)}>
                Cancel
              </Button>
              <SubmitButton
                variant="destructive"
                isPending={removeUserEntry.isPending}
                onClick={() => removeUserEntry.mutate({ userEntryId: userEntry.id })}
              >
                Remove
              </SubmitButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="mx-0 mt-3 w-full justify-start rounded-none border-b border-base-200 bg-transparent p-0">
          <TabsTrigger
            value="status"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-base-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Status
          </TabsTrigger>
          <TabsTrigger
            value="review"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-base-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="mt-0 flex-1 overflow-auto p-1">
          <div className="space-y-2 py-4">
            {statusConfig.map(({ status, icon: Icon, label, color, showProgress }) => {
              const isActive = userEntry.status === status;
              return (
                <div
                  key={status}
                  className={cn(
                    'overflow-hidden rounded-xl border transition-all',
                    isActive ? 'border-base-300 bg-base-50 shadow-sm' : 'border-transparent'
                  )}
                >
                  <button
                    onClick={() => updateStatus(status)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-base-100',
                      isActive && 'hover:bg-base-100'
                    )}
                  >
                    <div
                      className={cn(
                        'flex size-8 items-center justify-center rounded-full transition-colors',
                        isActive ? `${color} text-white` : 'bg-base-200 text-base-500'
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <span className={cn('font-medium', isActive ? 'text-base-900' : 'text-base-600')}>
                      {label}
                    </span>
                    {isActive && <Check className="ml-auto size-4 text-green-500" />}
                  </button>

                  {/* Progress input for watching/paused/dnf */}
                  {showProgress && isActive && (
                    <div className="flex items-center gap-3 border-t border-base-200 bg-white px-4 py-3">
                      <span className="text-sm text-base-500">Progress</span>
                      <Input
                        defaultValue={userEntry.progress}
                        className="h-8 w-20 text-center"
                        onBlur={e => {
                          const val = Number(e.target.value);
                          if (val >= 0) updateProgress(val);
                        }}
                        type="number"
                        min={0}
                        max={userEntry.entry.length}
                      />
                      <span className="text-sm text-base-400">/ {userEntry.entry.length}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="review" className="mt-0 flex flex-1 flex-col overflow-auto p-1">
          <div className="flex flex-1 flex-col gap-6 pt-4">
            {/* Rating Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Star className="size-4 text-amber-500" />
                  Rating
                </Label>
                <span className="rounded-full bg-base-100 px-3 py-1 text-sm font-semibold tabular-nums">
                  {(rating / 20).toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-base-400 gap-3">
                <span>0</span>
                <Slider
                  value={[rating]}
                  onValueChange={e => setRating(Number(e[0]))}
                  className="w-full"
                  step={1}
                  min={0}
                  max={100}
                />
                <span>5</span>
              </div>
            </div>

            {/* Notes Section */}
            <div className="flex flex-1 flex-col gap-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <MessageSquare className="size-4 text-base-400" />
                Notes
              </Label>
              <Textarea
                className="flex-1 resize-none"
                placeholder="Write your thoughts about this..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            {/* Date Section */}
            <div className="flex flex-wrap items-center gap-4 rounded-lg border border-base-200 bg-base-50 p-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-base-400" />
                <Label className="text-sm">Watched</Label>
                <DateTimePicker date={watchedAt} setDate={setWatchedAt} />
              </div>
              {isDesktop && (
                <>
                  <div className="h-4 w-px bg-base-200" />
                  <div className="flex items-center gap-2 text-sm text-base-500">
                    <Clock className="size-4" />
                    Added {new Date(userEntry.createdAt.toString()).toLocaleDateString()}
                  </div>
                </>
              )}
            </div>

            {/* Save Button */}
            <SubmitButton
              isPending={updateUserEntry.isPending}
              onClick={() =>
                updateUserEntry.mutate({
                  userEntryId: userEntry.id,
                  rating,
                  notes,
                  watchedAt: watchedAt ?? undefined,
                })
              }
              className="w-full"
              size="lg"
            >
              <Check className="size-4" />
              Save Changes
            </SubmitButton>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModifyUserEntry;
