"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";


export default function VerifierPage() {
  const [credentialId, setCredentialId] = useState("AWS-1234-ABCD");
  const [issuerName, setIssuerName] = useState("Amazon Web Services");
  const [showResult, setShowResult] = useState(false);
  const navigate=useNavigate();


  const handleVerifyCredential = () => {
    if (credentialId.trim()) {
      setShowResult(true);
    }
  };

  const handleVerifyIssuer = () => {
    if (issuerName.trim()) {
      setShowResult(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-full p-8">
        <div className="w-full h-full bg-white border rounded-sm shadow-sm p-10">
          <div className="text-sm text-gray-600 mb-8">Verifier</div>

          <div className="mb-8">
            <div className="flex items-center gap-3">
              <Input
                aria-label="Credential ID"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="Enter Credential ID (e.g. AWS-1234-ABCD)"
                className="flex-1"
              />
              <Button onClick={handleVerifyCredential}>Verify</Button>
            </div>
          </div>

          <div className="mb-2 text-gray-600">Issuer verification</div>
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <Input
                aria-label="Issuer Name"
                value={issuerName}
                onChange={(e) => setIssuerName(e.target.value)}
                placeholder="Enter Issuer Name (e.g. Amazon Web Services)"
                className="flex-1"
              />
              <Button onClick={handleVerifyIssuer}>Verify</Button>
            </div>
          </div>

          <div className="flex items-center my-6">
            <Separator className="flex-1" />
            <div className="px-4 text-sm text-gray-400">or</div>
            <Separator className="flex-1" />
          </div>

          <div className="flex justify-center mb-10">
            <Button asChild variant="outline">
              <a href="/verifierformpage">Verification Request Form</a>
            </Button>
          </div>

          {showResult && (
            <div className="w-full max-w-4xl space-y-6 mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                <span className="text-green-700 font-medium">
                  Verification Result: This credential is authentic.
                </span>
                <Badge variant="secondary">Verified</Badge>
              </div>

              {/* Credential details */}
              <Card>
                <CardHeader>
                  <CardTitle>Credential Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Credential ID</p>
                      <p>#AWS-1234-ABCD</p>
                    </div>
                    <div>
                      <p className="font-medium">Issue Date</p>
                      <p>03/15/2024</p>
                    </div>
                    <div>
                      <p className="font-medium">Title</p>
                      <p>AWS Certified Solutions Architect</p>
                    </div>
                    <div>
                      <p className="font-medium">Grade</p>
                      <p>With Distinction</p>
                    </div>
                    <div>
                      <p className="font-medium">Recipient</p>
                      <p>John Doe</p>
                    </div>
                    <div>
                      <p className="font-medium">Issuer</p>
                      <p>Amazon Web Services </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Skills & Competencies</p>
                    <div className="flex gap-2 flex-wrap mt-1">
                      <Badge>Cloud Architecture</Badge>
                      <Badge>DevOps</Badge>
                      <Badge>Security</Badge>
                      <Badge>Scalability</Badge>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Description</p>
                    <p className="text-sm text-gray-600">
                      Certification in cloud solutions architecture
                      demonstrating ability to design, secure, and deploy
                      scalable applications on AWS.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Blockchain verification */}
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Verification</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Network</p>
                    <p>Ethereum</p>
                  </div>
                  <div>
                    <p className="font-medium">Confirmations</p>
                    <p>1247</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium">Transaction Hash</p>
                    <p className="truncate text-gray-600">
                      0x123456789abcdef123456789abcdef12345678
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Block Number</p>
                    <p>18456789</p>
                  </div>
                </CardContent>
              </Card>

              {/* Issuer info */}
              <Card>
                <CardHeader>
                  <CardTitle>Issuer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Amazon Web Services</span>{" "}
                    <Badge>Verified Issuer</Badge>
                  </p>
                  <p>Accredited by Cloud Industry Standards Board</p>
                  <p>
                    <span className="font-medium">Public Key:</span>{" "}
                    0xabcdef123456789abcdef123456789abcdef12
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
