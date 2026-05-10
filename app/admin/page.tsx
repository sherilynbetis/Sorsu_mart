'use client'

import { useEffect, useState } from 'react'
import { getUsers, getOrders, getMenuItems } from '@/lib/store'
import type { Order, User } from '@/lib/types'
import {
  Users,
  ShoppingBag,
  ClipboardList,
  UtensilsCrossed,
  TrendingUp,
  Clock,
  CheckCircle,
  PhilippinePeso,
} from 'lucide-react'
import Link from 'next/link'

interface Stats {
  sellers: number
  shoppers: number
  orders: number
  menu: number
  revenue: number
  pendingOrders: number
  completedOrders: number
  todayOrders: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    sellers: 0,
    shoppers: 0,
    orders: 0,
    menu: 0,
    revenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    todayOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [recentUsers, setRecentUsers] = useState<User[]>([])

  useEffect(() => {
    const users = getUsers()
    const orders = getOrders()
    const menu = getMenuItems()

    const today = new Date().toDateString()
    const todayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    ).length

    const revenue = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0)

    setStats({
      sellers: users.filter((u) => u.role === 'seller').length,
      shoppers: users.filter((u) => u.role === 'shopper').length,
      orders: orders.length,
      menu: menu.length,
      revenue,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
      completedOrders: orders.filter((o) => o.status === 'completed').length,
      todayOrders,
    })

    setRecentOrders(
      [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    )

    setRecentUsers(
      [...users]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    )
  }, [])

  const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    received: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Complete overview of the SorSU Mart platform.
        </p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/users"
          className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Sellers</span>
            <div className="p-2 bg-orange-50 rounded-lg">
              <UtensilsCrossed className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.sellers}</p>
          <p className="text-xs text-muted-foreground">Registered food stalls</p>
        </Link>

        <Link
          href="/admin/users"
          className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Shoppers</span>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.shoppers}</p>
          <p className="text-xs text-muted-foreground">Registered customers</p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Orders</span>
            <div className="p-2 bg-green-50 rounded-lg">
              <ClipboardList className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.orders}</p>
          <p className="text-xs text-muted-foreground">{stats.todayOrders} today</p>
        </Link>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Menu Items</span>
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingBag className="w-4 h-4 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.menu}</p>
          <p className="text-xs text-muted-foreground">Across all sellers</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 rounded-xl">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.pendingOrders}</p>
            <p className="text-sm text-muted-foreground">Pending Orders</p>
          </div>
        </div>
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
            <PhilippinePeso className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">₱{stats.revenue.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs text-primary hover:underline font-medium">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">No orders yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between px-5 py-3 gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{order.shopperName}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.sellerName} &middot;{' '}
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

        {/* Recent Users */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Recent Sign-Ups</h3>
            <Link href="/admin/users" className="text-xs text-primary hover:underline font-medium">
              View all
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">No users yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-5 py-3 gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.phone}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        u.role === 'seller'
                          ? 'bg-orange-100 text-orange-800'
                          : u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {u.role}
                    </span>
                    {u.course && (
                      <span className="text-xs text-muted-foreground">{u.course}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
