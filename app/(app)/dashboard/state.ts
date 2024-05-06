import { Entry, User, UserEntry, UserEntryStatus } from '@prisma/client';
import { create } from 'zustand';

export type FilterStyle = 'rating' | 'az' | 'watched' | 'updated';
export type ExtendedUserEntry = UserEntry & { entry: Entry } & { user: User };

type DashboardStore = {
  filterStatus: UserEntryStatus | undefined;
  setFilterStatus: (status: UserEntryStatus | undefined) => void;
  filterTitle: string;
  setFilterTitle: (title: string) => void;
  filterStyle: FilterStyle;
  setFilterStyle: (style: FilterStyle) => void;

  userEntries: ExtendedUserEntry[];
  setUserEntries: (userEntries: ExtendedUserEntry[]) => void;
  setUserEntry: (userEntry: ExtendedUserEntry) => void;
};

export const useDashboardStore = create<DashboardStore>(set => ({
  filterStatus: undefined,
  setFilterStatus: (status: UserEntryStatus | undefined) =>
    set(() => ({ filterStatus: status })),
  filterTitle: '',
  setFilterTitle: (title: string) => set(() => ({ filterTitle: title })),
  filterStyle: 'rating',
  setFilterStyle: (style: FilterStyle) => set(() => ({ filterStyle: style })),

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
}));