'use client';

import React from 'react';
import { Button, ButtonProps } from './ui/button';
import { cn } from '@/lib/utils';
import { useFormStatus } from 'react-dom';
import { Loader } from 'lucide-react';

const SubmitButton = ({ children, className, ...props }: ButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button className={cn('w-full', className)} size="sm" {...props}>
      {!pending ? children : <Loader className="animate-spin" />}
    </Button>
  );
};

export default SubmitButton;
