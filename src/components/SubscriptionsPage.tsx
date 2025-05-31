
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { SubscriptionItem } from "@/components/ui/subscription-item";
import { Search, Filter, Download, RefreshCw } from "lucide-react";

const SubscriptionsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { value: "all", label: "All", count: 248 },
    { value: "free", label: "Free", count: 156 },
    { value: "paid", label: "Paid", count: 67 },
    { value: "promotional", label: "Promotional", count: 25 }
  ];

  const subscriptions = [
    {
      name: "Medium Daily Digest",
      email: "noreply@medium.com",
      category: 'free' as const,
      frequency: "Daily",
      lastReceived: "2 hours ago",
      status: 'active' as const
    },
    {
      name: "Netflix",
      email: "info@netflix.com",
      category: 'paid' as const,
      frequency: "Monthly",
      lastReceived: "1 week ago",
      cost: "$15.99/month",
      status: 'active' as const
    },
    {
      name: "Amazon Promotions",
      email: "promo@amazon.com",
      category: 'promotional' as const,
      frequency: "Weekly",
      lastReceived: "3 days ago",
      status: 'active' as const
    }
  ];

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesTab = activeTab === "all" || sub.category === activeTab;
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600">Manage all your email subscriptions in one place</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filter Subscriptions</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
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

      {/* Subscriptions List */}
      <div className="space-y-4">
        {filteredSubscriptions.length > 0 ? (
          filteredSubscriptions.map((subscription, index) => (
            <SubscriptionItem
              key={index}
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
              <Button variant="outline" className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Scan for New Subscriptions
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
