import { SectionCards } from "@/components/screens/Issuer/subComponents/dashboard/section-cards"
import { ChartAreaInteractive } from "@/components/screens/Issuer/subComponents/dashboard/chart-area-interactive"
import { DataTable } from "@/components/screens/Issuer/subComponents/dashboard/data-table"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable />
        <ChartAreaInteractive />
      </div>
    </div>
  )
}
