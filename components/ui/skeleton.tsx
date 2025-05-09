import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-base-500 animate-pulse rounded-md bg-opacity-10',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
