import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { SubscriptionItem } from "@/components/ui/subscription-item";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import { useEmails } from "@/lib/EmailsContext";
import { filterAndClassifySubscriptions, unsubscribeFromProvider } from "@/lib/utils";

const SubscriptionsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { emails, loading, error, refresh, forceScan } = useEmails();
  const hasFetched = useRef(false);
  const [unsubscribing, setUnsubscribing] = useState<string | null>(null);
  const [unsubscribeError, setUnsubscribeError] = useState<string | null>(null);
  const [unsubscribeSuccess, setUnsubscribeSuccess] = useState<string | null>(null);

  // Classify subscriptions from all emails
  const subscriptions = filterAndClassifySubscriptions(emails);

  // Remove duplicate subscriptions by email (and name)
  const uniqueSubscriptions = Array.from(
    new Map(subscriptions.map(s => [s.email.toLowerCase() + (s.name?.toLowerCase() || ''), s])).values()
  );

  const tabs = [
    { value: "all", label: "All", count: uniqueSubscriptions.length },
    { value: "Free", label: "Free", count: uniqueSubscriptions.filter(s => s.category === 'Free').length },
    { value: "Paid", label: "Paid", count: uniqueSubscriptions.filter(s => s.category === 'Paid').length },
    { value: "Promotional", label: "Promotional", count: uniqueSubscriptions.filter(s => s.category === 'Promotional').length },
    { value: "Unknown", label: "Unknown", count: uniqueSubscriptions.filter(s => s.category === 'Unknown').length }
  ];

  const filteredSubscriptions = uniqueSubscriptions.filter(sub => {
    const matchesTab = activeTab === "all" || sub.category === activeTab;
    const matchesSearch = sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) || sub.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
                <Button variant="outline" size="sm" onClick={() => { hasFetched.current = false; forceScan(); }}>
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
        {loading ? (
          <div className="text-center py-12 text-gray-500">Processing, validating, and computing your subscriptions...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (filteredSubscriptions.length > 0 ? (
          filteredSubscriptions.map((subscription, index) => (
            <SubscriptionItem
              key={subscription.id || index}
              {...subscription}
              status={unsubscribing === subscription.email ? 'processing' : subscription.status}
              onUnsubscribe={async () => {
                setUnsubscribing(subscription.email);
                setUnsubscribeError(null);
                setUnsubscribeSuccess(null);
                try {
                  const result = await unsubscribeFromProvider({ email: subscription.email, messageId: subscription.id });
                  
                  if (result.url) {
                    // Open the unsubscribe URL in a new tab
                    window.open(result.url, '_blank');
                    setUnsubscribeSuccess(result.message || 'Unsubscribe page opened in new tab');
                  } else {
                    setUnsubscribeSuccess('Unsubscribe request processed');
                  }
                } catch (err: any) {
                  setUnsubscribeError(err.message);
                } finally {
                  setUnsubscribing(null);
                }
              }}
              onArchive={() => console.log("Archive", subscription.name)}
              onMarkImportant={() => console.log("Mark Important", subscription.name)}
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
    </div>
  );
};

export default SubscriptionsPage;
