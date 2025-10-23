import { ReactNode } from "react";
import { Toaster } from "sonner";
import { getTheme } from "../_components/settings";

const Layout = async ({ children }: { children: ReactNode }) => {
  const theme = await getTheme();

  return (
    <div className={`theme-${theme} min-h-[100dvh]`}>
      {children}
      <Toaster />
    </div>
  );
};

export default Layout;
