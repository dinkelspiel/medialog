import { create } from 'zustand';

type AppStore = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export const useAppStore = create<AppStore>(set => ({
  sidebarOpen: true,
  setSidebarOpen: (open: boolean) => set(() => ({ sidebarOpen: open })),
}));
