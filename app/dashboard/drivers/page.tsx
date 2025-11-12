"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { driversAPI } from "@/lib/api"
import { Pagination } from "@/components/pagination"
import { Eye, Edit2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DriversPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ["drivers", page],
    queryFn: () => driversAPI.getAllDrivers(page, 10),
  })

  const drivers = data?.data?.data || []
  const meta = data?.data?.meta || { totalPages: 1 }

  return (
    <div className="md:ml-64 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Driver List</h1>
        <p className="text-gray-600 mt-1">View and manage all registered drivers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))
          : drivers.map((driver: any) => (
              <Card key={driver._id} className="hover:shadow-lg transition">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{driver.userId.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-bold">{driver.userId.name}</h3>
                      <p className="text-xs text-gray-600">{driver.userId.email}</p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Eye size={16} />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <Pagination currentPage={page} totalPages={meta.totalPages || 1} onPageChange={setPage} />
    </div>
  )
}
