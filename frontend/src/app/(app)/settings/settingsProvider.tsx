import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type SettingSelected = "profile" | "appearance";

type SettingContextType = {
  settingSelected: SettingSelected;
  setSettingSelected: Dispatch<SetStateAction<SettingSelected>>;
};

const SettingContext = createContext<SettingContextType>({
  settingSelected: "profile",
  setSettingSelected: () => {},
});

export const useSettingContext = () => useContext(SettingContext);

const SettingSidebarProvider = ({ children }: { children: ReactNode }) => {
  const [settingSelected, setSettingSelected] =
    useState<SettingSelected>("profile");

  return (
    <SettingContext.Provider value={{ settingSelected, setSettingSelected }}>
      {children}
    </SettingContext.Provider>
  );
};

export default SettingSidebarProvider;
