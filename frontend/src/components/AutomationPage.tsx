
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, Plus, Edit, Trash2, Activity, Clock, CheckCircle, AlertCircle } from "lucide-react";

const AutomationPage = () => {
  const [automations, setAutomations] = useState([
    {
      id: "1",
      name: "Auto Archive Promotions",
      trigger: "Subject contains 'promotion', 'sale', 'discount'",
      action: "Archive and label as 'Promotions'",
      status: "active",
      lastRun: "2 minutes ago",
      runsToday: 15,
      successRate: 98,
      isEnabled: true
    },
    {
      id: "2",
      name: "Smart Reply to Meeting Requests",
      trigger: "Email contains calendar invitation",
      action: "AI reply with availability + Add to calendar",
      status: "active",
      lastRun: "1 hour ago",
      runsToday: 3,
      successRate: 100,
      isEnabled: true
    },
    {
      id: "3",
      name: "Newsletter Digest",
      trigger: "Daily at 9 AM",
      action: "Summarize all newsletter emails from yesterday",
      status: "scheduled",
      lastRun: "Yesterday 9:00 AM",
      runsToday: 1,
      successRate: 95,
      isEnabled: true
    },
    {
      id: "4",
      name: "Unsubscribe Spam",
      trigger: "AI detects spam/unwanted emails",
      action: "Auto-unsubscribe using safe methods",
      status: "paused",
      lastRun: "3 days ago",
      runsToday: 0,
      successRate: 87,
      isEnabled: false
    }
  ]);

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id 
        ? { ...automation, isEnabled: !automation.isEnabled, status: automation.isEnabled ? 'paused' : 'active' }
        : automation
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "paused": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "scheduled": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "error": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4" />;
      case "paused": return <Pause className="w-4 h-4" />;
      case "scheduled": return <Clock className="w-4 h-4" />;
      case "error": return <AlertCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Automation</h1>
          <p className="text-gray-600 dark:text-gray-300">Create and manage intelligent email workflows</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold">{automations.filter(a => a.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Runs Today</p>
                <p className="text-2xl font-bold">{automations.reduce((sum, a) => sum + a.runsToday, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round(automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Time Saved</p>
                <p className="text-2xl font-bold">4.2h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation List */}
      <div className="space-y-4">
        {automations.map((automation) => (
          <Card key={automation.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Switch
                      checked={automation.isEnabled}
                      onCheckedChange={() => toggleAutomation(automation.id)}
                    />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {automation.name}
                    </h3>
                    <Badge className={getStatusColor(automation.status)} size="sm">
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(automation.status)}
                        <span className="capitalize">{automation.status}</span>
                      </span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Trigger: </span>
                      <span className="text-gray-600 dark:text-gray-400">{automation.trigger}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Action: </span>
                      <span className="text-gray-600 dark:text-gray-400">{automation.action}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 mt-4 text-xs text-gray-500">
                    <span>Last run: {automation.lastRun}</span>
                    <span>Runs today: {automation.runsToday}</span>
                    <span>Success rate: {automation.successRate}%</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Activity className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Quick Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <h4 className="font-medium mb-1">Auto Archive Newsletters</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Archive newsletters after 7 days</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <h4 className="font-medium mb-1">Smart Reply Assistant</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI generates contextual replies</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <h4 className="font-medium mb-1">Receipt Organizer</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Auto-label and organize receipts</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationPage;
