import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility to fetch all emails from backend
export async function fetchAllEmails(
  setLoading?: (loading: boolean) => void,
  setError?: (err: string | null) => void
) {
  if (setLoading) setLoading(true);
  try {
    const res = await fetch('http://localhost:4000/api/user/emails', {
      credentials: 'include',
    });
    const data = await res.json();
    if (setLoading) setLoading(false);
    return data;
  } catch (err: any) {
    if (setLoading) setLoading(false);
    if (setError) setError(err.message || 'Failed to fetch emails');
    throw err;
  }
}

// Utility to fetch cached emails only (no Gmail scan)
export async function fetchCachedEmails(
  setLoading?: (loading: boolean) => void,
  setError?: (err: string | null) => void
) {
  if (setLoading) setLoading(true);
  try {
    const res = await fetch('http://localhost:4000/api/user/emails/cached', {
      credentials: 'include',
    });
    const data = await res.json();
    if (setLoading) setLoading(false);
    return data;
  } catch (err: any) {
    if (setLoading) setLoading(false);
    if (setError) setError(err.message || 'Failed to fetch cached emails');
    throw err;
  }
}

// Utility to force scan Gmail for new subscriptions
export async function forceScanEmails(
  setLoading?: (loading: boolean) => void,
  setError?: (err: string | null) => void
) {
  if (setLoading) setLoading(true);
  try {
    const res = await fetch('http://localhost:4000/api/user/emails/scan', {
      credentials: 'include',
    });
    const data = await res.json();
    if (setLoading) setLoading(false);
    return data;
  } catch (err: any) {
    if (setLoading) setLoading(false);
    if (setError) setError(err.message || 'Failed to scan emails');
    throw err;
  }
}

// Utility to unsubscribe from a provider
export async function unsubscribeFromProvider({ email, messageId }: { email: string, messageId: string }) {
  const res = await fetch('http://localhost:4000/api/user/unsubscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, messageId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to unsubscribe');
  }
  return res.json();
}
