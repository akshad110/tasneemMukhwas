/** App-level routes (separate from in-page section URLs). */
export const APP_ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  shop: '/shop',
  cart: '/cart',
  checkout: '/checkout',
  admin: '/admin',
  profile: '/profile',
  myOrders: '/my-orders',
  /** Alias requested for the same page */
  myOrderPage: '/myorderpage',
  knowMore: '/know-more',
  wishlist: '/wishlist',
} as const

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES]

export type AdminSection =
  | 'dashboard'
  | 'customers'
  | 'products'
  | 'transactions'
  | 'orders'
  | 'reviews'
  | 'settings'

export function isAuthPath(pathname: string) {
  return pathname === APP_ROUTES.login || pathname === APP_ROUTES.signup
}

export function isShopPath(pathname: string) {
  return pathname === APP_ROUTES.shop
}

export function isCartPath(pathname: string) {
  return pathname === APP_ROUTES.cart
}

export function isCheckoutPath(pathname: string) {
  return pathname === APP_ROUTES.checkout
}

export function isProfilePath(pathname: string) {
  return pathname === APP_ROUTES.profile
}

export function isMyOrdersPath(pathname: string) {
  return pathname === APP_ROUTES.myOrders || pathname === APP_ROUTES.myOrderPage
}

export function isKnowMorePath(pathname: string) {
  return pathname === APP_ROUTES.knowMore
}

export function isWishlistPath(pathname: string) {
  return pathname === APP_ROUTES.wishlist
}

export function isAdminPath(pathname: string) {
  return pathname === APP_ROUTES.admin || pathname.startsWith(`${APP_ROUTES.admin}/`)
}

export function adminSectionFromPath(pathname: string): AdminSection {
  if (!isAdminPath(pathname)) return 'dashboard'
  const rest = pathname.slice(APP_ROUTES.admin.length).replace(/^\//, '')
  const seg = rest.split('/')[0] || 'dashboard'
  const allowed: AdminSection[] = [
    'dashboard',
    'customers',
    'products',
    'transactions',
    'orders',
    'reviews',
    'settings',
  ]
  return (allowed.includes(seg as AdminSection) ? seg : 'dashboard') as AdminSection
}

/** Standalone pages that should survive refresh (not section-scroll URLs). */
export function isAppPagePath(pathname: string) {
  return (
    isAuthPath(pathname) ||
    isShopPath(pathname) ||
    isCartPath(pathname) ||
    isCheckoutPath(pathname) ||
    isProfilePath(pathname) ||
    isMyOrdersPath(pathname) ||
    isWishlistPath(pathname) ||
    isKnowMorePath(pathname) ||
    isAdminPath(pathname)
  )
}

/** Client navigate without full reload. */
export function navigateApp(path: string) {
  if (window.location.pathname === path && !window.location.hash) {
    window.dispatchEvent(new PopStateEvent('popstate'))
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    return
  }
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}
