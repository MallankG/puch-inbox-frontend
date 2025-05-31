import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Mail, Phone, MapPin, Calendar, Shield, Bell } from "lucide-react";

const ProfilePage = () => {
  return (
    <div className="container py-12">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Profile Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">John Doe</h3>
              <p className="text-sm text-gray-500">john.doe@example.com</p>
              <Badge className="mt-2">Verified</Badge>
            </div>
            <Button variant="outline" className="w-full">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="account" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input type="text" id="name" defaultValue="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input type="tel" id="phone" defaultValue="+1 555-123-4567" />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input type="text" id="address" defaultValue="123 Main St, Anytown" />
                  </div>
                </div>
                <Button className="mt-4">Update Account</Button>
              </TabsContent>
              <TabsContent value="security" className="space-y-2">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" id="password" defaultValue="********" />
                </div>
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <Input type="text" id="two-factor" defaultValue="Enabled" />
                </div>
                <Button className="mt-4">Update Security</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Preferences */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <Label>Email Notifications</Label>
            </div>
            <p className="text-sm text-gray-500">Receive updates and notifications via email.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <Label>SMS Notifications</Label>
            </div>
            <p className="text-sm text-gray-500">Get important alerts via SMS.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <Label>Location Services</Label>
            </div>
            <p className="text-sm text-gray-500">Enable location-based features.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Label>Event Reminders</Label>
            </div>
            <p className="text-sm text-gray-500">Receive reminders for upcoming events.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <Label>Privacy Settings</Label>
            </div>
            <p className="text-sm text-gray-500">Control your data and privacy preferences.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-gray-500" />
              <Label>App Notifications</Label>
            </div>
            <p className="text-sm text-gray-500">Enable or disable in-app notifications.</p>
          </div>
        </CardContent>
      </Card>

      {/* Add New Feature */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Add New Feature</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">Suggest a feature you'd like to see in our app.</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Suggest Feature
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
