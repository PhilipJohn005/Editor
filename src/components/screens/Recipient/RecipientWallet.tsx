import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"
import cloudP from '../../../assets/cloudP.png'
import cloudE from '../../../assets/cloudE.png'
import netC from '../../../assets/netC.png'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"

type Status = "Verified" | "Pending Verification"
type Kind = "Badge" | "Certificate"

type Credential = {
  org: "AWS" | "Infosys"
  title: string
  kind: Kind
  status: Status
  issued: string
  image: string
}

const DATA: Credential[] = [
  { org: "AWS", title: "Cloud practitioner", kind: "Badge", status: "Pending Verification", issued: "25-04-24", image: cloudP },
  { org: "AWS", title: "Networking Core", kind: "Badge", status: "Verified", issued: "02-07-25", image: netC },
  { org: "AWS", title: "Cloud Economics", kind: "Certificate", status: "Pending Verification", issued: "13-10-25", image: cloudE },
  { org: "AWS", title: "Cloud Economics", kind: "Certificate", status: "Pending Verification", issued: "13-10-25", image: cloudE },
  { org: "Infosys", title: "Cloud practitioner", kind: "Badge", status: "Pending Verification", issued: "25-04-24", image: cloudP },
  { org: "Infosys", title: "Networking Core", kind: "Badge", status: "Verified", issued: "02-07-25", image: netC },
]

export default function RecipientWallet() {
  const navigate = useNavigate()

  const grouped = useMemo(() => {
    return {
      AWS: DATA.filter(d => d.org === "AWS"),
      Infosys: DATA.filter(d => d.org === "Infosys"),
    }
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Title + Profile */}
      <div className="px-6 pt-6 flex items-center justify-between">
        <h1 className="text-[36px] leading-[1.1] font-extrabold text-center flex-1">
          Philip’s Wallet
        </h1>

        <button onClick={() => navigate('/recipientprofile')} className="ml-4">
          <Avatar className="h-12 w-12 cursor-pointer border">
            <AvatarImage src="https://wwwE" alt="Profile" />
            <AvatarFallback>PJ</AvatarFallback>
          </Avatar>
        </button>
      </div>

      {/* Filters */}
      <div className="px-6 mt-6 flex items-center gap-3 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="h-9 rounded-md px-4">
              Type <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>All</DropdownMenuItem>
            <DropdownMenuItem>Badge</DropdownMenuItem>
            <DropdownMenuItem>Certificate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="h-9 rounded-md px-4">
              Status <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>All</DropdownMenuItem>
            <DropdownMenuItem>Verified</DropdownMenuItem>
            <DropdownMenuItem>Pending Verification</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="secondary" className="h-9 rounded-md px-4">
          17-7-24
        </Button>
        <Button variant="secondary" className="h-9 rounded-md px-4">
          20-10-25
        </Button>
      </div>

      {/* ORG Sections */}
      <OrgSection title="AWS">
        {grouped.AWS.slice(0, 4).map((c, i) => (
          <CredCard key={`aws-${i}`} cred={c} index={i} />
        ))}
      </OrgSection>

      <OrgSection title="Infosys">
        {grouped.Infosys.slice(0, 4).map((c, i) => (
          <CredCard key={`infy-${i}`} cred={c} index={i} />
        ))}
      </OrgSection>

      <div className="h-10" />
    </div>
  )
}

function OrgSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="px-6 mt-8">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </section>
  )
}


function CredCard({ cred, index }: { cred: Credential, index: number }) {
  const navigate = useNavigate()

  return (
    <Card 
      className="shadow-md rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/credential/${index}`)}   // navigate to detail
    >
      <div className="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={cred.image}
          alt={cred.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <CardContent className="p-4">
        <div className="text-sm font-semibold">{cred.title}</div>
        <div className="text-xs text-gray-600 mt-1">{cred.kind}</div>
        <div className="text-[11px] text-gray-500 mt-3">
          Issued on: {cred.issued}
        </div>
      </CardContent>
    </Card>
  )
}
