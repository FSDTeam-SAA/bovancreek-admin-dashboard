"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ChildProfile {
  id: string
  name: string
  bookingCount: number
  dateOfBirth: string
  schoolName: string
}

// Mock parent data
const mockParent = {
  id: "1",
  name: "John Doe",
  contactNumber: "07123 456789",
  emergencyNumber: "07123 456789",
  address: "12 Maple Street, Leeds",
  councilMember: "Yes",
  childrenCount: 3,
  totalBookings: 12,
  bookings: [
    {
      id: "1",
      passengerName: "Oliver Smith",
      contactNumber: "07123 456789",
      pickupLocation: "12 Maple Street, Leeds",
      dropoffLocation: "St. Mary's High School, Leeds",
      rideDateTime: "15 Aug 2025, 08:00",
      driverAssigned: "John Carter",
    },
    {
      id: "2",
      passengerName: "Amelia Johnson",
      contactNumber: "07123 456789",
      pickupLocation: "45 Oak Lane, Manchester",
      dropoffLocation: "Manchester Grammar School",
      rideDateTime: "15 Aug 2025, 08:00",
      driverAssigned: "Sarah White",
    },
    {
      id: "3",
      passengerName: "Amelia Johnson",
      contactNumber: "07123 456789",
      pickupLocation: "45 Oak Lane, Manchester",
      dropoffLocation: "Manchester Grammar School",
      rideDateTime: "15 Aug 2025, 08:00",
      driverAssigned: "Sarah White",
    },
  ],
  children: [
    {
      id: "1",
      name: "Oliver Smith",
      bookingCount: "02",
      dateOfBirth: "03/03/2009",
      schoolName: "North London Collegiate School - Edgware",
    },
    {
      id: "2",
      name: "Amelia Johnson",
      bookingCount: "01",
      dateOfBirth: "03/03/2009",
      schoolName: "St. Mary's High School, Leeds",
    },
    {
      id: "3",
      name: "Harry Brown",
      bookingCount: "00",
      dateOfBirth: "03/03/2009",
      schoolName: "Manchester Grammar School",
    },
  ],
}

export default function ParentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  return (
    <div className="md:ml-64 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Parent Profile Detail</h1>
        <p className="text-gray-600 mt-2">This is route detail page</p>
      </div>

      <Button
        onClick={() => router.back()}
        className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Go back
      </Button>

      {/* Basic Information */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl text-gray-900">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Parent Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Contact Number</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Emergency Number</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Address</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Council Member</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Children</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900 font-medium">{mockParent.name}</td>
                <td className="py-3 px-4 text-gray-700">{mockParent.contactNumber}</td>
                <td className="py-3 px-4 text-gray-700">{mockParent.emergencyNumber}</td>
                <td className="py-3 px-4 text-gray-700">{mockParent.address}</td>
                <td className="py-3 px-4 text-gray-700">{mockParent.councilMember}</td>
                <td className="py-3 px-4 text-gray-700">0{mockParent.childrenCount}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Total Bookings */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl text-gray-900">Total Bookings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-gray-50">
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
                {mockParent.bookings.map((booking) => (
                  <TableRow key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">{booking.passengerName}</TableCell>
                    <TableCell className="text-gray-700">{booking.contactNumber}</TableCell>
                    <TableCell className="text-gray-700">{booking.pickupLocation}</TableCell>
                    <TableCell className="text-gray-700">{booking.dropoffLocation}</TableCell>
                    <TableCell className="text-gray-700">{booking.rideDateTime}</TableCell>
                    <TableCell className="text-gray-700">{booking.driverAssigned}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Children Profiles */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl text-gray-900">Children Profiles</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockParent.children.map((child) => (
              <div key={child.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary"></div>
                  <h3 className="text-lg font-semibold text-gray-900">{child.name}</h3>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Booking</span>
                    <span className="text-sm font-semibold text-gray-900">{child.bookingCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date of Birth</span>
                    <span className="text-sm font-semibold text-gray-900">{child.dateOfBirth}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <span className="text-xs text-gray-600">School Name</span>
                    <p className="text-sm font-medium text-gray-900">{child.schoolName}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive/10 font-semibold rounded-full bg-transparent"
                >
                  <Trash2 size={16} className="mr-2" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
