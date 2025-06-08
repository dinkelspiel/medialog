import prisma from '@/server/db';
import { User } from '@prisma/client';
import React from 'react';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ActivityHistory = async ({ profileUser }: { profileUser: User }) => {
  const entriesPerDay: {
    date: string;
    count: bigint;
  }[] = await prisma.$queryRawUnsafe(`
    SELECT 
      DATE(watchedAt) as date,
      COUNT(*) as count
    FROM UserEntry
    WHERE 
      userId = '${profileUser.id}'
      AND status = 'completed'
      AND watchedAt IS NOT NULL
      AND watchedAt >= CURDATE() - INTERVAL 200 DAY
    GROUP BY DATE(watchedAt)
    ORDER BY date ASC;
  `);

  const countMap: Record<string, number> = {};
  for (const entry of entriesPerDay) {
    countMap[new Date(entry.date).toDateString()] = Number(entry.count);
  }

  const days = Array.from({ length: 200 }, (_, i) => {
    const date = subDays(new Date(), i).toDateString();
    return {
      date,
      count: countMap[date] || 0,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full justify-between border-b border-b-base-200 pb-2 text-lg font-medium">
        Activity History
      </div>

      <div className="flex flex-wrap justify-center gap-1 rounded-lg bg-base-50 p-4 shadow-sm">
        {days.map((day, idx) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                key={idx}
                className={cn('size-3 rounded-sm bg-opacity-5', {
                  'bg-base-950': day.count === 0,
                })}
                style={{
                  backgroundColor: day.count
                    ? `rgba(132, 204, 22, ${Math.max(0.5, Math.min(1, day.count / 5))})`
                    : undefined,
                }}
              ></div>
            </TooltipTrigger>
            <TooltipContent>
              {day.date} {day.count !== 0 && `(${day.count})`}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default ActivityHistory;
