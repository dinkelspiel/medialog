'use client';

import { useEffect } from 'react';

export const useInfiniteScroll = ({
  enabled,
  onLoadMore,
  threshold = 600,
}: {
  enabled: boolean;
  onLoadMore: () => void;
  threshold?: number;
}) => {
  useEffect(() => {
    const handleScroll = () => {
      if (
        enabled &&
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - threshold
      ) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled, onLoadMore, threshold]);
};