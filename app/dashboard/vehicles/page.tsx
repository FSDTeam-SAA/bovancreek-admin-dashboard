"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { vehiclesAPI } from "@/lib/api"
import { Pagination } from "@/components/pagination"
import { Plus, Edit2, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"

export default function VehiclesPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ["vehicles", page],
    queryFn: () => vehiclesAPI.getAllVehicles(page, 10),
  })

  const vehicles = data?.data?.data || []
  const meta = data?.data?.meta || { totalPages: 1 }

  return (
    <div className="md:ml-64 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vehicle List</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all registered vehicles</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus size={20} />
          Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            ))
          : vehicles.map((vehicle: any) => (
              <Card key={vehicle._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{vehicle.regNum}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{vehicle.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit2 size={16} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-red-600">
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                          <AlertDialogDescription>Are you sure you want to delete this vehicle?</AlertDialogDescription>
                          <div className="flex gap-4 justify-end">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">{vehicle.capacity} seats</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Driver:</span>
                      <span className="font-medium">{vehicle.driverId.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">MOT Date:</span>
                      <span className="font-medium">{new Date(vehicle.motDate).toLocaleDateString()}</span>
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
