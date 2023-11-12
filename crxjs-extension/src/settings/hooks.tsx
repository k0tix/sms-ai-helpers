import { useState, useEffect } from "react";

export type SettingsConfig = {
  isDark?: boolean;
  getRandomFacts?: boolean;
  hallucinationScore?: number;
  apiUser?: string;
  apiPassword?: string;
};

const defaultSettings: SettingsConfig = {
  isDark: true,
  getRandomFacts: true,
  hallucinationScore: 1,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsConfig>(defaultSettings);

  useEffect(() => {
    console.log("reading settings");
    chrome.storage.sync.get(["settings"], (result) => {
      setSettings(result.settings);
    });
  }, []);

  const saveSettings = (settings?: SettingsConfig) => {
    console.log("Settings saved");

    if (settings === undefined) return;
    chrome.storage.sync.set({ settings }, () => {
      console.log("Settings saved");
    });
    setSettings(settings);
    console.log("Settings saved");
  };

  return { settings, saveSettings };
};
