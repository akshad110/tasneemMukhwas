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
  isWhatTasneemDoPath,
  isMukhwasBenefitsPath,
  isMyOrdersPath,
  isProfilePath,
  isPublicPath,
  isSettingsPath,
  isShopPath,
  isShopProductPath,
  isWholesalePath,
  isWishlistPath,
  isPrivacyPath,
  isShippingPolicyPath,
  isTermsPath,
  isOurCompanyPath,
  navigateApp,
  APP_ROUTES,
  clearPersistRoute,
  getPersistRoute,
  parseShopProductId,
} from './lib/appRoutes'
import { scrollAppToTop } from './lib/scrollControl'
import { resetPathToHome } from './lib/sectionNav'
import Home from './pages/Home'

const AdminPage = lazy(() => import('./pages/AdminPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const KnowMorePage = lazy(() => import('./pages/KnowMorePage'))
const WhatTasneemDoPage = lazy(() => import('./pages/WhatTasneemDoPage'))
const MukhwasBenefitsPage = lazy(() => import('./pages/MukhwasBenefitsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const WholesalePage = lazy(() => import('./pages/WholesalePage'))
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const ShopPage = lazy(() => import('./pages/ShopPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage'))
const TermsConditionsPage = lazy(() => import('./pages/TermsConditionsPage'))
const OurCompanyPage = lazy(() => import('./pages/OurCompanyPage'))

function LazyPage({ children, label }: { children: ReactNode; label?: string }) {
  return <Suspense fallback={<PageFallback label={label} />}>{children}</Suspense>
}

function AppRoutes({ path }: { path: string }) {
  const { user, loading } = useAuth()
  const auth = isAuthPath(path)
  const shop = isShopPath(path) && !isShopProductPath(path)
  const shopProductId = parseShopProductId(path)
  const cart = isCartPath(path)
  const checkout = isCheckoutPath(path)
  const profile = isProfilePath(path)
  const settings = isSettingsPath(path)
  const myOrders = isMyOrdersPath(path)
  const wishlist = isWishlistPath(path)
  const knowMore = isKnowMorePath(path)
  const whatTasneemDo = isWhatTasneemDoPath(path)
  const mukhwasBenefits = isMukhwasBenefitsPath(path)
  const wholesale = isWholesalePath(path)
  const contact = isContactPath(path)
  const privacy = isPrivacyPath(path)
  const shippingPolicy = isShippingPolicyPath(path)
  const terms = isTermsPath(path)
  const ourCompany = isOurCompanyPath(path)
  const admin = isAdminPath(path)
  const authMode = path === '/signup' ? 'signup' : 'login'

  if (loading && !isAuthPath(path) && !isPublicPath(path)) {
    return null
  }

  if (!user && !isPublicPath(path)) {
    return (
      <LazyPage label="Loading sign in">
        <AuthPage initialMode="login" />
      </LazyPage>
    )
  }

  if (auth) {
    return (
      <LazyPage label="Loading sign in">
        <AuthPage initialMode={authMode} />
      </LazyPage>
    )
  }
  if (shopProductId) {
    return (
      <LazyPage>
        <ProductDetailPage productId={shopProductId} />
      </LazyPage>
    )
  }
  if (shop) {
    return (
      <LazyPage>
        <ShopPage />
      </LazyPage>
    )
  }
  if (cart) {
    return (
      <LazyPage>
        <CartPage />
      </LazyPage>
    )
  }
  if (checkout) {
    return (
      <LazyPage>
        <CheckoutPage />
      </LazyPage>
    )
  }
  if (profile) {
    return (
      <LazyPage>
        <ProfilePage />
      </LazyPage>
    )
  }
  if (settings) {
    return (
      <LazyPage>
        <SettingsPage />
      </LazyPage>
    )
  }
  if (myOrders) {
    return (
      <LazyPage>
        <MyOrdersPage />
      </LazyPage>
    )
  }
  if (wishlist) {
    return (
      <LazyPage>
        <WishlistPage />
      </LazyPage>
    )
  }
  if (knowMore) {
    return (
      <LazyPage>
        <KnowMorePage />
      </LazyPage>
    )
  }
  if (whatTasneemDo) {
    return (
      <LazyPage>
        <WhatTasneemDoPage />
      </LazyPage>
    )
  }
  if (mukhwasBenefits) {
    return (
      <LazyPage>
        <MukhwasBenefitsPage />
      </LazyPage>
    )
  }
  if (wholesale) {
    return (
      <LazyPage>
        <WholesalePage />
      </LazyPage>
    )
  }
  if (contact) {
    return (
      <LazyPage>
        <ContactPage />
      </LazyPage>
    )
  }
  if (privacy) {
    return (
      <LazyPage>
        <PrivacyPolicyPage />
      </LazyPage>
    )
  }
  if (shippingPolicy) {
    return (
      <LazyPage>
        <ShippingPolicyPage />
      </LazyPage>
    )
  }
  if (terms) {
    return (
      <LazyPage>
        <TermsConditionsPage />
      </LazyPage>
    )
  }
  if (ourCompany) {
    return (
      <LazyPage>
        <OurCompanyPage />
      </LazyPage>
    )
  }
  if (admin) {
    return (
      <LazyPage>
        <AdminPage />
      </LazyPage>
    )
  }

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
