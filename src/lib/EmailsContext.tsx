import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchCachedEmails, forceScanEmails } from "./utils";


interface EmailsContextType {
  emails: any[];
  setEmails: (emails: any[]) => void;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  forceScan: () => Promise<void>;
}

const EmailsContext = createContext<EmailsContextType | undefined>(undefined);

export const EmailsProvider = ({ children }: { children: ReactNode }) => {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch emails only once when the user logs in (provider mounts)
  useEffect(() => {
    fetchAndSet();
    // Only run on mount
    // eslint-disable-next-line
  }, []);

  const fetchAndSet = async () => {
    setLoading(true);
    setError(null);
    try {
      // First try to get cached data
      const data = await fetchCachedEmails();
      if (data.status === "done") {
        // If we have cached data (even if empty), use it
        if (data.cached === true) {
          setEmails(Array.isArray(data.emails) ? data.emails : []);
          setError(null);
        } else {
          // No cache found (first time login or cache expired), automatically trigger a scan
          console.log("No cache found, starting initial Gmail scan...");
          const scanData = await forceScanEmails();
          if (scanData.status === "done") {
            setEmails(Array.isArray(scanData.emails) ? scanData.emails : []);
            setError(null);
          } else if (scanData.status === "processing") {
            setEmails([]);
            setError("Scanning your Gmail for subscriptions. This may take a moment...");
          } else {
            setEmails([]);
            setError("No emails found.");
          }
        }
      } else if (data.status === "processing") {
        setEmails([]);
        setError("Scan is still processing. Please wait...");
      } else {
        setEmails([]);
        setError("No emails found.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch emails");
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const forceScanAndSet = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await forceScanEmails();
      if (data.status === "done") {
        setEmails(Array.isArray(data.emails) ? data.emails : []);
        setError(null);
      } else if (data.status === "processing") {
        setEmails([]);
        setError("Scan is still processing. Please wait...");
      } else {
        setEmails([]);
        setError("No emails found.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to scan emails");
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmailsContext.Provider value={{ emails, setEmails, loading, error, refresh: fetchAndSet, forceScan: forceScanAndSet }}>
      {children}
    </EmailsContext.Provider>
  );
};

export const useEmails = () => {
  const ctx = useContext(EmailsContext);
  if (!ctx) throw new Error("useEmails must be used within an EmailsProvider");
  return ctx;
};