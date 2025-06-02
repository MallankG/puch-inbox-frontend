import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { SubscriptionItem } from "@/components/ui/subscription-item";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import { useSubscriptions } from "@/lib/SubscriptionsContext";

const SubscriptionsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { subscriptions, loading, error, refresh } = useSubscriptions();

  const tabs = [
    { value: "all", label: "All", count: subscriptions.length },
    { value: "free", label: "Free", count: subscriptions.filter(s => s.category === 'free').length },
    { value: "paid", label: "Paid", count: subscriptions.filter(s => s.category === 'paid').length },
    { value: "promotional", label: "Promotional", count: subscriptions.filter(s => s.category === 'promotional').length }
  ];

  const filteredSubscriptions = subscriptions.filter(sub => {
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
                <Button variant="outline" size="sm" onClick={refresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Scan for New Subscriptions
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FilterTabs
              tabs={tabs}
              defaultValue="all"
              onValueChange={setActiveTab}
            />
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
        ) : (subscriptions.length === 0 && !loading && !error) ? (
          <div className="text-center py-12 text-gray-500">No subscriptions found.</div>
        ) : (
          filteredSubscriptions.length > 0 ? (
            filteredSubscriptions.map((subscription, index) => (
              <SubscriptionItem
                key={subscription.id || index}
                {...subscription}
                onUnsubscribe={() => console.log("Unsubscribe", subscription.name)}
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
          )
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
