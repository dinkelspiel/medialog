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
  let [hoverRating, setHoverRating] = useState(rating);

  useEffect(() => {
    setHoverRating(rating);
  }, [userEntryId]);

  return (
    <div className="flex flex-row justify-center gap-2">
      {[...Array(5)].map((x, i) => (
        <div className="flex flex-row" key={i}>
          <StarHalf
            variant={hoverRating >= (i + 1) * 20 - 10 ? "fill" : "outline"}
            style={{
              height: hoverRating >= (i + 1) * 20 - 10 ? 22 : 19.5,
            }}
            className={cn(
              "w-[11px]",
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
            style={{
              height: hoverRating >= (i + 1) * 20 ? 22 : 19.5,
            }}
            className={cn(
              "ms-[-2px] w-[11px] scale-x-[-1]",
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
