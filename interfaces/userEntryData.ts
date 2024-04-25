import type UserEntryStatus from './userEntryStatus.js';

interface UserEntryData {
  id: number;
  franchiseName: string;
  entryName: string;
  entryCoverUrl: string;
  releaseYear: number;
  entries: number;
  userEntries: { id: number; rating: number; watchedAt?: string }[];
  rating: number;
  notes: string;
  status: UserEntryStatus;
  entryLength: number;
  entryId: number;
  progress: number;
  watchedAt?: string;
}

export default UserEntryData;
