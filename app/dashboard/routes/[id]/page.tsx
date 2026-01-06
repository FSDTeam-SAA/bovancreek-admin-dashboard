"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface RouteStop {
  stopNumber: string
  stopName: string
  location: string
  type: "starting" | "stop" | "ending"
}

// Mock route data
const mockRoute = {
  id: "1",
  routeName: "Route A",
  routeType: "Pickup",
  routeTime: "07:30 AM",
  startingLocation: "12 Maple Street, Leeds",
  endingLocation: "Springfield School, Main Campus",
  fare: 12.5,
  driverName: "William Smith",
  driverContact: "+1 202 555 0100",
  vehicleCapacity: "20 Seats",
  vehicleInfo: "Route A – Plate: ABC-2345",
  licensePlate: "AB12 CDE",
  geofence: "1KM",
  totalStops: 8,
  stops: [
    {
      stopNumber: "01",
      stopName: "Starting Location",
      location: "12 Maple Street, House #12",
      type: "starting" as const,
    },
    { stopNumber: "02", stopName: "Route Stop", location: "Oakwood Park Entrance", type: "stop" as const },
    { stopNumber: "03", stopName: "Route Stop", location: "Central Library Bus Stop", type: "stop" as const },
    { stopNumber: "04", stopName: "Route Stop", location: "Riverdale Market", type: "stop" as const },
    { stopNumber: "05", stopName: "Route Stop", location: "Driver started trip", type: "stop" as const },
    { stopNumber: "06", stopName: "Route Stop", location: "Central Library Bus Stop", type: "stop" as const },
    { stopNumber: "07", stopName: "Route Stop", location: "Central Library Bus Stop", type: "stop" as const },
    {
      stopNumber: "08",
      stopName: "Ending Location",
      location: "Springfield School, Main Campus",
      type: "ending" as const,
    },
  ],
}

export default function RouteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  return (
    <div className="md:ml-64 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Route Detail</h1>
        <p className="text-gray-600 mt-2">This is route detail page</p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => router.back()}
          className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Go back
        </Button>
        <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-full px-6">
          Edit Route
        </Button>
        <Button className="bg-destructive hover:bg-destructive/90 text-white font-semibold rounded-full px-6">
          Delete Route
        </Button>
      </div>

      {/* Route Information */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl text-gray-900">Route Information</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Route Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Route Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Route Time</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Starting Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Ending Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Fare</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900 font-medium">{mockRoute.routeName}</td>
                <td className="py-3 px-4 text-gray-700">{mockRoute.routeType}</td>
                <td className="py-3 px-4 text-gray-700">{mockRoute.routeTime}</td>
                <td className="py-3 px-4 text-gray-700">{mockRoute.startingLocation}</td>
                <td className="py-3 px-4 text-gray-700">{mockRoute.endingLocation}</td>
                <td className="py-3 px-4 text-gray-900 font-medium">£{mockRoute.fare}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Driver & Vehicle */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl text-gray-900">Driver & Vehicle</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Driver</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Driver Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Vehicle Capacity</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Vehicle</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">License Number</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Geofence</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900 font-medium">{mockRoute.driverName}</td>
                <td className="py-3 px-4 text-gray-700">{mockRoute.driverContact}</td>
                <td className="py-3 px-4 text-gray-700">{mockRoute.vehicleCapacity}</td>
                <td className="py-3 px-4 text-gray-700">{mockRoute.vehicleInfo}</td>
                <td className="py-3 px-4 text-gray-700">{mockRoute.licensePlate}</td>
                <td className="py-3 px-4 text-gray-700">{mockRoute.geofence}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Route Stops */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-gray-900">Route Stops</CardTitle>
            <p className="text-sm text-primary mt-1">0{mockRoute.totalStops} Stops</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full">
            <Plus size={18} className="mr-2" />
            Add a Stop
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-8 items-start">
            {mockRoute.stops.map((stop, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* Timeline connector */}
                {idx < mockRoute.stops.length - 1 && (
                  <div className="hidden md:block absolute left-0 right-0 h-0.5 bg-primary/30 top-6 -z-10 w-24"></div>
                )}
                {/* Stop circle */}
                <div className="w-12 h-12 rounded-full border-4 border-primary bg-white flex items-center justify-center font-semibold text-primary mb-3">
                  {stop.stopNumber}
                </div>
                {/* Stop name */}
                <p className="text-sm font-semibold text-gray-900 text-center max-w-xs">{stop.stopName}</p>
                <p className="text-xs text-gray-600 text-center max-w-xs mt-1">{stop.location}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
