"use client";

import { useState, useCallback } from "react";

export interface AppSettings {
  creditCards: {
    cibilWarningThreshold: number;
    daysBeforeDueWarning: number;
  };
  loans: {
    daysBeforeEmiReminder: number;
  };
  display: {
    currencyFormat: "full" | "compact";
    dateFormat: "dmy" | "mdy";
  };
}

const SETTINGS_KEY = "fin_app_settings";

const defaultSettings: AppSettings = {
  creditCards: {
    cibilWarningThreshold: 30,
    daysBeforeDueWarning: 5,
  },
  loans: {
    daysBeforeEmiReminder: 3,
  },
  display: {
    currencyFormat: "full",
    dateFormat: "dmy",
  },
};

function loadSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    // use defaults
  }
  return defaultSettings;
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const mounted = typeof window !== "undefined";

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, updateSettings, mounted };
}
