"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, User, Calendar, DollarSign } from "lucide-react"
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
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      label: "Total Vehicles",
      value: vehicles?.data?.data?.length || 0,
      icon: Car,
      color: "bg-green-500",
    },
    {
      label: "Active Drivers",
      value: parents?.data?.data?.length || 0,
      icon: User,
      color: "bg-purple-500",
    },
    {
      label: "Pending Payments",
      value: payments?.data?.payments?.filter((p: any) => p.status === "pending").length || 0,
      icon: DollarSign,
      color: "bg-yellow-500",
    },
  ]

  return (
    <div className="md:ml-64 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back to BPOOL Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2 text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-4 rounded-lg text-white flex items-center justify-center`}>
                    <Icon size={28} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Bookings over time</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Last 7 Days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="bookings" stroke="#6b7fdb" strokeWidth={2} dot={{ fill: "#6b7fdb" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Revenue over Time</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Last 7 Days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px" }} />
                <Bar dataKey="revenue" fill="#d084c1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
