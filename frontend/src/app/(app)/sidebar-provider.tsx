import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type SidebarSelected = "dashboard" | "community" | "profile" | "settings";

type SidebarContextType = {
  sidebarSelected: SidebarSelected;
  setSidebarSelected: Dispatch<SetStateAction<SidebarSelected>>;
};

const SidebarContex = createContext<SidebarContextType>({
  sidebarSelected: "dashboard",
  setSidebarSelected: () => {},
});

export const useSidebarContext = () => useContext(SidebarContex);

const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarSelected, setSidebarSelected] =
    useState<SidebarSelected>("dashboard");

  return (
    <SidebarContex.Provider value={{ sidebarSelected, setSidebarSelected }}>
      {children}
    </SidebarContex.Provider>
  );
};

export default SidebarProvider;
