import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Settings, Trash2, Calendar, Filter, ArrowRight } from "lucide-react";

const RulesPage = () => {
  const [rules, setRules] = useState([
    {
      id: "1",
      name: "Archive Promotions",
      condition: "Subject contains 'sale' OR 'discount' OR 'promotion'",
      action: "Archive + Label 'Promotions'",
      schedule: "Immediately",
      isEnabled: true,
      runsThisWeek: 45,
      lastTriggered: "2 hours ago"
    },
    {
      id: "2",
      name: "Important Client Emails",
      condition: "From domain '@importantclient.com'",
      action: "Mark as Important + Notify via SMS",
      schedule: "Immediately",
      isEnabled: true,
      runsThisWeek: 8,
      lastTriggered: "Yesterday"
    },
    {
      id: "3",
      name: "Weekly Newsletter Cleanup",
      condition: "Label 'Newsletters' AND older than 7 days",
      action: "Archive",
      schedule: "Every Sunday at 9 AM",
      isEnabled: true,
      runsThisWeek: 1,
      lastTriggered: "Last Sunday"
    },
    {
      id: "4",
      name: "Receipt Organization",
      condition: "Contains attachment AND subject contains 'receipt' OR 'invoice'",
      action: "Label 'Receipts' + Archive",
      schedule: "Immediately",
      isEnabled: false,
      runsThisWeek: 0,
      lastTriggered: "Never"
    }
  ]);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, isEnabled: !rule.isEnabled } : rule
    ));
  };

  const conditionTypes = [
    { value: "subject", label: "Subject contains" },
    { value: "sender", label: "Sender is" },
    { value: "domain", label: "From domain" },
    { value: "attachment", label: "Has attachment" },
    { value: "label", label: "Has label" },
    { value: "body", label: "Body contains" }
  ];

  const actionTypes = [
    { value: "archive", label: "Archive" },
    { value: "label", label: "Add label" },
    { value: "forward", label: "Forward to" },
    { value: "reply", label: "Auto reply" },
    { value: "delete", label: "Delete" },
    { value: "mark_important", label: "Mark as important" },
    { value: "notify", label: "Send notification" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Rules</h1>
          <p className="text-muted-foreground">Create IF-THEN rules to automatically organize your emails</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card text-card-foreground">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold text-foreground">{rules.filter(r => r.isEnabled).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ArrowRight className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Runs This Week</p>
                <p className="text-2xl font-bold text-foreground">{rules.reduce((sum, r) => sum + r.runsThisWeek, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-foreground">{rules.filter(r => r.schedule !== 'Immediately').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Time Saved</p>
                <p className="text-2xl font-bold text-foreground">3.5h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id} className="hover:shadow-md transition-shadow bg-card text-card-foreground">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Switch
                      checked={rule.isEnabled}
                      onCheckedChange={() => toggleRule(rule.id)}
                      className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                    />
                    <h3 className="text-lg font-semibold text-foreground">
                      {rule.name}
                    </h3>
                    <Badge variant={rule.isEnabled ? 'default' : 'secondary'} size="sm">
                      {rule.isEnabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-blue-600 dark:text-blue-400">IF</span>
                        <span className="bg-background px-3 py-1 rounded border border-border">
                          {rule.condition}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-green-600 dark:text-green-400">THEN</span>
                        <span className="bg-background px-3 py-1 rounded border border-border">
                          {rule.action}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                    <span>Schedule: {rule.schedule}</span>
                    <span>Runs this week: {rule.runsThisWeek}</span>
                    <span>Last triggered: {rule.lastTriggered}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
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

      {/* Rule Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Quick Rule Builder</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Condition</label>
              <Select defaultValue="subject">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditionTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Select defaultValue="archive">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map(action => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Schedule</label>
              <Select defaultValue="immediately">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">Immediately</SelectItem>
                  <SelectItem value="daily">Daily at 9 AM</SelectItem>
                  <SelectItem value="weekly">Weekly on Sunday</SelectItem>
                  <SelectItem value="monthly">Monthly on 1st</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full">Create Rule</Button>
        </CardContent>
      </Card>

      {/* Rule Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <h4 className="font-medium mb-1">Auto Archive Promotions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  IF subject contains "sale" THEN archive + label "Promotions"
                </p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <h4 className="font-medium mb-1">VIP Client Alerts</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  IF from VIP domain THEN mark important + notify SMS
                </p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <h4 className="font-medium mb-1">Newsletter Weekly Cleanup</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  IF label "Newsletter" older than 7 days THEN archive
                </p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <h4 className="font-medium mb-1">Receipt Organization</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  IF contains "receipt" THEN label "Receipts" + archive
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RulesPage;
