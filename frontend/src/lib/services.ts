import { apiDownload, apiRequest } from './api'
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
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'
  date: string
  city: string
  tracking?: string
  invoice?: string
  invoiceAvailable?: boolean
  transactionStatus?: 'paid' | 'pending' | 'refunded' | 'failed'
  discountAmount?: number
  couponCode?: string
  subtotal?: number
  deliveryFee?: number
  lineItems?: {
    productId: string
    name: string
    variantId?: string
    variantLabel?: string
    image?: string
    qty: number
    unitPrice: number
    lineTotal: number
    reviewed?: boolean
  }[]
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

export type DashboardPeriod =
  | { mode: 'all' }
  | { mode: 'month'; year: number; month: number }

export type DashboardData = {
  period?: DashboardPeriod
  periodLabel?: string
  metrics: {
    totalSales: number
    ordersToday: number
    totalProducts: number
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
  me: (signal?: AbortSignal) => apiRequest<AuthUser>('/auth/me', { signal }),
  updateProfile: (payload: Partial<AuthUser>) =>
    apiRequest<AuthUser>('/auth/profile', { method: 'PATCH', body: payload }),
  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiRequest<null>('/auth/change-password', { method: 'POST', body: payload }),
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

export type RazorpayCheckoutPayload = {
  keyId: string
  orderId: string
  amount: number
  currency: string
  name: string
  description: string
  prefill?: { name?: string; email?: string; contact?: string }
}

export const ordersApi = {
  list: () =>
    apiRequest<{ items: AdminOrder[]; counts: Record<string, number> }>('/orders'),
  create: (body: Record<string, unknown>) =>
    apiRequest<{
      order: AdminOrder
      transaction: AdminTransaction
      razorpay?: RazorpayCheckoutPayload | null
    }>('/orders', {
      method: 'POST',
      body,
    }),
  mine: () =>
    apiRequest<{ items: AdminOrder[]; reviews: ProductReview[] }>('/orders/mine'),
  advance: (id: string) =>
    apiRequest<AdminOrder>(`/orders/${id}/advance`, { method: 'PATCH' }),
  downloadInvoice: async (orderId: string, filename?: string) => {
    const safeName = filename || `Invoice-${orderId}.pdf`
    await apiDownload(`/orders/${encodeURIComponent(orderId)}/invoice`, safeName)
  },
}

export const paymentsApi = {
  verifyRazorpay: (body: {
    orderNumber: string
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
    email?: string
  }) =>
    apiRequest<{ order: AdminOrder; transaction: AdminTransaction }>('/payments/razorpay/verify', {
      method: 'POST',
      body,
      auth: false,
    }),
  cancelRazorpay: (orderNumber: string) =>
    apiRequest<{ order: AdminOrder }>('/payments/razorpay/cancel', {
      method: 'POST',
      body: { orderNumber },
      auth: false,
    }),
}

export type ProductReview = {
  id: string
  productId: string
  productName: string
  orderNumber: string
  rating: number
  comment: string
  status?: 'pending' | 'approved' | 'ignored'
  createdAt?: string
}

export type AdminReview = ProductReview & {
  customerName: string
  customerEmail: string
  authorAvatar: string
}

export type TestimonialItem = {
  id: string
  text: string
  rating: number
  productName: string
  author: {
    name: string
    handle: string
    avatar: string
  }
}

export const reviewsApi = {
  create: (body: { orderId: string; productId: string; rating: number; comment?: string }) =>
    apiRequest<{
      review: ProductReview
      productRating: number
      productReviews: number
    }>('/reviews', { method: 'POST', body }),
  mine: () => apiRequest<{ items: ProductReview[] }>('/reviews/mine'),
  forProduct: (productId: string) =>
    apiRequest<{ items: ProductReview[] }>(`/reviews/product/${productId}`, { auth: false }),
  testimonials: (limit = 24) =>
    apiRequest<{ items: TestimonialItem[] }>(`/reviews/testimonials?limit=${limit}`, {
      auth: false,
    }),
  adminList: (status: 'all' | 'pending' | 'approved' | 'ignored' = 'all') =>
    apiRequest<{
      items: AdminReview[]
      counts: { pending: number; approved: number; ignored: number; total: number }
    }>(`/reviews/admin?status=${encodeURIComponent(status)}`),
  setStatus: (id: string, status: 'approved' | 'ignored' | 'pending') =>
    apiRequest<{ review: AdminReview }>(`/reviews/${id}/status`, {
      method: 'PATCH',
      body: { status },
    }),
}

export const wishlistApi = {
  get: () =>
    apiRequest<{
      wishlist: { id: string; productIds: string[] }
      items: ShopProduct[]
    }>('/wishlist'),
  add: (productId: string) =>
    apiRequest<{
      wishlist: { id: string; productIds: string[] }
      items: ShopProduct[]
      added: boolean
    }>('/wishlist', { method: 'POST', body: { productId } }),
  remove: (productId: string) =>
    apiRequest<{
      wishlist: { id: string; productIds: string[] }
      items: ShopProduct[]
      removed: boolean
    }>(`/wishlist/${encodeURIComponent(productId)}`, { method: 'DELETE' }),
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
  get: (period?: DashboardPeriod) => {
    const qs = new URLSearchParams()
    if (period?.mode === 'month') {
      qs.set('period', 'month')
      qs.set('year', String(period.year))
      qs.set('month', String(period.month))
    } else if (period?.mode === 'all') {
      qs.set('period', 'all')
    }
    const q = qs.toString()
    return apiRequest<DashboardData>(`/dashboard${q ? `?${q}` : ''}`)
  },
}

export type CouponRecord = {
  id: string
  code?: string
  title: string
  description?: string
  scope: 'global' | 'product' | 'category'
  productId?: string
  category?: string
  discountType: 'percent' | 'fixed'
  value: number
  expiresAt: string
  maxRedemptions: number
  redemptionCount: number
  maxRedemptionsPerUser: number
  minOrderValue: number
  maxDiscountAmount?: number
  autoApply: boolean
  isActive: boolean
  createdAt?: string
}

export type CampaignRecord = {
  id: string
  title: string
  message: string
  couponId?: string
  coupon?: CouponRecord
  channel: 'email'
  recipientFilter: 'all' | 'active'
  status: 'draft' | 'sending' | 'sent' | 'failed'
  stats: { total: number; sent: number; failed: number }
  sentAt?: string
  createdAt?: string
}

export type AppNotification = {
  id: string
  type: string
  title: string
  body: string
  channel: string
  emailStatus?: string
  orderNumber?: string
  couponCode?: string
  read: boolean
  meta?: Record<string, unknown>
  createdAt?: string
}

export const couponsApi = {
  list: () => apiRequest<{ items: CouponRecord[] }>('/coupons'),
  create: (body: Partial<CouponRecord> & { expiresAt: string; title: string; scope: CouponRecord['scope']; discountType: CouponRecord['discountType']; value: number }) =>
    apiRequest<CouponRecord>('/coupons', { method: 'POST', body }),
  update: (id: string, body: Partial<CouponRecord>) =>
    apiRequest<CouponRecord>(`/coupons/${id}`, { method: 'PATCH', body }),
  remove: (id: string) => apiRequest<unknown>(`/coupons/${id}`, { method: 'DELETE' }),
  regenerateCode: (id: string) =>
    apiRequest<CouponRecord>(`/coupons/${id}/regenerate-code`, { method: 'POST' }),
  validate: (body: { code: string; email: string; subtotal: number; items: { productId: string; qty: number }[] }) =>
    apiRequest<{ code: string; discountAmount: number; label: string; title: string; newTotal: number }>(
      '/coupons/validate',
      { method: 'POST', body, auth: false },
    ),
  activePromos: () =>
    apiRequest<{
      items: {
        id: string
        scope: string
        productId?: string
        category?: string
        discountType: string
        value: number
        title: string
        label: string
        productName?: string
        productImage?: string
        expiresAt?: string
      }[]
    }>('/coupons/active', { auth: false }),
}

export const campaignsApi = {
  list: () => apiRequest<{ items: CampaignRecord[]; mailConfigured: boolean }>('/campaigns'),
  previewRecipients: (filter: 'all' | 'active' = 'all') =>
    apiRequest<{ count: number; sample: { name: string; email: string }[] }>(
      `/campaigns/preview-recipients?filter=${filter}`,
    ),
  create: (body: { title: string; message: string; couponId: string; recipientFilter?: 'all' | 'active' }) =>
    apiRequest<CampaignRecord>('/campaigns', { method: 'POST', body }),
  send: (id: string) => apiRequest<CampaignRecord>(`/campaigns/${id}/send`, { method: 'POST' }),
}

export const notificationsApi = {
  mine: () => apiRequest<{ items: AppNotification[]; unread: number; mailConfigured: boolean }>('/notifications/mine'),
  readAll: () => apiRequest<unknown>('/notifications/mine/read-all', { method: 'PATCH' }),
  deleteAll: () => apiRequest<{ deleted: number }>('/notifications/mine', { method: 'DELETE' }),
  markRead: (id: string) => apiRequest<AppNotification>(`/notifications/${id}/read`, { method: 'PATCH' }),
  remove: (id: string) => apiRequest<unknown>(`/notifications/${id}`, { method: 'DELETE' }),
  adminList: (type = 'all') =>
    apiRequest<{ items: AppNotification[]; counts: Record<string, number>; mailConfigured: boolean }>(
      `/notifications/admin?type=${encodeURIComponent(type)}`,
    ),
}
