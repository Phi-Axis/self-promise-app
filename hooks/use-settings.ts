import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AppSettings {
  notificationEnabled: boolean;
  notificationTime: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  notificationEnabled: true,
  notificationTime: "21:00",
};

const SETTINGS_KEY = "appSettings";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback(
    async (updates: Partial<AppSettings>) => {
      try {
        const newSettings = { ...settings, ...updates };
        setSettings(newSettings);
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      } catch (error) {
        console.error("Failed to update settings:", error);
        // Revert on error
        await loadSettings();
      }
    },
    [settings, loadSettings]
  );

  const resetSettings = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(SETTINGS_KEY);
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(SETTINGS_KEY);
      }
      setSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error("Failed to reset settings:", error);
      throw error;
    }
  }, []);

  return {
    settings,
    isLoading,
    updateSettings,
    resetSettings,
  };
}
