'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getUserByEmail, addUser, generateId } from '@/lib/store'
import type { UserRole, Course } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Eye, EyeOff, ChevronLeft } from 'lucide-react'

const COURSES: Course[] = ['BSAIS', 'BPA', 'BSA', 'BSE', 'BSCS', 'BSIT', 'BSIS', 'BTVTED']

function RegisterForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { login } = useAuth()

  const [role, setRole] = useState<UserRole>((params.get('role') as UserRole) || 'shopper')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [course, setCourse] = useState<Course>('BSIT')
  const [gcash, setGcash] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const r = params.get('role') as UserRole
    if (r === 'shopper' || r === 'seller') setRole(r)
  }, [params])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.includes('@')) {
      setError('Enter a valid email address.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (getUserByEmail(email)) {
      setError('An account with this email already exists.')
      return
    }

    setLoading(true)
    const user = {
      id: generateId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      ...(phone ? { phone: phone.trim() } : {}),
      password,
      role,
      ...(role === 'shopper' ? { course } : {}),
      ...(gcash ? { gcashNumber: gcash.trim() } : {}),
      createdAt: new Date().toISOString(),
    }
    addUser(user)
    login(user)

    if (role === 'seller') router.replace('/seller')
    else router.replace('/shopper')
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-4 py-10">
      {/* Back button */}
      <div className="w-full max-w-md mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <Link href="/" className="flex items-center gap-3 mb-8">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sorsu%20Cart-bEXZ1vgUCvAe0fifkwa9BfnS2jXiYu.jpg"
          alt="SorSU Mart"
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-xl font-bold text-primary leading-tight">SorSU Mart</p>
          <p className="text-xs text-muted-foreground">Bulan Campus</p>
        </div>
      </Link>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join SorSU Mart today</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Role Toggle */}
          <div className="flex rounded-lg overflow-hidden border border-border mb-6">
            {(['shopper', 'seller'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                  role === r
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:bg-secondary'
                }`}
              >
                {r === 'shopper' ? 'I am a Shopper' : 'I am a Seller'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Juan Dela Cruz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">
                Phone Number
                <span className="text-muted-foreground font-normal"> (optional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="09xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={11}
              />
            </div>

            {role === 'shopper' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="course">Course</Label>
                <select
                  id="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value as Course)}
                  className="w-full h-9 rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  {COURSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {/* GCash number — sellers only */}
            {role === 'seller' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="gcash">
                  GCash Number
                  <span className="text-muted-foreground font-normal"> (optional)</span>
                </Label>
                <Input
                  id="gcash"
                  type="tel"
                  placeholder="09xxxxxxxxx"
                  value={gcash}
                  onChange={(e) => setGcash(e.target.value)}
                  maxLength={11}
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-1">
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
