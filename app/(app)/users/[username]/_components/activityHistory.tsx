import prisma from '@/server/db';
import { subDays } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SafeUser } from '@/server/auth/validateSession';
import StyleHeader from '@/components/styleHeader';
import { Category } from '@/prisma/generated/browser';

const ActivityHistory = async ({
  profileUser,
  categories,
}: {
  profileUser: NonNullable<SafeUser>;
  categories: Category[];
}) => {
  const activity = await prisma.userActivity.findMany({
    where: {
      userId: profileUser.id,
      createdAt: {
        gte: subDays(new Date(), 200),
      },
      entry: {
        category: {
          in: categories,
        },
      },
    },
    select: {
      createdAt: true,
    },
  });

  const countMap: Record<string, number> = {};
  for (const item of activity) {
    const date = item.createdAt.toDateString();
    countMap[date] = (countMap[date] ?? 0) + 1;
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
      <StyleHeader>Activity History</StyleHeader>

      <div className="flex flex-wrap justify-center gap-1 rounded-lg bg-base-50 p-4 shadow-sm">
        {days.map((day, idx) => (
          <Tooltip key={day.date}>
            <TooltipTrigger asChild>
              <div
                key={idx}
                className={cn('size-3 rounded-sm', {
                  'bg-base-950/5': day.count === 0,
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
