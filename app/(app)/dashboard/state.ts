import { Entry, User, UserEntry, UserEntryStatus } from '@prisma/client';
import { create } from 'zustand';

export type FilterStyle = 'rating' | 'az' | 'completed' | 'updated';
export type ExtendedUserEntry = UserEntry & { entry: Entry } & { user: User };

type DashboardStore = {
  filterStatus: UserEntryStatus | 'all';
  setFilterStatus: (status: UserEntryStatus | undefined) => void;
  filterTitle: string;
  setFilterTitle: (title: string) => void;
  filterStyle: FilterStyle;
  setFilterStyle: (style: FilterStyle) => void;
  filterRating: number[];
  setFilterRating: (ratings: number[]) => void;

  userEntries: ExtendedUserEntry[];
  setUserEntries: (userEntries: ExtendedUserEntry[]) => void;
  setUserEntry: (userEntry: ExtendedUserEntry) => void;
  removeUserEntry: (userEntry: ExtendedUserEntry) => void;

  selectedUserEntry: number | undefined;
  setSelectedUserEntry: (userEntryId: number | undefined) => void;
};

export const useDashboardStore = create<DashboardStore>(set => ({
  filterStatus: 'all',
  setFilterStatus: (status: UserEntryStatus | undefined) =>
    set(() => ({ filterStatus: status })),
  filterTitle: '',
  setFilterTitle: (title: string) => set(() => ({ filterTitle: title })),
  filterStyle: 'rating',
  setFilterStyle: (style: FilterStyle) => set(() => ({ filterStyle: style })),
  filterRating: [0, 10],
  setFilterRating: (ratings: number[]) =>
    set(() => ({ filterRating: ratings })),

  userEntries: [],
  setUserEntries: (userEntries: ExtendedUserEntry[]) =>
    set(() => ({ userEntries })),
  setUserEntry: (userEntry: ExtendedUserEntry) =>
    set(state => ({
      userEntries: [
        ...state.userEntries.filter(e => e.id !== userEntry.id),
        userEntry,
      ],
    })),
  removeUserEntry: (userEntry: ExtendedUserEntry) =>
    set(state => ({
      userEntries: [...state.userEntries.filter(e => e.id !== userEntry.id)],
    })),

  selectedUserEntry: undefined,
  setSelectedUserEntry: (userEntryId: number | undefined) =>
    set(state => ({
      selectedUserEntry:
        userEntryId === state.selectedUserEntry ? undefined : userEntryId,
    })),
}));
