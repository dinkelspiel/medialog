"use client";

import React from "react";
import { useSidebarContext } from "../../sidebar-provider";
import Header from "@/components/header";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { useUserContext } from "../../user-provider";
import { cn } from "@/lib/utils";
import { RatingStyle } from "@/interfaces/user";
import { toast } from "sonner";
import { useSettingContext } from "../settingsProvider";

const Appearance = () => {
  const { setSidebarSelected } = useSidebarContext();
  setSidebarSelected("settings");

  const { setSettingSelected } = useSettingContext();
  setSettingSelected("profile");

  const { user, setUser } = useUserContext();

  if (user === undefined) return <div></div>;

  return (
    <>
      <Header
        title="Profile"
        subtext="Manage your account settings and set e-mail preferences."
      />
      <div className="flex flex-col gap-1.5"></div>
    </>
  );
};

export default Appearance;
