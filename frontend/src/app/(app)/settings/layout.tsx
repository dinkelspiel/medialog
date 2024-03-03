"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SettingsSidebar from "./settingsSidebar";
import SettingSidebarProvider from "./settingsProvider";

export default function SettingsLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 px-8 py-6">
      <Header
        title="Settings"
        subtext="Manage your color schemes and account settings"
      />
      <div className="flex flex-row gap-4">
        <SettingSidebarProvider>
          <SettingsSidebar />
          <div className="flex w-full flex-col gap-4">{children}</div>
        </SettingSidebarProvider>
      </div>
    </div>
  );
}
