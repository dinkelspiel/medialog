import React from 'react';
import { cn } from '@/lib/utils';
import { Star, StarHalf } from 'lucide-react';

export const getRatingAsStars = (rating: number | undefined) => {
  const stars: React.JSX.Element[] = [];
  for (let i = 0; i < 5; i++) {
    if (Math.floor((rating ?? 0) / 20) >= i + 1) {
      stars.push(
        <Star key={i} strokeWidth={0} className="size-4 fill-primary" />
      );
    }
  }

  const fraction = (rating ?? 0) / 20 - Math.floor((rating ?? 0) / 20);

  const showHalf = fraction >= 0.3 && fraction <= 0.7;
  const showFull = fraction > 0.7;

  if (showHalf) {
    stars.push(
      <StarHalf key={6} strokeWidth={0} className="size-4 fill-primary" />
    );
  }

  if (showFull) {
    stars.push(
      <Star key={7} strokeWidth={0} className="size-4 fill-primary" />
    );
  }

  return stars;
};

const SmallRating = ({
  rating,
  className,
}: {
  rating: number | undefined;
  className?: string;
}) => {
  return (
    <div className={cn(`flex flex-row`, className)}>
      {getRatingAsStars(rating)}
    </div>
  );
};

export default SmallRating;
