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
  settings: '/settings',
  myOrders: '/my-orders',
  /** Alias requested for the same page */
  myOrderPage: '/myorderpage',
  knowMore: '/know-more',
  wishlist: '/wishlist',
  wholesale: '/wholesale',
  contact: '/contact',
} as const

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES]

export type AdminSection =
  | 'dashboard'
  | 'customers'
  | 'products'
  | 'transactions'
  | 'orders'
  | 'reviews'
  | 'discounts'
  | 'notifications'
  | 'settings'

/** In-page section URLs while scrolling on the home experience. */
const HOME_SECTION_PATHS = ['/about', '/products'] as const

/** Soft URLs synced while scrolling home — must not load standalone pages on refresh. */
export const HOME_SECTION_SCROLL_PATHS = [
  '/about',
  '/products',
] as const

export function isHomeSectionScrollPath(pathname: string) {
  return (HOME_SECTION_SCROLL_PATHS as readonly string[]).includes(pathname)
}

const PERSIST_ROUTE_KEY = 'tm-persist-route'

export function markRoutePersistOnRefresh(pathname: string) {
  sessionStorage.setItem(PERSIST_ROUTE_KEY, pathname)
}

export function clearPersistRoute() {
  sessionStorage.removeItem(PERSIST_ROUTE_KEY)
}

export function getPersistRoute() {
  return sessionStorage.getItem(PERSIST_ROUTE_KEY)
}

export function isHomeScrollPath(pathname: string) {
  return pathname === APP_ROUTES.home || HOME_SECTION_PATHS.includes(pathname as (typeof HOME_SECTION_PATHS)[number])
}

/** Routes that require a signed-in user. */
export function requiresAuthPath(pathname: string) {
  return (
    isCartPath(pathname) ||
    isCheckoutPath(pathname) ||
    isAdminPath(pathname) ||
    isProfilePath(pathname) ||
    isSettingsPath(pathname) ||
    isMyOrdersPath(pathname) ||
    isWishlistPath(pathname)
  )
}

/** Routes reachable without signing in. */
export function isPublicPath(pathname: string) {
  if (requiresAuthPath(pathname)) return false
  return (
    isAuthPath(pathname) ||
    isHomeScrollPath(pathname) ||
    isShopPath(pathname) ||
    isKnowMorePath(pathname) ||
    isWholesalePath(pathname) ||
    isContactPath(pathname)
  )
}

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

export function isSettingsPath(pathname: string) {
  return pathname === APP_ROUTES.settings
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

export function isWholesalePath(pathname: string) {
  return pathname === APP_ROUTES.wholesale
}

export function isContactPath(pathname: string) {
  return pathname === APP_ROUTES.contact
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
    'discounts',
    'notifications',
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
    isSettingsPath(pathname) ||
    isMyOrdersPath(pathname) ||
    isWishlistPath(pathname) ||
    isWholesalePath(pathname) ||
    isContactPath(pathname) ||
    isKnowMorePath(pathname) ||
    isAdminPath(pathname)
  )
}

/** App pages where no primary nav item should appear active (cart, checkout, etc.). */
export function isNavNeutralAppPath(pathname: string) {
  return isAppPagePath(pathname) && !isKnowMorePath(pathname) && !isShopPath(pathname) && !isWholesalePath(pathname) && !isContactPath(pathname)
}

/** Client navigate without full reload. Path may include a hash (e.g. `/profile#settings`). */
export function navigateApp(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const hashIdx = normalized.indexOf('#')
  const pathname = hashIdx >= 0 ? normalized.slice(0, hashIdx) : normalized
  const hash = hashIdx >= 0 ? normalized.slice(hashIdx) : ''
  const target = `${pathname}${hash}`

  if (
    isShopPath(pathname) ||
    isCartPath(pathname) ||
    isCheckoutPath(pathname) ||
    isProfilePath(pathname) ||
    isSettingsPath(pathname) ||
    isMyOrdersPath(pathname) ||
    isWishlistPath(pathname) ||
    isKnowMorePath(pathname) ||
    isWholesalePath(pathname) ||
    isContactPath(pathname) ||
    isAdminPath(pathname) ||
    isAuthPath(pathname)
  ) {
    markRoutePersistOnRefresh(pathname)
  } else if (pathname === APP_ROUTES.home || isHomeSectionScrollPath(pathname)) {
    clearPersistRoute()
  }

  if (window.location.pathname + window.location.hash === target && !window.location.search) {
    window.dispatchEvent(new PopStateEvent('popstate'))
    return
  }
  window.history.pushState(null, '', target)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
