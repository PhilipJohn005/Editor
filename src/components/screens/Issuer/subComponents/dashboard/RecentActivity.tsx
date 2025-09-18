import * as React from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const schema = {
  id: Number,
  activity: String,
  outcome: String,
  date: String,
}

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "activity",
    header: "Recent Activity",
    cell: ({ row }) => row.original.activity,
  },
  {
    accessorKey: "outcome",
    header: "Outcome",
    cell: ({ row }) => row.original.outcome,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => row.original.date,
  },
]

const placeholderData = [
  {
    id: 1,
    activity: "Redis Fundamentals Certificate Issued",
    outcome: "200 recipients",
    date: "2025-08-10",
  },
  {
    id: 2,
    activity: "AWS Workshop Completed",
    outcome: "150 participants",
    date: "2025-07-22",
  },
  {
    id: 3,
    activity: "PostgreSQL Basics Training",
    outcome: "120 attendees",
    date: "2025-06-15",
  },
  {
    id: 4,
    activity: "Hackathon Organized",
    outcome: "50 teams registered",
    date: "2025-05-09",
  },
  {
    id: 5,
    activity: "Docker Certification Drive",
    outcome: "90 certificates issued",
    date: "2025-04-01",
  },
  {
    id: 6,
    activity: "Kubernetes Hands-on Lab",
    outcome: "75 participants",
    date: "2025-03-18",
  },
  {
    id: 6,
    activity: "Kubernetes Hands-on Lab",
    outcome: "75 participants",
    date: "2025-03-18",
  },
  {
    id: 6,
    activity: "Kubernetes Hands-on Lab",
    outcome: "75 participants",
    date: "2025-03-18",
  },
  {
    id: 6,
    activity: "Kubernetes Hands-on Lab",
    outcome: "75 participants",
    date: "2025-03-18",
  },
  {
    id: 6,
    activity: "Kubernetes Hands-on Lab",
    outcome: "75 participants",
    date: "2025-03-18",
  },
  {
    id: 6,
    activity: "Kubernetes Hands-on Lab",
    outcome: "75 participants",
    date: "2025-03-18",
  },
  {
    id: 6,
    activity: "Kubernetes Hands-on Lab",
    outcome: "75 participants",
    date: "2025-03-18",
  },
  {
    id: 6,
    activity: "Kubernetes Hands-on Lab",
    outcome: "75 participants",
    date: "2025-03-18",
  },
  {
    id: 6,
    activity: "Kubernetes Hands-on Lab",
    outcome: "75 participants",
    date: "2025-03-18",
  },
]

export function RecentActivity() {
  const table = useReactTable({
    data: placeholderData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full overflow-hidden">
      <Table className="rounded">
        <TableHeader className="bg-muted sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No recent activity.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
