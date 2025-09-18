import React from "react"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table"
import { Card, CardContent } from "../../../ui/card"

const credentials = [
  {
    id: "01",
    recipient: "xyz",
    email: "xyz123@gmail.com",
    badge: "Data Analysis",
    status: "issued",
    issueDate: "24-07-25",
  },
  {
    id: "02",
    recipient: "xyz",
    email: "xyz123@gmail.com",
    badge: "Data Analysis",
    status: "issued",
    issueDate: "24-07-25",
  },
  {
    id: "03",
    recipient: "xyz",
    email: "xyz123@gmail.com",
    badge: "Data Analysis",
    status: "issued",
    issueDate: "24-07-25",
  },
]

const BadgeManager = () => {
  return (
    <div className="space-y-6">
      
      <h2 className="text-2xl font-bold">Badge Manager</h2>

    
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Input
          placeholder="Type something bro..."
          className="w-full sm:w-1/2"
        />
        <span className="text-sm text-gray-600">Filter by status</span>
      </div>

     
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableCaption>
              List of all credentials issued
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Badge Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead className="flex items-end justify-center pb-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {credentials.map((c, index) => (
                <TableRow key={index}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{c.recipient}</span>
                      <span className="text-xs text-gray-500">{c.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{c.badge}</TableCell>
                  <TableCell className="capitalize">{c.status}</TableCell>
                  <TableCell>{c.issueDate}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:bg-red-100"
                      >
                        Revoke
                      </Button>
                      <Button variant="outline">Download</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default BadgeManager
