import { Loader2 } from 'lucide-react';
import React from 'react';
import Entry from '../entry';
import EntryView from '../entry';
import { api } from '@/trpc/server';
import { validateSessionToken } from '@/server/auth/validateSession';

const EntryServer = async ({ entryId }: { entryId: number }) => {
  const entryPage = await api.entries.getEntryPage({ entryId });
  const authUser = await validateSessionToken();
  if (!entryPage) return;

  return (
    <EntryView host={'server'} entryPage={entryPage} authUser={authUser} />
  );
};

export default EntryServer;
