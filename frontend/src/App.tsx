import { useEffect, useState } from 'react'
import { useAuth } from './context/AuthContext'
import SmoothScroll, { RouteScrollReset } from './components/scroll/SmoothScroll'
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
import AdminPage from './pages/AdminPage'
import AuthPage from './pages/AuthPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import Home from './pages/Home'
import KnowMorePage from './pages/KnowMorePage'
import ContactPage from './pages/ContactPage'
import WholesalePage from './pages/WholesalePage'
import MyOrdersPage from './pages/MyOrdersPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import ShopPage from './pages/ShopPage'
import WishlistPage from './pages/WishlistPage'

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

  if (loading && !isAuthPath(path) && !isPublicPath(path)) {
    return null
  }

  if (!user && !isPublicPath(path)) {
    return <AuthPage initialMode="login" />
  }

  if (auth) return <AuthPage initialMode={authMode} />
  if (shop) return <ShopPage />
  if (cart) return <CartPage />
  if (checkout) return <CheckoutPage />
  if (profile) return <ProfilePage />
  if (settings) return <SettingsPage />
  if (myOrders) return <MyOrdersPage />
  if (wishlist) return <WishlistPage />
  if (knowMore) return <KnowMorePage />
  if (wholesale) return <WholesalePage />
  if (contact) return <ContactPage />
  if (admin) return <AdminPage />

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
