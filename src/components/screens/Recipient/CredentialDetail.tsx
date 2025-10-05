import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Linkedin, Twitter, Facebook, Mail, Share2, Download } from "lucide-react"

import cloudP from "../../../assets/cloudP.png"
import cloudE from "../../../assets/cloudE.png"
import netC from "../../../assets/netC.png"

const DATA = [
  {
    org: "AWS",
    title: "Cloud practitioner",
    kind: "Badge",
    status: "Pending Verification",
    issued: "25-04-24",
    expiry: "25-04-27",
    image: cloudP,
    recipient: {
      name: "Philip John",
      email: "philip@example.com",
      skills: ["Networking", "EC2", "VPC"],
      comments: "Strong grasp of AWS fundamentals with excellent practical application.",
    },
    issuer: {
      name: "Amazon Web Services",
      contact: "aws-certifications@amazon.com",
      website: "https://aws.amazon.com/certification",
      dashboard: "https://aws.amazon.com/certification/verify",
    },
  },
  {
    org: "AWS",
    title: "Networking Core",
    kind: "Badge",
    status: "Verified",
    issued: "02-07-25",
    expiry: "02-07-28",
    image: netC,
    recipient: {
      name: "Philip John",
      email: "philip@example.com",
      skills: ["Subnets", "Load Balancers", "Hybrid Networking"],
      comments: "Advanced knowledge in networking fundamentals and cloud integration.",
    },
    issuer: {
      name: "Amazon Web Services",
      contact: "aws-certifications@amazon.com",
      website: "https://aws.amazon.com/certification",
      dashboard: "https://aws.amazon.com/certification/verify",
    },
  },
  {
    org: "AWS",
    title: "Cloud Economics",
    kind: "Certificate",
    status: "Pending Verification",
    issued: "13-10-25",
    expiry: "13-10-28",
    image: cloudE,
    recipient: {
      name: "Philip John",
      email: "philip@example.com",
      skills: ["Cost Optimization", "Billing", "TCO Analysis"],
      comments: "Demonstrated strong analytical skills in cloud cost modeling.",
    },
    issuer: {
      name: "Amazon Web Services",
      contact: "aws-certifications@amazon.com",
      website: "https://aws.amazon.com/certification",
      dashboard: "https://aws.amazon.com/certification/verify",
    },
  },
]

export default function CredentialDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [shareEmail, setShareEmail] = useState("")

  const cred = DATA[Number(id)]
  if (!cred) return <p className="p-6">Credential not found</p>

  const handleShare = () => {
    if (!shareEmail) return
    alert(`Verification report sent to ${shareEmail}`)
    setShareEmail("")
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="w-full p-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      {/* Main Body */}
      <main className="w-full p-10 space-y-10">
        {/* Credential Summary */}
        <Card className="p-6 flex flex-col lg:flex-row items-center gap-6">
          <img
            src={cred.image}
            alt={cred.title}
            className="w-40 h-40 object-contain"
          />
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-semibold">{cred.title}</h2>
            <p className="text-gray-600">{cred.kind}</p>
            <p className="text-sm text-gray-500">Issued: {cred.issued}</p>
            <p className="text-sm text-gray-500">Expiry: {cred.expiry}</p>
          </div>
        </Card>

        {/* Verification Status */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Verification Status</h3>
          {cred.status === "Verified" ? (
            <Badge className="bg-green-600 text-white">Verified</Badge>
          ) : (
            <Badge variant="secondary">Pending Verification</Badge>
          )}
          <p className="mt-3 text-sm text-gray-600">
            Verification ensures this credential is authentic and issued by{" "}
            <strong>{cred.org}</strong>.
          </p>
        </Card>

        {/* Recipient Info */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Recipient Information</h3>
          <p><strong>Name:</strong> {cred.recipient.name}</p>
          <p><strong>Email:</strong> {cred.recipient.email}</p>
          <p className="mt-3 font-semibold">Skills Demonstrated:</p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {cred.recipient.skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
          <text>Issuer feedback:-</text>
          <p className="text-gray-700 italic">
            "{cred.recipient.comments}"
          </p>
        </Card>

        {/* Issuer Info */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Issuer Information</h3>
          <p><strong>Organization:</strong> {cred.issuer.name}</p>
          <p><strong>Contact:</strong> {cred.issuer.contact}</p>
          <p>
            <strong>Website:</strong>{" "}
            <a
              href={cred.issuer.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              {cred.issuer.website}
            </a>
          </p>
          <p>
            <strong>Dashboard:</strong>{" "}
            <a
              href={cred.issuer.dashboard}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Access Issuer Dashboard
            </a>
          </p>
        </Card>

        {/* Evidence / Metadata */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Evidence & Metadata</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>Lab Exercises Metadata</li>
            <li>Case Study Metadata</li>
            <li>Verification Report Available</li>
            <li>JSON Export Option</li>
          </ul>
        </Card>

        {/* Share Section */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-bold">Share Credential</h3>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter recipient email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
            <Button onClick={handleShare}>Send Report</Button>
          </div>
          <div className="flex items-center my-2 text-gray-500 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-2">or</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <div className="flex flex-wrap pt-2 justify-center gap-16">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Twitter className="h-4 w-4" /> Twitter
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" /> Facebook
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" /> Copy Link
            </Button>
          </div>
        </Card>

        {/* Download Section */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-bold">Download Credential</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2 w-auto">
              <Download className="h-4 w-4" /> PDF
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2 w-auto">
              <Download className="h-4 w-4" /> JSON
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
