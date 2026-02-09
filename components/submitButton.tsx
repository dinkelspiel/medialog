'use client';

import { Button, ButtonProps } from './ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const SubmitButton = ({
  children,
  isPending,
  className,
  ...props
}: ButtonProps & { isPending: boolean }) => {
  return (
    <Button
      className={cn('w-full', className)}
      disabled={isPending}
      size="sm"
      {...props}
    >
      {isPending && <Loader2 className="animate-spin" />} {children}
    </Button>
  );
};

export default SubmitButton;
