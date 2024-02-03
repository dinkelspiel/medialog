import React from "react";
import Star from "./icons/star";
import StarHalf from "./icons/starHalf";

interface EntryProps {
  title: string;
  coverUrl: string;
  releaseYear: number;
  rating?: number;
  onClick?: () => void;
}

const Entry = ({
  title,
  coverUrl,
  releaseYear,
  rating,
  onClick,
}: EntryProps) => {
  const getRatingAsStars = () => {
    let stars = [];
    for (var i = 0; i < 5; i++) {
      if (Math.floor((rating ?? 0) / 20) > i + 1) {
        stars.push(<Star className="fill-primary h-[16px] w-[16.5px]" />);
      }
    }

    let fraction = (rating ?? 0) / 20 - Math.floor((rating ?? 0) / 20);

    let showHalf = fraction >= 0.3 && fraction <= 0.7;
    let showFull = fraction > 0.7;

    if (showHalf) {
      stars.push(<StarHalf className="fill-primary h-[16px] w-[16.5px]" />);
    }

    if (showFull) {
      stars.push(<Star className="fill-primary h-[16px] w-[16.5px]" />);
    }

    return stars;
  };

  return (
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
            <div className="flex flex-row">{getRatingAsStars()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entry;
