"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { type SiteSettings, DEFAULT_SETTINGS } from "@/server/types/settings.types";

interface SettingsContextType {
  settings: SiteSettings;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
});

export const SettingsProvider: React.FC<{
  children: ReactNode;
  initialSettings?: SiteSettings;
}> = ({ children, initialSettings = DEFAULT_SETTINGS }) => {
  return (
    <SettingsContext.Provider value={{ settings: initialSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SiteSettings => {
  const context = useContext(SettingsContext);
  return context.settings || DEFAULT_SETTINGS;
};
