import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, Mail, Calendar, DollarSign, AlertTriangle } from "lucide-react";

const SubscriptionsPage = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const subscriptions = [
    {
      id: "1",
      sender: "Netflix",
      email: "info@netflix.com",
      frequency: "Monthly",
      lastReceived: "2 days ago",
      status: "subscribed",
      type: "paid",
      cost: "$15.99",
      category: "Entertainment"
    },
    {
      id: "2",
      sender: "Medium Daily Digest",
      email: "noreply@medium.com",
      frequency: "Daily",
      lastReceived: "1 hour ago",
      status: "subscribed",
      type: "free",
      cost: "Free",
      category: "Newsletter"
    },
    {
      id: "3",
      sender: "Amazon Promotions",
      email: "promo@amazon.com",
      frequency: "Weekly",
      lastReceived: "3 days ago",
      status: "subscribed",
      type: "promo",
      cost: "Free",
      category: "Shopping"
    },
    {
      id: "4",
      sender: "GitHub Notifications",
      email: "noreply@github.com",
      frequency: "As needed",
      lastReceived: "5 minutes ago",
      status: "subscribed",
      type: "notification",
      cost: "Free",
      category: "Development"
    }
  ];

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleBulkUnsubscribe = () => {
    console.log("Bulk unsubscribe:", selectedItems);
    // Implementation would go here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "subscribed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "unsubscribed": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "processing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "paid": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "free": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "promo": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "notification": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage all your email subscriptions in one place</p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedItems.length > 0 && (
            <Button onClick={handleBulkUnsubscribe} variant="destructive" size="sm">
              Unsubscribe ({selectedItems.length})
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search subscriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold">{subscriptions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
                <p className="text-2xl font-bold">{subscriptions.filter(s => s.type === 'paid').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Promo</p>
                <p className="text-2xl font-bold">{subscriptions.filter(s => s.type === 'promo').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'subscribed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="free">Free</TabsTrigger>
          <TabsTrigger value="promo">Promo</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredSubscriptions.map((subscription) => (
            <Card key={subscription.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedItems.includes(subscription.id)}
                      onCheckedChange={() => handleSelectItem(subscription.id)}
                    />
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{subscription.sender[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{subscription.sender}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{subscription.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(subscription.status)}>
                          {subscription.status}
                        </Badge>
                        <Badge className={getTypeColor(subscription.type)}>
                          {subscription.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Frequency: {subscription.frequency}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last: {subscription.lastReceived}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{subscription.cost}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Archive</Button>
                    <Button variant="destructive" size="sm">Unsubscribe</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Other tab contents would filter the data accordingly */}
        <TabsContent value="paid" className="space-y-4">
          {filteredSubscriptions.filter(sub => sub.type === 'paid').map((subscription) => (
            <Card key={subscription.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedItems.includes(subscription.id)}
                      onCheckedChange={() => handleSelectItem(subscription.id)}
                    />
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{subscription.sender[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{subscription.sender}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{subscription.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(subscription.status)}>
                          {subscription.status}
                        </Badge>
                        <Badge className={getTypeColor(subscription.type)}>
                          {subscription.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Frequency: {subscription.frequency}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last: {subscription.lastReceived}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{subscription.cost}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Archive</Button>
                    <Button variant="destructive" size="sm">Unsubscribe</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="free" className="space-y-4">
          {filteredSubscriptions.filter(sub => sub.type === 'free').map((subscription) => (
            <Card key={subscription.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedItems.includes(subscription.id)}
                      onCheckedChange={() => handleSelectItem(subscription.id)}
                    />
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{subscription.sender[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{subscription.sender}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{subscription.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(subscription.status)}>
                          {subscription.status}
                        </Badge>
                        <Badge className={getTypeColor(subscription.type)}>
                          {subscription.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Frequency: {subscription.frequency}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last: {subscription.lastReceived}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{subscription.cost}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Archive</Button>
                    <Button variant="destructive" size="sm">Unsubscribe</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="promo" className="space-y-4">
          {filteredSubscriptions.filter(sub => sub.type === 'promo').map((subscription) => (
            <Card key={subscription.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedItems.includes(subscription.id)}
                      onCheckedChange={() => handleSelectItem(subscription.id)}
                    />
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{subscription.sender[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{subscription.sender}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{subscription.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(subscription.status)}>
                          {subscription.status}
                        </Badge>
                        <Badge className={getTypeColor(subscription.type)}>
                          {subscription.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Frequency: {subscription.frequency}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last: {subscription.lastReceived}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{subscription.cost}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Archive</Button>
                    <Button variant="destructive" size="sm">Unsubscribe</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionsPage;
