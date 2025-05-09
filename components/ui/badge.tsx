import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-base-950 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-base-500 text-base-50 shadow hover:bg-base-500 hover-bg-opacity-80',
        secondary:
          'border-transparent bg-base-50 text-base-900 hover:bg-base-50 hover:bg-opacity-80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive hover:bg-opacity-80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
