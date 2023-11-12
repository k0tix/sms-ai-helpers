import { useState, useEffect, createContext, useContext } from "react";

export type SettingsConfig = {
  isDark?: boolean;
  getRandomFacts?: boolean;
  hallucinationScore?: number;
  apiUser?: string;
  apiPassword?: string;
};

export const defaultSettings: SettingsConfig = {
  isDark: true,
  getRandomFacts: true,
  hallucinationScore: 1,
};

type SettingsContextType = {
  settings: SettingsConfig | undefined;
  saveSettings: (settings?: SettingsConfig) => void;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  saveSettings: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SettingsConfig | undefined>(
    defaultSettings
  );

  useEffect(() => {
    console.log("reading settings");
    chrome.storage.local.get(["settings"]).then((result) => {
      console.log(result);
      setSettings(JSON.parse(result.settings));
    });
  }, []);

  const saveSettings = (settings?: SettingsConfig) => {
    if (settings === undefined) return;
    chrome.storage.local
      .set({ settings: JSON.stringify(settings) })
      .then(() => {
        console.log("Settings saved");
      });
    setSettings(settings);
  };

  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
