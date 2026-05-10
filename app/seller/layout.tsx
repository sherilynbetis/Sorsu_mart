'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import DashboardNav from '@/components/dashboard-nav'
import { UtensilsCrossed, ClipboardList, MessageCircle, LayoutDashboard } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/seller/dashboard', icon: LayoutDashboard },
  { label: 'My Menu', href: '/seller/menu', icon: UtensilsCrossed },
  { label: 'Orders', href: '/seller/orders', icon: ClipboardList },
  { label: 'Chat', href: '/seller/chat', icon: MessageCircle },
]

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) router.replace('/login')
    else if (user && user.role !== 'seller') {
      if (user.role === 'shopper') router.replace('/shopper')
      else if (user.role === 'admin') router.replace('/admin')
    }
  }, [user, router])

  if (!user || user.role !== 'seller') return null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardNav items={NAV_ITEMS} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">{children}</main>
    </div>
  )
}
