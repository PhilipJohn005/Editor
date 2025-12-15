// src/components/screens/subComponents/dashboard/app-sidebar.tsx
import React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "../sidebar/nav-main"
import { NavUser } from "../sidebar/nav-user"
import logo from "@/assets/sertify-logo-full.png"

import {
  LayoutDashboard,
  GraduationCap,
  Palette,
  IdCard,
  BadgeCheck,
  FilePieChartIcon,
  Send,
  CreditCard,
  User,
} from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Certificate-Class", url: "/badge-class", icon: GraduationCap },
    { title: "Canvas Tool", url: "/canvassetup", icon: Palette },
    {
      title: "Credential Manager",
      icon: IdCard,
      children: [
        { title: "Badge Manager", url: "/badgemanager", icon: BadgeCheck },
        { title: "Certificate Manager", url: "/certificatemanager", icon: FilePieChartIcon },
      ],
    },
    { title: "Issuance", url: "/issueance", icon: Send },
    { title: "Subscription & Billing", url: "/subscription", icon: CreditCard },
    { title: "Profile Management", url: "/profile", icon: User },
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="w-64">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="py-2 bg-white flex items-center justify-center rounded">
              <img src={logo} alt="Sertify.me" className="h-10 w-auto object-contain" />
            </div>
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
