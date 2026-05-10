'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  generateId,
} from '@/lib/store'
import type { MenuItem, FoodCategory } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, UtensilsCrossed } from 'lucide-react'
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

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'Meals/Rice Meals' as FoodCategory,
  imageUrl: '',
}

export default function SellerMenuPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<MenuItem[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [preview, setPreview] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function load() {
    setItems(getMenuItems().filter((m) => m.sellerId === user?.id))
  }

  useEffect(() => {
    load()
  }, [user])

  function openAdd() {
    setEditing(null)
    setForm({ ...EMPTY_FORM })
    setPreview('')
    setOpen(true)
  }

  function openEdit(item: MenuItem) {
    setEditing(item)
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      imageUrl: item.imageUrl,
    })
    setPreview(item.imageUrl)
    setOpen(true)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setPreview(result)
      setForm((f) => ({ ...f, imageUrl: result }))
    }
    reader.readAsDataURL(file)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    const price = parseFloat(form.price)
    if (isNaN(price) || price <= 0) {
      toast.error('Enter a valid price.')
      return
    }

    if (editing) {
      const updated: MenuItem = {
        ...editing,
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        category: form.category,
        imageUrl: form.imageUrl,
      }
      updateMenuItem(updated)
      toast.success('Item updated!')
    } else {
      const newItem: MenuItem = {
        id: generateId(),
        sellerId: user.id,
        sellerName: user.name,
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        category: form.category,
        imageUrl: form.imageUrl,
        available: true,
        createdAt: new Date().toISOString(),
      }
      addMenuItem(newItem)
      toast.success('Item added!')
    }
    setOpen(false)
    load()
  }

  function toggleAvailability(item: MenuItem) {
    updateMenuItem({ ...item, available: !item.available })
    load()
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return
    deleteMenuItem(id)
    load()
    toast.success('Item deleted.')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold">My Menu</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Item' : 'Add Menu Item'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  id="item-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="e.g. Adobo Rice"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="item-desc">Description</Label>
                <Textarea
                  id="item-desc"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the item..."
                  rows={2}
                />
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label htmlFor="item-price">Price (₱)</Label>
                  <Input
                    id="item-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label htmlFor="item-cat">Category</Label>
                  <select
                    id="item-cat"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as FoodCategory }))}
                    className="h-9 rounded-md border border-input bg-card px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Photo</Label>
                {preview && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-secondary mb-1">
                    <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  className="w-full"
                >
                  {preview ? 'Change Photo' : 'Upload Photo'}
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editing ? 'Save Changes' : 'Add Item'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="font-medium text-foreground">No menu items yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Add your first item to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col transition-opacity ${
                item.available ? 'border-border' : 'border-border opacity-60'
              }`}
            >
              <div className="relative h-40 bg-secondary">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
                    🍽️
                  </div>
                )}
                <Badge className="absolute top-2 left-2 text-xs bg-primary/90 text-primary-foreground border-0">
                  {item.category}
                </Badge>
              </div>
              <div className="p-4 flex flex-col flex-1 gap-2">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
                <p className="font-bold text-primary mt-auto">₱{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1 px-3 pb-3">
                <button
                  onClick={() => toggleAvailability(item)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mr-auto"
                  title={item.available ? 'Mark unavailable' : 'Mark available'}
                >
                  {item.available
                    ? <ToggleRight className="w-5 h-5 text-green-600" />
                    : <ToggleLeft className="w-5 h-5" />}
                  <span>{item.available ? 'Available' : 'Unavailable'}</span>
                </button>
                <Button size="icon" variant="ghost" onClick={() => openEdit(item)} className="w-7 h-7">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="w-7 h-7 text-destructive hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
