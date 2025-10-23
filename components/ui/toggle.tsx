import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const toggleVariants = cva(
  'group gap-1.5 inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-muted hover:text-base-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-base-950 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:fill-primary-foreground',
  {
    variants: {
      variant: {
        default: 'bg-base-200/50',
        outline:
          'border border-base-100 bg-transparent shadow-sm hover:bg-base-50 hover:text-base-900 data-[state=on]:border-0',
      },
      size: {
        default: 'h-9 px-3',
        sm: 'h-8 px-2',
        lg: 'h-10 px-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
