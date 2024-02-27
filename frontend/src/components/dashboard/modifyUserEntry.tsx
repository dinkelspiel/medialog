import React, { Dispatch, SetStateAction, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import RatingSelector from "../ratingSelector";
import { Textarea } from "../ui/textarea";
import { Toggle } from "../ui/toggle";
import Bookmark from "../icons/bookmark";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Pause from "../icons/pause";
import Xmark from "../icons/xmark";
import FlagCheckered from "../icons/flagCheckered";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { AlertTriangle, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import Rating from "../rating";
import UserEntryData from "@/interfaces/userEntryData";
import { User } from "@/interfaces/user";
import UserEntryStatus from "@/interfaces/userEntryStatus";
import Eye from "../icons/eye";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "../ui/drawer";
import { useMediaQuery } from "usehooks-ts";
import { toast } from "sonner";
import { Slider } from "../ui/slider";
import ModifyUserEntryContent, {
  ModifyUserEntryContentProps,
} from "./modifyUserEntryContent";
import ModifyUserEntrySkeleton from "./modifyUserEntrySkeleton";

export interface ModifyUserEntryProps {
  pendingUserEntryData: boolean;
  userEntryData: UserEntryData | undefined;
  setUserEntryData: Dispatch<SetStateAction<UserEntryData | undefined>>;
  setPendingDataFetch: Dispatch<SetStateAction<boolean>>;
  fetchEntries: (userId: number) => Promise<void>;
  getUserEntryData: (
    userEntryId: number,
    updateExisting?: boolean,
  ) => Promise<void>;
  user: User;
}

const ModifyUserContent = (props: ModifyUserEntryProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <>
      {isDesktop ? (
        <Card className="hidden h-full w-[23vw] grid-rows-[max-content,1fr,max-content] lg:grid">
          {props.pendingUserEntryData && <ModifyUserEntrySkeleton {...props} />}
          {props.userEntryData !== undefined && (
            <ModifyUserEntryContent
              {...(props as ModifyUserEntryContentProps)}
            />
          )}
        </Card>
      ) : (
        <Drawer
          open={props.userEntryData !== undefined || props.pendingUserEntryData}
          onClose={() => {
            props.setUserEntryData(undefined);
            props.setPendingDataFetch(false);
          }}
        >
          <DrawerContent>
            {props.pendingUserEntryData && (
              <ModifyUserEntrySkeleton {...props} />
            )}
            {props.userEntryData !== undefined && (
              <ModifyUserEntryContent
                {...(props as ModifyUserEntryContentProps)}
              />
            )}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default ModifyUserContent;
