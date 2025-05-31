
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const stats = [
    { label: "New Emails", value: "24", change: "+12%", icon: "📧", color: "text-blue-600" },
    { label: "AI Replies", value: "8", change: "+25%", icon: "🤖", color: "text-green-600" },
    { label: "Cleaned Subs", value: "156", change: "+8%", icon: "🧹", color: "text-purple-600" },
    { label: "Time Saved", value: "2.4h", change: "+15%", icon: "⏰", color: "text-orange-600" }
  ];

  const recentActivity = [
    { action: "Auto-replied to John's email", time: "2 minutes ago", type: "reply", status: "success" },
    { action: "Unsubscribed from 3 newsletters", time: "1 hour ago", type: "cleanup", status: "success" },
    { action: "Archived 12 promotional emails", time: "3 hours ago", type: "archive", status: "success" },
    { action: "Summarized long thread from team", time: "5 hours ago", type: "summary", status: "success" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, Alex! 👋</h1>
        <p className="text-gray-600 dark:text-gray-300">Your inbox is looking great today. Here's what happened while you were away.</p>
      </div>

      {/* Inbox Health */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2 text-lg">
            📊 Inbox Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Health</span>
                <span className="text-2xl font-bold text-green-600">85%</span>
              </div>
              <Progress value={85} className="h-3" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Excellent! Your inbox is well organized.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-green-600">324</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Important</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-yellow-600">89</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Newsletters</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-red-600">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Spam</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={stat.label} 
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  <p className="text-green-600 text-sm font-medium mt-1">{stat.change}</p>
                </div>
                <div className={`text-3xl ${stat.color}`}>{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white text-lg">⚡ Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              🧹 Clean Inbox Now
            </Button>
            <Button variant="outline" className="w-full border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              ⚙️ Create New Rule
            </Button>
            <Button variant="outline" className="w-full border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              📋 Summarize Emails
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white text-lg">🕐 Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white text-sm font-medium">{activity.action}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{activity.time}</p>
                  </div>
                  <div className="text-green-500 text-sm">✓</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
