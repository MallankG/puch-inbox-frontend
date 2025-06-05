import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Mail, Phone, MapPin, Calendar, Shield, Bell } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { profile, loading, error, updateProfile } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    otp: "",
    preferences: profile?.preferences || {
      emailNotifications: true,
      smsNotifications: false,
      locationServices: false,
      eventReminders: false,
      privacySettings: false,
      appNotifications: true
    }
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(profile?.phoneVerified || false);

  // Update form and phoneVerified when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || "",
        otp: "",
        preferences: profile.preferences
      });
      setPhoneVerified(!!profile.phoneVerified);
    }
  }, [profile]);

  const handleChange = (e: any) => {
    const { id, value, type, checked } = e.target;
    if (id in form.preferences) {
      setForm((f) => ({ ...f, preferences: { ...f.preferences, [id]: type === "checkbox" ? checked : value } }));
    } else {
      setForm((f) => ({ ...f, [id]: value }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await updateProfile({
      name: form.name,
      email: form.email,
      phone: form.phone,
      preferences: form.preferences,
      phoneVerified: phoneVerified // Always include phoneVerified
    });
    setEditMode(false);
  };

  const handleCancelPhone = () => {
    setForm((f) => ({
      ...f,
      phone: profile?.phone || "",
      otp: ""
    }));
    setOtpSent(false);
    setOtpError("");
    setPhoneVerified(!!profile?.phone && profile?.phone.length > 0);
  };

  const handleSendOtp = async () => {
    setOtpError("");
    console.log('[handleSendOtp] Called with phone:', form.phone);
    if (!form.phone || form.phone.length < 8) {
      setOtpError("Enter a valid phone number.");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/api/profile/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: form.phone })
      });
      console.log('[handleSendOtp] Response status:', res.status);
      if (!res.ok) throw new Error("Failed to send OTP");
      setOtpSent(true);
    } catch (e: any) {
      console.error('[handleSendOtp] Error:', e);
      setOtpError(e.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError("");
    try {
      const res = await fetch("http://localhost:4000/api/profile/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone: form.phone, otp: form.otp })
      });
      if (!res.ok) throw new Error("Invalid OTP. Please try again.");
      setPhoneVerified(true);
      setOtpSent(false);
      setForm((f) => ({ ...f, otp: "" }));
      // Automatically save after successful verification
      await updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        preferences: form.preferences,
        phoneVerified: true
      });
      setEditMode(false);
    } catch (e: any) {
      setOtpError(e.message || "Invalid OTP. Please try again.");
    }
  };

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
              <AvatarFallback>{profile?.name?.split(" ").map((n) => n[0]).join("") || "U"}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{profile?.name || "-"}</h3>
              <p className="text-sm text-gray-500">{profile?.email || "-"}</p>
              {phoneVerified ? (
                <Badge className="mt-2 bg-green-500 text-white">Verified</Badge>
              ) : (
                <Badge className="mt-2 bg-red-500 text-white">Unverified</Badge>
              )}
            </div>
            <Button variant="outline" className="w-full" onClick={() => setEditMode((v) => !v)}>
              <Edit2 className="h-4 w-4 mr-2" />
              {editMode ? "Cancel" : "Edit Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input type="text" id="name" value={form.name} disabled />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" value={form.email} disabled />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex gap-2 items-center">
                      <Input type="tel" id="phone" value={form.phone} onChange={handleChange} disabled={phoneVerified} />
                      {!phoneVerified && (
                        <Button type="button" size="sm" onClick={handleSendOtp} disabled={otpSent}>Send OTP</Button>
                      )}
                      {phoneVerified && (
                        <Badge className="bg-green-500 text-white ml-2">Verified</Badge>
                      )}
                    </div>
                  </div>
                  {otpSent && !phoneVerified && (
                    <div>
                      <Label htmlFor="otp">Enter OTP</Label>
                      <div className="flex gap-2 items-center">
                        <Input type="text" id="otp" value={form.otp} onChange={handleChange} placeholder="Enter OTP" />
                        <Button type="button" size="sm" onClick={handleVerifyOtp}>Verify</Button>
                      </div>
                      {otpError && <div className="text-red-500 text-xs mt-1">{otpError}</div>}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button type="submit">Save</Button>
                  <Button type="button" variant="secondary" onClick={() => {
                    setEditMode(false);
                    setForm({
                      name: profile?.name || "",
                      email: profile?.email || "",
                      phone: profile?.phone || "",
                      otp: "",
                      preferences: profile?.preferences || {
                        emailNotifications: true,
                        smsNotifications: false,
                        locationServices: false,
                        eventReminders: false,
                        privacySettings: false,
                        appNotifications: true
                      }
                    });
                    setOtpSent(false);
                    setOtpError("");
                    setPhoneVerified(!!profile?.phoneVerified);
                  }}>Cancel</Button>
                </div>
              </form>
            ) : (
              <Tabs defaultValue="account" className="space-y-4">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <div className="py-2">{profile?.name || "-"}</div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <div className="py-2">{profile?.email || "-"}</div>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <div className="py-2">{profile?.phone || "-"}</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
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
              {editMode && (
                <input type="checkbox" id="emailNotifications" checked={form.preferences.emailNotifications} onChange={handleChange} />
              )}
            </div>
            <p className="text-sm text-gray-500">Receive updates and notifications via email.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <Label>SMS Notifications</Label>
              {editMode && (
                <input type="checkbox" id="smsNotifications" checked={form.preferences.smsNotifications} onChange={handleChange} />
              )}
            </div>
            <p className="text-sm text-gray-500">Get important alerts via SMS.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <Label>Location Services</Label>
              {editMode && (
                <input type="checkbox" id="locationServices" checked={form.preferences.locationServices} onChange={handleChange} />
              )}
            </div>
            <p className="text-sm text-gray-500">Enable location-based features.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Label>Event Reminders</Label>
              {editMode && (
                <input type="checkbox" id="eventReminders" checked={form.preferences.eventReminders} onChange={handleChange} />
              )}
            </div>
            <p className="text-sm text-gray-500">Receive reminders for upcoming events.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <Label>Privacy Settings</Label>
              {editMode && (
                <input type="checkbox" id="privacySettings" checked={form.preferences.privacySettings} onChange={handleChange} />
              )}
            </div>
            <p className="text-sm text-gray-500">Control your data and privacy preferences.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-gray-500" />
              <Label>App Notifications</Label>
              {editMode && (
                <input type="checkbox" id="appNotifications" checked={form.preferences.appNotifications} onChange={handleChange} />
              )}
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
          <Button asChild>
            <a href="https://forms.gle/QEoKiDhwvTpVxr5p6" target="_blank" rel="noopener noreferrer">
              <Plus className="h-4 w-4 mr-2" />
              Suggest Feature
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
