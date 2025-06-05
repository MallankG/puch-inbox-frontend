import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ThemeProvider from "@/components/ThemeProvider";
import { SettingsProvider } from "@/hooks/SettingsContext";
import Dashboard from "./Dashboard";
import SubscriptionsPage from "./SubscriptionsPage";
import SmartInboxPage from "./SmartInboxPage";
import AutomationPage from "./AutomationPage";
import RulesPage from "./RulesPage";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'subscriptions', label: 'Subscriptions', icon: '📧' },
    { id: 'inbox', label: 'Smart Inbox', icon: '📥' },
    { id: 'automation', label: 'Automation', icon: '🤖' },
    { id: 'rules', label: 'Rules', icon: '⚙️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '🔧' },
  ];

  useEffect(() => {
    // Check authentication on mount
    fetch("http://localhost:4000/api/user/me", {
      credentials: "include"
    })
      .then(res => {
        if (res.status === 401) {
          navigate("/login");
        }
        // Removed fetchSubscriptions() call here to prevent background scan after login
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'subscriptions':
        return <SubscriptionsPage />;
      case 'inbox':
        return <SmartInboxPage />;
      case 'automation':
        return <AutomationPage />;
      case 'rules':
        return <RulesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-4">🚧</div>
              <p>Coming Soon</p>
            </div>
          </div>
        );
    }
  };

  return (
    <SettingsProvider>
      <ThemeProvider>
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white h-screen w-screen overflow-hidden flex">
          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-screen z-30 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm`}
          >
            <div className="p-4">
              {/* Logo */}
              <div className="flex items-center space-x-2 mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                {!sidebarCollapsed && (
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Puch
                  </span>
                )}
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                      activeTab === item.id
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                ))}
              </nav>
            </div>

            {/* Collapse Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute bottom-4 left-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {sidebarCollapsed ? '→' : '←'}
            </Button>
          </div>

          {/* Main Content */}
            <div
              className={`flex flex-col ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 flex-1 min-h-0 h-full overflow-hidden`}
            >
            {/* Top Bar */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">{activeTab}</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    🔔
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 glow-purple hover-scale transition-all duration-300 font-bold text-white hover:text-white"
                    onClick={async () => {
                      await fetch("http://localhost:4000/auth/logout", {
                        method: "POST",
                        credentials: "include"
                      });
                      window.location.href = "/";
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Log out
                  </Button>
                </div>
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 min-h-0 flex flex-col overflow-hidden h-full p-6 bg-gray-50 dark:bg-gray-900">
              {renderContent()}
            </main>
          </div>
        </div>
      </ThemeProvider>
    </SettingsProvider>
  );
};

export default DashboardLayout;
