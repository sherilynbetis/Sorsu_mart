'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getCart, clearCart, addOrder, generateId, getUsers } from '@/lib/store'
import type { CartItem, PaymentMethod, Order } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Smartphone, Banknote, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [cart, setCartState] = useState<CartItem[]>([])
  const [payment, setPayment] = useState<PaymentMethod>(user?.paymentPreference || 'cod')
  const [gcashNumber, setGcashNumber] = useState(user?.gcashNumber || user?.phone || '')
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    const c = getCart()
    if (c.length === 0) router.replace('/shopper/cart')
    setCartState(c)
    // Pre-select payment from user preference
    if (user?.paymentPreference) setPayment(user.paymentPreference)
    if (user?.gcashNumber) setGcashNumber(user.gcashNumber)
    else if (user?.phone) setGcashNumber(user.phone)
  }, [router, user])

  const total = cart.reduce((acc, c) => acc + c.price * c.qty, 0)

  const bySeller = cart.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.sellerName]) acc[item.sellerName] = []
    acc[item.sellerName].push(item)
    return acc
  }, {})

  function placeOrder() {
    if (payment === 'gcash' && !gcashNumber.trim()) {
      alert('Please enter your GCash number.')
      return
    }
    setPlacing(true)

    const sellers = getUsers().filter((u) => u.role === 'seller')

    Object.entries(bySeller).forEach(([sellerName, items]) => {
      const seller = sellers.find((s) => s.name === sellerName)
      const order: Order = {
        id: generateId(),
        shopperId: user!.id,
        shopperName: user!.name,
        shopperCourse: user!.course,
        shopperPhone: user!.phone,
        sellerId: seller?.id || sellerName,
        sellerName,
        items,
        total: items.reduce((a, i) => a + i.price * i.qty, 0),
        paymentMethod: payment,
        ...(payment === 'gcash' ? { gcashNumber: gcashNumber.trim() } : {}),
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      addOrder(order)
    })

    clearCart()
    router.replace('/shopper/orders?placed=1')
  }

  if (cart.length === 0) return null

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {/* Order summary */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm mb-5">
        <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
        {Object.entries(bySeller).map(([sellerName, items]) => (
          <div key={sellerName} className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {sellerName}
            </p>
            {items.map((item) => (
              <div key={item.menuItemId} className="flex justify-between text-sm py-1.5">
                <span className="text-foreground">
                  {item.menuItemName} <span className="text-muted-foreground">x{item.qty}</span>
                </span>
                <span className="font-medium">₱{(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <Separator className="mt-2" />
          </div>
        ))}
        <div className="flex justify-between font-bold text-base mt-3">
          <span>Total</span>
          <span className="text-primary text-lg">₱{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm mb-5">
        <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
        <RadioGroup
          value={payment}
          onValueChange={(v) => setPayment(v as PaymentMethod)}
          className="flex flex-col gap-3"
        >
          <label
            className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
              payment === 'cod' ? 'border-primary bg-primary/5' : 'border-border bg-card'
            }`}
          >
            <RadioGroupItem value="cod" id="cod" />
            <Banknote className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-sm">Cash on Delivery</p>
              <p className="text-xs text-muted-foreground">Pay with cash when you receive your order</p>
            </div>
          </label>
          <label
            className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
              payment === 'gcash' ? 'border-primary bg-primary/5' : 'border-border bg-card'
            }`}
          >
            <RadioGroupItem value="gcash" id="gcash" />
            <Smartphone className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-sm">GCash</p>
              <p className="text-xs text-muted-foreground">Pay via GCash mobile wallet</p>
            </div>
          </label>
        </RadioGroup>

        {payment === 'gcash' && (
          <div className="mt-4 flex flex-col gap-1.5">
            <Label htmlFor="gcash-num">Your GCash Number</Label>
            <Input
              id="gcash-num"
              type="tel"
              placeholder="09xxxxxxxxx"
              value={gcashNumber}
              onChange={(e) => setGcashNumber(e.target.value)}
              maxLength={11}
              required
            />
            <p className="text-xs text-muted-foreground">
              Your GCash number will be shown to the seller to confirm your payment.
            </p>
          </div>
        )}
      </div>

      {/* Customer info */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm mb-6">
        <h3 className="font-semibold text-foreground mb-3">Customer Details</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Name</span>
          <span className="font-medium">{user?.name}</span>
          <span className="text-muted-foreground">Phone</span>
          <span className="font-medium">{user?.phone}</span>
          {user?.course && (
            <>
              <span className="text-muted-foreground">Course</span>
              <span className="font-medium">{user.course}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/shopper/cart" className="flex-1">
          <Button variant="outline" className="w-full">Back to Cart</Button>
        </Link>
        <Button
          className="flex-1"
          size="lg"
          onClick={placeOrder}
          disabled={placing}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          {placing ? 'Placing...' : 'Place Order'}
        </Button>
      </div>
    </div>
  )
}
