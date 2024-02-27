import React, { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtext: string;
  children?: ReactNode;
}

const Header = ({ title, subtext, children }: HeaderProps) => {
  return (
    <div className="flex w-full flex-row justify-between border-b border-b-slate-200 pb-4">
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-semibold">{title}</div>
        <div className="text-sm text-slate-500">{subtext}</div>
      </div>
      {children}
    </div>
  );
};

export default Header;
