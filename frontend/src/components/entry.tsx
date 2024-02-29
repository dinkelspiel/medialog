import React from "react";
import Star from "./icons/star";
import StarHalf from "./icons/starHalf";
import { useMediaQuery } from "usehooks-ts";
import { AspectRatio } from "./ui/aspect-ratio";
import SmallRating from "./smallRating";

interface EntryProps {
  id: number;
  title: string;
  coverUrl: string;
  releaseYear: number;
  rating?: number;
  onClick?: () => void;
}

const Entry = ({
  id,
  title,
  coverUrl,
  releaseYear,
  rating,
  onClick,
}: EntryProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <>
      {isDesktop ? (
        <div
          className="relative h-[255px] w-[170px] cursor-pointer"
          onClick={onClick}
        >
          <img src={coverUrl} className="h-full w-full rounded-md" />
          <div className="absolute bottom-0 flex h-[60%] w-full flex-col justify-end rounded-md bg-gradient-to-t from-slate-900 to-transparent object-cover p-2">
            <div className="flex flex-col gap-1">
              <div className="break-words text-lg font-semibold text-white">
                {title}
              </div>
              <div className="grid grid-cols-2">
                <div className="text-sm text-slate-400">{releaseYear}</div>
                <SmallRating rating={rating} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AspectRatio
          ratio={2 / 3}
          onClick={onClick}
          className="relative cursor-pointer"
        >
          <img src={coverUrl} className="h-full w-full rounded-md" />
        </AspectRatio>
      )}
    </>
  );
};

export default Entry;
