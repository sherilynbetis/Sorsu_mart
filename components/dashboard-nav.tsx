'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface DashboardNavProps {
  items: NavItem[]
}

export default function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    router.replace('/login')
  }

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sorsu%20Cart-bEXZ1vgUCvAe0fifkwa9BfnS2jXiYu.jpg"
            alt="SorSU Mart"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          <span className="font-bold text-base hidden sm:block">SorSU Mart</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1 overflow-x-auto">
          {items.map((item) => {
            // Exact match for root-level paths to avoid false highlights (e.g. /seller vs /seller/dashboard)
            const active =
              pathname === item.href ||
              (item.href !== '/seller' &&
                item.href !== '/shopper' &&
                item.href !== '/admin' &&
                pathname.startsWith(item.href + '/'))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                  active
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User + logout */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-primary-foreground/80 hidden md:block truncate max-w-[120px]">
            {user?.name}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LogOut className="w-4 h-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
