import { UserList } from '@prisma/client';
import { create } from 'zustand';

type ListState = {
  list: UserList | null;
  setList: (list: UserList) => void;

  createTimedChallengeOpen: boolean;
  setCreateTimedChallengeOpen: (open: boolean) => void;
};

export const useListState = create<ListState>(set => ({
  list: null,
  setList: list => set({ list }),

  createTimedChallengeOpen: false,
  setCreateTimedChallengeOpen: (open: boolean) =>
    set(() => ({ createTimedChallengeOpen: open })),
}));
