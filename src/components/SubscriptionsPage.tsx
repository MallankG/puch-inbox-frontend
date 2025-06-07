import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { SubscriptionItem } from "@/components/ui/subscription-item";
import { Search, Download, RefreshCw } from "lucide-react";
import { unsubscribeFromProvider } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEmails } from "../lib/EmailsContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

const SubscriptionsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const hasFetched = useRef(false);
  const [unsubscribing, setUnsubscribing] = useState<string | null>(null);
  const [archiving, setArchiving] = useState<string | null>(null);
  const [unarchiving, setUnarchiving] = useState<string | null>(null);
  const [unsubscribeError, setUnsubscribeError] = useState<string | null>(null);
  const [unsubscribeSuccess, setUnsubscribeSuccess] = useState<string | null>(null);
  const [subscriptionsState, setSubscriptionsState] = useState<{[key: string]: any}>({});
  const [pendingManualUnsub, setPendingManualUnsub] = useState<{url: string, message?: string} | null>(null);
  const [unsubscribedAlerts, setUnsubscribedAlerts] = useState<string[]>([]);
  const [pendingResubscribe, setPendingResubscribe] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [subscriptionsReady, setSubscriptionsReady] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<any>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string>("PuchInboxArchived");
  const [customLabel, setCustomLabel] = useState<string>("");
  const { scanning: contextScanning } = useEmails();

  // Fetch all subscriptions from MongoDB on mount
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4000/api/user/emails/subscriptions', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'done' && Array.isArray(data.emails)) {
          setSubscriptions(data.emails);
        } else {
          setError(data.error || 'Failed to load subscriptions');
        }
        setLoading(false);
        setSubscriptionsReady(true);
      })
      .catch(err => {
        setError('Failed to load subscriptions');
        setLoading(false);
      });
  }, []);

  // Use subscriptions directly, merging with local state if needed
  const mergedSubscriptions = subscriptions.map(s => ({
    ...s,
    ...(subscriptionsState[s.email?.toLowerCase()] || {})
  }));

  const filteredSubscriptions = mergedSubscriptions.filter(sub => {
    let matchesTab = false;
    if (activeTab === "all") {
      matchesTab = true;
    } else if (activeTab === "Archived") {
      matchesTab = sub.archived === true;
    } else {
      matchesTab = sub.category === activeTab && sub.archived !== true;
    }
    const matchesSearch = sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) || sub.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { value: "all", label: "All", count: mergedSubscriptions.filter(s => s.archived !== true).length },
    { value: "Free", label: "Free", count: mergedSubscriptions.filter(s => s.category === 'Free' && s.archived !== true).length },
    { value: "Paid", label: "Paid", count: mergedSubscriptions.filter(s => s.category === 'Paid' && s.archived !== true).length },
    { value: "Promotional", label: "Promotional", count: mergedSubscriptions.filter(s => s.category === 'Promotional' && s.archived !== true).length },
    { value: "Unknown", label: "Other", count: mergedSubscriptions.filter(s => s.category === 'Unknown' && s.archived !== true).length },
    { value: "Archived", label: "Archived", count: mergedSubscriptions.filter(s => s.archived === true).length },
  ];

  // Scan for new subscriptions (refresh from backend)
  const handleScan = async () => {
    hasFetched.current = false;
    setScanning(true);
    setUnsubscribeError(null);
    setUnsubscribeSuccess(null);
    try {
      const res = await fetch('http://localhost:4000/api/user/emails/subscriptions/scan', { credentials: 'include' });
      const data = await res.json();
      if (data.status === 'done') {
        setSubscriptions(data.emails || []);
        setUnsubscribedAlerts(data.unsubscribedAlerts || []);
      }
    } catch {}
    setScanning(false);
  };

  // Archive handler
  const openArchiveDialog = (subscription: any) => {
    setArchiveTarget(subscription);
    setSelectedLabel("PuchInboxArchived");
    setCustomLabel("");
    setShowArchiveDialog(true);
    fetchLabels();
  };

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

  const handleArchive = async (subscription: any, labelOverride?: string) => {
    setArchiving(subscription.email);
    const labelToUse = labelOverride || (customLabel.trim() ? customLabel.trim() : selectedLabel);
    const res = await fetch('http://localhost:4000/api/user/emails/archive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: subscription.email, label: labelToUse })
    });
    if (res.ok) {
      setSubscriptions(prev => prev.map(s =>
        s.email === subscription.email ? { ...s, archived: true } : s
      ));
      setSubscriptionsState(prev => ({
        ...prev,
        [subscription.email.toLowerCase()]: {
          ...subscription,
          archived: true,
        }
      }));
      setActiveTab(tab => tab);
      toast({
        title: 'Archived',
        description: `${subscription.name || subscription.email} has been archived.`,
      });
    } else {
      toast({
        title: 'Archive Failed',
        description: `Failed to archive ${subscription.name || subscription.email}.`,
        variant: 'destructive',
      });
    }
    setArchiving(null);
    setShowArchiveDialog(false);
    setArchiveTarget(null);
  };
  // Unarchive handler
  const handleUnarchive = async (subscription: any) => {
    setUnarchiving(subscription.email);
    const res = await fetch('http://localhost:4000/api/user/emails/unarchive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: subscription.email })
    });
    if (res.ok) {
      setSubscriptions(prev => prev.map(s =>
        s.email === subscription.email ? { ...s, archived: false } : s
      ));
      setSubscriptionsState(prev => ({
        ...prev,
        [subscription.email.toLowerCase()]: {
          ...subscription,
          archived: false,
        }
      }));
      setActiveTab(tab => tab);
      toast({
        title: 'Unarchived',
        description: `${subscription.name || subscription.email} has been unarchived.`,
      });
    } else {
      toast({
        title: 'Unarchive Failed',
        description: `Failed to unarchive ${subscription.name || subscription.email}.`,
        variant: 'destructive',
      });
    }
    setUnarchiving(null);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const categories = [
      { label: "Free", value: "Free" },
      { label: "Paid", value: "Paid" },
      { label: "Promotional", value: "Promotional" },
      { label: "Other", value: "Unknown" },
      { label: "Archived", value: "Archived" },
    ];
    let y = 10;

    categories.forEach(({ label, value }) => {
      let subs;
      if (value === "Archived") {
        subs = mergedSubscriptions.filter(sub => sub.archived === true);
      } else if (value === "Unknown") {
        subs = mergedSubscriptions.filter(sub => sub.category === "Unknown" && sub.archived !== true);
      } else {
        subs = mergedSubscriptions.filter(sub => sub.category === value && sub.archived !== true);
      }
      if (subs.length === 0) return;

      doc.setFontSize(16);
      doc.text(label, 14, y);
      y += 6;

      // autoTable does not return a value in the default import, so we use doc.lastAutoTable.finalY if available
      autoTable(doc, {
        startY: y,
        head: [["Name", "Email", "Status", "Last Received"]],
        body: subs.map(sub => [
          sub.name || "",
          sub.email || "",
          sub.status || "active",
          // Try multiple possible fields for last received date
          sub.lastReceived || sub.last_received || sub.date || sub.lastSeen || "",
        ]),
        theme: "striped",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [99, 102, 241] },
        margin: { left: 14, right: 14 },
      });
      // Safely get the finalY position for the next table
      y = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : y + 30;
    });

    doc.save("subscriptions.pdf");
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden h-full max-h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground">Manage all your email subscriptions in one place</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      {contextScanning && (
        <div className="text-center text-blue-600 dark:text-blue-300 font-medium">Fetching latest mails...</div>
      )}
      {/* Filters and Search */}
      <div className="px-6 pb-4 shrink-0">
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filter Subscriptions</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleScan}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Scan for New Subscriptions
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full">
              <FilterTabs
                tabs={tabs}
                defaultValue="all"
                onValueChange={setActiveTab}
                className="rounded-lg border bg-background p-1 flex gap-2 shadow-sm w-full flex-nowrap justify-center"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions List */}
      <div className="flex-1 min-h-0 max-h-full overflow-y-auto px-6 pb-6">
        {(loading || scanning || !subscriptionsReady) ? (
          <div className="text-center py-12 text-muted-foreground">Processing, validating, and computing your subscriptions...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (filteredSubscriptions.length > 0 ? (
          filteredSubscriptions.map((subscription, index) => (
            <SubscriptionItem
              key={subscription.id || index}
              {...subscription}
              id={subscription.id || subscription.messageId}
              archived={subscription.archived}
              onArchive={() => openArchiveDialog(subscription)}
              onUnarchive={() => handleUnarchive(subscription)}
              status={(() => {
                const key = subscription.email.toLowerCase();
                const stateStatus = subscriptionsState[key]?.status;
                if (unsubscribing === subscription.email) return 'processing';
                if (archiving === subscription.email) return 'processing';
                if (unarchiving === subscription.email) return 'processing';
                const fallbackStatus = subscription.status;
                const finalStatus = stateStatus || fallbackStatus || 'active';
                return finalStatus;
              })()}
              onUnsubscribe={async () => {
                setUnsubscribing(subscription.email);
                setUnsubscribeError(null);
                setUnsubscribeSuccess(null);
                try {
                  const result = await unsubscribeFromProvider({ email: subscription.email, messageId: subscription.id || subscription.messageId });
                  if (result.url) {
                    setPendingManualUnsub({ url: result.url, message: result.message });
                    // Sync with backend for manual unsubscribe
                    await fetch('http://localhost:4000/api/user/unsubscribe', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({
                        email: subscription.email,
                        messageId: subscription.id || subscription.messageId,
                        lastSeen: subscription.date
                      })
                    });
                    setSubscriptionsState(prev => ({
                      ...prev,
                      [subscription.email.toLowerCase()]: {
                        ...subscription,
                        status: 'unsubscribed',
                      }
                    }));
                    toast({
                      title: 'Marked as Unsubscribed',
                      description: `${subscription.name || subscription.email} is now marked as unsubscribed.`
                    });
                  } else {
                    // Automatic unsubscribe: backend already called in unsubscribeFromProvider
                    toast({
                      title: 'Successfully unsubscribed',
                      description: `${subscription.name || subscription.email} has been unsubscribed.`,
                    });
                    setSubscriptionsState(prev => ({
                      ...prev,
                      [subscription.email.toLowerCase()]: {
                        ...subscription,
                        status: 'unsubscribed',
                      }
                    }));
                  }
                } catch (err: any) {
                  setUnsubscribeError(err.message);
                  toast({
                    title: 'Unsubscribe Failed',
                    description: err.message || 'Failed to unsubscribe. Please try again later.',
                    variant: 'destructive',
                  });
                } finally {
                  setUnsubscribing(null);
                }
              }}
              onSubscribe={async () => {
                // Sync with backend for re-subscribe
                await fetch('http://localhost:4000/api/user/emails/mark-subscribed', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ email: subscription.email, lastSeen: subscription.date })
                });
                setSubscriptionsState(prev => ({
                  ...prev,
                  [subscription.email.toLowerCase()]: {
                    ...subscription,
                    status: 'active',
                  }
                }));
                toast({ title: 'Marked as Subscribed', description: `${subscription.name || subscription.email} is now marked as subscribed.` });
              }}
            />
          ))
        ) : (
          <Card className="bg-card text-card-foreground">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No subscriptions found matching your criteria.</p>
            </CardContent>
          </Card>
        ))}
        {unsubscribeError && (
          <div className="text-center text-red-500 py-2">{unsubscribeError}</div>
        )}
        {unsubscribeSuccess && (
          <div className="text-center text-green-500 py-2">{unsubscribeSuccess}</div>
        )}
      </div>
      {/* Archive Label Dialog */}
      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Subscription</DialogTitle>
            <DialogDescription>
              Choose a label for archiving <b>{archiveTarget?.name || archiveTarget?.email}</b>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block text-sm font-medium">Select an existing label</label>
            <Select value={selectedLabel} onValueChange={setSelectedLabel}>
              <SelectTrigger className="w-full">
                {selectedLabel}
              </SelectTrigger>
              <SelectContent>
                {labels.map(label => (
                  <SelectItem key={label} value={label}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">Or create new label:</span>
              <Input
                value={customLabel}
                onChange={e => setCustomLabel(e.target.value)}
                placeholder="New label name"
                className="w-48"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => archiveTarget && handleArchive(archiveTarget)}
              disabled={archiving === archiveTarget?.email}
            >
              {archiving === archiveTarget?.email ? 'Archiving...' : 'Archive'}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Manual Unsubscribe Alert Dialog */}
      {pendingManualUnsub && (
        <AlertDialog open onOpenChange={open => { if (!open) setPendingManualUnsub(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Manual Unsubscribe Required</AlertDialogTitle>
              <AlertDialogDescription>
                {pendingManualUnsub.message || 'This subscription requires you to manually unsubscribe via a link. Do you want to open the unsubscribe page in a new tab?'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPendingManualUnsub(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                window.open(pendingManualUnsub.url, '_blank');
                setPendingManualUnsub(null);
              }}>Open Link</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Unsubscribed Alert Dialog */}
      {unsubscribedAlerts.length > 0 && pendingResubscribe === null && (
        <AlertDialog open onOpenChange={open => { if (!open) setUnsubscribedAlerts([]); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Previously Unsubscribed Sender</AlertDialogTitle>
              <AlertDialogDescription>
                {(() => {
                  const unsubEmail = unsubscribedAlerts[0];
                  const unsubSub = mergedSubscriptions.find(s => s.email === unsubEmail);
                  const providerName = unsubSub?.name || unsubEmail;
                  return (
                    <>
                      You have received a new email from <b>{providerName}</b>, a sender you previously unsubscribed from.<br />
                      Would you like to mark this sender as subscribed again?
                    </>
                  );
                })()}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setUnsubscribedAlerts([])}>No</AlertDialogCancel>
              <AlertDialogAction onClick={() => setPendingResubscribe(unsubscribedAlerts[0])}>Yes</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {/* Resubscribe API call */}
      {pendingResubscribe && (
        <AlertDialog open onOpenChange={open => { if (!open) setPendingResubscribe(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mark as Subscribed</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to mark {pendingResubscribe} as subscribed again?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPendingResubscribe(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={async () => {
                // Find the subscription object for the pendingResubscribe email
                const resubSub = mergedSubscriptions.find(s => s.email === pendingResubscribe);
                await fetch('http://localhost:4000/api/user/emails/mark-subscribed', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ email: pendingResubscribe, lastSeen: resubSub?.date })
                });
                setPendingResubscribe(null);
                setUnsubscribedAlerts(alerts => alerts.filter(e => e !== pendingResubscribe));
                toast({ title: 'Marked as Subscribed', description: `${pendingResubscribe} is now marked as subscribed.` });
              }}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default SubscriptionsPage;
