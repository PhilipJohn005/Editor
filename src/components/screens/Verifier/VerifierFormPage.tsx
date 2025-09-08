"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function VerifierFormPage() {
  const [formData, setFormData] = useState({
    orgName: "",
    verifierName: "",
    role: "",
    contact: "",
    credentialId: "",
    purpose: "",
    comments: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted: " + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Verification Request Form</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Organization Name</label>
              <Input name="orgName" value={formData.orgName} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium">Role / Designation</label>
              <Input name="role" value={formData.role} onChange={handleChange} />
            </div>

            <div>
              <label className="text-sm font-medium">Verifier Name</label>
              <Input name="verifierName" value={formData.verifierName} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium">Credential ID</label>
              <Input name="credentialId" value={formData.credentialId} onChange={handleChange} />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Contact Info (email / phone)</label>
              <Input name="contact" value={formData.contact} onChange={handleChange} />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Purpose of Verification</label>
              <Input name="purpose" value={formData.purpose} onChange={handleChange} />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Upload File</label>
              <Input type="file" />
            </div>

            {/* Comments */}
            <div className="col-span-2">
              <label className="text-sm font-medium">Additional Comments</label>
              <Textarea name="comments" value={formData.comments} onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Submit</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
