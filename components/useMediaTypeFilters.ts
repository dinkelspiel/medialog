'use client';

import {
  DEFAULT_MEDIA_TYPE_FILTERS,
  MediaTypeFilters,
} from '@/lib/mediaTypeFilters';
import { api } from '@/trpc/react';

export const useMediaTypeFilters = () => {
  const utils = api.useUtils();
  const query = api.settings.getMediaTypeFilters.useQuery();
  const mutation = api.settings.setMediaTypeFilters.useMutation({
    onMutate: async filters => {
      await utils.settings.getMediaTypeFilters.cancel();
      const previousFilters = utils.settings.getMediaTypeFilters.getData();

      utils.settings.getMediaTypeFilters.setData(undefined, filters);

      return { previousFilters };
    },
    onError: (_error, _filters, context) => {
      if (context?.previousFilters) {
        utils.settings.getMediaTypeFilters.setData(
          undefined,
          context.previousFilters
        );
      }
    },
    onSettled: () => {
      utils.settings.getMediaTypeFilters.invalidate();
    },
  });

  const setFilters = (filters: MediaTypeFilters) => {
    mutation.mutate(filters);
  };

  return {
    filters: query.data ?? DEFAULT_MEDIA_TYPE_FILTERS,
    setFilters,
    isLoading: query.isLoading,
    isUpdating: mutation.isPending,
  };
};