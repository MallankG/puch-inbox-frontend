
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const stats = [
    { label: "New Emails", value: "24", change: "+12%", icon: "📧" },
    { label: "AI Replies", value: "8", change: "+25%", icon: "🤖" },
    { label: "Cleaned Subs", value: "156", change: "+8%", icon: "🧹" },
    { label: "Time Saved", value: "2.4h", change: "+15%", icon: "⏰" }
  ];

  const recentActivity = [
    { action: "Auto-replied to John's email", time: "2 minutes ago", type: "reply" },
    { action: "Unsubscribed from 3 newsletters", time: "1 hour ago", type: "cleanup" },
    { action: "Archived 12 promotional emails", time: "3 hours ago", type: "archive" },
    { action: "Summarized long thread from team", time: "5 hours ago", type: "summary" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-500/20">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, Alex! 👋</h1>
        <p className="text-gray-300">Your inbox is looking great today. Here's what happened while you were away.</p>
      </div>

      {/* Inbox Health */}
      <Card className="glass-card border-white/10 animate-scale-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            📊 Inbox Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${85 * 2.51} ${100 * 2.51}`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">85%</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">324</div>
              <div className="text-sm text-gray-400">Important</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">89</div>
              <div className="text-sm text-gray-400">Newsletters</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">12</div>
              <div className="text-sm text-gray-400">Spam</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={stat.label} 
            className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 animate-scale-in hover-scale"
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-green-400 text-sm">{stat.change}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="glass-card border-white/10 animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="text-white">⚡ Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
              🧹 Clean Inbox Now
            </Button>
            <Button variant="outline" className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20">
              ⚙️ Create New Rule
            </Button>
            <Button variant="outline" className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/20">
              📋 Summarize Emails
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card border-white/10 animate-slide-in-right" style={{ animationDelay: '0.7s' }}>
          <CardHeader>
            <CardTitle className="text-white">🕐 Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.action}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
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
