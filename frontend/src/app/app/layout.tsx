"use client";

import Sidebar from "./sidebar";
import SidebarProvider from "./sidebar-provider";
import UserProvider from "./user-provider";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className=" w-[100dvw]  text-slate-900">
      <UserProvider>
        <SidebarProvider>
          <div className="grid grid-cols-1 grid-rows-[72px,1fr] lg:grid-cols-[256px,1fr] lg:grid-rows-1">
            <Sidebar />
            {children}
          </div>
        </SidebarProvider>
      </UserProvider>
      <Toaster />
    </main>
  );
}
