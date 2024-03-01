import React from "react";
import Star from "./icons/star";
import StarHalf from "./icons/starHalf";
import { cn } from "@/lib/utils";

export const getRatingAsStars = (rating: number | undefined) => {
  const stars: React.JSX.Element[] = [];
  for (let i = 0; i < 5; i++) {
    if (Math.floor((rating ?? 0) / 20) >= i + 1) {
      stars.push(<Star key={i} className="h-[16px] w-[16.5px] fill-primary" />);
    }
  }

  const fraction = (rating ?? 0) / 20 - Math.floor((rating ?? 0) / 20);

  const showHalf = fraction >= 0.3 && fraction <= 0.7;
  const showFull = fraction > 0.7;

  if (showHalf) {
    stars.push(
      <StarHalf key={6} className="h-[16px] w-[16.5px] fill-primary" />,
    );
  }

  if (showFull) {
    stars.push(<Star key={7} className="h-[16px] w-[16.5px] fill-primary" />);
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
