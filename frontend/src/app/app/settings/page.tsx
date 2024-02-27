"use client";

import React from "react";
import { useSidebarContext } from "../sidebar-provider";
import { redirect } from "next/navigation";

const Settings = () => {
  return redirect("/app/settings/appearance");
};

export default Settings;
