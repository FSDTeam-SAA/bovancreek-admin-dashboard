"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Car, DollarSign } from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { bookingsAPI, vehiclesAPI, parentsAPI, paymentsAPI } from "@/lib/api"
import { useSession } from "next-auth/react"

const chartData = [
  { day: "Mon", bookings: 12, revenue: 800 },
  { day: "Tue", bookings: 19, revenue: 1200 },
  { day: "Wed", bookings: 15, revenue: 900 },
  { day: "Thu", bookings: 25, revenue: 1500 },
  { day: "Fri", bookings: 22, revenue: 1400 },
  { day: "Sat", bookings: 8, revenue: 500 },
  { day: "Sun", bookings: 5, revenue: 300 },
]

export default function DashboardPage() {

  const session = useSession()
  console.log(session)
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => bookingsAPI.getAllBookings(1, 5),
  })

  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => vehiclesAPI.getAllVehicles(1, 5),
  })

  const { data: parents, isLoading: parentsLoading } = useQuery({
    queryKey: ["parents"],
    queryFn: () => parentsAPI.getAllParents(1, 5),
  })

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: () => paymentsAPI.getAllPayments(1, 10),
  })

  const stats = [
    {
      label: "Total Bookings",
      value: bookings?.data?.data?.length || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Total Vehicles",
      value: vehicles?.data?.data?.length || 0,
      icon: Car,
      color: "bg-green-500",
    },
    {
      label: "Active Parents",
      value: parents?.data?.data?.length || 0,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      label: "Total Payments",
      value: `$${payments?.data?.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0}`,
      icon: DollarSign,
      color: "bg-yellow-500",
    },
  ]

  return (
    <div className="md:ml-64 p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <Icon size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bookings Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
