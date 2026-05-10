'use client'

import { useState, useEffect } from 'react'
import { getOrders } from '@/lib/store'
import type { Order } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Printer, ClipboardList, Search } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  received: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    setOrders(
      getOrders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    )
  }, [])

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.shopperName.toLowerCase().includes(search.toLowerCase()) ||
      o.sellerName.toLowerCase().includes(search.toLowerCase()) ||
      (o.shopperCourse || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  function handlePrintAll() {
    window.print()
  }

  const totals = {
    total: orders.reduce((a, o) => a + o.total, 0),
    pending: orders.filter((o) => o.status === 'pending').length,
    received: orders.filter((o) => o.status === 'received').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  }

  return (
    <>
      {/* Print view */}
      <div className="print-only">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">SorSU Mart — All Orders Report</h1>
          <p className="text-sm text-gray-500">Sorsogon State University — Bulan Campus</p>
          <p className="text-xs text-gray-400 mt-1">
            Printed: {new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
          <hr className="my-4" />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
          <div className="border rounded p-3 text-center">
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-gray-500">Total Orders</p>
          </div>
          <div className="border rounded p-3 text-center">
            <p className="text-2xl font-bold">{totals.pending}</p>
            <p className="text-gray-500">Pending</p>
          </div>
          <div className="border rounded p-3 text-center">
            <p className="text-2xl font-bold">{totals.completed}</p>
            <p className="text-gray-500">Completed</p>
          </div>
          <div className="border rounded p-3 text-center">
            <p className="text-2xl font-bold">₱{totals.total.toFixed(2)}</p>
            <p className="text-gray-500">Revenue</p>
          </div>
        </div>

        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Customer</th>
              <th className="border p-2 text-left">Course</th>
              <th className="border p-2 text-left">Seller</th>
              <th className="border p-2 text-left">Items</th>
              <th className="border p-2 text-left">Payment</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="border p-2 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="border p-2">{order.shopperName}</td>
                <td className="border p-2">{order.shopperCourse || '—'}</td>
                <td className="border p-2">{order.sellerName}</td>
                <td className="border p-2">
                  {order.items.map((i) => `${i.menuItemName} x${i.qty}`).join(', ')}
                </td>
                <td className="border p-2 capitalize">
                  {order.paymentMethod === 'gcash' ? 'GCash' : 'COD'}
                </td>
                <td className="border p-2 capitalize">{order.status}</td>
                <td className="border p-2 text-right font-semibold">₱{order.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td colSpan={7} className="border p-2 text-right">Grand Total</td>
              <td className="border p-2 text-right">₱{totals.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="text-center text-xs text-gray-400 mt-6">— End of Report —</p>
      </div>

      {/* Screen view */}
      <div className="no-print">
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold">All Orders</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{orders.length} total orders</p>
          </div>
          <Button onClick={handlePrintAll} variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print Full Report
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Orders', value: orders.length, color: 'bg-secondary text-foreground' },
            { label: 'Pending', value: totals.pending, color: 'bg-yellow-50 text-yellow-800' },
            { label: 'Completed', value: totals.completed, color: 'bg-green-50 text-green-800' },
            { label: 'Revenue', value: `₱${totals.total.toFixed(2)}`, color: 'bg-primary/10 text-primary' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-4 ${s.color} border border-border`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by customer, seller, course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'received', 'completed', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize border transition-colors ${
                  statusFilter === s
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-primary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="font-medium text-foreground">No orders found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="bg-card border border-border rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                  <div>
                    <p className="font-semibold text-foreground">
                      {order.shopperName}
                      {order.shopperCourse && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                          {order.shopperCourse}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Seller: <span className="font-medium">{order.sellerName}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-PH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[order.status]}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="flex flex-col gap-1 mb-3 text-sm">
                  {order.items.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between">
                      <span className="text-foreground">
                        {item.menuItemName} <span className="text-muted-foreground">x{item.qty}</span>
                      </span>
                      <span className="text-muted-foreground">₱{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">
                      {order.paymentMethod === 'gcash' ? 'GCash' : 'Cash on Delivery'}
                    </span>
                    {order.paymentMethod === 'gcash' && order.gcashNumber && (
                      <span> — {order.gcashNumber}</span>
                    )}
                  </div>
                  <span className="font-bold text-primary">₱{order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
