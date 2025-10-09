'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { api } from '@/trpc/react';
import {
  AlertCircle,
  Bug,
  MessageCircle,
  Send,
  Sparkles,
  Wand2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthUser } from './AuthUserContext';

export const Feedback = () => {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const user = useAuthUser();
  const createIssue = api.github.createIssue.useMutation({
    onSuccess(data) {
      setOpen(false);
      toast.success('Created issue', {
        action: (
          <Link href={data.issueUrl} className="ms-auto">
            <Button variant={'outline'} size={'sm'}>
              Visit
            </Button>
          </Link>
        ),
      });
    },
  });
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [label, setLabel] = useState<'bug' | 'feature' | 'enhancement'>('bug');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={'outline'} className="w-full">
          <MessageCircle className="size-4 stroke-base-600" />
          Send Feedback
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle>Send Feedback</DialogTitle>
          <Link
            className="text-sm text-sky-600 hover:underline"
            href={`https://github.com/${process.env.NEXT_PUBLIC_FEEDBACK_REPO_OWNER}/${process.env.NEXT_PUBLIC_FEEDBACK_REPO}/issues?q=is%3Aissue%20in%3Abody%20%22user%3A${user?.id}%22`}
          >
            See my issues
          </Link>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={e => {
            e.preventDefault();
            setBody('');
            setTitle('');
            setLabel('bug');
            setOpen(false);
            createIssue.mutate({
              title,
              body,
              label,
              route: path,
            });
          }}
        >
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>Title</Label>
              <Input
                required
                value={title}
                onChange={e => setTitle(e.target.value!)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Description</Label>
              <Textarea
                required
                value={body}
                onChange={e => setBody(e.target.value!)}
                className="min-h-32"
              />
            </div>
            <div className="flex gap-1.5">
              <Toggle pressed={label === 'bug'} onClick={() => setLabel('bug')}>
                <Bug className="size-4 stroke-base-600 group-hover:opacity-50 group-data-[state=on]:stroke-primary-foreground" />{' '}
                Bug
              </Toggle>
              <Toggle
                pressed={label === 'feature'}
                onClick={() => setLabel('feature')}
              >
                <Sparkles className="size-4 stroke-base-600 group-hover:opacity-50 group-data-[state=on]:stroke-primary-foreground" />{' '}
                New Feature
              </Toggle>
              <Toggle
                pressed={label === 'enhancement'}
                onClick={() => setLabel('enhancement')}
              >
                <Wand2 className="size-4 stroke-base-600 group-hover:opacity-50 group-data-[state=on]:stroke-primary-foreground" />{' '}
                Enhancement
              </Toggle>
            </div>
          </div>
          {createIssue.error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{createIssue.error.message}</AlertDescription>
            </Alert>
          )}
          <DialogFooter className="flex w-full items-center sm:justify-between">
            <Link
              className="text-sm text-base-600 hover:underline"
              href="https://medium.com/nyc-planning-digital/writing-a-proper-github-issue-97427d62a20f"
            >
              How should i write it?
            </Link>
            <Button type="submit">
              <Send className="size-4 stroke-white" /> Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
