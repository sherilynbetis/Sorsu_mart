'use client'

import type { User, MenuItem, Order, CartItem, ChatMessage } from './types'

// ── Keys ──────────────────────────────────────────────────────────────────────
const KEYS = {
  users: 'sorsu_users',
  currentUser: 'sorsu_current_user',
  menu: 'sorsu_menu',
  orders: 'sorsu_orders',
  cart: 'sorsu_cart',
  messages: 'sorsu_messages',
}

function get<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function set<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

// ── Seed default admin + demo seller ─────────────────────────────────────────
export function seedAdmin() {
  const users = get<User>(KEYS.users)
  if (!users.find((u) => u.role === 'admin')) {
    const admin: User = {
      id: 'admin-001',
      name: 'SorSU Admin',
      email: 'admin@sorsu.edu.ph',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    }
    const demoSeller: User = {
      id: 'seller-001',
      name: 'SorSU Canteen',
      email: 'canteen@sorsu.edu.ph',
      password: 'seller123',
      role: 'seller',
      createdAt: new Date().toISOString(),
    }
    set(KEYS.users, [...users, admin, demoSeller])
  } else {
    // Ensure demo seller exists even if admin was already seeded
    const current = get<User>(KEYS.users)
    if (!current.find((u) => u.id === 'seller-001')) {
      const demoSeller: User = {
        id: 'seller-001',
        name: 'SorSU Canteen',
        email: 'canteen@sorsu.edu.ph',
        password: 'seller123',
        role: 'seller',
        createdAt: new Date().toISOString(),
      }
      set(KEYS.users, [...current, demoSeller])
    }
  }

  // Seed demo menu items if the canteen menu is not yet seeded
  const menu = get<MenuItem>(KEYS.menu)
  if (!menu.find((m) => m.id === 'mi-001')) {
    const demoItems: MenuItem[] = [
      { id: 'mi-001', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Fried Chicken + Rice', description: 'Crispy golden fried chicken served with steamed white rice.', price: 65, category: 'Meals/Rice Meals', imageUrl: '/food/fried-chicken-rice.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-002', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Pork Adobo', description: 'Tender pork braised in soy sauce, vinegar, garlic and bay leaves.', price: 55, category: 'Meals/Rice Meals', imageUrl: '/food/pork-adobo.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-003', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Pork Sinigang', description: 'Sour tamarind pork soup with kangkong and vegetables.', price: 60, category: 'Lunch', imageUrl: '/food/pork-sinigang.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-004', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Menudo', description: 'Hearty pork stew with potatoes, carrots, and tomato sauce.', price: 55, category: 'Lunch', imageUrl: '/food/menudo.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-005', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Bicol Express', description: 'Spicy pork cooked in coconut milk with chili peppers.', price: 60, category: 'Meals/Rice Meals', imageUrl: '/food/bicol-express.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-006', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Fish Fillet / Fried Fish', description: 'Crispy fried fish fillet served with rice and tomatoes.', price: 55, category: 'Meals/Rice Meals', imageUrl: '/food/fish-fillet.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-007', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Chopsuey', description: 'Stir-fried mixed vegetables with pork in savory sauce.', price: 50, category: 'Lunch', imageUrl: '/food/chopsuey.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-008', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Spaghetti', description: 'Filipino-style sweet spaghetti with hotdog and ground meat.', price: 45, category: 'Quick Bites', imageUrl: '/food/spaghetti.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-009', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Pancit Canton / Bihon', description: 'Stir-fried noodles with vegetables, pork and soy sauce.', price: 45, category: 'Quick Bites', imageUrl: '/food/pancit.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-010', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Palabok', description: 'Rice noodles topped with shrimp sauce, eggs and chicharron.', price: 50, category: 'Quick Bites', imageUrl: '/food/palabok.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-011', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Burger', description: 'Juicy beef patty with lettuce, tomato and cheese in a soft bun.', price: 40, category: 'Quick Bites', imageUrl: '/food/burger.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-012', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Lumpia', description: 'Crispy fried pork spring rolls served with sweet vinegar dip.', price: 15, category: 'Quick Bites', imageUrl: '/food/lumpia.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-013', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Fries', description: 'Crispy golden french fries with ketchup dipping sauce.', price: 30, category: 'Quick Bites', imageUrl: '/food/fries.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-014', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Banana Cake', description: 'Moist and sweet Filipino banana cake loaf, a classic merienda.', price: 35, category: 'Sweets/Desserts', imageUrl: '/food/banana-cake.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-015', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Cassava Cake', description: 'Creamy Filipino cassava cake with custard topping.', price: 30, category: 'Sweets/Desserts', imageUrl: '/food/cassava-cake.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-016', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Macaroni Salad', description: 'Creamy macaroni salad with carrots, raisins and cheese.', price: 30, category: 'Sweets/Desserts', imageUrl: '/food/macaroni-salad.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-017', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Softdrinks', description: 'Chilled Coke, Sprite or Royal in a cup with ice.', price: 25, category: 'Drinks/Beverages', imageUrl: '/food/softdrinks.jpg', available: true, createdAt: new Date().toISOString() },
      { id: 'mi-018', sellerId: 'seller-001', sellerName: 'SorSU Canteen', name: 'Juice', description: 'Fresh orange, pineapple or lemon juice served cold.', price: 20, category: 'Drinks/Beverages', imageUrl: '/food/juice.jpg', available: true, createdAt: new Date().toISOString() },
    ]
    set(KEYS.menu, demoItems)
  }
}

// ── Users ─────────────────────────────────────────────────────────────────────
export function getUsers(): User[] {
  return get<User>(KEYS.users)
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id)
}

