import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtext: string;
  children?: ReactNode;
  className?: string;
}

const Header = ({ title, subtext, children, className }: HeaderProps) => {
  return (
    <div
      className={cn(
        `flex w-full flex-row justify-between border-b border-b-slate-200 pb-4`,
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-semibold">{title}</div>
        <div className="text-sm text-slate-500">{subtext}</div>
      </div>
      <div className="flex flex-row gap-3">{children}</div>
    </div>
  );
};

export default Header;
