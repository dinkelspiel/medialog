import { useState } from "react";
import { ModifyUserEntryProps } from "./modifyUserEntry";
import { useMediaQuery } from "usehooks-ts";
import { toast } from "sonner";
import UserEntryStatus from "@/interfaces/userEntryStatus";
import { CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import Xmark from "../icons/xmark";
import RatingSelector from "../ratingSelector";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Toggle } from "../ui/toggle";
import Bookmark from "../icons/bookmark";
import Eye from "../icons/eye";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import Pause from "../icons/pause";
import FlagCheckered from "../icons/flagCheckered";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import { cn } from "@/lib/utils";
import Rating from "../rating";
import { Slider } from "../ui/slider";
import UpdateInformation from "./updateInformation";

const ModifyUserEntrySkeleton = ({
  pendingUserEntryData,
  userEntryData,
  setUserEntryData,
  fetchEntries,
  getUserEntryData,
  user,
}: ModifyUserEntryProps) => {
  return (
    <>
      <CardHeader className="flex flex-row items-end gap-3">
        <Skeleton className="h-8 w-[60%]" />
        <div className="ms-auto hidden h-full items-start lg:flex">
          <button onClick={() => setUserEntryData(undefined)}>
            <Xmark />
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex h-full w-full flex-col items-center gap-3">
          <div className="flex w-full flex-col space-y-1.5">
            <Skeleton className="h-[14px] w-[45px]" />
            <div className="flex flex-row justify-center gap-2">
              <Skeleton className="h-[22px] w-[150px]" />
            </div>
          </div>
          <div className="flex h-full w-full flex-col space-y-1.5">
            <Skeleton className="h-[14px] w-[40px]" />
            <Skeleton className="h-full w-full" />
          </div>
          <div className="flex w-full flex-col space-y-1.5">
            <Skeleton className="h-[36px] w-full" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex h-full flex-col gap-3">
        <Skeleton className="h-[36px] w-[85px]" />
        <Skeleton className="h-[36px] w-[120px]" />
      </CardFooter>
    </>
  );
};

export default ModifyUserEntrySkeleton;
