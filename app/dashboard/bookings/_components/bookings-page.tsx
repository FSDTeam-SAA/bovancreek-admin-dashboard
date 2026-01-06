"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { bookingsAPI } from "@/lib/api"
import { Pagination } from "@/components/pagination"
import { TableSkeleton } from "@/components/table-skeleton"
import { ArrowUpDown } from "lucide-react"
import { BookingDetailsModal } from "./booking-details-sheet"

type BookingRow = any

export default function BookingsPage() {
  const [page, setPage] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["bookings", page],
    queryFn: () => bookingsAPI.getAllBookings(page, 10),
  })

  const bookings = data?.data?.data || []
  const meta = data?.data?.meta || { totalPages: 1 }

  const openDetails = (booking: BookingRow) => {
    setSelectedBooking(booking)
    setDetailsOpen(true)
  }

  return (
    <div className="md:ml-64 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Passenger Bookings</h1>
        <p className="text-gray-600 mt-2">Manage and track all ride bookings made by passengers.</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">All Bookings</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 border-gray-300 bg-transparent">
                <ArrowUpDown size={16} />
                Sort by: Ride time
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 hover:bg-transparent">
                  <TableHead className="text-gray-900 font-semibold">Passenger Name</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Contact Number</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Pickup Location</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Drop-off Location</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Ride Date & Time</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Driver Assigned</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton rows={10} columns={7} />
                ) : bookings.length > 0 ? (
                  bookings.map((booking: any) => (
                    <TableRow key={booking._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell className="font-bold text-gray-900">{booking?.parentId?.name}</TableCell>
                      <TableCell className="text-gray-700">07123 456789</TableCell>
                      <TableCell className="text-gray-700">{booking?.pickupLocation}</TableCell>
                      <TableCell className="text-gray-700">{booking?.dropOffLocation}</TableCell>
                      <TableCell className="text-gray-700">15 Aug 2025, 08:00</TableCell>
                      <TableCell className="font-medium text-gray-900">{booking.driverName || "John Carter"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => openDetails(booking)}
                          >
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-300 bg-transparent">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-600">
                      No bookings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination currentPage={page} totalPages={meta.totalPages || 1} onPageChange={setPage} />
        </CardContent>
      </Card>

      <BookingDetailsModal
        open={detailsOpen}
        onOpenChange={(v) => {
          setDetailsOpen(v)
          if (!v) setSelectedBooking(null)
        }}
        booking={selectedBooking}
      />
    </div>
  )
}
