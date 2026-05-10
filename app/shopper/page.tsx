'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { getMenuItems, getCart, setCart, generateId } from '@/lib/store'
import type { MenuItem, FoodCategory, CartItem } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, ShoppingCart, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const CATEGORIES: FoodCategory[] = [
  'Meals/Rice Meals',
  'Lunch',
  'Breakfast',
  'Dinner',
  'Drinks/Beverages',
  'Sweets/Desserts',
  'Quick Bites',
]

export default function ShopperBrowsePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<MenuItem[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'All'>('All')
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    setItems(getMenuItems().filter((m) => m.available))
    setCartCount(getCart().reduce((acc, i) => acc + i.qty, 0))
  }, [])

  function addToCart(item: MenuItem) {
    const cart = getCart()
    const existing = cart.find((c) => c.menuItemId === item.id)
    if (existing) {
      setCart(cart.map((c) => c.menuItemId === item.id ? { ...c, qty: c.qty + 1 } : c))
    } else {
      const newItem: CartItem = {
        menuItemId: item.id,
        menuItemName: item.name,
        sellerName: item.sellerName,
        price: item.price,
        qty: 1,
        imageUrl: item.imageUrl,
      }
      setCart([...cart, newItem])
    }
    setCartCount(getCart().reduce((acc, i) => acc + i.qty, 0))
    toast.success(`${item.name} added to cart`)
  }

  const filtered = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sellerName.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' || item.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Hello, {user?.name?.split(' ')[0]}!
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          What would you like to eat today?
        </p>
      </div>

      {/* Search + Cart */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search food or stall name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          onClick={() => router.push('/shopper/cart')}
          className="relative shrink-0"
          variant="outline"
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as FoodCategory | 'All')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No items found.</p>
          <p className="text-sm mt-1">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative h-44 bg-secondary">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl">
                    🍽️
                  </div>
                )}
                <Badge className="absolute top-2 left-2 text-xs bg-primary/90 text-primary-foreground border-0">
                  {item.category}
                </Badge>
              </div>
              <div className="p-4 flex flex-col flex-1 gap-2">
                <h3 className="font-semibold text-foreground leading-tight">{item.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
                <p className="text-xs text-muted-foreground">by {item.sellerName}</p>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-primary font-bold text-base">
                    ₱{item.price.toFixed(2)}
                  </span>
                  <Button size="sm" onClick={() => addToCart(item)}>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
