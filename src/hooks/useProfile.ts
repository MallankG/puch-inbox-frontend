import { useState, useEffect } from "react";

export interface Profile {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  phoneVerified?: boolean;
  address?: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    locationServices: boolean;
    eventReminders: boolean;
    privacySettings: boolean;
    appNotifications: boolean;
  };
  security: {
    password?: string;
    twoFactor?: string;
  };
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, { credentials: "include" })
      .then(res => res.json())
      .then(user => {
        if (!user?.user?.email) throw new Error("No user");
        return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/${user.user.email}` , { credentials: "include" });
      })
      .then(res => {
        if (!res.ok) throw new Error("No profile");
        return res.json();
      })
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const updateProfile = async (data: Partial<Profile>) => {
    setLoading(true);
    setError(null);
    try {
      const userRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, { credentials: "include" });
      const user = await userRes.json();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/${user.user.email}` , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setProfile(updated);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile };
}
