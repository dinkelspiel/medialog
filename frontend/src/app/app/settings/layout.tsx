"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";

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
        <div className="flex w-[250px] flex-col gap-1">
          <Button variant="ghost">Profile</Button>
          <Button variant="secondary">Appearance</Button>
        </div>
        <div className="flex w-full flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
