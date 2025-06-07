// summaryApi.ts
// Utility functions to get/set the daily summary from the backend

export async function fetchDailySummary(): Promise<string> {
  const res = await fetch("http://localhost:4000/api/ai/summary", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch summary");
  const data = await res.json();
  return data.summary || "";
}

export async function generateDailySummary(emails: any[]): Promise<string> {
  const res = await fetch("http://localhost:4000/api/ai/summary/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ emails }),
  });
  if (res.status === 429) throw new Error("You are being rate limited. Please wait and try again.");
  if (!res.ok) throw new Error("Failed to generate summary");
  const data = await res.json();
  return data.summary || "";
}
