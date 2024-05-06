'use client';
import SubmitButton from '@/components/submitButton';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import UserEntryCard from '@/components/userEntryCard';
import { saveUserEntry } from '@/server/user/entries';
import { Entry, User, UserEntry } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';
import { useMediaQuery } from 'usehooks-ts';
import { useDashboardStore } from './state';

const UserEntryComponent = ({
  userEntry,
}: {
  userEntry: UserEntry & { user: User } & { entry: Entry };
}) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [open, setOpen] = useState(false);

  return (
    <>
      <UserEntryCard
        title={userEntry.entry.originalTitle}
        backgroundImage={userEntry.entry.posterPath}
        category={userEntry.entry.category}
        releaseDate={userEntry.entry.releaseDate}
        rating={userEntry.rating}
        onClick={() => setOpen(true)}
      />

      {(() => {
        if (isDesktop) {
          return (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent className="!max-w-[550px]">
                <ModifyUserEntry userEntry={userEntry} setOpen={setOpen} />
              </SheetContent>
            </Sheet>
          );
        } else {
          return (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerContent className="top-[50px] mt-0 p-6">
                <ModifyUserEntry userEntry={userEntry} setOpen={setOpen} />
              </DrawerContent>
            </Drawer>
          );
        }
      })()}
    </>
  );
};

const ModifyUserEntry = ({
  userEntry,
  setOpen,
}: {
  userEntry: UserEntry & { user: User } & { entry: Entry };
  setOpen: (value: boolean) => void;
}) => {
  const { setUserEntry } = useDashboardStore();

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

  return (
    <div className="grid h-full w-full grow grid-rows-[max-content,max-content,1fr,max-content]">
      <input type="hidden" value={userEntry.id} name="userEntryId" />
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
};

export default UserEntryComponent;
