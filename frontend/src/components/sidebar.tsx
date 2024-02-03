import React from "react";
import { Button } from "./ui/button";
import House from "./icons/house";
import UserGroup from "./icons/userGroup";

const Sidebar = () => {
  return (
    <div className="flex h-[100dvh] w-64 flex-col gap-1 border-r border-r-slate-200 px-3 py-6">
      <div className="px-4 pb-1 text-lg font-semibold">Medialog</div>
      <Button className="w-full justify-start">
        <House />
        Homepage
      </Button>
      <Button className="w-full justify-start" variant="ghost">
        <UserGroup />
        Community
      </Button>
    </div>
  );
};

export default Sidebar;
