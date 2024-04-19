import { Category } from "./category";
import UserEntryStatus from "./userEntryStatus";

type Studio = { name: string };
type Person = { name: string };

export interface UserEntry {
  id: number;
  franchiseName: string;
  franchiseCategory: Category;
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
