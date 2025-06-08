import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchCachedEmails, forceScanEmails } from "./utils";


interface EmailsContextType {
  emails: any[];
  setEmails: (emails: any[]) => void;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  forceScan: () => Promise<void>;
  scanning: boolean;
}

const EmailsContext = createContext<EmailsContextType | undefined>(undefined);

export const EmailsProvider = ({ children }: { children: ReactNode }) => {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  // On mount: show cached emails instantly, then update with fresh emails in background
  useEffect(() => {
    let isMounted = true;
    const fetchCachedAndUpdate = async () => {
      setLoading(true);
      setError(null);
      setScanning(false);
      try {
        // 1. Fetch cached emails and display instantly
        const cachedData = await fetchCachedEmails();
        if (isMounted && cachedData.status === "done" && cachedData.cached === true) {
          setEmails(Array.isArray(cachedData.emails) ? cachedData.emails : []);
          setError(null);
        } else if (isMounted && cachedData.status === "processing") {
          setEmails([]);
          setError("Processing, validating, and computing your emails...");
        } else if (isMounted) {
          setEmails([]);
          setError("Processing, validating, and computing your emails...");
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Failed to fetch emails");
          setEmails([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }

      // 2. In the background, fetch latest emails and update when ready
      try {
        setScanning(true);
        const freshData = await forceScanEmails();
        if (isMounted && freshData.status === "done") {
          setEmails(Array.isArray(freshData.emails) ? freshData.emails : []);
          setError(null);
        }
      } catch (err: any) {
        // Optionally, handle background fetch errors (do not clear cached emails)
      } finally {
        if (isMounted) setScanning(false);
      }
    };
    fetchCachedAndUpdate();
    return () => { isMounted = false; };
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
          const scanData = await forceScanEmails();
          if (scanData.status === "done") {
            setEmails(Array.isArray(scanData.emails) ? scanData.emails : []);
            setError(null);
          } else if (scanData.status === "processing") {
            setEmails([]);
            setError("Processing, validating, and computing your emails...");
          } else {
            setEmails([]);
            setError("Processing, validating, and computing your emails...");
          }
        }
      } else if (data.status === "processing") {
        setEmails([]);
        setError("Processing, validating, and computing your emails...");
      } else {
        setEmails([]);
        setError("Processing, validating, and computing your emails...");
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
    <EmailsContext.Provider value={{ emails, setEmails, loading, error, refresh: fetchAndSet, forceScan: forceScanAndSet, scanning }}>
      {children}
    </EmailsContext.Provider>
  );
};

export const useEmails = () => {
  const ctx = useContext(EmailsContext);
  if (!ctx) throw new Error("useEmails must be used within an EmailsProvider");
  return ctx;
};