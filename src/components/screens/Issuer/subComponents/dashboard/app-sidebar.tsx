// src/components/screens/subComponents/dashboard/app-sidebar.tsx
import React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import logo from "@/assets/sertify-logo-full.png" // use @ alias (your project already uses it)

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard" },
    { title: "Certificate-Class", url: "/badge-class" },
    { title: "Canvas Tool", url: "/canvassetup" },
    { title: "Credential Manager", 
      children: [
        { title: "Badge Manager", url: "/badgemanager" },
        { title: "Certificate Manager", url: "/certifiicatemanager" },
      ]},
    { title: "Issuance", url: "/issueance" },
    { title: "Subscription & Billing", url: "/subscription" },
    { title: "Profile Management", url: "/profile" },
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="w-64">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-2">
              {/* fixed height: h-10 so logo doesn't stretch */}
              <img src={logo} alt="Sertify.me" className="h-10 w-auto object-contain" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
