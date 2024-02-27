import React, { useState } from "react";
import Header from "../header";
import SortByDesktop from "./sortByDesktop";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useMediaQuery } from "usehooks-ts";
import Sort from "../icons/sort";
import Xmark from "../icons/xmark";
import { SortByType } from "@/interfaces/sortByType";
import SortByMobile from "./sortByMobile";

interface DashboardHeaderProps {
  sortBy: SortByType;
  setSortBy: (value: SortByType) => void;
}

const DashboardHeader = ({ sortBy, setSortBy }: DashboardHeaderProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  return (
    <div className="flex w-full flex-col gap-4 pb-4">
      <Header
        title="My Media"
        subtext="Search through your entire media catalogue"
      >
        {isDesktop && <SortByDesktop setSortBy={setSortBy} sortBy={sortBy} />}
        <Button
          variant={!showFilters ? `outline` : `secondary`}
          className="w-9 px-0"
          onClick={() => {
            setShowFilters((x) => !x);
          }}
        >
          {!showFilters ? <Sort /> : <Xmark />}
        </Button>
      </Header>
      {showFilters && (
        <div className="flex flex-col gap-4 border-b border-b-slate-200 pb-4">
          <div className="flex flex-col gap-2">
            <Label>Title</Label>
            <Input placeholder="Name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Directors/Writers</Label>
              <Input placeholder="Name" />
            </div>{" "}
            <div className="flex flex-col gap-2">
              <Label>Studios</Label>
              <Input placeholder="Studio Name" />
            </div>
          </div>
          {!isDesktop && <SortByMobile setSortBy={setSortBy} sortBy={sortBy} />}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
