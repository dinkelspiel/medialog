"use client";

import React from "react";
import { useSidebarContext } from "../../sidebar-provider";

const Appearance = () => {
  const { setSidebarSelected } = useSidebarContext();
  setSidebarSelected("settings");

  return <div>Appearance</div>;
};

export default Appearance;
