"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { paymentsAPI } from "@/lib/api"
import { Pagination } from "@/components/pagination"
import { TableSkeleton } from "@/components/table-skeleton"
import { DollarSign, CreditCard } from "lucide-react"

export default function PaymentsPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState("completed")

  const { data, isLoading } = useQuery({
    queryKey: ["payments", page, status],
    queryFn: () => paymentsAPI.getAllPayments(page, 10, status),
  })

  const payments = data?.data?.payments || []
  const meta = data?.data?.meta || { totalPages: 1 }
  const totalAmount = payments.reduce((sum: number, p: any) => sum + p.amount, 0)
  const pendingCount = payments.filter((p: any) => p.status === "pending").length

  return (
    <div className="md:ml-64 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-2">
          Track and manage all ride payments with filters, receipts, and export options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Amount</p>
                <p className="text-3xl font-bold mt-2 text-gray-900">£{totalAmount.toFixed(2)}</p>
              </div>
              <div className="bg-blue-500 p-4 rounded-lg text-white flex items-center justify-center">
                <DollarSign size={28} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Payments</p>
                <p className="text-3xl font-bold mt-2 text-gray-900">{pendingCount}</p>
              </div>
              <div className="bg-yellow-500 p-4 rounded-lg text-white flex items-center justify-center">
                <CreditCard size={28} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 hover:bg-transparent">
                  <TableHead className="text-gray-900 font-semibold">Transaction ID</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Passenger Name</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Ride Date & Time</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Amount (£)</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Payment Method</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Payment Status</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton rows={10} columns={7} />
                ) : payments.length > 0 ? (
                  payments.map((payment: any) => (
                    <TableRow key={payment._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell className="font-mono text-sm text-gray-900">
                        {payment._id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{payment.passengerName || "-"}</TableCell>
                      <TableCell className="text-gray-700">{payment.rideDate || "-"}</TableCell>
                      <TableCell className="font-bold text-gray-900">£{payment.amount}</TableCell>
                      <TableCell className="text-gray-700">{payment.paymentMethod}</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                            payment.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : payment.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View</button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-600">
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination currentPage={page} totalPages={meta.totalPages || 1} onPageChange={setPage} />
        </CardContent>
      </Card>
    </div>
  )
}
