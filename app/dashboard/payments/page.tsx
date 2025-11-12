"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { paymentsAPI } from "@/lib/api"
import { Pagination } from "@/components/pagination"
import { TableSkeleton } from "@/components/table-skeleton"
import { DollarSign } from "lucide-react"

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

  return (
    <div className="md:ml-64 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-gray-600 mt-1">Track and manage all payment transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Amount</p>
                <p className="text-3xl font-bold mt-2">${totalAmount.toFixed(2)}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg text-white">
                <DollarSign size={28} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Payments</p>
                <p className="text-3xl font-bold mt-2">{payments.filter((p: any) => p.status === "pending").length}</p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-lg text-white">
                <DollarSign size={28} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton rows={10} columns={6} />
                ) : payments.length > 0 ? (
                  payments.map((payment: any) => (
                    <TableRow key={payment._id}>
                      <TableCell className="font-mono text-sm">{payment._id.substring(0, 8)}...</TableCell>
                      <TableCell className="font-medium">{payment.orderId}</TableCell>
                      <TableCell className="font-bold">${payment.amount}</TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
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
