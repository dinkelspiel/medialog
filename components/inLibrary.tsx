import React from 'react';
import { Badge } from './ui/badge';
import { Library } from 'lucide-react';
import { cn } from '@/lib/utils';

const InLibrary = () => {
  return (
    <Badge
      variant={'secondary'}
      className={cn("flex size-5.5 justify-center px-1 py-0.5 text-xs md:size-fit md:h-5.5")}
    >
      <span className="inline">
        <Library className="size-3" />
      </span>
    </Badge>
  );
};

export default InLibrary;