export function addUser(user: User): void {
  set(KEYS.users, [...getUsers(), user])
}

export function updateUser(updated: User): void {
  set(KEYS.users, getUsers().map((u) => (u.id === updated.id ? updated : u)))
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
}

export function getUserByPhone(phone: string): User | undefined {
  return getUsers().find((u) => u.phone === phone.trim())
}

// ── Auth session ──────────────────────────────────────────────────────────────
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEYS.currentUser)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(KEYS.currentUser, JSON.stringify(user))
  } else {
    localStorage.removeItem(KEYS.currentUser)
  }
}

// ── Menu ──────────────────────────────────────────────────────────────────────
export function getMenuItems(): MenuItem[] {
  return get<MenuItem>(KEYS.menu)
}

export function addMenuItem(item: MenuItem): void {
  set(KEYS.menu, [...getMenuItems(), item])
}

export function updateMenuItem(updated: MenuItem): void {
  set(KEYS.menu, getMenuItems().map((m) => (m.id === updated.id ? updated : m)))
}

export function deleteMenuItem(id: string): void {
  set(KEYS.menu, getMenuItems().filter((m) => m.id !== id))
}

// ── Cart ──────────────────────────────────────────────────────────────────────
export function getCart(): CartItem[] {
  return get<CartItem>(KEYS.cart)
}

export function setCart(items: CartItem[]): void {
  set(KEYS.cart, items)
}

export function clearCart(): void {
  set(KEYS.cart, [])
}

// ── Orders ────────────────────────────────────────────────────────────────────
export function getOrders(): Order[] {
  return get<Order>(KEYS.orders)
}

export function addOrder(order: Order): void {
  set(KEYS.orders, [...getOrders(), order])
}

export function updateOrder(updated: Order): void {
  set(KEYS.orders, getOrders().map((o) => (o.id === updated.id ? updated : o)))
}

// ── Messages ──────────────────────────────────────────────────────────────────
export function getMessages(): ChatMessage[] {
  return get<ChatMessage>(KEYS.messages)
}

export function addMessage(msg: ChatMessage): void {
  set(KEYS.messages, [...getMessages(), msg])
}

export function getConversation(userA: string, userB: string): ChatMessage[] {
  return getMessages().filter(
    (m) =>
      (m.senderId === userA && m.receiverId === userB) ||
      (m.senderId === userB && m.receiverId === userA)
  )
}

// ── ID generator ─────────────────────────────────────────────────────────────
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
