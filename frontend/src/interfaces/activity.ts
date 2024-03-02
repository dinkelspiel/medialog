import { Category } from "./category";

export type Activity = {
  type: "status_update" | "reviewed" | "rewatch" | "complete_review";
  additionalData: string;
  franchiseName: string;
  entryName: string;
  franchiseCategory: Category;
  rating: number;
  coverUrl: string;
  createdAt: string;
  createdAtHuman: string;
};
