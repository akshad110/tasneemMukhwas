/** Shared admin TypeScript types (data comes from the API). */

export type AdminCustomer = {
  id: string
  name: string
  email: string
  phone: string
  city: string
  orders: number
  spent: number
  lastActive: string
  status: 'active' | 'inactive'
  interactions: { date: string; type: string; detail: string }[]
}

export type AdminOrder = {
  id: string
  customer: string
  items: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'
  payment: 'cod' | 'razorpay'
  date: string
  city: string
  tracking?: string
}

export type AdminTransaction = {
  id: string
  orderId: string
  customer: string
  amount: number
  method: 'cod' | 'razorpay' | 'upi' | 'card'
  status: 'paid' | 'pending' | 'refunded' | 'failed'
  invoice: string
  date: string
}
