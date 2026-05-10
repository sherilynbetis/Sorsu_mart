'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getUserByEmail, updateUser } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'

type Step = 'email' | 'reset' | 'done'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const user = getUserByEmail(email)
    if (!user) {
      setError('No account found with that email address.')
      return
    }
    setStep('reset')
  }

  function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (newPw.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (newPw !== confirm) {
      setError('Passwords do not match.')
      return
    }
    const user = getUserByEmail(email)
    if (!user) return
    updateUser({ ...user, password: newPw })
    setStep('done')
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
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            {step === 'email' && 'Enter your email address to reset your password.'}
            {step === 'reset' && 'Set your new password.'}
            {step === 'done' && 'Your password has been updated.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
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
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full">Continue</Button>
              <Link href="/login" className="text-center text-sm text-primary hover:underline">
                Back to login
              </Link>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newpw">New Password</Label>
                <Input
                  id="newpw"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Repeat new password"
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
              <Button type="submit" className="w-full">Reset Password</Button>
            </form>
          )}

          {step === 'done' && (
            <div className="text-center flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Your password has been successfully updated.
              </p>
              <Link href="/login">
                <Button className="w-full">Back to Login</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
