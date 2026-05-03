import type { Category } from '@/prisma/generated/browser';

export type MediaTypeFilters = {
  movie: boolean;
  book: boolean;
  series: boolean;
};

export const MEDIA_TYPE_FILTERS_SETTING_NAME = 'mediaTypeFilters';

export const DEFAULT_MEDIA_TYPE_FILTERS: MediaTypeFilters = {
  movie: true,
  book: true,
  series: true,
};

export const mediaTypeFiltersToCategories = (
  filters: MediaTypeFilters
): Category[] => {
  const categories: Category[] = [];

  if (filters.book) categories.push('Book');
  if (filters.movie) categories.push('Movie');
  if (filters.series) categories.push('Series');

  return categories;
};