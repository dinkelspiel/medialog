import "@/styles/globals.css";
import "@/styles/themes.css";
import { Metadata, Viewport } from "next";
import { SettingsProvider } from "./_components/SettingsContext";
import Providers from "./providers";
import { getSettings } from "./_components/settings";
import dotenv from "dotenv"
import path from "path";

dotenv.config({ path: path.resolve("../.env") });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <SettingsProvider settings={settings}>
      <Providers>{children}</Providers>
    </SettingsProvider>
  );
}

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Medialog",
};
