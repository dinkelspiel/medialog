'use client';

import Entry from '@/components/islands/entry';
import EntryClient from '@/components/islands/entry/client';
import { IslandDialog } from '@/components/islands/islands';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

const EntryIslandContext = createContext<{
  storedUrl: string | null;
  entryId: number | null;
  entrySlug: string | null;
  setEntry: (id: number | null, slug: string | null) => void;
  open: boolean;
  setOpen: (
    open: boolean,
    entryId: number | null,
    entrySlug: string | null
  ) => void;
} | null>(null);

export function EntryIslandProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [entryId, setEntryId] = useState<number | null>(null);
  const [entrySlug, setEntrySlug] = useState<string | null>(null);
  const [open, setOpenValue] = useState(false);
  const [storedUrl, setStoredUrl] = useState('');

  const setOpen = (
    open_: boolean,
    entryId_: number | null,
    entrySlug: string | null
  ) => {
    setEntryId(entryId_);
    setEntrySlug(entrySlug);
    setOpenValue(open_);
    if (open_) {
      setStoredUrl(window.location.pathname);
      window.history.pushState({}, '', `/entry/${entrySlug}`);
    } else {
      window.history.pushState({}, '', storedUrl);
    }
  };

  return (
    <EntryIslandContext.Provider
      value={{
        storedUrl,
        entrySlug,
        entryId,
        setEntry(id, slug) {
          setEntryId(id);
          setEntrySlug(slug);
        },
        open,
        setOpen,
      }}
    >
      {children}
    </EntryIslandContext.Provider>
  );
}

export function useEntryIsland() {
  const context = useContext(EntryIslandContext);
  if (!context) {
    return null;
  }
  return context;
}

export const EntryIsland = () => {
  const entryIsland = useEntryIsland();
  if (!entryIsland) return;

  return (
    <IslandDialog
      open={entryIsland.open}
      setOpen={open => entryIsland.setOpen(open, null, null)}
      title={'Settings'}
    >
      <EntryClient />
    </IslandDialog>
  );
};

export const EntryRedirect = ({
  entryId,
  entrySlug,
  children,
  className,
}: {
  entryId: number;
  entrySlug: string;
  children: ReactNode;
  className?: string;
}) => {
  const entryIsland = useEntryIsland();
  if (!entryIsland) {
    return <Link href={`/entry/${entrySlug}`}>{children}</Link>;
  }

  return (
    <button
      className={cn('text-left hover:underline', className)}
      onClick={() => {
        entryIsland.setOpen(true, entryId, entrySlug);
      }}
    >
      {children}
    </button>
  );
};
