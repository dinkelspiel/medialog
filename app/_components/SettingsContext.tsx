'use client';

import { Language, Theme } from '@/prisma/generated/client';
import { createContext, useContext } from 'react';

export type Settings = {
  theme: Theme;
  showMediaMetaIn: Language;
};
const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({
  settings,
  children,
}: {
  settings: Settings;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
