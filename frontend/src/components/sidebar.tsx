import React from "react";
import { Button } from "./ui/button";
import House from "./icons/house";
import UserGroup from "./icons/userGroup";
import { useMediaQuery } from "usehooks-ts";
import Logo from "./icons/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserIcon from "./icons/user";
import { User } from "@/interfaces/user";
import { useRouter } from "next/router";

interface SidebarProps {
  user: User;
}

const Sidebar = ({ user }: SidebarProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const router = useRouter();

  const logOut = () => {
    localStorage.removeItem("sessionToken");
    router.push("/login");
  };

  return (
    <>
      {isDesktop ? (
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mt-auto w-full justify-start" variant="ghost">
                <UserIcon />
                <div className="flex flex-col items-start space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.username}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.username}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <a href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                </a>
                <a href="/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    Settings
                  </DropdownMenuItem>
                </a>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => logOut()}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex cursor-pointer items-center justify-between border-b border-slate-200 px-8">
          <Logo />
          <svg
            className="h-5 w-5 duration-100 hover:fill-slate-600 active:fill-slate-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
          </svg>
        </div>
      )}
    </>
  );
};

export default Sidebar;
