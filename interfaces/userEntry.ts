import UserEntryStatus from './userEntryStatus.js';

type Studio = { name: string };
type Person = { name: string };

export interface UserEntry {
  id: number;
  franchiseName: string;
  entryName: string;
  coverUrl: string;
  entries: number;
  updatedAt: string;
  watchedAt?: string;
  rating: number;
  status: UserEntryStatus;
  creators: Person[];
  studios: Studio[];
}
