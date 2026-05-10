'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import DashboardNav from '@/components/dashboard-nav'
import { ShoppingBag, ShoppingCart, ClipboardList, MessageCircle } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Browse', href: '/shopper', icon: ShoppingBag },
  { label: 'Cart', href: '/shopper/cart', icon: ShoppingCart },
  { label: 'My Orders', href: '/shopper/orders', icon: ClipboardList },
  { label: 'Chat', href: '/shopper/chat', icon: MessageCircle },
]

export default function ShopperLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) router.replace('/login')
    else if (user && user.role !== 'shopper') {
      if (user.role === 'seller') router.replace('/seller')
      else if (user.role === 'admin') router.replace('/admin')
    }
  }, [user, router])

  if (!user || user.role !== 'shopper') return null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardNav items={NAV_ITEMS} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">{children}</main>
    </div>
  )
}
