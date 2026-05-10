'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCart, setCart } from '@/lib/store'
import type { CartItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const [cart, setCartState] = useState<CartItem[]>([])

  useEffect(() => {
    setCartState(getCart())
  }, [])

  function update(id: string, delta: number) {
    const updated = cart
      .map((c) => c.menuItemId === id ? { ...c, qty: c.qty + delta } : c)
      .filter((c) => c.qty > 0)
    setCart(updated)
    setCartState(updated)
  }

  function remove(id: string) {
    const updated = cart.filter((c) => c.menuItemId !== id)
    setCart(updated)
    setCartState(updated)
  }

  const total = cart.reduce((acc, c) => acc + c.price * c.qty, 0)

  if (cart.length === 0) {
    return (
      <div className="text-center py-24">
        <ShoppingBag className="w-14 h-14 mx-auto mb-4 text-muted-foreground/40" />
        <h2 className="text-xl font-semibold text-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground text-sm mt-1">Browse the menu and add something delicious!</p>
        <Link href="/shopper" className="inline-block mt-5">
          <Button>Browse Menu</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      <div className="flex flex-col gap-3 mb-6">
        {cart.map((item) => (
          <div
            key={item.menuItemId}
            className="flex gap-4 bg-card border border-border rounded-xl p-4 shadow-sm"
          >
            {item.imageUrl ? (
              <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-secondary">
                <Image
                  src={item.imageUrl}
                  alt={item.menuItemName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-16 h-16 shrink-0 rounded-lg bg-secondary flex items-center justify-center text-2xl">
                🍽️
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{item.menuItemName}</p>
              <p className="text-xs text-muted-foreground">by {item.sellerName}</p>
              <p className="text-primary font-bold mt-1">₱{(item.price * item.qty).toFixed(2)}</p>
            </div>
            <div className="flex flex-col items-end justify-between gap-2">
              <button
                onClick={() => remove(item.menuItemId)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => update(item.menuItemId, -1)}
                  className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                <button
                  onClick={() => update(item.menuItemId, 1)}
                  className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex justify-between text-base font-semibold mb-4">
          <span>Total</span>
          <span className="text-primary text-lg">₱{total.toFixed(2)}</span>
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={() => router.push('/shopper/checkout')}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  )
}
