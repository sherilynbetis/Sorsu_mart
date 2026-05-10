'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from './types'
import { getCurrentUser, setCurrentUser, seedAdmin } from './store'

interface AuthContextValue {
  user: User | null
  login: (user: User) => void
  logout: () => void
  refresh: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
  refresh: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    seedAdmin()
    setUser(getCurrentUser())
  }, [])

  function login(u: User) {
    setCurrentUser(u)
    setUser(u)
  }

  function logout() {
    setCurrentUser(null)
    setUser(null)
  }

  function refresh() {
    setUser(getCurrentUser())
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
