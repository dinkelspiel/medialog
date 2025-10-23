"use client";

import { useAuthUser } from "@/app/(app)/_components/AuthUserContext";
import { useAppStore } from "@/app/(app)/state";
import SettingsView from "@/components/islands/settings";
import {
  LogIn,
  Menu,
  PanelLeft,
  Plus,
  Settings,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import React, {
  Dispatch,
  memo,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { cn } from "../lib/utils";
import AddLog from "./addLog";
import { Button } from "./ui/button";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Feedback } from "@/app/(app)/_components/feedback";
import { IslandDialog } from "./islands/islands";

const SettingsButton = memo(function SettingsButton({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <IslandDialog open={open} setOpen={setOpen} title={"Settings"}>
      <SettingsView />
    </IslandDialog>
  );
});

export const Header = ({
  className,
  titleComponent,
  children,
  sidebarContent,
}: React.HTMLAttributes<HTMLDivElement> & {
  titleComponent: ReactNode;
  sidebarContent: ReactNode;
}) => {
  const user = useAuthUser();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { setSidebarOpen, sidebarOpen } = useAppStore();
  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex h-16 items-center justify-between gap-2 border-b border-b-base-200 bg-base-50 p-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {user && (
          <Button
            size={"icon"}
            variant={"ghost"}
            className="hidden lg:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <PanelLeft className="stroke-base-600" />
          </Button>
        )}
        <div className="whitespace-nowrap text-sm font-medium text-base-600">
          {titleComponent}
        </div>
      </div>
      {children}
      <div className="hidden items-center gap-2 lg:flex">
        {user && (
          <>
            {" "}
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="stroke-base-600" />
            </Button>{" "}
            <Link href={`/@${user && user.username}`}>
              <Button variant={"outline"}>
                <UserRound className="size-4 stroke-base-600" />{" "}
                {user && user.username}
              </Button>
            </Link>
          </>
        )}
        {!user && (
          <Link href={`/auth/login`}>
            <Button variant={"default"} size={"sm"}>
              <LogIn className="size-4" /> Sign in
            </Button>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        {!user && (
          <Link href={`/auth/login`} className="w-full">
            <Button variant={"default"} size={"sm"} className="w-full">
              <LogIn className="size-4" /> Sign in
            </Button>
          </Link>
        )}
        {user && (
          <AddLog>
            <Button className="flex lg:hidden" size="sm" variant={"outline"}>
              <Plus className="size-4 stroke-base-600" />
              Log Media
            </Button>
          </AddLog>
        )}
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              size={"icon"}
              variant={"ghost"}
              className={cn("flex aspect-square lg:hidden", {
                hidden: !user,
              })}
            >
              <Menu className="stroke-base-600" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DialogHeader className="sr-only">
              <DialogTitle>Burger Menu</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 p-4">{sidebarContent}</div>
            <div className="flex flex-col gap-2 p-4">
              <div className="text-sm font-normal text-base-400">
                {process.env.GIT_COMMIT
                  ? `${process.env.GIT_COMMIT}@${process.env.GIT_BRANCH}`
                  : "dev"}
              </div>
              <div className="flex gap-2">
                <Feedback />
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className="w-full"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings className="stroke-base-600" /> Settings
                </Button>
              </div>
              <Link href={`/@${user && user.username}`} className="w-full">
                <Button variant={"outline"} size="sm" className="w-full">
                  <UserRound className="size-4 stroke-base-600" />{" "}
                  {user && user.username}
                </Button>
              </Link>
            </div>
          </DrawerContent>
        </Drawer>
        <SettingsButton open={settingsOpen} setOpen={setSettingsOpen} />
      </div>
    </div>
  );
};

export const HeaderHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <Button size={"icon"} variant={"ghost"} onClick={() => "setOpen(!open)"}>
        <PanelLeft className="stroke-base-600" />
      </Button>
      {children}
    </div>
  );
};

export const HeaderTitle = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("text-sm font-medium text-base-600", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const HeaderDescription = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("w-full text-base-500 xl:w-max", className)} {...props}>
      {children}
    </div>
  );
};

export const HeaderContent = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex w-full items-center justify-end gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
};
