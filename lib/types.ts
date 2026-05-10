export type UserRole = 'admin' | 'seller' | 'shopper'

export type Course =
  | 'BSAIS'
  | 'BPA'
  | 'BSA'
  | 'BSE'
  | 'BSCS'
  | 'BSIT'
  | 'BSIS'
  | 'BTVTED'

export interface User {
  id: string
  name: string
  email: string          // used as login identifier
  phone?: string         // optional contact number
  password: string
  role: UserRole
  course?: Course        // shoppers only
  gcashNumber?: string   // seller/shopper gcash
  paymentPreference?: PaymentMethod // shopper default payment
  createdAt: string
}

export type FoodCategory =
  | 'Meals/Rice Meals'
  | 'Lunch'
  | 'Breakfast'
  | 'Dinner'
  | 'Drinks/Beverages'
  | 'Sweets/Desserts'
  | 'Quick Bites'

export interface MenuItem {
  id: string
  sellerId: string
  sellerName: string
  name: string
  description: string
  price: number
  category: FoodCategory
  imageUrl: string       // base64 data URL or placeholder
  available: boolean
  createdAt: string
}

export type PaymentMethod = 'gcash' | 'cod'

export interface CartItem {
  menuItemId: string
  menuItemName: string
  sellerName: string
  price: number
  qty: number
  imageUrl: string
}

export type OrderStatus = 'pending' | 'received' | 'completed' | 'cancelled'

export interface Order {
  id: string
  shopperId: string
  shopperName: string
  shopperCourse?: string
  shopperPhone: string
  sellerId: string
  sellerName: string
  items: CartItem[]
  total: number
  paymentMethod: PaymentMethod
  gcashNumber?: string
  status: OrderStatus
  createdAt: string
  receivedAt?: string
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  receiverId: string
  content: string
  createdAt: string
}
