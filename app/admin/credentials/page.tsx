'use client'

import { useState, useEffect } from 'react'
import { getUsers } from '@/lib/store'
import type { User } from '@/lib/types'
import { Eye, EyeOff, ShieldCheck, Store, UserCog } from 'lucide-react'
import { Button } from '@/components/ui/button'

function CredentialCard({ user, role }: { user: User; role: string }) {
  const [showPw, setShowPw] = useState(false)

  const icon =
    role === 'admin' ? (
      <ShieldCheck className="w-5 h-5 text-primary" />
    ) : role === 'seller' ? (
      <Store className="w-5 h-5 text-amber-600" />
    ) : (
      <UserCog className="w-5 h-5 text-blue-600" />
    )

  const badgeColor =
    role === 'admin'
      ? 'bg-primary/10 text-primary'
      : role === 'seller'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-blue-100 text-blue-700'

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-foreground">{user.name}</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${badgeColor}`}>
            {role}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between bg-secondary rounded-lg px-4 py-2.5">
          <span className="text-muted-foreground w-24 shrink-0">Email</span>
          <span className="font-mono text-xs font-medium text-foreground">{user.email}</span>
        </div>
        <div className="flex items-center justify-between bg-secondary rounded-lg px-4 py-2.5">
          <span className="text-muted-foreground w-24 shrink-0">Password</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-medium text-foreground">
              {showPw ? user.password : '••••••••'}
            </span>
            <button
              onClick={() => setShowPw((v) => !v)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {user.phone && (
          <div className="flex items-center justify-between bg-secondary rounded-lg px-4 py-2.5">
            <span className="text-muted-foreground w-24 shrink-0">Phone</span>
            <span className="font-mono text-xs text-foreground">{user.phone}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CredentialsPage() {
  const [admins, setAdmins] = useState<User[]>([])
  const [sellers, setSellers] = useState<User[]>([])

  useEffect(() => {
    const all = getUsers()
    setAdmins(all.filter((u) => u.role === 'admin'))
    setSellers(all.filter((u) => u.role === 'seller'))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Account Credentials</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Private login details for system accounts. Do not share with unauthorized users.
        </p>
      </div>

      {/* Admin Accounts */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          Admin Accounts
        </h2>
        {admins.length === 0 ? (
          <p className="text-muted-foreground text-sm">No admin accounts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {admins.map((u) => (
              <CredentialCard key={u.id} user={u} role="admin" />
            ))}
          </div>
        )}
      </section>

      {/* Seller Accounts */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Store className="w-4 h-4 text-amber-600" />
          Seller Accounts
        </h2>
        {sellers.length === 0 ? (
          <p className="text-muted-foreground text-sm">No seller accounts registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sellers.map((u) => (
              <CredentialCard key={u.id} user={u} role="seller" />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
