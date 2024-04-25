import { Category } from "./category.js";

export type Activity = {
  type: "status_update" | "reviewed" | "rewatch" | "complete_review";
  additionalData: string;
  franchiseName: string;
  entryName: string;
  entries: number;
  franchiseCategory: Category;
  rating: number;
  coverUrl: string;
  createdAt: string;
  createdAtHuman: string;
};
