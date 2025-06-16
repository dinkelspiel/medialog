import { Loader2 } from 'lucide-react';
import React from 'react';
import Entry from '../entry';
import EntryView from '../entry';
import { api } from '@/trpc/server';

const EntryServer = async ({ entryId }: { entryId: number }) => {
  const entry = await api.entries.get({ id: entryId });
  if (!entry) return;

  return <EntryView entry={entry} />;
};

export default EntryServer;
