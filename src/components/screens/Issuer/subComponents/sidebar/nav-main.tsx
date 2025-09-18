// src/components/screens/subComponents/dashboard/nav-main.tsx
import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type NavItem = {
  title: string
  url?: string
  icon?: LucideIcon
  children?: NavItem[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <React.Fragment key={item.title}>
              <SidebarMenuItem>
                {item.children ? (
                  <SidebarMenuButton
                    onClick={() => toggleMenu(item.title)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition hover:cursor-pointer"
                  >
                    {item.icon ? <item.icon size={18} /> : null}
                    <span>{item.title}</span>
                    <span className="ml-auto">
                      {openMenus[item.title] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </span>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url!}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                          ${isActive ? "bg-muted text-foreground" : "hover:bg-muted/50"}`
                      }
                    >
                      {item.icon ? <item.icon size={18} /> : null}
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>

              {item.children && openMenus[item.title] && (
                <div className="ml-6 mt-1 flex flex-col gap-1">
                  {item.children.map((child) => (
                    <SidebarMenuItem key={child.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={child.url!}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition
                              ${isActive ? "bg-muted text-foreground" : "hover:bg-muted/50"}`
                          }
                        >
                          {child.icon ? <child.icon size={16} /> : null}
                          <span>{child.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
