import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { SubscriptionItem } from "@/components/ui/subscription-item";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import { useEmails } from "@/lib/EmailsContext";
import { filterAndClassifySubscriptions, unsubscribeFromProvider } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

const SubscriptionsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { emails, setEmails, loading, error, refresh, forceScan } = useEmails();
  const hasFetched = useRef(false);
  const [unsubscribing, setUnsubscribing] = useState<string | null>(null);
  const [unsubscribeError, setUnsubscribeError] = useState<string | null>(null);
  const [unsubscribeSuccess, setUnsubscribeSuccess] = useState<string | null>(null);
  const [subscriptionsState, setSubscriptionsState] = useState<{[key: string]: any}>({});
  const [pendingManualUnsub, setPendingManualUnsub] = useState<{url: string, message?: string} | null>(null);
  const [unsubscribedAlerts, setUnsubscribedAlerts] = useState<string[]>([]);
  const [pendingResubscribe, setPendingResubscribe] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [subscriptionsReady, setSubscriptionsReady] = useState(false);

  // Classify subscriptions from all emails
  const subscriptions = filterAndClassifySubscriptions(emails);

  // Remove duplicate subscriptions by email (and name)
  const uniqueSubscriptions = Array.from(
    new Map(subscriptions.map(s => [s.email.toLowerCase(), {
      ...s,
      ...(subscriptionsState[s.email.toLowerCase()] || {})
    }])).values()
  );

  const filteredSubscriptions = uniqueSubscriptions.filter(sub => {
    const matchesTab = activeTab === "all" || sub.category === activeTab;
    const matchesSearch = sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) || sub.email?.toLowerCase().includes(searchTerm.toLowerCase());
    // Show all subscriptions, both archived and non-archived
    return matchesTab && matchesSearch;
  });

  // Send all subscriptions to backend for upsert (insert if unique)
  useEffect(() => {
    if (uniqueSubscriptions.length > 0) {
      // Only upsert the provider whose status just changed (unsubscribe/subscribe)
      // So, do NOT upsert all subscriptions here on every change
      // Remove this effect or restrict it to only run on initial mount or full scan
    }
    // eslint-disable-next-line
  }, []); // Only run on mount (or remove entirely if not needed)

  const tabs = [
    { value: "all", label: "All", count: uniqueSubscriptions.length },
    { value: "Free", label: "Free", count: uniqueSubscriptions.filter(s => s.category === 'Free').length },
    { value: "Paid", label: "Paid", count: uniqueSubscriptions.filter(s => s.category === 'Paid').length },
    { value: "Promotional", label: "Promotional", count: uniqueSubscriptions.filter(s => s.category === 'Promotional').length },
    { value: "Unknown", label: "Other", count: uniqueSubscriptions.filter(s => s.category === 'Unknown').length }
  ];

  // Fetch unsubscribed list on mount and update subscriptionsState
  useEffect(() => {
    let unsubscribedLoaded = false;
    let emailsLoaded = false;

    // Helper to check if both are loaded
    function checkReady() {
      if (unsubscribedLoaded && emailsLoaded) setSubscriptionsReady(true);
    }

    // Fetch unsubscribed list
    fetch('http://localhost:4000/api/user/emails/unsubscribed', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'done' && Array.isArray(data.emails)) {
          setSubscriptionsState(prev => {
            const updated = { ...prev };
            data.emails.forEach(sub => {
              const key = sub.email.toLowerCase();
              updated[key] = {
                ...sub,
                status: 'unsubscribed',
              };
            });
            return updated;
          });
        }
        unsubscribedLoaded = true;
        checkReady();
      });

    // Listen for emails loaded
    if (!loading) {
      emailsLoaded = true;
      checkReady();
    }
    // If emails are still loading, wait for them
    // This effect only runs on mount, so we need another effect to watch emails/ready
    // eslint-disable-next-line
  }, []);

  // Watch emails loading state to set subscriptionsReady
  useEffect(() => {
    if (!loading) {
      setSubscriptionsReady(prev => {
        // Only set to true if unsubscribedLoaded already ran
        return prev || subscriptionsReady;
      });
    }
    // eslint-disable-next-line
  }, [loading]);

  // Archive handler
  const handleArchive = async (subscription: any) => {
    console.log('[Frontend] Archiving', subscription.email);
    const res = await fetch('http://localhost:4000/api/user/emails/archive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: subscription.email })
    });
    if (res.ok) {
      setSubscriptionsState(prev => ({
        ...prev,
        [subscription.email.toLowerCase()]: {
          ...subscription,
          archived: true,
        }
      }));
      toast({
        title: 'Archived',
        description: `${subscription.name || subscription.email} has been archived.`,
      });
      console.log('[Frontend] Archive success for', subscription.email);
    } else {
      console.error('[Frontend] Archive failed for', subscription.email);
      toast({
        title: 'Archive Failed',
        description: `Failed to archive ${subscription.name || subscription.email}.`,
        variant: 'destructive',
      });
    }
  };
  // Unarchive handler
  const handleUnarchive = async (subscription: any) => {
    console.log('[Frontend] Unarchiving', subscription.email);
    const res = await fetch('http://localhost:4000/api/user/emails/unarchive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: subscription.email })
    });
    if (res.ok) {
      setSubscriptionsState(prev => ({
        ...prev,
        [subscription.email.toLowerCase()]: {
          ...subscription,
          archived: false,
        }
      }));
      toast({
        title: 'Unarchived',
        description: `${subscription.name || subscription.email} has been unarchived.`,
      });
      console.log('[Frontend] Unarchive success for', subscription.email);
    } else {
      console.error('[Frontend] Unarchive failed for', subscription.email);
      toast({
        title: 'Unarchive Failed',
        description: `Failed to unarchive ${subscription.name || subscription.email}.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden h-full max-h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600">Manage all your email subscriptions in one place</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 pb-4 shrink-0">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filter Subscriptions</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={async () => {
                  hasFetched.current = false;
                  setScanning(true);
                  setUnsubscribeError(null);
                  setUnsubscribeSuccess(null);
                  try {
                    const res = await fetch('http://localhost:4000/api/user/emails/subscriptions/scan', { credentials: 'include' });
                    const data = await res.json();
                    if (data.status === 'done') {
                      setEmails(data.emails || []);
                      setUnsubscribedAlerts(data.unsubscribedAlerts || []);
                    }
                  } catch {}
                  setScanning(false);
                }}>
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
                className="rounded-lg border bg-white dark:bg-gray-800 p-1 flex gap-2 shadow-sm w-full flex-nowrap justify-center"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
        {(!subscriptionsReady || loading || scanning) ? (
          <div className="text-center py-12 text-gray-500">Processing, validating, and computing your subscriptions...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (filteredSubscriptions.length > 0 ? (
          filteredSubscriptions.map((subscription, index) => (
            <SubscriptionItem
              key={subscription.id || index}
              {...subscription}
              archived={subscription.archived}
              onArchive={() => handleArchive(subscription)}
              onUnarchive={() => handleUnarchive(subscription)}
              onMarkImportant={() => console.log("Mark Important", subscription.name)}
              status={
                (() => {
                  const key = subscription.email.toLowerCase();
                  const stateStatus = subscriptionsState[key]?.status;
                  const fallbackStatus = (unsubscribing === subscription.email ? 'processing' : subscription.status);
                  const finalStatus = stateStatus || fallbackStatus || 'active';
                  return finalStatus;
                })()
              }
              onUnsubscribe={async () => {
                setUnsubscribing(subscription.email);
                setUnsubscribeError(null);
                setUnsubscribeSuccess(null);
                try {
                  const result = await unsubscribeFromProvider({ email: subscription.email, messageId: subscription.id });
                  if (result.url) {
                    setPendingManualUnsub({ url: result.url, message: result.message });
                    // Sync with backend for manual unsubscribe
                    await fetch('http://localhost:4000/api/user/unsubscribe', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({ email: subscription.email, messageId: subscription.id, lastSeen: subscription.date })
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
                    setUnsubscribeSuccess('Unsubscribe request processed');
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
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No subscriptions found matching your criteria.</p>
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
                You have received a new email from a sender you previously unsubscribed from.<br />
                Would you like to mark this sender as subscribed again?
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
                const resubSub = uniqueSubscriptions.find(s => s.email === pendingResubscribe);
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
