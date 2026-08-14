/** App-level routes (separate from in-page section URLs). */
export const APP_ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  shop: '/shop',
  cart: '/cart',
  checkout: '/checkout',
  admin: '/admin',
} as const

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES]

export type AdminSection =
  | 'dashboard'
  | 'customers'
  | 'products'
  | 'transactions'
  | 'orders'
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
    isAdminPath(pathname)
  )
}

/** Client navigate without full reload. */
export function navigateApp(path: string) {
  if (window.location.pathname === path && !window.location.hash) {
    window.dispatchEvent(new PopStateEvent('popstate'))
    return
  }
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
