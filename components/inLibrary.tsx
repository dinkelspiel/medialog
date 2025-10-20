import React from 'react';
import { Badge } from './ui/badge';
import { Library } from 'lucide-react';

const InLibrary = () => {
  return (
    <Badge
      variant={'secondary'}
      className="flex size-[22px] justify-center px-0.5 text-xs md:size-fit md:px-2.5"
    >
      <span className="hidden md:inline">In Library</span>
      <span className="inline md:hidden">
        <Library className="size-3" />
      </span>
    </Badge>
  );
};

export default InLibrary;
