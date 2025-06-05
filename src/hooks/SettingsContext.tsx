import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Settings } from "./useSettings";

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (data: Partial<Settings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/user/me", { credentials: "include" })
      .then(res => res.json())
      .then(user => {
        if (user?.user?.id || user?.user?._id || user?.user?.email) {
          setUserId(user.user.id || user.user._id || user.user.email);
        } else {
          setUserId(null);
        }
      })
      .catch(() => setUserId(null));
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`http://localhost:4000/api/settings/${userId}`, { credentials: "include" })
      .then(res => res.json())
      .then(setSettings)
      .catch(() => setSettings(null))
      .finally(() => setLoading(false));
  }, [userId]);

  const updateSettings = async (data: Partial<Settings>) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:4000/api/settings/${userId}` , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to update settings");
      const updated = await res.json();
      setSettings(updated);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, error, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettingsContext() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettingsContext must be used within a SettingsProvider");
  return ctx;
}
