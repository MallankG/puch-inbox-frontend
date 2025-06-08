import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { EmailItem } from "@/components/ui/email-item";
import { ActionButton } from "@/components/ui/action-button";
import { Search, Zap, Archive, RefreshCw, Settings } from "lucide-react";
import { useEmails } from "../lib/EmailsContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { fetchDailySummary, generateDailySummary } from "../lib/summaryApi";
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';

const SmartInboxPage = () => {
  const [activeTab, setActiveTab] = useState("primary");
  const [searchTerm, setSearchTerm] = useState("");
  const { emails, setEmails, loading, error, refresh: fetchAndSet, forceScan, scanning } = useEmails();
  const [emailsState, setEmailsState] = useState<{ [key: string]: any }>({});
  const { toast } = useToast();
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<any>(null);
  const [labels, setLabels] = useState<string[]>(["PuchInboxArchived"]);
  const [selectedLabel, setSelectedLabel] = useState<string>("PuchInboxArchived");
  const [customLabel, setCustomLabel] = useState<string>("");
  // Remove: const dailySummaryRef = useRef<DailySummaryHandle>(null);
  // Track if emails are from cache or fresh
  const [isCached, setIsCached] = useState<boolean | undefined>(undefined);

  // Patch EmailsContext to set isCached
  // (Assume emails context provides a way to know if emails are cached. If not, patch here.)
  // We'll use a workaround: if scanning is true, emails are being fetched fresh
  // When scanning goes from true to false, emails are fresh
  // When loading is true, emails are being loaded (could be cache or fresh)
  // When loading is false and scanning is false, emails are from cache
  // We'll update isCached accordingly
  // This logic may need to be adjusted if you have a better signal
  useEffect(() => {
    if (scanning) setIsCached(true);
    else if (!loading && !scanning) setIsCached(false);
  }, [loading, scanning]);

  // Merge emails with local state for optimistic updates
  const mergedEmails = emails.map(e => ({
    ...e,
    ...(emailsState[e.id] || {})
  }));

  // Compute tab counts dynamically
  const tabDefs = [
    { value: "primary", label: "Primary" },
    { value: "social", label: "Social" },
    { value: "promotions", label: "Promotions" },
    { value: "updates", label: "Updates" }
  ];
  const tabs = tabDefs.map(tab => ({
    ...tab,
    count: emails.filter(e => e.category === tab.value).length
  }));

  // Filter emails by tab and search
  const filteredEmails = mergedEmails.filter(email => {
    // Defensive: if category is undefined, treat as 'primary' (Gmail fallback)
    const emailCategory = email.category || 'primary';
    const matchesTab = activeTab === "all" || emailCategory === activeTab;
    const matchesSearch = email.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.sender?.toLowerCase().includes(searchTerm.toLowerCase());
    // Do NOT filter out archived emails; show all
    return matchesTab && matchesSearch;
  });

  const fetchLabels = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/user/gmail-labels", { credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data.labels)) {
        setLabels(data.labels);
      } else {
        setLabels(["PuchInboxArchived"]);
      }
    } catch {
      setLabels(["PuchInboxArchived"]);
    }
  };

  const openArchiveDialog = (email: any) => {
    setArchiveTarget(email);
    setSelectedLabel("PuchInboxArchived");
    setCustomLabel("");
    setShowArchiveDialog(true);
    fetchLabels();
  };

  // Add state for summary
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  let lastSummaryRequest = useRef(0);
  const RATE_LIMIT_MS = 60 * 1000;

  // Load summary from backend on mount
  useEffect(() => {
    fetchDailySummary().then(setSummary).catch(() => setSummary(""));
  }, []);

  // Helper: filter emails from last 24h
  function getLast24hEmails() {
    const now = Date.now();
    return emails.filter(e => {
      const dateStr = e.date || e.time;
      if (!dateStr) return false;
      const emailDate = new Date(dateStr).getTime();
      return now - emailDate < 24 * 60 * 60 * 1000;
    });
  }

  // Handler to generate summary
  async function handleGenerateSummary() {
    const now = Date.now();
    if (now - lastSummaryRequest.current < RATE_LIMIT_MS) {
      setSummaryError("You can only generate a new summary once every 60 seconds. Please wait and try again.");
      return;
    }
    lastSummaryRequest.current = now;
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const last24hEmails = getLast24hEmails();
      const aiSummary = await generateDailySummary(last24hEmails);
      setSummary(aiSummary);
    } catch (err: any) {
      setSummaryError(err.message || "Failed to generate summary");
    } finally {
      setSummaryLoading(false);
    }
  }

  // Add state to track last generated email hash
  const [lastEmailHash, setLastEmailHash] = useState<string>("");
  const initialHashSet = useRef(false); // Track if initial hash has been set for this session
  const [lastDeletedId, setLastDeletedId] = useState<string | null>(null); // Restore lastDeletedId state

  // Helper to hash emails for change detection
  function hashEmails(emailArr: any[]): string {
    // Simple hash: join all ids and dates
    return emailArr.map(e => `${e.id}:${e.date || e.time}`).join("|");
  }

  // Effect: set lastEmailHash only once per session, and only generate summary if emails actually change
  useEffect(() => {
    const last24hEmails = getLast24hEmails();
    const newHash = hashEmails(last24hEmails);
    if (!initialHashSet.current) {
      setLastEmailHash(newHash);
      initialHashSet.current = true;
      return;
    }
    if (loading || scanning || isCached === true) return; // Only skip if isCached is explicitly true
    if (lastDeletedId) return;
    if (newHash && newHash !== lastEmailHash) {
      setLastEmailHash(newHash);
      handleGenerateSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emails, loading, scanning, isCached, lastDeletedId]);

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.triggerRefreshSummary) {
      // Simulate clicking the Refresh Summary button
      (async () => {
        setSummaryLoading(true);
        setSummaryError(null);
        try {
          await fetchAndSet();
          await handleGenerateSummary();
        } catch (err: any) {
          setSummaryError(err.message || "Failed to refresh summary");
        } finally {
          setSummaryLoading(false);
        }
      })();
    }
  }, []);

  return (
    <div className="flex flex-col space-y-6 min-h-screen" style={{ overflowY: 'auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Smart Inbox</h1>
          <p className="text-muted-foreground">AI-powered email organization and management</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 min-w-[220px]"
            />
          </div>
          <Button size="sm" variant="outline" onClick={async () => {
            setSummaryLoading(true);
            setSummaryError(null);
            try {
              await fetchAndSet(); // Fetch latest emails from backend
              await handleGenerateSummary(); // Then generate summary
            } catch (err: any) {
              setSummaryError(err.message || "Failed to refresh summary");
            } finally {
              setSummaryLoading(false);
            }
          }} disabled={loading || summaryLoading}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh Summary
          </Button>
        </div>
      </div>
      {scanning && (
        <div className="text-center text-blue-600 dark:text-blue-300 font-medium">Fetching latest mails...</div>
      )}
      {/* Summary Section */}
      <Card className="bg-card text-card-foreground bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Daily Summary</h4>
        {summaryLoading ? (
          <p className="text-blue-800 dark:text-blue-100 text-sm mb-3">Generating summary...</p>
        ) : summaryError ? (
          <p className="text-red-600 dark:text-red-400 text-sm mb-3">{summaryError}</p>
        ) : (
          <div className="prose prose-sm max-w-none text-blue-800 dark:text-blue-100 mb-3 overflow-x-auto break-words whitespace-pre-line">
            <ReactMarkdown>{summary || `You received ${emails.length} new emails today.`}</ReactMarkdown>
          </div>
        )}
      </Card>

      {/* Filters and Search */}
      <Card className="bg-card text-card-foreground">
        <CardContent className="pt-6 space-y-4">
          <FilterTabs
            tabs={tabs}
            defaultValue="primary"
            onValueChange={setActiveTab}
          />
        </CardContent>
      </Card>

      {/* Email List */}
      <div className="space-y-3">
        {loading || scanning ? (
          <Card className="bg-card text-card-foreground">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Processing, validating, and computing your emails...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="bg-card text-card-foreground">
            <CardContent className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        ) : filteredEmails.length > 0 ? (
          filteredEmails.map((email, index) => (
            <EmailItem
              key={index}
              subject={email.subject}
              sender={email.name || email.sender || email.senderName || "Unknown"}
              senderEmail={email.email || email.senderEmail}
              preview={email.snippet || email.preview || ""}
              time={email.time || email.date || ""}
              isRead={Array.isArray(email.labelIds) ? !email.labelIds.includes('UNREAD') : true}
              isImportant={Array.isArray(email.labelIds) ? email.labelIds.includes('STARRED') : false}
              isArchived={Array.isArray(email.labelIds) && labels.some(label => email.labelIds.includes(label))}
              category={email.category}
              attachments={email.attachments}
              // Add a prop to visually distinguish archived emails
              archivedBadge={Array.isArray(email.labelIds) && labels.some(label => email.labelIds.includes(label))}
              onUnstar={async () => {
                setEmailsState(prev => ({
                  ...prev,
                  [email.id]: {
                    ...email,
                    labelIds: (email.labelIds || []).filter(l => l !== 'STARRED')
                  }
                }));
                setEmails(emails.map(e => e.id === email.id ? { ...e, labelIds: (e.labelIds || []).filter(l => l !== 'STARRED') } : e));
                toast({ title: 'Email unstarred', description: email.subject });
                await fetch(`http://localhost:4000/api/user/emails/unstar`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ messageId: email.id })
                });
              }}
              onArchive={async () => {
                // Use the label that will be applied (from dialog)
                openArchiveDialog(email);
              }}
              onUnarchive={async () => {
                // Find the label that caused the archive (any label in labels[] that is present in labelIds)
                const archiveLabel = (email.labelIds || []).find(l => labels.includes(l)) || 'PuchInboxArchived';
                // Optimistic update: remove archiveLabel from labelIds
                setEmailsState(prev => ({
                  ...prev,
                  [email.id]: {
                    ...email,
                    labelIds: (email.labelIds || []).filter(l => l !== archiveLabel)
                  }
                }));
                setEmails(emails.map(e => e.id === email.id ? { ...e, labelIds: (e.labelIds || []).filter(l => l !== archiveLabel) } : e));
                toast({ title: 'Email unarchived', description: email.subject });
                await fetch('http://localhost:4000/api/user/emails/unarchiveOne', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ messageId: email.id, label: archiveLabel })
                });
              }}
              onStar={async () => {
                setEmailsState(prev => ({
                  ...prev,
                  [email.id]: {
                    ...email,
                    labelIds: [...(email.labelIds || []), 'STARRED']
                  }
                }));
                setEmails(emails.map(e => e.id === email.id ? { ...e, labelIds: [...(e.labelIds || []), 'STARRED'] } : e));
                toast({ title: 'Email starred', description: email.subject });
                await fetch(`http://localhost:4000/api/user/emails/star`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ messageId: email.id })
                });
              }}
              onReply={() => {
                const gmailUrl = `https://mail.google.com/mail/u/0/#inbox/${email.id}`;
                window.open(gmailUrl, '_blank');
              }}
              onForward={() => {
                const gmailUrl = `https://mail.google.com/mail/u/0/#inbox/${email.id}`;
                window.open(gmailUrl, '_blank');
              }}
              onDelete={async () => {
                // Optimistically remove from UI
                setEmails(emails.filter(e => e.id !== email.id));
                setEmailsState(prev => {
                  const newState = { ...prev };
                  delete newState[email.id];
                  return newState;
                });
                setLastDeletedId(email.id); // Mark this as a delete
                try {
                  await fetch(`http://localhost:4000/api/user/emails/delete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ messageId: email.id })
                  });
                  toast({ title: 'Email deleted', description: email.subject });
                } catch (err) {
                  toast({ title: 'Failed to delete email', description: email.subject, variant: 'destructive' });
                  // Optionally, re-add the email to the list if deletion fails
                  setEmails([...emails, email]);
                } finally {
                  // Clear the delete marker after a short delay so future changes can trigger summary
                  setTimeout(() => setLastDeletedId(null), 500);
                }
              }}
              onView={() => {
                const gmailUrl = `https://mail.google.com/mail/u/0/#inbox/${email.id}`;
                window.open(gmailUrl, '_blank');
              }}
            />
          ))
        ) : (
          <Card className="bg-card text-card-foreground">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No emails found in this category.</p>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Archive Label Dialog */}
      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Email</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Select Archive Label</label>
            <Select value={selectedLabel} onValueChange={v => setSelectedLabel(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select label" />
              </SelectTrigger>
              <SelectContent>
                {labels.map(label => (
                  <SelectItem key={label} value={label}>{label}</SelectItem>
                ))}
                <SelectItem value="__custom__">Custom...</SelectItem>
              </SelectContent>
            </Select>
            {selectedLabel === "__custom__" && (
              <input
                className="w-full border rounded p-2 mt-2"
                placeholder="Enter custom label"
                value={customLabel}
                onChange={e => setCustomLabel(e.target.value)}
              />
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                if (!archiveTarget) return;
                const labelToUse = selectedLabel === "__custom__" ? (customLabel.trim() || "PuchInboxArchived") : selectedLabel;
                // Optimistic update: add label to labelIds
                setEmailsState(prev => ({
                  ...prev,
                  [archiveTarget.id]: {
                    ...archiveTarget,
                    labelIds: [...(archiveTarget.labelIds || []), labelToUse]
                  }
                }));
                setEmails(emails.map(e => e.id === archiveTarget.id ? { ...e, labelIds: [...(e.labelIds || []), labelToUse] } : e));
                toast({ title: 'Email archived', description: archiveTarget.subject });
                await fetch('http://localhost:4000/api/user/emails/archiveOne', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ messageId: archiveTarget.id, label: labelToUse })
                });
                setShowArchiveDialog(false);
                setArchiveTarget(null);
              }}
              variant="default"
            >
              Archive
            </Button>
            <Button variant="outline" onClick={() => setShowArchiveDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SmartInboxPage;
