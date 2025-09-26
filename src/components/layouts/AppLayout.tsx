import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/screens/Issuer/subComponents/sidebar/app-sidebar"
import { SiteHeader } from "@/components/screens/Issuer/subComponents/dashboard/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function AppLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          <Outlet/> 
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
