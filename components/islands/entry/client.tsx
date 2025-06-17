'use client';

import { useEntryIsland } from '@/app/(app)/_components/EntryIslandContext';
import { getUserTitleFromEntry } from '@/server/api/routers/dashboard_';
import { api } from '@/trpc/react';
import { Loader2 } from 'lucide-react';
import React from 'react';
import Entry from '../entry';
import EntryView from '../entry';
import { useAuthUser } from '@/app/(app)/_components/AuthUserContext';

const EntryClient = () => {
  const entryIsland = useEntryIsland();
  const authUser = useAuthUser();
  const utils = api.useUtils();

  const entryPage = api.entries.getEntryPage.useQuery({
    entryId: entryIsland ? (entryIsland.entryId ?? -1) : -1,
  });

  if (!entryIsland || !entryIsland.entryId) return;
  if (entryPage.isPending) return <Loader2 className="animate-spin" />;
  if (!entryPage.data) return;

  return (
    <EntryView
      host={'client'}
      entryPage={entryPage.data}
      authUser={authUser}
      addToListSuccess={async () => {
        utils.entries.getEntryPage.invalidate();
      }}
    />
  );
};

export default EntryClient;
