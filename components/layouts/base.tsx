import { getTheme } from "@/app/_components/settings";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const BaseLayout = async ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const theme = await getTheme();

  return (
    <html>
      <body
        className={cn(
          `theme-${theme} min-h-dvh bg-base-50 font-geist`,
          className
        )}
      >
        {children}
      </body>
    </html>
  );
};

export default BaseLayout;
