"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { driversAPI } from "@/lib/api"
import { Pagination } from "@/components/pagination"
import { Eye, Phone } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DriversPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ["drivers", page],
    queryFn: () => driversAPI.getAllDrivers(page, 10),
  })

  // Your API response shape: { success, message, data: [...] }
  const drivers = data?.data?.data ?? []

  // If your API doesn't send meta/totalPages, don't rely on it
  const totalPages = data?.data?.meta?.totalPages ?? 1

  return (
    <div className="md:ml-64 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Driver List</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all registered drivers, their details, and availability status.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">Create Driver</Button>
      </div>

      {/* Filters (placeholder for future) */}
      <div className="flex gap-3">
        <select className="px-4 py-2 border border-border rounded-lg text-sm bg-card">
          <option>Sort by: Review</option>
        </select>
        <select className="px-4 py-2 border border-border rounded-lg text-sm bg-card">
          <option>Route</option>
        </select>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border border-border shadow-sm rounded-lg overflow-hidden">
                <CardContent className="pt-6">
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            ))
          : drivers.map((driver: any) => {
              const name = driver?.name ?? "Unknown"
              const email = driver?.email ?? "-"
              const initial = (name?.trim()?.[0] ?? "?").toUpperCase()
              const status = driver?.status || "IDLE"
              const rating = 3.5
              const reviews = 100

              return (
                <Card
                  key={driver._id}
                  className="border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-lg"
                >
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {/* Driver Avatar Header with Status */}
                      <div className="bg-muted/50 p-4 flex items-start justify-between border-b border-border">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {initial}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-foreground text-sm">{name}</h3>
                            <span
                              className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mt-1 ${
                                status === "IDLE" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                        </div>
                        {/* Call button */}
                        <button className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 flex-shrink-0 transition-colors">
                          <Phone size={18} />
                        </button>
                      </div>

                      {/* Driver Details */}
                      <div className="px-4 py-3 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                              Contact Number
                            </p>
                            <p className="text-sm font-bold text-foreground mt-1">07123 456789</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                              License Number
                            </p>
                            <p className="text-sm font-bold text-foreground mt-1">AB12 CDE</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                              Vehicle Assigned
                            </p>
                            <p className="text-sm font-bold text-foreground mt-1">Route # 12</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                              Average Rating
                            </p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className="text-sm font-bold text-orange-500">{rating} Stars</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground text-center">{reviews} Reviews</div>
                      </div>

                      {/* Action Buttons */}
                      <div className="px-4 pb-4 pt-2 space-y-2 border-t border-border">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-full h-10">
                          <Eye size={16} />
                          View Details
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 border-primary text-primary hover:bg-primary/10 font-semibold text-sm rounded-full h-10 bg-transparent"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-destructive text-destructive hover:bg-destructive/10 font-semibold text-sm rounded-full h-10 bg-transparent"
                          >
                            Deactivate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
