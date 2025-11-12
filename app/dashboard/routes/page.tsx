"use client"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { routesAPI } from "@/lib/api"
import { Plus, Eye, Edit2 } from "lucide-react"
import { TableSkeleton } from "@/components/table-skeleton"

export default function RoutesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["routes"],
    queryFn: () => routesAPI.getAllRoutes(),
  })

  const routes = data?.data?.data || []

  return (
    <div className="md:ml-64 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Routes</h1>
          <p className="text-gray-600 mt-1">Create and manage delivery routes</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus size={20} />
          Add Route
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead>Stops</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton rows={5} columns={7} />
                ) : routes.length > 0 ? (
                  routes.map((route: any) => (
                    <TableRow key={route._id}>
                      <TableCell className="font-medium">{route.routeName}</TableCell>
                      <TableCell>{route.routeType}</TableCell>
                      <TableCell>{route.routeTime}</TableCell>
                      <TableCell>£{route.routeFare}</TableCell>
                      <TableCell>{route.stops?.length || 0}</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            route.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {route.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye size={16} />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
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
