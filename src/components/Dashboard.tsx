import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, 
  Users, 
  TrendingUp, 
  Shield, 
  BarChart3, 
  Calendar,
  Bell,
  Zap
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Subscriptions",
      value: "248",
      change: "+12% from last month",
      changeType: 'positive' as const,
      icon: Mail
    },
    {
      title: "Unsubscribed This Month",
      value: "34",
      change: "+23% efficiency",
      changeType: 'positive' as const,
      icon: TrendingUp
    },
    {
      title: "Money Saved",
      value: "$127",
      change: "Estimated monthly savings",
      changeType: 'positive' as const,
      icon: Shield
    },
    {
      title: "AI Actions",
      value: "89",
      change: "This week",
      changeType: 'neutral' as const,
      icon: Zap
    }
  ];

  const recentActivity = [
    { action: "Unsubscribed from Newsletter X", time: "2 hours ago", type: "unsubscribe" },
    { action: "AI Summary generated for Inbox", time: "4 hours ago", type: "ai" },
    { action: "Scheduled reminder set", time: "6 hours ago", type: "schedule" },
    { action: "Archived 15 promotional emails", time: "1 day ago", type: "archive" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your email overview.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm" variant="secondary">
            <Bell className="h-4 w-4 mr-2" />
            Set Alert
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription Overview */}
        <Card className="lg:col-span-2 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Subscription Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Free Subscriptions</span>
                <span className="text-sm text-muted-foreground">156 (63%)</span>
              </div>
              <Progress value={63} className="h-2 bg-muted [&_.bg-primary]:bg-primary dark:[&_.bg-primary]:bg-primary" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Paid Subscriptions</span>
                <span className="text-sm text-muted-foreground">67 (27%)</span>
              </div>
              <Progress value={27} className="h-2 bg-muted [&_.bg-primary]:bg-primary dark:[&_.bg-primary]:bg-primary" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Promotional Only</span>
                <span className="text-sm text-muted-foreground">25 (10%)</span>
              </div>
              <Progress value={10} className="h-2 bg-muted [&_.bg-primary]:bg-primary dark:[&_.bg-primary]:bg-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Mail className="h-6 w-6" />
              <span>Scan New Emails</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-muted text-foreground hover:bg-muted/50">
              <Zap className="h-6 w-6" />
              <span>AI Summary</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-muted text-foreground hover:bg-muted/50">
              <Calendar className="h-6 w-6" />
              <span>Schedule Reminder</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
