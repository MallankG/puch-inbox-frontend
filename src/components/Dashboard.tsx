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
import { useEffect, useState } from "react";
import { useEmails } from "../lib/EmailsContext";
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  // State for stats
  const [stats, setStats] = useState<{
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon?: any;
  }[]>([
    { title: "Total Subscriptions", value: "-", change: "", changeType: "neutral", icon: Mail },
    { title: "Unsubscribed This Month", value: "-", change: "", changeType: "neutral", icon: TrendingUp },
    { title: "Money Saved", value: "-", change: "", changeType: "neutral", icon: Shield },
    { title: "AI Actions", value: "-", change: "", changeType: "neutral", icon: Zap }
  ]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState({
    free: 0,
    paid: 0,
    promotional: 0,
    unknown: 0,
    total: 0
  });

  // Get emails and subscriptions from context
  const { emails } = useEmails();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Fetch subscriptions from backend
  useEffect(() => {
    fetch('http://localhost:4000/api/user/emails/subscriptions', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'done' && Array.isArray(data.emails)) {
          setSubscriptions(data.emails);
        }
      });
  }, []);

  // Compute stats when data changes
  useEffect(() => {
    // Subscriptions by category
    const free = subscriptions.filter(s => s.category === 'Free' && s.archived !== true).length;
    const paid = subscriptions.filter(s => s.category === 'Paid' && s.archived !== true).length;
    const promotional = subscriptions.filter(s => s.category === 'Promotional' && s.archived !== true).length;
    const unknown = subscriptions.filter(s => s.category === 'Unknown' && s.archived !== true).length;
    const total = subscriptions.filter(s => s.archived !== true).length;
    setCategoryStats({ free, paid, promotional, unknown, total });

    // Unsubscribed this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const unsubThisMonth = subscriptions.filter(s => s.status === 'unsubscribed' && s.lastSeen && new Date(s.lastSeen) >= startOfMonth).length;

    // Money saved (dummy: $3 per unsubscribed this month)
    const moneySaved = unsubThisMonth * 3;

    // AI Actions: count summary generations and archives (dummy: emails with summary or archived)
    const aiActions = emails.filter(e => e.summary || (Array.isArray(e.labelIds) && e.labelIds.some(l => l.startsWith('PuchInbox')))).length;

    setStats([
      {
        title: "Total Subscriptions",
        value: total.toString(),
        change: `+${total > 0 ? Math.round((total - 200) / 2) : 0}% from last month`,
        changeType: 'positive' as const,
        icon: Mail
      },
      {
        title: "Unsubscribed This Month",
        value: unsubThisMonth.toString(),
        change: unsubThisMonth > 0 ? `+${Math.round(unsubThisMonth * 0.2 * 100) / 100}% efficiency` : '',
        changeType: 'positive' as const,
        icon: TrendingUp
      },
      {
        title: "Money Saved",
        value: `$${moneySaved}`,
        change: unsubThisMonth > 0 ? "Estimated monthly savings" : '',
        changeType: 'positive' as const,
        icon: Shield
      },
      {
        title: "AI Actions",
        value: aiActions.toString(),
        change: aiActions > 0 ? "This week" : '',
        changeType: 'neutral' as const,
        icon: Zap
      }
    ]);

    // Recent activity: last 4 actions
    const recent: any[] = [];
    // Unsubscribes
    subscriptions.filter(s => s.status === 'unsubscribed').slice(-2).forEach(s => {
      recent.push({ action: `Unsubscribed from ${s.name || s.email}`, time: s.lastSeen ? timeAgo(s.lastSeen) : '', type: 'unsubscribe' });
    });
    // AI summary
    if (emails.length > 0) {
      recent.push({ action: "AI Summary generated for Inbox", time: '', type: 'ai' });
    }
    // Archives
    subscriptions.filter(s => s.archived === true).slice(-1).forEach(s => {
      recent.push({ action: `Archived ${s.name || s.email}`, time: s.lastSeen ? timeAgo(s.lastSeen) : '', type: 'archive' });
    });
    setRecentActivity(recent.slice(0, 4));
  }, [subscriptions, emails]);

  // Helper for time ago
  function timeAgo(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  // Handler for Scan New Subscriptions
  const handleScanSubscriptions = () => {
    navigate('/subscriptions', { state: { triggerScan: true } });
  };

  // Handler for AI Summary
  const handleAISummary = () => {
    navigate('/smart-inbox', { state: { triggerRefreshSummary: true } });
  };

  // Handler for Schedule Reminder
  const handleScheduleReminder = () => {
    window.open('https://calendar.google.com', '_blank');
  };

  // Handler for Export Report
  const handleExportReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('PuchInbox Dashboard Report', 14, 18);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);

    // Stats Table
    autoTable(doc, {
      startY: 32,
      head: [['Stat', 'Value']],
      body: stats.map(s => [s.title, String(s.value)]),
      theme: 'striped',
    });
    // Safely get the finalY position for the next table
    let finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY : 32 + 8 * stats.length;
    if (typeof finalY !== 'number') finalY = 32 + 8 * stats.length;

    // Category Table
    autoTable(doc, {
      startY: finalY + 10,
      head: [['Category', 'Count']],
      body: [
        ['Free', categoryStats.free],
        ['Paid', categoryStats.paid],
        ['Promotional', categoryStats.promotional],
        ['Other', categoryStats.unknown],
        ['Total', categoryStats.total],
      ],
      theme: 'striped',
    });
    finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY : finalY + 8 * 5;
    if (typeof finalY !== 'number') finalY = 32 + 8 * (stats.length + 5);

    // Recent Activity Table
    autoTable(doc, {
      startY: finalY + 10,
      head: [['Action', 'Time']],
      body: recentActivity.map(a => [a.action, a.time]),
      theme: 'striped',
    });

    doc.save('puchinbox-dashboard-report.pdf');
    toast({
      title: 'Report Downloaded',
      description: 'Your dashboard report PDF has been downloaded.',
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your email overview.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          // Compute live change text for Total Subscriptions and Unsubscribed This Month
          let liveChange = stat.change;
          if (stat.title === "Total Subscriptions") {
            if (subscriptions.length > 0) {
              const now = new Date();
              const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
              const totalThisMonth = subscriptions.filter(s => s.archived !== true && s.createdAt && new Date(s.createdAt) < now).length;
              const totalLastMonth = subscriptions.filter(s => s.archived !== true && s.createdAt && new Date(s.createdAt) < endOfLastMonth).length;
              const diff = totalThisMonth - totalLastMonth;
              if (totalLastMonth > 0) {
                const percent = Math.round((diff / totalLastMonth) * 100);
                liveChange = `${diff >= 0 ? "+" : ""}${percent}% from last month`;
              }
            }
          }
          if (stat.title === "Unsubscribed This Month") {
            if (subscriptions.length > 0) {
              const now = new Date();
              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
              const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
              const unsubThisMonth = subscriptions.filter(s => s.status === 'unsubscribed' && s.lastSeen && new Date(s.lastSeen) >= startOfMonth).length;
              const unsubLastMonth = subscriptions.filter(s => s.status === 'unsubscribed' && s.lastSeen && new Date(s.lastSeen) >= lastMonth && new Date(s.lastSeen) < startOfMonth).length;
              const diff = unsubThisMonth - unsubLastMonth;
              if (unsubLastMonth > 0) {
                const percent = Math.round((diff / unsubLastMonth) * 100);
                liveChange = `${diff >= 0 ? "+" : ""}${percent}% from last month`;
              } else if (unsubThisMonth > 0) {
                liveChange = `+${unsubThisMonth} this month`;
              }
            }
          }
          return (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={liveChange}
              changeType={stat.changeType}
              icon={stat.icon}
            />
          );
        })}
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
                <span className="text-sm text-muted-foreground">{categoryStats.free} ({categoryStats.total > 0 ? Math.round((categoryStats.free / categoryStats.total) * 100) : 0}%)</span>
              </div>
              <Progress value={categoryStats.total > 0 ? (categoryStats.free / categoryStats.total) * 100 : 0} className="h-2 bg-muted [&_.bg-primary]:bg-primary dark:[&_.bg-primary]:bg-primary" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Paid Subscriptions</span>
                <span className="text-sm text-muted-foreground">{categoryStats.paid} ({categoryStats.total > 0 ? Math.round((categoryStats.paid / categoryStats.total) * 100) : 0}%)</span>
              </div>
              <Progress value={categoryStats.total > 0 ? (categoryStats.paid / categoryStats.total) * 100 : 0} className="h-2 bg-muted [&_.bg-primary]:bg-primary dark:[&_.bg-primary]:bg-primary" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Promotional Only</span>
                <span className="text-sm text-muted-foreground">{categoryStats.promotional} ({categoryStats.total > 0 ? Math.round((categoryStats.promotional / categoryStats.total) * 100) : 0}%)</span>
              </div>
              <Progress value={categoryStats.total > 0 ? (categoryStats.promotional / categoryStats.total) * 100 : 0} className="h-2 bg-muted [&_.bg-primary]:bg-primary dark:[&_.bg-primary]:bg-primary" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Other</span>
                <span className="text-sm text-muted-foreground">{categoryStats.unknown} ({categoryStats.total > 0 ? Math.round((categoryStats.unknown / categoryStats.total) * 100) : 0}%)</span>
              </div>
              <Progress value={categoryStats.total > 0 ? (categoryStats.unknown / categoryStats.total) * 100 : 0} className="h-2 bg-muted [&_.bg-primary]:bg-primary dark:[&_.bg-primary]:bg-primary" />
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
              {recentActivity.length === 0 ? (
                <div className="text-muted-foreground text-sm">No recent activity.</div>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
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
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 border-muted text-foreground hover:bg-muted/50"
              onClick={handleScanSubscriptions}
            >
              <Mail className="h-6 w-6" />
              <span>Scan New Subscriptions</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 border-muted text-foreground hover:bg-muted/50"
              onClick={handleAISummary}
            >
              <Zap className="h-6 w-6" />
              <span>AI Summary</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 border-muted text-foreground hover:bg-muted/50"
              onClick={handleScheduleReminder}
            >
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
