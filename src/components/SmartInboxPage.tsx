import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { EmailItem } from "@/components/ui/email-item";
import { ActionButton } from "@/components/ui/action-button";
import { Search, Zap, Archive, RefreshCw, Settings } from "lucide-react";

const SmartInboxPage = () => {
  const [activeTab, setActiveTab] = useState("primary");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { value: "primary", label: "Primary", count: 12 },
    { value: "social", label: "Social", count: 8 },
    { value: "promotions", label: "Promotions", count: 23 },
    { value: "updates", label: "Updates", count: 15 }
  ];

  const emails = [
    {
      subject: "Your weekly summary is ready",
      sender: "team@company.com",
      preview: "Here's what happened this week in your projects...",
      time: "2h ago",
      isRead: false,
      isImportant: true,
      category: 'primary' as const
    },
    {
      subject: "New connection request",
      sender: "linkedin@updates.com",
      preview: "John Doe wants to connect with you on LinkedIn...",
      time: "4h ago",
      isRead: true,
      isImportant: false,
      category: 'social' as const
    },
    {
      subject: "Flash Sale - 50% Off Everything!",
      sender: "deals@store.com",
      preview: "Don't miss out on our biggest sale of the year...",
      time: "6h ago",
      isRead: true,
      isImportant: false,
      category: 'promotions' as const
    }
  ];

  const filteredEmails = emails.filter(email => {
    const matchesTab = activeTab === "all" || email.category === activeTab;
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.sender.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Smart Inbox</h1>
          <p className="text-muted-foreground">AI-powered email organization and management</p>
        </div>
        <div className="flex space-x-2">
          <ActionButton
            icon={Zap}
            label="AI Summary"
            variant="default"
          />
          <ActionButton
            icon={Archive}
            label="Bulk Archive"
            variant="outline"
          />
          <ActionButton
            icon={Settings}
            label="Settings"
            variant="outline"
          />
        </div>
      </div>

      {/* AI Insights */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-500" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Daily Summary</h4>
            <p className="text-blue-800 dark:text-blue-100 text-sm mb-3">
              You received 23 new emails today. 12 are primary, 8 are social updates, and 3 require immediate attention.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh Summary
              </Button>
              <Button size="sm" variant="outline">
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="bg-card text-card-foreground">
        <CardContent className="pt-6 space-y-4">
          <FilterTabs
            tabs={tabs}
            defaultValue="primary"
            onValueChange={setActiveTab}
          />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Email List */}
      <div className="space-y-3">
        {filteredEmails.length > 0 ? (
          filteredEmails.map((email, index) => (
            <EmailItem
              key={index}
              {...email}
              onArchive={() => console.log("Archive", email.subject)}
              onStar={() => console.log("Star", email.subject)}
              onReply={() => console.log("Reply", email.subject)}
              onForward={() => console.log("Forward", email.subject)}
              onDelete={() => console.log("Delete", email.subject)}
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
    </div>
  );
};

export default SmartInboxPage;
