"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { parentsAPI } from "@/lib/api"
import { Pagination } from "@/components/pagination"
import { Eye } from "lucide-react"
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
        <h1 className="text-3xl font-bold">Parents List</h1>
        <p className="text-gray-600 mt-1">View all registered parents and their details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Parents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Fine</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton rows={10} columns={6} />
                ) : parents.length > 0 ? (
                  parents.map((parent: any) => (
                    <TableRow key={parent._id}>
                      <TableCell className="font-medium">{parent.name}</TableCell>
                      <TableCell>{parent.email}</TableCell>
                      <TableCell>{parent.emergencyContact}</TableCell>
                      <TableCell>{parent.location}</TableCell>
                      <TableCell>
                        <span className={parent.fine > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                          £{parent.fine}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Eye size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No parents found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination currentPage={page} totalPages={meta.totalPages || 1} onPageChange={setPage} />
        </CardContent>
      </Card>
    </div>
  )
}
