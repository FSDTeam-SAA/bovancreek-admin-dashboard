"use client"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual API call
const mockDriver = {
  _id: "1",
  name: "William Smith",
  email: "williamsmith@gmail.com",
  password: "••••••••••",
  contactNumber: "07123 456789",
  emergencyContact: "07123 456789",
  homeAddress: "12 Maple Street, Leeds",
  licenseFile: "john-license123.pdf",
  licenseExpiry: "08/01/2027",
  licenseUploaded: "07/01/2025",
  dbsFile: "mycertificate.pdf",
  dbsExpiry: "08/01/2027",
  dbsUploaded: "07/01/2025",
  vehicleAssigned: "Route A",
  vehicleLicensePlate: "ABC-2345",
  vehicleCapacity: "40 Seats",
  routeAssignments: [
    {
      routeName: "Route A",
      routeType: "Pickup",
      routeTime: "07:30 AM",
      startLocation: "Maple Street, House #12",
      endLocation: "Springfield School, Main Campus",
      fare: "£12.50",
    },
  ],
}

export default function DriverDetailPage() {
  const params = useParams()
  const driverId = params.id
  const driver = mockDriver // Replace with API fetch

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Driver Detail</h1>
          <p className="text-muted-foreground mt-2">
            View complete ride information, including passenger, pickup & drop-off, driver, and vehicle details.
          </p>
        </div>
        {/* Search */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border border-border rounded-lg text-sm bg-card"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Link href="/dashboard/drivers">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
            <ArrowLeft size={18} />
            Go back
          </Button>
        </Link>
        <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-6">Edit Details</Button>
        <Button className="bg-destructive hover:bg-destructive/90 text-white rounded-full px-6">
          Deactivate Profile
        </Button>
      </div>

      {/* Driver Information Section */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl">Driver Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-5 gap-4">
            <InfoField label="Name" value={driver.name} />
            <InfoField label="Email" value={driver.email} />
            <InfoField label="Password" value={driver.password} />
            <InfoField label="Contact Number" value={driver.contactNumber} />
            <InfoField label="Emergency Contact Number" value={driver.emergencyContact} />

            {/* Full width address */}
            <div className="col-span-5">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Home Address</p>
                <p className="text-sm font-semibold text-foreground mt-2">{driver.homeAddress}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License & DBS Certificate Section */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl">License & DBS Certificate</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Uploaded License file */}
            <FileBox
              title="Uploaded License file"
              fileName={driver.licenseFile}
              expiry={driver.licenseExpiry}
              uploaded={driver.licenseUploaded}
            />
            {/* Uploaded DBS Certificate file */}
            <FileBox
              title="Uploaded DBS Certificate file"
              fileName={driver.dbsFile}
              expiry={driver.dbsExpiry}
              uploaded={driver.dbsUploaded}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Assigned Section */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl">Vehicle Assigned</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4">
            <InfoField
              label="Vehicle"
              value={driver.vehicleAssigned}
              isLink="/dashboard/vehicles/1"
              linkText="View Vehicle"
            />
            <InfoField label="License Plate" value={driver.vehicleLicensePlate} />
            <InfoField label="Capacity" value={driver.vehicleCapacity} />
            <InfoField
              label="Track Ride"
              value="View on Map"
              isLink="/dashboard/bookings/track"
              linkText="View on Map"
            />
          </div>
        </CardContent>
      </Card>

      {/* Route Assigned Section */}
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl">Route Assigned</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Route Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Route Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Route Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Starting Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Ending Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Fare</th>
                </tr>
              </thead>
              <tbody>
                {driver.routeAssignments.map((route, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-foreground">{route.routeName}</td>
                    <td className="py-3 px-4 text-foreground">{route.routeType}</td>
                    <td className="py-3 px-4 text-foreground">{route.routeTime}</td>
                    <td className="py-3 px-4 text-foreground">{route.startLocation}</td>
                    <td className="py-3 px-4 text-foreground">{route.endLocation}</td>
                    <td className="py-3 px-4 text-foreground font-semibold">{route.fare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper component for info fields
function InfoField({
  label,
  value,
  isLink = false,
  linkText,
}: {
  label: string
  value: string
  isLink?: boolean | string
  linkText?: string
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{label}</p>
      {isLink ? (
        <Link href={isLink as string} className="text-sm font-semibold text-primary hover:underline mt-2 inline-block">
          {linkText || value}
        </Link>
      ) : (
        <p className="text-sm font-semibold text-foreground mt-2">{value}</p>
      )}
    </div>
  )
}

// File box component for certificates
function FileBox({
  title,
  fileName,
  expiry,
  uploaded,
}: {
  title: string
  fileName: string
  expiry: string
  uploaded: string
}) {
  return (
    <div className="border-2 border-dashed border-border rounded-lg p-6 bg-muted/30">
      <h4 className="font-semibold text-foreground mb-4">{title}</h4>
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-foreground">{fileName}</p>
          <p className="text-sm text-destructive font-semibold mt-1">Expiry: {expiry}</p>
          <p className="text-xs text-muted-foreground mt-1">Uploaded: {uploaded}</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white w-full rounded-lg gap-2">
          <Download size={16} />
          Download File
        </Button>
      </div>
    </div>
  )
}
