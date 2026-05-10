'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getOrders, updateOrder } from '@/lib/store'
import type { Order } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ClipboardList, Printer, CheckCircle } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  received: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

export default function SellerOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [printOrder, setPrintOrder] = useState<Order | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  function load() {
    if (!user) return
    const all = getOrders()
      .filter((o) => o.sellerId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setOrders(all)
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
  }, [user])

  function markReceived(order: Order) {
    const updated = { ...order, status: 'received' as const, receivedAt: new Date().toISOString() }
    updateOrder(updated)
    load()
  }

  function markCompleted(order: Order) {
    const updated = { ...order, status: 'completed' as const }
    updateOrder(updated)
    load()
  }

  function handlePrint(order: Order) {
    setPrintOrder(order)
    setTimeout(() => {
      window.print()
    }, 200)
  }

  const pending = orders.filter((o) => o.status === 'pending')
  const received = orders.filter((o) => o.status === 'received')
  const past = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled')

  return (
    <>
      {/* Print-only receipt */}
      {printOrder && (
        <div className="print-only fixed inset-0 bg-white p-8 z-[9999]" ref={printRef}>
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">SorSU Mart</h1>
              <p className="text-sm text-gray-500">Sorsogon State University — Bulan Campus</p>
              <hr className="my-3" />
              <h2 className="text-lg font-bold">ORDER RECEIPT</h2>
            </div>

            <div className="mb-4 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono text-xs">{printOrder.id.slice(0, 12)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span>{new Date(printOrder.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {printOrder.receivedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Received</span>
                  <span>{new Date(printOrder.receivedAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>

            <hr className="my-3" />

            <div className="mb-4 text-sm space-y-1">
              <p className="font-semibold text-gray-700">Customer</p>
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span>{printOrder.shopperName}</span>
              </div>
              {printOrder.shopperCourse && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Course</span>
                  <span>{printOrder.shopperCourse}</span>
                </div>
              )}
              <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="text-xs">{printOrder.shopperPhone}</span>
                </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment</span>
                <span className="capitalize">{printOrder.paymentMethod === 'gcash' ? 'GCash' : 'Cash on Delivery'}</span>
              </div>
              {printOrder.paymentMethod === 'gcash' && printOrder.gcashNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-500">GCash No.</span>
                  <span>{printOrder.gcashNumber}</span>
                </div>
              )}
            </div>

            <hr className="my-3" />

            <p className="font-semibold text-sm text-gray-700 mb-2">Items Ordered</p>
            <div className="text-sm space-y-1.5 mb-3">
              {printOrder.items.map((item) => (
                <div key={item.menuItemId} className="flex justify-between">
                  <span>
                    {item.menuItemName} <span className="text-gray-400">x{item.qty}</span>
                  </span>
                  <span>₱{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-base mt-2">
              <span>TOTAL</span>
              <span>₱{printOrder.total.toFixed(2)}</span>
            </div>
            <hr className="my-4" />
            <p className="text-center text-xs text-gray-400">Thank you for ordering at SorSU Mart!</p>
          </div>
        </div>
      )}

      <div className="no-print">
        <h2 className="text-2xl font-bold mb-6">Incoming Orders</h2>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="font-medium text-foreground">No orders yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Orders from customers will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Pending */}
            {pending.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Pending ({pending.length})
                </h3>
                <div className="flex flex-col gap-3">
                  {pending.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onReceive={() => markReceived(order)}
                      onPrint={() => handlePrint(order)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Received */}
            {received.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Received ({received.length})
                </h3>
                <div className="flex flex-col gap-3">
                  {received.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onComplete={() => markCompleted(order)}
                      onPrint={() => handlePrint(order)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Past */}
            {past.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Past Orders
                </h3>
                <div className="flex flex-col gap-3">
                  {past.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onPrint={() => handlePrint(order)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </>
  )
}

interface OrderCardProps {
  order: Order
  onReceive?: () => void
  onComplete?: () => void
  onPrint?: () => void
}

function OrderCard({ order, onReceive, onComplete, onPrint }: OrderCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-semibold text-foreground">{order.shopperName}</p>
          {order.shopperCourse && (
            <p className="text-xs text-muted-foreground">{order.shopperCourse}</p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(order.createdAt).toLocaleDateString('en-PH', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
            STATUS_COLORS[order.status]
          }`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="flex flex-col gap-1 mb-3">
        {order.items.map((item) => (
          <div key={item.menuItemId} className="flex justify-between text-sm">
            <span>
              {item.menuItemName} <span className="text-muted-foreground">x{item.qty}</span>
            </span>
            <span className="text-muted-foreground">₱{(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <div className="text-xs text-muted-foreground">
          <span className="font-medium capitalize">
            {order.paymentMethod === 'gcash' ? 'GCash' : 'Cash on Delivery'}
          </span>
          {order.paymentMethod === 'gcash' && order.gcashNumber && (
            <span> — {order.gcashNumber}</span>
          )}
        </div>
        <span className="font-bold text-primary">₱{order.total.toFixed(2)}</span>
      </div>

      {(onReceive || onComplete || onPrint) && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
          {onReceive && (
            <Button size="sm" onClick={onReceive} className="flex-1">
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              Mark Received
            </Button>
          )}
          {onComplete && (
            <Button size="sm" onClick={onComplete} variant="outline" className="flex-1">
              Complete
            </Button>
          )}
          {onPrint && (
            <Button size="sm" variant="outline" onClick={onPrint}>
              <Printer className="w-3.5 h-3.5 mr-1" />
              Print Receipt
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
