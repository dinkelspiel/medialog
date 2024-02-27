import React, { useEffect, useState } from "react";
import StarHalf from "./icons/starHalf";
import { cn } from "@/lib/utils";

interface RatingSelectorProps {
  rating: number;
  setRating: (rating: number) => void;
  userEntryId: number;
}

const RatingSelector = ({
  setRating,
  rating,
  userEntryId,
}: RatingSelectorProps) => {
  const [hoverRating, setHoverRating] = useState(rating);

  useEffect(() => {
    setHoverRating(rating);
  }, [userEntryId]);

  return (
    <div className="flex flex-row justify-center gap-2">
      {[...(Array(5) as number[])].map((x, i) => (
        <div className="flex flex-row" key={i}>
          <StarHalf
            variant={hoverRating >= (i + 1) * 20 - 10 ? "fill" : "outline"}
            className={cn(
              "h-[44px] w-[22px] lg:h-[22px] lg:w-[11px]",
              rating >= (i + 1) * 20 - 10 ? "fill-primary" : "",
            )}
            onClick={() => {
              setRating((i + 1) * 20 - 10);
            }}
            onMouseEnter={() => {
              setHoverRating((i + 1) * 20 - 10);
            }}
          />
          <StarHalf
            variant={hoverRating >= (i + 1) * 20 ? "fill" : "outline"}
            className={cn(
              "ms-[-4px] h-[44px] w-[22px] scale-x-[-1] lg:ms-[-2px] lg:h-[22px] lg:w-[11px]",
              rating >= (i + 1) * 20 ? "fill-primary" : "",
            )}
            onClick={() => {
              setRating((i + 1) * 20);
            }}
            onMouseEnter={() => {
              setHoverRating((i + 1) * 20);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default RatingSelector;
