import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchSubscriptions } from "./fetchSubscriptions";

interface SubscriptionsContextType {
  subscriptions: any[];
  setSubscriptions: (subs: any[]) => void;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

export const SubscriptionsProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSet = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSubscriptions();
      if (data.status === "done") {
        setSubscriptions(Array.isArray(data.subscriptions) ? data.subscriptions : []);
        setError(null);
      } else if (data.status === "processing") {
        setSubscriptions([]);
        setError("Scan is still processing. Please wait...");
      } else {
        setSubscriptions([]);
        setError("No subscriptions found.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch subscriptions");
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSet();
  }, []);

  return (
    <SubscriptionsContext.Provider value={{ subscriptions, setSubscriptions, loading, error, refresh: fetchAndSet }}>
      {children}
    </SubscriptionsContext.Provider>
  );
};

export const useSubscriptions = () => {
  const ctx = useContext(SubscriptionsContext);
  if (!ctx) throw new Error("useSubscriptions must be used within a SubscriptionsProvider");
  return ctx;
};
