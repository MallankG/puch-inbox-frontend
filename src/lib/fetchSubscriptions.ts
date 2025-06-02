// Utility to fetch subscriptions from backend
export async function fetchSubscriptions(
  setLoading?: (loading: boolean) => void,
  setError?: (err: string | null) => void
) {
  if (setLoading) setLoading(true);
  try {
    const res = await fetch('http://localhost:4000/api/user/subscriptions', {
      credentials: 'include',
    });
    const data = await res.json();
    if (setLoading) setLoading(false);
    return data;
  } catch (err: any) {
    if (setLoading) setLoading(false);
    if (setError) setError(err.message || 'Failed to fetch subscriptions');
    throw err;
  }
}
