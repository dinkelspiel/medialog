'use client';

import Activity from '@/components/activity';
import StyleHeader from '@/components/styleHeader';
import { Category } from '@/prisma/generated/browser';
import { api } from '@/trpc/react';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const RecentActivity = ({
  userId,
  categories,
}: {
  userId: number;
  categories: Category[];
}) => {
  const activity = api.community.getUserActivity.useInfiniteQuery(
    {
      userId,
      categories,
    },
    {
      initialCursor: null,
      getNextPageParam: lastPage => lastPage.nextCursor,
    }
  );

  const entries = activity.data?.pages.flatMap(page => page.activity) ?? [];
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = activity;

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 600
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex flex-col gap-4">
      <StyleHeader>Recent Activity</StyleHeader>
      <div className="flex flex-col gap-3">
        {activity.isLoading && (
          <div className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="size-4 animate-spin" /> Loading activity...
          </div>
        )}
        {activity.isError && (
          <div className="text-lg">Could not load recent activity.</div>
        )}
        {entries.map(item => (
          <Activity
            activity={item}
            title={item.entry.translations[0]?.name || item.entry.originalTitle}
            key={item.id}
          />
        ))}
        {activity.isFetchingNextPage && (
          <div className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="size-4 animate-spin" /> Loading more activity...
          </div>
        )}
        {!activity.isLoading && !activity.isError && entries.length === 0 && (
          <div className="text-lg">No recent activity found</div>
        )}
        {!activity.hasNextPage && entries.length > 0 && (
          <div className="relative py-12">
            <div className="h-px w-full bg-base-200"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 px-4 text-center font-semibold">
              You have reached the end.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;