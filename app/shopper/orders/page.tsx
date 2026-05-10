'use client'

import { Suspense, useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getOrders } from '@/lib/store'
import type { Order } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ClipboardList, CheckCircle } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  received: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

function ShopperOrdersContent() {
  const { user } = useAuth()
  const params = useSearchParams()
  const justPlaced = params.get('placed') === '1'
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!user) return
    const all = getOrders()
      .filter((o) => o.shopperId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setOrders(all)
  }, [user])

  return (
    <div>
      {justPlaced && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <p className="font-semibold text-green-800 text-sm">Order placed successfully!</p>
            <p className="text-xs text-green-700">The seller will prepare your order shortly.</p>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="font-medium text-foreground">No orders yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Browse the menu and place your first order!
          </p>
          <Link href="/shopper" className="inline-block mt-4">
            <Button>Browse Menu</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-foreground">{order.sellerName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
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

              <div className="flex flex-col gap-1 mb-3">
                {order.items.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between text-sm">
                    <span className="text-foreground">
                      {item.menuItemName}{' '}
                      <span className="text-muted-foreground">x{item.qty}</span>
                    </span>
                    <span className="text-muted-foreground">
                      ₱{(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium capitalize">
                    {order.paymentMethod === 'gcash' ? 'GCash' : 'Cash on Delivery'}
                  </span>
                  {order.paymentMethod === 'gcash' && order.gcashNumber && (
                    <span>— {order.gcashNumber}</span>
                  )}
                </div>
                <span className="font-bold text-primary">₱{order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ShopperOrdersPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading orders...</div>}>
      <ShopperOrdersContent />
    </Suspense>
  )
}
