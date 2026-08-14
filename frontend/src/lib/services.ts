import { apiRequest } from './api'
import type { ShopProduct } from './shopCatalog'

export type AuthUser = {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'customer'
  store: string
  timezone: string
  notifyOrders: boolean
  notifyLowStock: boolean
  notifyReviews: boolean
}

export type AdminOrder = {
  id: string
  mongoId?: string
  customer: string
  customerEmail?: string
  items: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'
  payment: 'cod' | 'razorpay'
  date: string
  city: string
  tracking?: string
  lineItems?: unknown[]
}

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

export type DashboardData = {
  metrics: {
    totalSales: number
    ordersToday: number
    lowStock: number
    customers: number
  }
  salesByMonth: { m: string; v: number; amount?: number }[]
  inventoryStatus: { label: string; count: number; tone: 'ok' | 'warn' | 'bad' }[]
  shipmentBreakdown: { label: string; value: number; color: string }[]
  customerActivity: { label: string; value: number; color: string }[]
  marketingBars: { label: string; a: number; b: number }[]
  topProducts: ShopProduct[]
  recentOrders: AdminOrder[]
}

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    }),
  register: (payload: { name: string; email: string; password: string; phone?: string }) =>
    apiRequest<{ token: string; user: AuthUser }>('/auth/register', {
      method: 'POST',
      body: payload,
      auth: false,
    }),
  me: () => apiRequest<AuthUser>('/auth/me'),
  updateProfile: (payload: Partial<AuthUser>) =>
    apiRequest<AuthUser>('/auth/profile', { method: 'PATCH', body: payload }),
}

export const productsApi = {
  list: (params?: Record<string, string | number | undefined>) => {
    const qs = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v != null && v !== '') qs.set(k, String(v))
      })
    }
    const q = qs.toString()
    return apiRequest<{
      items: ShopProduct[]
      total: number
      categories: string[]
    }>(`/products${q ? `?${q}` : ''}`, { auth: false })
  },
  create: (body: Partial<ShopProduct> & { name: string; category: string; price: number }) =>
    apiRequest<ShopProduct>('/products', { method: 'POST', body }),
  update: (id: string, body: Partial<ShopProduct>) =>
    apiRequest<ShopProduct>(`/products/${id}`, { method: 'PATCH', body }),
  remove: (id: string) => apiRequest<{ id: string }>(`/products/${id}`, { method: 'DELETE' }),
}

export const ordersApi = {
  list: () =>
    apiRequest<{ items: AdminOrder[]; counts: Record<string, number> }>('/orders'),
  create: (body: Record<string, unknown>) =>
    apiRequest<{ order: AdminOrder; transaction: AdminTransaction }>('/orders', {
      method: 'POST',
      body,
      auth: false,
    }),
  advance: (id: string) =>
    apiRequest<AdminOrder>(`/orders/${id}/advance`, { method: 'PATCH' }),
}

export const customersApi = {
  list: (q?: string) =>
    apiRequest<{ items: AdminCustomer[]; total: number }>(
      `/customers${q ? `?q=${encodeURIComponent(q)}` : ''}`,
    ),
}

export const transactionsApi = {
  list: (status = 'all') =>
    apiRequest<{
      items: AdminTransaction[]
      summary: { paid: number; pending: number; count: number }
    }>(`/transactions?status=${encodeURIComponent(status)}`),
}

export const dashboardApi = {
  get: () => apiRequest<DashboardData>('/dashboard'),
}
