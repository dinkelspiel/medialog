'use client';

import { useEntryIsland } from '@/app/(app)/_components/EntryIslandContext';
import { getUserTitleFromEntry } from '@/server/api/routers/dashboard_';
import { api } from '@/trpc/react';
import { Loader2 } from 'lucide-react';
import React from 'react';
import Entry from '../entry';
import EntryView from '../entry';

const EntryClient = () => {
  const entryIsland = useEntryIsland();

  const entry = api.entries.get.useQuery({
    id: entryIsland ? (entryIsland.entryId ?? -1) : -1,
  });

  if (!entryIsland || !entryIsland.entryId) return;
  if (entry.isPending) return <Loader2 className="animate-spin" />;
  if (!entry.data) return;

  return <EntryView entry={entry.data} />;
};

export default EntryClient;
