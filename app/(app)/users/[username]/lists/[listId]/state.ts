import { create } from 'zustand';

type ListState = {
  createTimedChallengeOpen: boolean;
  setCreateTimedChallengeOpen: (open: boolean) => void;
};

export const useListState = create<ListState>(set => ({
  createTimedChallengeOpen: true,
  setCreateTimedChallengeOpen: (open: boolean) =>
    set(() => ({ createTimedChallengeOpen: open })),
}));
