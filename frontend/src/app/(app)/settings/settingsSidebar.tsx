import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useSettingContext } from "./settingsProvider";
import { cn } from "@/lib/utils";

const SettingsSidebar = () => {
  const { settingSelected } = useSettingContext();

  return (
    <div className="flex w-[250px] flex-col gap-1">
      <Link href="/settings/profile" className="w-full">
        <Button
          variant={settingSelected === "profile" ? "secondary" : "ghost"}
          className="w-full"
        >
          Profile
        </Button>
      </Link>
      <Link href="/settings/appearance" className="w-full">
        <Button
          variant={settingSelected === "appearance" ? "secondary" : "ghost"}
          className="w-full"
        >
          Appearance
        </Button>
      </Link>
    </div>
  );
};

export default SettingsSidebar;
