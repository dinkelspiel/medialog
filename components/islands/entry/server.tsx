import { Loader2 } from 'lucide-react';
import React from 'react';
import Entry from '../entry';
import EntryView from '../entry';
import { api } from '@/trpc/server';

const EntryServer = async ({ entryId }: { entryId: number }) => {
  const entryPage = await api.entries.getEntryPage({ entryId });
  if (!entryPage) return;

  return <EntryView entryPage={entryPage} />;
};

export default EntryServer;
