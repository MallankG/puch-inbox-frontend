import { useSettings } from "@/hooks/useSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, Mail, Shield, CreditCard, Brain, Moon, Sun, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { settings, loading, error, updateSettings } = useSettings();
  const { toast } = useToast();
  const defaultSettings = {
    notifications: {
      emailAlerts: false,
      smsAlerts: false,
      pushNotifications: false,
      weeklyDigest: false,
    },
    preferences: {
      smartReplyTone: "friendly" as const,
      defaultView: "smart" as const,
      theme: "system" as const,
      autoArchive: false,
    },
    privacy: {
      dataSharing: false,
      analytics: false,
      aiImprovement: false,
    }
  };
  const currentSettings = settings ?? defaultSettings;

  if (loading) {
    return <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground text-lg">Loading settings...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-[40vh] text-red-500 text-lg">Error loading settings: {typeof error === 'string' ? error : (error && 'message' in error ? error.message : 'Unknown error')}</div>;
  }

  const updateSetting = async <K extends keyof typeof defaultSettings>(
    category: K,
    key: keyof typeof defaultSettings[K],
    value: typeof defaultSettings[K][keyof typeof defaultSettings[K]]
  ) => {
    try {
      await updateSettings({
        ...currentSettings,
        [category]: {
          ...currentSettings[category],
          [key]: value

        }
      } as typeof defaultSettings);
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Could not update settings.",
        variant: "destructive",
        duration: 4000
      });
    }
  };

  const handleResetSettings = async () => {
    // Preserve the current theme
    const themeToPreserve = currentSettings.preferences.theme;
    const resetSettings = {
      ...defaultSettings,
      preferences: {
        ...defaultSettings.preferences,
        theme: themeToPreserve
      }
    };
    try {
      await updateSettings(resetSettings);
      toast({
        title: "Settings reset",
        description: "All settings have been restored to their default values (except theme).",
        variant: "default",
        duration: 4000
      });
    } catch (error) {
      toast({
        title: "Reset failed",
        description: "Failed to reset settings. Please try again.",
        variant: "destructive",
        duration: 4000
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">Customize your Puch experience</p>
      </div>

      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          {/* <TabsTrigger value="billing">Billing</TabsTrigger> */}
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>AI Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="replyTone">Smart Reply Tone</Label>
                  <Select 
                    value={currentSettings.preferences.smartReplyTone} 
                    onValueChange={(value) => updateSetting('preferences', 'smartReplyTone', value as typeof defaultSettings.preferences.smartReplyTone)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultView">Default Inbox View</Label>
                  <Select 
                    value={currentSettings.preferences.defaultView} 
                    onValueChange={(value) => updateSetting('preferences', 'defaultView', value as typeof defaultSettings.preferences.defaultView)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smart">Smart Categories</SelectItem>
                      <SelectItem value="traditional">Traditional</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoArchive">Auto-archive read emails after 30 days</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Keep your inbox clean automatically</p>
                </div>
                <Switch
                  id="autoArchive"
                  checked={currentSettings.preferences.autoArchive}
                  onCheckedChange={(checked) => updateSetting('preferences', 'autoArchive', checked)}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="w-5 h-5" />
                <span>Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={currentSettings.preferences.theme} 
                  onValueChange={(value) => updateSetting('preferences', 'theme', value as typeof defaultSettings.preferences.theme)}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center space-x-2">
                        <Sun className="w-4 h-4" />
                        <span>Light</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center space-x-2">
                        <Moon className="w-4 h-4" />
                        <span>Dark</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-4 h-4" />
                        <span>System</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailAlerts">Email Alerts</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about important emails</p>
                </div>
                <Switch
                  id="emailAlerts"
                  checked={currentSettings.notifications.emailAlerts}
                  onCheckedChange={(checked) => updateSetting('notifications', 'emailAlerts', checked)}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsAlerts">SMS Alerts</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Urgent notifications via text message</p>
                </div>
                <Switch
                  id="smsAlerts"
                  checked={currentSettings.notifications.smsAlerts}
                  onCheckedChange={(checked) => updateSetting('notifications', 'smsAlerts', checked)}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Browser notifications for real-time updates</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={currentSettings.notifications.pushNotifications}
                  onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Summary of your email activity</p>
                </div>
                <Switch
                  id="weeklyDigest"
                  checked={currentSettings.notifications.weeklyDigest}
                  onCheckedChange={(checked) => updateSetting('notifications', 'weeklyDigest', checked)}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy & Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dataSharing">Data Sharing</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Share anonymized data to improve our services</p>
                </div>
                <Switch
                  id="dataSharing"
                  checked={currentSettings.privacy.dataSharing}
                  onCheckedChange={(checked) => updateSetting('privacy', 'dataSharing', checked)}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics">Usage Analytics</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Help us understand how you use Puch</p>
                </div>
                <Switch
                  id="analytics"
                  checked={currentSettings.privacy.analytics}
                  onCheckedChange={(checked) => updateSetting('privacy', 'analytics', checked)}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="aiImprovement">AI Model Improvement</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use your data to improve AI accuracy</p>
                </div>
                <Switch
                  id="aiImprovement"
                  checked={currentSettings.privacy.aiImprovement}
                  onCheckedChange={(checked) => updateSetting('privacy', 'aiImprovement', checked)}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                We only store the minimum data necessary to provide our services. Your email content is never stored on our servers.
              </p>
              <Button variant="outline">View Privacy Policy</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Subscription & Billing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Current Plan</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Free Plan</p>
                </div>
                <Badge variant="outline">Free</Badge>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Upgrade to Pro</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                  <li>• Unlimited AI-powered emails</li>
                  <li>• Advanced automation rules</li>
                  <li>• Priority support</li>
                  <li>• Custom integrations</li>
                </ul>
                <Button>Upgrade to Pro - $9.99/month</Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Usage This Month</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">AI Replies</p>
                    <p className="font-semibold">47/100</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Auto Rules</p>
                    <p className="font-semibold">3/5</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Advanced Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="space-y-2">
                <Label htmlFor="apiAccess">API Access</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Generate API keys for custom integrations</p>
                <Button variant="outline" disabled>
                  Manage API Keys (Pro Feature)
                </Button>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="exportData">Data Export</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download your data in JSON format</p>
                <Button variant="outline">Export Data</Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resetSettings">Reset All Settings</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Restore all settings to default values</p>
                <Button variant="destructive" onClick={handleResetSettings}>Reset to Defaults</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
