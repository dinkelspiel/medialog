import UserEntryStatus from "./userEntryStatus";

interface UserEntryData {
    id: number;
    franchiseName: string;
    entryName: string;
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