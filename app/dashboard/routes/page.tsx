"use client"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { routesAPI } from "@/lib/api"
import { Plus, Eye } from "lucide-react"
import { TableSkeleton } from "@/components/table-skeleton"

export default function RoutesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["routes"],
    queryFn: () => routesAPI.getAllRoutes(),
  })

  const routes = data?.data?.data || []

  return (
    <div className="md:ml-64 p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Routes</h1>
        <p className="text-gray-600 mt-2">Create new drop-off routes for parents or view routes stops by them.</p>
      </div>

      <div className="flex gap-3 items-center">
        <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-full px-6">
          <Eye size={18} className="mr-2" />
          View Requested Stop
        </Button>
        <Button className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6">
          <Plus size={18} className="mr-2" />
          Add Route
        </Button>
        <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm">
          <option>Route Type</option>
          <option>Pickup</option>
          <option>Drop-off</option>
        </select>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-gray-50">
                  <TableHead className="text-gray-900 font-semibold text-sm">Route Name</TableHead>
                  <TableHead className="text-gray-900 font-semibold text-sm">Route Time</TableHead>
                  <TableHead className="text-gray-900 font-semibold text-sm">Route Type</TableHead>
                  <TableHead className="text-gray-900 font-semibold text-sm">Starting Location</TableHead>
                  <TableHead className="text-gray-900 font-semibold text-sm">Ending Location</TableHead>
                  <TableHead className="text-gray-900 font-semibold text-sm">Fare (£)</TableHead>
                  <TableHead className="text-gray-900 font-semibold text-sm">Total Stops</TableHead>
                  <TableHead className="text-gray-900 font-semibold text-sm">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton rows={8} columns={8} />
                ) : routes.length > 0 ? (
                  routes.map((route: any) => (
                    <TableRow key={route._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">{route.routeName}</TableCell>
                      <TableCell className="text-gray-700">{route.routeTime}</TableCell>
                      <TableCell className="text-gray-700">{route.routeType}</TableCell>
                      <TableCell className="text-gray-700">{route.startLocation?.name || "-"}</TableCell>
                      <TableCell className="text-gray-700">{route.endLocation?.name || "-"}</TableCell>
                      <TableCell className="text-gray-900 font-medium">£{route.routeFare}</TableCell>
                      <TableCell className="text-gray-700">{route.stops?.length || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary/10 bg-transparent"
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No routes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
