import {
  Entry,
  EntryTranslation,
  UserList,
  UserListEntry,
} from '@prisma/client';
import { create } from 'zustand';

export type StateList = UserList & {
  entries: (UserListEntry & {
    entry: Entry & { translations: EntryTranslation[] };
  })[];
};

type ListState = {
  list: StateList | null;
  setList: (list: StateList) => void;

  createTimedChallengeOpen: boolean;
  setCreateTimedChallengeOpen: (open: boolean) => void;

  createPollOpen: boolean;
  setCreatePollOpen: (open: boolean) => void;
};

export const useListState = create<ListState>(set => ({
  list: null,
  setList: list => set({ list }),

  createTimedChallengeOpen: false,
  setCreateTimedChallengeOpen: (open: boolean) =>
    set(() => ({ createTimedChallengeOpen: open })),

  createPollOpen: false,
  setCreatePollOpen: (open: boolean) => set(() => ({ createPollOpen: open })),
}));
