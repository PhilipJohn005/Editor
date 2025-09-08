import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const ProfileManagement = () => {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Issuer Profile</h2>

      {/* Profile Header */}
      <div className="flex items-start gap-6">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-sm">Logo</span>
          </div>
          <Button variant="outline" size="sm" className="mt-2">
            Upload logo
          </Button>
          <p className="text-xs text-gray-500">JPG, PNG</p>
        </div>

        <div className="flex-1">
          <p className="text-xl font-semibold">Philip John</p>
        </div>

        <Button variant="outline">Save</Button>
      </div>

      {/* Org Info */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <Label htmlFor="org">Org Info</Label>
          <Textarea id="org" placeholder="Enter organization info..." />
          <Button size="sm" className="mt-2">Save</Button>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4 space-y-2">
            <Label>Email</Label>
            <p className="text-sm text-gray-700">abc@gmail.com</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-2">
            <Label>Phone</Label>
            <p className="text-sm text-gray-700">+91 7y7jih834</p>
          </CardContent>
        </Card>
      </div>

      {/* Social Media */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <Label className="font-semibold">Social Media</Label>
          <div className="space-y-2">
            <Input placeholder="Instagram" />
            <Input placeholder="Medium" />
            <Input placeholder="X" />
          </div>
        </CardContent>
      </Card>

      {/* Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Public Profile</Label>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <Label>Issuance Data share</Label>
          <Switch defaultChecked />
        </div>
      </div>

      
      <div>
        <p className="text-sm text-gray-600">
          Verification status: <span className="font-medium">Verified</span>
        </p>
      </div>
    </div>
  )
}

export default ProfileManagement
