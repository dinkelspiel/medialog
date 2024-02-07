import React from "react";
import StarHalf from "./icons/starHalf";
import { cn } from "@/lib/utils";

const Rating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex flex-row justify-center gap-2">
      {[...Array(5)].map((x, i) => (
        <div className="flex flex-row" key={i}>
          <StarHalf
            variant={rating >= (i + 1) * 20 - 10 ? "fill" : "outline"}
            style={{
              height: rating >= (i + 1) * 20 - 10 ? 22 : 19.5,
            }}
            className={cn(
              "w-[11px]",
              rating >= (i + 1) * 20 - 10 ? "fill-primary" : "fill-transparent",
            )}
          />
          <StarHalf
            variant={rating >= (i + 1) * 20 ? "fill" : "outline"}
            style={{
              height: rating >= (i + 1) * 20 ? 22 : 19.5,
            }}
            className={cn(
              "ms-[-2px] w-[11px] scale-x-[-1]",
              rating >= (i + 1) * 20 ? "fill-primary" : "fill-transparent",
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default Rating;
