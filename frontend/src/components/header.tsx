import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const Header = ({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        `flex w-full flex-row justify-between border-b border-b-slate-200 pb-4`,
        className,
      )}
    >
      {children}
    </div>
  );
};

export const HeaderContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn(`flex min-w-max flex-col gap-1`, className)} {...props}>
      {children}
    </div>
  );
};

export const HeaderTitle = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn(`text-2xl font-semibold`, className)} {...props}>
      {children}
    </div>
  );
};

export const HeaderSubtext = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(`min-w-max text-sm text-slate-500`, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Header;
