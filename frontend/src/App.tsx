import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from './context/AuthContext'
import SmoothScroll, { RouteScrollReset } from './components/scroll/SmoothScroll'
import PageFallback from './components/shared/PageFallback'
import {
  isAdminPath,
  isAppPagePath,
  isAuthPath,
  isCartPath,
  isCheckoutPath,
  isContactPath,
  isHomeSectionScrollPath,
  isKnowMorePath,
  isMyOrdersPath,
  isProfilePath,
  isPublicPath,
  isSettingsPath,
  isShopPath,
  isWholesalePath,
  isWishlistPath,
  navigateApp,
  APP_ROUTES,
  clearPersistRoute,
  getPersistRoute,
} from './lib/appRoutes'
import { scrollAppToTop } from './lib/scrollControl'
import { resetPathToHome } from './lib/sectionNav'
import AuthPage from './pages/AuthPage'
import Home from './pages/Home'

const ShopPage = lazy(() => import('./pages/ShopPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const KnowMorePage = lazy(() => import('./pages/KnowMorePage'))
const WholesalePage = lazy(() => import('./pages/WholesalePage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>
}

function AppRoutes({ path }: { path: string }) {
  const { user, loading } = useAuth()
  const auth = isAuthPath(path)
  const shop = isShopPath(path)
  const cart = isCartPath(path)
  const checkout = isCheckoutPath(path)
  const profile = isProfilePath(path)
  const settings = isSettingsPath(path)
  const myOrders = isMyOrdersPath(path)
  const wishlist = isWishlistPath(path)
  const knowMore = isKnowMorePath(path)
  const wholesale = isWholesalePath(path)
  const contact = isContactPath(path)
  const admin = isAdminPath(path)
  const authMode = path === '/signup' ? 'signup' : 'login'

  if (loading && !isAuthPath(path)) return <Home ready={false} />

  if (!user && !isPublicPath(path)) {
    return <AuthPage initialMode="login" />
  }

  if (auth) return <AuthPage initialMode={authMode} />
  if (shop) return <LazyPage><ShopPage /></LazyPage>
  if (cart) return <LazyPage><CartPage /></LazyPage>
  if (checkout) return <LazyPage><CheckoutPage /></LazyPage>
  if (profile) return <LazyPage><ProfilePage /></LazyPage>
  if (settings) return <LazyPage><SettingsPage /></LazyPage>
  if (myOrders) return <LazyPage><MyOrdersPage /></LazyPage>
  if (wishlist) return <LazyPage><WishlistPage /></LazyPage>
  if (knowMore) return <LazyPage><KnowMorePage /></LazyPage>
  if (wholesale) return <LazyPage><WholesalePage /></LazyPage>
  if (contact) return <LazyPage><ContactPage /></LazyPage>
  if (admin) return <LazyPage><AdminPage /></LazyPage>

  return <Home ready />
}

function App() {
  const { user, loading } = useAuth()
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (loading) return
    const current = window.location.pathname
    if (!user && !isPublicPath(current)) {
      navigateApp(APP_ROUTES.login)
      setPath(APP_ROUTES.login)
    }
  }, [user, loading])

  // Refresh: keep intentional app pages; scroll-sync section URLs return home
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    const current = window.location.pathname
    const persist = getPersistRoute()
    const keepPage =
      (isAppPagePath(current) && !isHomeSectionScrollPath(current)) ||
      (persist === current && isHomeSectionScrollPath(current))

    if (keepPage) {
      setPath(current)
      scrollAppToTop(true)
      return
    }
    resetPathToHome()
    clearPersistRoute()
    setPath('/')
    scrollAppToTop(true)
  }, [])

  return (
    <SmoothScroll enabled>
      <RouteScrollReset routeKey={path} />
      <AppRoutes path={path} />
    </SmoothScroll>
  )
}

export default App
