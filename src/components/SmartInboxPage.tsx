import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, Archive, Reply, Trash2, Clock, Tag } from "lucide-react";

const SmartInboxPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const emails = [
    {
      id: "1",
      sender: "John Doe",
      email: "john@company.com",
      subject: "Project Update - Q4 Planning",
      preview: "Hi there, I wanted to give you an update on our Q4 planning session...",
      time: "2 min ago",
      category: "important",
      aiLabel: "Urgent",
      isRead: false,
      hasAttachment: true
    },
    {
      id: "2",
      sender: "GitHub",
      email: "noreply@github.com",
      subject: "Pull Request Review Requested",
      preview: "You've been requested to review a pull request in repository...",
      time: "15 min ago",
      category: "important",
      aiLabel: "Action Required",
      isRead: false,
      hasAttachment: false
    },
    {
      id: "3",
      sender: "TechCrunch",
      email: "newsletter@techcrunch.com",
      subject: "Daily Tech News Digest",
      preview: "Today's top stories: AI breakthrough, startup funding rounds...",
      time: "1 hour ago",
      category: "newsletters",
      aiLabel: "Newsletter",
      isRead: true,
      hasAttachment: false
    },
    {
      id: "4",
      sender: "Amazon",
      email: "orders@amazon.com",
      subject: "Your order has been shipped",
      preview: "Good news! Your order #123456789 has been shipped and will arrive...",
      time: "3 hours ago",
      category: "receipts",
      aiLabel: "Receipt",
      isRead: false,
      hasAttachment: true
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "important": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "newsletters": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "receipts": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "noise": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getAILabelColor = (label: string) => {
    switch (label) {
      case "Urgent": return "bg-red-500 text-white";
      case "Action Required": return "bg-orange-500 text-white";
      case "Suggested Reply": return "bg-purple-500 text-white";
      case "Newsletter": return "bg-blue-500 text-white";
      case "Receipt": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const filteredEmails = emails.filter(email =>
    email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Inbox</h1>
          <p className="text-gray-600 dark:text-gray-300">AI-powered email categorization and management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Archive className="w-4 h-4 mr-2" />
            Archive All Read
          </Button>
          <Button size="sm">
            <Reply className="w-4 h-4 mr-2" />
            AI Summarize
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search emails..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Important</p>
                <p className="text-2xl font-bold">{emails.filter(e => e.category === 'important').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Newsletters</p>
                <p className="text-2xl font-bold">{emails.filter(e => e.category === 'newsletters').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Archive className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receipts</p>
                <p className="text-2xl font-bold">{emails.filter(e => e.category === 'receipts').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
                <p className="text-2xl font-bold">{emails.filter(e => !e.isRead).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Categories */}
      <Tabs defaultValue="important" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="important">Important</TabsTrigger>
          <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
          <TabsTrigger value="noise">Noise</TabsTrigger>
        </TabsList>

        <TabsContent value="important" className="space-y-3">
          {filteredEmails.filter(email => email.category === 'important').map((email) => (
            <Card key={email.id} className={`hover:shadow-md transition-shadow cursor-pointer ${!email.isRead ? 'border-l-4 border-l-blue-500' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`font-semibold ${!email.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        {email.sender}
                      </h3>
                      <span className="text-sm text-gray-500">{email.email}</span>
                      <Badge className={getAILabelColor(email.aiLabel)} size="sm">
                        {email.aiLabel}
                      </Badge>
                      {email.hasAttachment && (
                        <Badge variant="outline" size="sm">📎</Badge>
                      )}
                    </div>
                    <h4 className={`font-medium mb-1 ${!email.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {email.subject}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {email.preview}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-sm text-gray-500">{email.time}</span>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Reply className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Other tab contents would show filtered emails */}
        <TabsContent value="newsletters">
          {filteredEmails.filter(email => email.category === 'newsletters').map((email) => (
            <Card key={email.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{email.sender}</h3>
                      <Badge className={getAILabelColor(email.aiLabel)} size="sm">
                        {email.aiLabel}
                      </Badge>
                    </div>
                    <h4 className="font-medium mb-1 text-gray-900 dark:text-white">{email.subject}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{email.preview}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-sm text-gray-500">{email.time}</span>
                    <Button variant="ghost" size="sm">
                      <Archive className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="receipts">
          {filteredEmails.filter(email => email.category === 'receipts').map((email) => (
            <Card key={email.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{email.sender}</h3>
                      <Badge className={getAILabelColor(email.aiLabel)} size="sm">
                        {email.aiLabel}
                      </Badge>
                      {email.hasAttachment && (
                        <Badge variant="outline" size="sm">📎</Badge>
                      )}
                    </div>
                    <h4 className="font-medium mb-1 text-gray-900 dark:text-white">{email.subject}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{email.preview}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-sm text-gray-500">{email.time}</span>
                    <Button variant="ghost" size="sm">
                      <Archive className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="noise">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Noise Found!</h3>
            <p className="text-gray-600 dark:text-gray-400">Your AI filters are working perfectly.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartInboxPage;
