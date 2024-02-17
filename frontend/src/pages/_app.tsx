import { type AppType } from "next/dist/shared/lib/utils";

import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
};

export default MyApp;
