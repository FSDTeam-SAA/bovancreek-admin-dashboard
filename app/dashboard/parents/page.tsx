"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { parentsAPI } from "@/lib/api"
import { Pagination } from "@/components/pagination"
import { TableSkeleton } from "@/components/table-skeleton"

export default function ParentsPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ["parents", page],
    queryFn: () => parentsAPI.getAllParents(page, 10),
  })

  const parents = data?.data?.data || []
  const meta = data?.data?.meta || { totalPages: 1 }

  return (
    <div className="md:ml-64 p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Parents List</h1>
        <p className="text-gray-600 mt-2">View Parents And Their Details Including Children Signed Up To The App</p>
      </div>

      <div className="flex gap-3 items-center">
        <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm font-medium">
          <option>Sort by: Revenue</option>
          <option>Sort by: Name</option>
          <option>Sort by: Bookings</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm font-medium">
          <option>Council Member: Yes</option>
          <option>Council Member: No</option>
          <option>Council Member: All</option>
        </select>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-gray-50">
                  <TableHead className="text-gray-900 font-semibold text-sm">Parent Name</TableHead>
                  <TableHead className="text-gray-900 font-semibold text-sm">Contact Number</TableHead>
                  <TableHead className="text-gray-900 font-semibold text-sm">Emergency Number</TableHead>
                  <TableHead className="text-gray-900 font-semibold text-sm">Address</TableHead>
                  <TableHead className="text-gray-900 font-semibold text-sm">Council Member</TableHead>
                  <TableHead className="text-gray-900 font-semibold text-sm">Total Bookings</TableHead>
                  <TableHead className="text-gray-900 font-semibold text-sm">Children</TableHead>
                  <TableHead className="text-gray-900 font-semibold text-sm">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton rows={10} columns={8} />
                ) : parents.length > 0 ? (
                  parents.map((parent: any) => (
                    <TableRow key={parent._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">{parent.name}</TableCell>
                      <TableCell className="text-gray-700">{parent.phone || "-"}</TableCell>
                      <TableCell className="text-gray-700">{parent.emergencyContact || "-"}</TableCell>
                      <TableCell className="text-gray-700">{parent.location || "-"}</TableCell>
                      <TableCell className="text-gray-700">{parent.councilMember ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-gray-700">{parent.totalBookings || 0}</TableCell>
                      <TableCell className="text-gray-700">{parent.childrenCount || 0}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No parents found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="p-6 border-t border-gray-200">
            <Pagination currentPage={page} totalPages={meta.totalPages || 1} onPageChange={setPage} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
