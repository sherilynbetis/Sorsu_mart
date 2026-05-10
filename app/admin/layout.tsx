'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import DashboardNav from '@/components/dashboard-nav'
import { Users, ClipboardList, LayoutDashboard, ShieldCheck } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { label: 'Credentials', href: '/admin/credentials', icon: ShieldCheck },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) router.replace('/login')
    else if (user && user.role !== 'admin') {
      if (user.role === 'seller') router.replace('/seller')
      else router.replace('/shopper')
    }
  }, [user, router])

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardNav items={NAV_ITEMS} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">{children}</main>
    </div>
  )
}
