"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  IconChevronRight,
  IconAward,
  IconBrush,
  IconUserCog,
  IconHierarchy2,
  IconUpload,
  IconFileSpreadsheet,
} from "@tabler/icons-react"

type QuickAction = {
  id: string
  label: string
  description?: string
  action?: () => void
  icon: React.ReactNode
}

const DEFAULT_ACTIONS: QuickAction[] = [
  {
    id: "create-badge",
    label: "Create Badge",
    description: "Issue a new badge to users",
    icon: <IconAward className="size-5" />,
    action: () => alert("Create Badge"),
  },
  {
    id: "canvas-tool",
    label: "Go to Canvas Tool",
    description: "Open the certificate/canvas editor",
    icon: <IconBrush className="size-5" />,
    action: () => alert("Go to Canvas Tool"),
  },
  {
    id: "profile-management",
    label: "Profile Management",
    description: "Manage user profiles & roles",
    icon: <IconUserCog className="size-5" />,
    action: () => alert("Profile Management"),
  },
  {
    id: "badge-class-management",
    label: "Badge Class Management",
    description: "Create and manage badge classes",
    icon: <IconHierarchy2 className="size-5" />,
    action: () => alert("Badge Class Management"),
  },
  {
    id: "import-recipients",
    label: "Import Recipients",
    description: "Upload a CSV of recipients",
    icon: <IconUpload className="size-5" />,
    action: () => alert("Import Recipients"),
  },
  {
    id: "export-data",
    label: "Export Data",
    description: "Download CSV / Excel",
    icon: <IconFileSpreadsheet className="size-5" />,
    action: () => alert("Export Data"),
  },
]

export function QuickActions({
  actions = DEFAULT_ACTIONS,
  onAction,
}: {
  actions?: QuickAction[]
  onAction?: (id: string) => void
}) {
  const handleClick = (item: QuickAction) => {
    item.action?.()
    onAction?.(item.id)
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Jump to common tasks</CardDescription>
      </CardHeader>

      <CardContent className="px-2 sm:px-6">
        <div className="grid gap-2">
          {actions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className="group flex w-full items-center justify-between rounded-2xl border p-3 text-left transition
                         hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-muted p-2">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  {item.description ? (
                    <span className="text-sm text-muted-foreground">
                      {item.description}
                    </span>
                  ) : null}
                </div>
              </div>

              <IconChevronRight className="size-4 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
