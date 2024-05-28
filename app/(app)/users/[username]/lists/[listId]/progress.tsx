'use client';
import { Progress } from '@/components/ui/progress';
import React from 'react';

const CompletionProgress = ({
  max,
  current,
}: {
  max: number;
  current: number;
}) => {
  return (
    <div className="flex items-center gap-2">
      0 <Progress max={max} value={current} /> {max}
    </div>
  );
};

export default CompletionProgress;
