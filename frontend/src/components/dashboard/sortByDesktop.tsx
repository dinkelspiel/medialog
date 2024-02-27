import React, { Dispatch, SetStateAction } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Star from "../icons/star";
import Az from "../icons/az";
import Eye from "../icons/eye";
import Pen from "../icons/pen";
import { SortByType } from "@/interfaces/sortByType";

export interface SortByProps {
  sortBy: SortByType;
  setSortBy: (value: SortByType) => void;
}

export const sortByOptions: {
  value: string;
  label: string;
  icon: JSX.Element;
}[] = [
  {
    value: "rating",
    label: "Rating",
    icon: <Star />,
  },
  {
    value: "az",
    label: "A-Z",
    icon: <Az />,
  },
  {
    value: "watched",
    label: "Watched",
    icon: <Eye />,
  },
  {
    value: "updated",
    label: "Updated",
    icon: <Pen />,
  },
];

const SortByDesktop = ({ setSortBy }: SortByProps) => {
  return (
    <Tabs defaultValue={localStorage.getItem("sortBy") ?? "rating"}>
      <TabsList>
        {sortByOptions.map((option, idx) => (
          <TabsTrigger
            key={"tabdesk" + idx}
            value={option.value}
            className="gap-3"
            onClick={() => setSortBy(option.value as SortByType)}
          >
            {option.icon} {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default SortByDesktop;
