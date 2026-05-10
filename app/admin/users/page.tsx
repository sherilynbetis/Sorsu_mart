'use client'

import { useState, useEffect } from 'react'
import { getUsers } from '@/lib/store'
import type { User } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Users } from 'lucide-react'

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800 border-purple-200',
  seller: 'bg-orange-100 text-orange-800 border-orange-200',
  shopper: 'bg-blue-100 text-blue-800 border-blue-200',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'seller' | 'shopper' | 'admin'>('all')

  useEffect(() => {
    setUsers(
      getUsers().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    )
  }, [])

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">All Users</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'shopper', 'seller', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize border transition-colors ${
                roleFilter === r
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-primary'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="font-medium text-foreground">No users found.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Course</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${ROLE_COLORS[u.role]}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.course || '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString('en-PH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
            Showing {filtered.length} of {users.length} user{users.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  )
}
