import { SectionCards } from "@/components/screens/Issuer/dashboard/section-cards"
import { QuickActions } from "@/components/screens/Issuer/dashboard/QuickActions"
import { RecentActivity } from "@/components/screens/Issuer/dashboard/RecentActivity"



export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  )
}


