import { useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
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
  image: string // image URL
}

const DATA: Credential[] = [
  { org: "AWS", title: "Cloud practitioner", kind: "Badge", status: "Pending Verification", issued: "25-04-24", image: cloudP },
  { org: "AWS", title: "Networking Core", kind: "Badge", status: "Verified", issued: "02-07-25", image: netC },
  { org: "AWS", title: "Cloud Economics", kind: "Certificate", status: "Pending Verification", issued: "13-10-25", image: cloudE },
  { org: "AWS", title: "Cloud Economics", kind: "Certificate", status: "Pending Verification", issued: "13-10-25", image: cloudE },
  { org: "AWS", title: "Cloud Economics", kind: "Certificate", status: "Pending Verification", issued: "13-10-25", image: cloudE },
  { org: "AWS", title: "Cloud Economics", kind: "Certificate", status: "Pending Verification", issued: "13-10-25", image: cloudE },
  { org: "Infosys", title: "Cloud practitioner", kind: "Badge", status: "Pending Verification", issued: "25-04-24", image: cloudP },
  { org: "Infosys", title: "Networking Core", kind: "Badge", status: "Verified", issued: "02-07-25", image: netC },
  { org: "Infosys", title: "Cloud Economics", kind: "Certificate", status: "Pending Verification", issued: "13-10-25", image: cloudE },
  { org: "Infosys", title: "Cloud Economics", kind: "Certificate", status: "Pending Verification", issued: "13-10-25", image: cloudE },
  { org: "Infosys", title: "Cloud Economics", kind: "Certificate", status: "Pending Verification", issued: "13-10-25", image: cloudE },
  { org: "Infosys", title: "Cloud Economics", kind: "Certificate", status: "Pending Verification", issued: "13-10-25", image: cloudE },
]

export default function RecipientWallet() {
  const awsRow = useRef<HTMLDivElement>(null)
  const infyRow = useRef<HTMLDivElement>(null)
  const navigate=useNavigate();

  const grouped = useMemo(() => {
    return {
      AWS: DATA.filter(d => d.org === "AWS"),
      Infosys: DATA.filter(d => d.org === "Infosys"),
    }
  }, [])

  const scrollBy = (ref: React.RefObject<HTMLDivElement>, dir: "left" | "right") => {
    const el = ref.current
    if (!el) return
    const delta = dir === "left" ? -el.clientWidth : el.clientWidth
    el.scrollBy({ left: delta, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Title + Profile */}
      <div className="px-6 pt-6 flex items-center justify-between">
        <h1 className="text-[44px] leading-[1.1] font-extrabold text-center flex-1">
          Philip’s Wallet
        </h1>

       
        <button onClick={() => navigate('/recipientprofile')} className="ml-4">
          <Avatar className="h-12 w-12 cursor-pointer border">
            <AvatarImage src="https://wwwE" alt="Profile" />
            <AvatarFallback>PJ</AvatarFallback>
          </Avatar>
        </button>
      </div>

    
      <div className="px-6 mt-3 mb-6 flex items-center justify-between">
        <p className="text-base font-medium">
          Total Credentials Earned: <span className="font-semibold">5</span>
        </p>
        <p className="text-base font-medium">
          Recent Credential Additions: <span className="font-semibold">2</span>
        </p>
      </div>

      {/* Search + view icons */}
      <div className="px-6">
        <div className="w-full bg-gray-100/60 rounded-md p-3 grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center">
          <Button variant="secondary" size="icon" className="rounded-full">
            <Search className="h-4 w-4" />
          </Button>
          <Input placeholder="Type something..." className="bg-white" />
          <Button variant="outline" size="icon" className="justify-self-end">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter chips row */}
        <div className="flex items-center gap-3 mt-4">
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

          {/* Date pills */}
          <Button variant="secondary" className="h-9 rounded-md px-4">
            17-7-24
          </Button>
          <Button variant="secondary" className="h-9 rounded-md px-4">
            20-10-25
          </Button>
        </div>
      </div>

      {/* ORG: AWS */}
      <OrgSection
        title="AWS"
        rowRef={awsRow}
        onLeft={() => scrollBy(awsRow, "left")}
        onRight={() => scrollBy(awsRow, "right")}
      >
        {grouped.AWS.map((c, i) => (
          <CredCard key={`aws-${i}`} cred={c} />
        ))}
      </OrgSection>

      {/* ORG: Infosys */}
      <OrgSection
        title="Infosys"
        rowRef={infyRow}
        onLeft={() => scrollBy(infyRow, "left")}
        onRight={() => scrollBy(infyRow, "right")}
      >
        {grouped.Infosys.map((c, i) => (
          <CredCard key={`infy-${i}`} cred={c} />
        ))}
      </OrgSection>

      <div className="h-10" />
    </div>
  )
}

function OrgSection({
  title,
  rowRef,
  onLeft,
  onRight,
  children,
}: {
  title: string
  rowRef: React.RefObject<HTMLDivElement>
  onLeft: () => void
  onRight: () => void
  children: React.ReactNode
}) {
  return (
    <section className="px-6 mt-8">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="relative">
        {/* left chevron */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full"
          onClick={onLeft}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* scroll row */}
        <div
          ref={rowRef}
          className="ml-12 mr-12 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
        >
          {children}
        </div>

        {/* right chevron */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full"
          onClick={onRight}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </section>
  )
}

function CredCard({ cred }: { cred: Credential }) {
  return (
    <Card className="min-w-[240px] max-w-[260px] snap-start shadow-md rounded-2xl overflow-hidden">
      
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
        <div className="mt-1">
          {cred.status === "Verified" ? (
            <Badge className="text-xs bg-green-600 text-white">Verified</Badge>
          ) : (
            <span className="text-gray-700 text-sm">Pending Verification</span>
          )}
        </div>
        <div className="text-[11px] text-gray-500 mt-3">
          Issued on: {cred.issued}
        </div>
      </CardContent>
    </Card>
  )
}
