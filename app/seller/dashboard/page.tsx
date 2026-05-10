'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getOrders, getMenuItems } from '@/lib/store'
import type { Order } from '@/lib/types'
import {
  ClipboardList,
  UtensilsCrossed,
  PhilippinePeso,
  Clock,
  CheckCircle,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  received: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function SellerDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    menu: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenue: 0,
    todayOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!user) return
    const allOrders = getOrders().filter((o) => o.sellerId === user.id)
    const menu = getMenuItems().filter((m) => m.sellerId === user.id)
    const today = new Date().toDateString()

    const revenue = allOrders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0)

    setStats({
      menu: menu.length,
      totalOrders: allOrders.length,
      pendingOrders: allOrders.filter((o) => o.status === 'pending').length,
      completedOrders: allOrders.filter((o) => o.status === 'completed').length,
      revenue,
      todayOrders: allOrders.filter((o) => new Date(o.createdAt).toDateString() === today).length,
    })

    setRecentOrders(
      [...allOrders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    )
  }, [user])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Seller Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, <span className="font-medium text-foreground">{user?.name}</span>. Here&apos;s your store summary.
        </p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/seller"
          className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Menu Items</span>
            <div className="p-2 bg-primary/10 rounded-lg">
              <UtensilsCrossed className="w-4 h-4 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.menu}</p>
          <p className="text-xs text-muted-foreground">Items on your menu</p>
        </Link>

        <Link
          href="/seller/orders"
          className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Orders</span>
            <div className="p-2 bg-blue-50 rounded-lg">
              <ClipboardList className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
          <p className="text-xs text-muted-foreground">{stats.todayOrders} today</p>
        </Link>

        <Link
          href="/seller/orders"
          className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Pending</span>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.pendingOrders}</p>
          <p className="text-xs text-muted-foreground">Awaiting action</p>
        </Link>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Revenue</span>
            <div className="p-2 bg-green-50 rounded-lg">
              <PhilippinePeso className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">₱{stats.revenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">From completed orders</p>
        </div>
      </div>

      {/* Secondary row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.completedOrders}</p>
            <p className="text-sm text-muted-foreground">Completed Orders</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.todayOrders}</p>
            <p className="text-sm text-muted-foreground">Orders Today</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Orders</h3>
          <Link href="/seller/orders" className="text-xs text-primary hover:underline font-medium">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-5 py-10 text-center text-muted-foreground text-sm">
            No orders yet. Share your menu to start receiving orders!
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3 gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{order.shopperName}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} &middot;{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-PH', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status]}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-bold text-primary">₱{order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
