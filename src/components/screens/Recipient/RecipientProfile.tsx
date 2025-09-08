"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function RecipientProfile() {
  const [publicProfile, setPublicProfile] = useState(true);
  const [credentialVisibility, setCredentialVisibility] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Page Header */}
      <header className="bg-white shadow-sm p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recipient Profile</h1>
        <Button className="rounded-xl">Save Changes</Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Profile */}
        <Card className="col-span-1 shadow-md">
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
                PJ
              </div>
              <Button variant="secondary" size="sm">Upload Pic</Button>
              <p className="text-xs text-gray-400">JPG, PNG</p>
            </div>
            <Separator />
            <div className="space-y-4">
              <Input placeholder="First Name" defaultValue="Philip" />
              <Input placeholder="Last Name" defaultValue="John" />
              <Input placeholder="Phone No." defaultValue="+91 54545abcd" />
              <Input placeholder="Location" defaultValue="Mars" />
              <Textarea placeholder="Bio" defaultValue="Cloud enthusiast and lifelong learner 🚀" />
            </div>
          </CardContent>
        </Card>

        {/* Right Panel: Settings */}
        <div className="col-span-2 space-y-8">
          {/* Privacy & Security */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Public Profile</span>
                <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
              </div>
              <div className="flex justify-between items-center">
                <span>Credential Visibility</span>
                <Switch checked={credentialVisibility} onCheckedChange={setCredentialVisibility} />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Email Notifications</span>
                <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
              </div>
              <div className="flex justify-between items-center">
                <span>SMS Notifications</span>
                <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Input placeholder="LinkedIn URL" defaultValue="https://linkedin.com/in/philip" />
              <Input placeholder="GitHub URL" defaultValue="https://github.com/philip" />
              <Input placeholder="Twitter URL" />
              <Input placeholder="Portfolio Website" />
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-between gap-4">
              <Input placeholder="Search credentials..." />
              <Button className="rounded-xl">Download Credentials</Button>
              <Button variant="destructive" className="rounded-xl">Deactivate Account</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
