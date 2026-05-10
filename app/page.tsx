'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  ShoppingCart,
  UtensilsCrossed,
  MessageCircle,
  Clock,
  Star,
  ChevronRight,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const FOOD_CATEGORIES = [
  { label: 'Rice Meals', emoji: '🍱', color: 'bg-amber-50 border-amber-200' },
  { label: 'Breakfast', emoji: '🍳', color: 'bg-orange-50 border-orange-200' },
  { label: 'Lunch', emoji: '🍽️', color: 'bg-red-50 border-red-200' },
  { label: 'Dinner', emoji: '🥘', color: 'bg-rose-50 border-rose-200' },
  { label: 'Drinks', emoji: '🧃', color: 'bg-blue-50 border-blue-200' },
  { label: 'Desserts', emoji: '🍰', color: 'bg-pink-50 border-pink-200' },
  { label: 'Quick Bites', emoji: '🥪', color: 'bg-yellow-50 border-yellow-200' },
]

const FEATURES = [
  {
    icon: <ShoppingCart className="w-6 h-6 text-primary" />,
    title: 'Easy Ordering',
    desc: 'Browse stalls, add to cart, and checkout in minutes. Pay via GCash or Cash on Delivery.',
  },
  {
    icon: <UtensilsCrossed className="w-6 h-6 text-primary" />,
    title: 'Campus Sellers',
    desc: 'Support your fellow students and staff by ordering directly from on-campus food stalls.',
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-primary" />,
    title: 'Live Chat',
    desc: 'Talk directly with sellers about your order — no more lining up just to ask questions.',
  },
  {
    icon: <Clock className="w-6 h-6 text-primary" />,
    title: 'Order Tracking',
    desc: 'Get real-time updates on your order status from placement to pick-up.',
  },
]

const STEPS = [
  { step: '1', title: 'Create Account', desc: 'Register as a Shopper or Seller in under a minute.' },
  { step: '2', title: 'Browse Menu', desc: 'Explore food stalls and add items to your cart.' },
  { step: '3', title: 'Checkout', desc: 'Choose GCash or Cash on Delivery and place your order.' },
  { step: '4', title: 'Pick Up', desc: 'Wait for seller confirmation then pick up your food.' },
]

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') router.replace('/admin')
      else if (user.role === 'seller') router.replace('/seller/dashboard')
      else router.replace('/shopper')
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sorsu%20Cart-bEXZ1vgUCvAe0fifkwa9BfnS2jXiYu.jpg"
              alt="SorSU Mart logo"
              width={40}
              height={40}
              className="rounded-full object-cover border-2 border-primary-foreground/30"
            />
            <div className="leading-tight">
              <span className="font-bold text-lg tracking-tight">SorSU Mart</span>
              <span className="block text-[11px] text-primary-foreground/70">Bulan Campus</span>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Register
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative h-[480px] md:h-[540px] overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SORSU-BC-sii4VBCZFOdIhcArhHlFWR2zrkuqMR.jpg"
          alt="Sorsogon State University Bulan Campus main gate"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 gap-4">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sorsu%20Cart-bEXZ1vgUCvAe0fifkwa9BfnS2jXiYu.jpg"
            alt="SorSU Mart"
            width={96}
            height={96}
            className="rounded-full border-4 border-white/70 shadow-2xl object-cover"
          />
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance leading-tight drop-shadow-lg">
              Welcome to SorSU Mart
            </h2>
            <p className="mt-3 text-lg text-white/85 max-w-xl mx-auto text-pretty leading-relaxed">
              The official online food ordering platform for{' '}
              <span className="font-semibold text-white">Sorsogon State University Bulan Campus</span>.
              Order from campus stalls — fast, easy, and cashless.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <Link href="/register?role=shopper">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Order Now
              </Button>
            </Link>
            <Link href="/register?role=seller">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-white/10 hover:bg-white/20 hover:text-white"
              >
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Become a Seller
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-1 text-white/60 text-sm mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Bulan, Sorsogon</span>
          </div>
        </div>
      </section>

      {/* ── Food Categories ── */}
      <section className="bg-white py-12 px-4 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl font-bold text-center text-foreground mb-6">
            What are you craving?
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {FOOD_CATEGORIES.map((cat) => (
              <Link key={cat.label} href="/register?role=shopper">
                <div
                  className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-4 cursor-pointer hover:shadow-md transition-shadow ${cat.color}`}
                >
                  <span className="text-3xl">{cat.emoji}</span>
                  <span className="text-xs font-medium text-foreground text-center leading-tight">
                    {cat.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-secondary py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-foreground mb-2 text-balance">
            Why choose SorSU Mart?
          </h3>
          <p className="text-center text-muted-foreground mb-10 text-pretty">
            Built for the SorSU Bulan Campus community.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-card rounded-xl p-5 shadow-sm border border-border flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  {f.icon}
                </div>
                <h4 className="font-semibold text-foreground">{f.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-foreground mb-2 text-balance">
            How It Works
          </h3>
          <p className="text-center text-muted-foreground mb-10 text-pretty">
            Get your food in 4 simple steps.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.step} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shadow-md">
                  {s.step}
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="hidden md:block absolute translate-x-[calc(100%+1.5rem)] text-muted-foreground w-4 h-4 mt-4" />
                )}
                <h4 className="font-semibold text-foreground">{s.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="bg-primary text-primary-foreground py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { value: '100%', label: 'Campus-based' },
            { value: 'GCash', label: 'Cashless Payment' },
            { value: '24/7', label: 'Online Orders' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-primary-foreground/75 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-secondary py-14 px-4 text-center">
        <h3 className="text-2xl font-bold text-foreground text-balance">
          Ready to start ordering?
        </h3>
        <p className="mt-2 text-muted-foreground text-pretty max-w-md mx-auto">
          Create a free account in seconds and explore food stalls from the SorSU Bulan Campus.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Link href="/register?role=shopper">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Register as Shopper
            </Button>
          </Link>
          <Link href="/register?role=seller">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <UtensilsCrossed className="w-4 h-4 mr-2" />
              Register as Seller
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in here
          </Link>
        </p>
      </section>

      {/* ── Testimonial / Star Banner ── */}
      <section className="bg-white py-8 px-4 border-t border-border">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            Proudly serving the students and staff of{' '}
            <span className="font-semibold text-foreground">
              Sorsogon State University Bulan Campus
            </span>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-foreground text-background py-6 px-4 text-center text-sm">
        <p className="text-background/60">
          &copy; {new Date().getFullYear()} SorSU Mart &mdash; Sorsogon State University Bulan Campus.
          All rights reserved.
        </p>
      </footer>
    </div>
  )
}
