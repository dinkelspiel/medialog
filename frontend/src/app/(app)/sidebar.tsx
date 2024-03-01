import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { useUserContext } from "./user-provider";
import { Button } from "../../components/ui/button";
import House from "../../components/icons/house";
import UserGroup from "../../components/icons/userGroup";
import { useMediaQuery } from "usehooks-ts";
import Logo from "../../components/icons/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import UserIcon from "../../components/icons/user";
import { useRouter } from "next/navigation";
import { useSidebarContext } from "./sidebar-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Menu from "@/components/icons/menu";

const Sidebar = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return <>{isDesktop ? <Desktop /> : <Mobile />}</>;
};

const Mobile = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 flex cursor-pointer items-center justify-between border-b border-slate-200 bg-white px-8">
        <Logo />
        <Menu
          onClick={() => setOpen(!open)}
          className="h-5 w-5 duration-100 hover:fill-slate-600 active:fill-slate-500"
        />
      </div>
      <div
        className={cn(
          `fixed left-0 top-[72px] z-[1] flex h-[calc(100dvh-72px)] w-[100dvw] flex-col gap-3 bg-white p-4 transition-all duration-200`,
          open ? `translate-x-full` : `translate-x-0`,
        )}
      >
        <Content setOpen={setOpen} />
      </div>
    </>
  );
};

const Desktop = () => {
  return (
    <div className="flex h-[100dvh] w-64 flex-col gap-1 border-r border-r-slate-200 px-3 py-6">
      <div className="px-4 pb-1 text-lg font-semibold">Medialog</div>
      <Content setOpen={() => {}} />
    </div>
  );
};

const Content = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useUserContext();
  const { sidebarSelected } = useSidebarContext();

  const router = useRouter();

  const logOut = () => {
    localStorage.removeItem("sessionToken");
    router.push("/login");
  };

  if (user === undefined) return;

  return (
    <>
      <Link href="/dashboard" onClick={() => setOpen(false)}>
        <Button
          className="w-full justify-start"
          variant={sidebarSelected === "dashboard" ? "default" : "ghost"}
        >
          <House />
          Homepage
        </Button>
      </Link>
      <Button
        className="w-full justify-start"
        variant={sidebarSelected === "community" ? "default" : "ghost"}
      >
        <UserGroup />
        Community
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="mt-auto w-full justify-start py-6"
            variant={
              sidebarSelected === "settings" || sidebarSelected === "profile"
                ? "default"
                : "ghost"
            }
          >
            <UserIcon />
            <div className="flex flex-col items-start space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.username}
              </p>
              <p className="text-xs leading-none">{user.email}</p>
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
            <Link href={`/@${user.username}`} onClick={() => setOpen(false)}>
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
            </Link>
            <Link href="/settings/appearance" onClick={() => setOpen(false)}>
              <DropdownMenuItem className="cursor-pointer">
                Settings
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={() => logOut()}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Sidebar;
