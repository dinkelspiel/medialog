import UserEntryStatus from "./userEntryStatus";

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
  }