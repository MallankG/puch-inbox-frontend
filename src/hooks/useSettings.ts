import { useState, useEffect } from "react";
import { useSettingsContext } from "./SettingsContext";

export interface Settings {
  notifications: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    pushNotifications: boolean;
    weeklyDigest: boolean;
  };
  preferences: {
    smartReplyTone: "formal" | "friendly" | "casual" | "professional";
    defaultView: "smart" | "traditional" | "compact";
    theme: "light" | "dark" | "system";
    autoArchive: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
    aiImprovement: boolean;
  };
}

export function useSettings() {
  try {
    return useSettingsContext();
  } catch {
    // fallback for legacy usage outside provider
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Fetch userId on mount
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

    // Fetch settings when userId is available
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

    return { settings, loading, error, updateSettings };
  }
}
