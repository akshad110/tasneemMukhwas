import { useCallback, useEffect, useState } from 'react'
import SmoothScroll from './components/scroll/SmoothScroll'
import {
  isAdminPath,
  isAppPagePath,
  isAuthPath,
  isCartPath,
  isCheckoutPath,
  isShopPath,
} from './lib/appRoutes'
import { resetPathToHome } from './lib/sectionNav'
import AdminPage from './pages/AdminPage'
import AuthPage from './pages/AuthPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import Home from './pages/Home'
import Loader from './pages/Loader'
import ShopPage from './pages/ShopPage'

function scrollToTop() {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

function App() {
  const [loading, setLoading] = useState(true)
  const [path, setPath] = useState(() => window.location.pathname)

  const handleLoaderComplete = useCallback(() => {
    scrollToTop()
    if (!isAppPagePath(window.location.pathname)) {
      resetPathToHome()
      setPath('/')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Refresh: keep standalone app pages; section URLs reset to /
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    const current = window.location.pathname
    if (isAppPagePath(current)) {
      setPath(current)
      scrollToTop()
      return
    }
    resetPathToHome()
    setPath('/')
    scrollToTop()
  }, [])

  useEffect(() => {
    scrollToTop()
    if (!loading) {
      document.documentElement.style.removeProperty('overflow')
      document.body.style.removeProperty('overflow')
      return
    }

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    scrollToTop()

    return () => {
      document.documentElement.style.removeProperty('overflow')
      document.body.style.removeProperty('overflow')
      scrollToTop()
    }
  }, [loading])

  const auth = isAuthPath(path)
  const shop = isShopPath(path)
  const cart = isCartPath(path)
  const checkout = isCheckoutPath(path)
  const admin = isAdminPath(path)
  const authMode = path === '/signup' ? 'signup' : 'login'

  return (
    <>
      {loading && <Loader onComplete={handleLoaderComplete} />}
      {auth ? (
        <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
          <AuthPage initialMode={authMode} />
        </div>
      ) : shop ? (
        <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
          <ShopPage />
        </div>
      ) : cart ? (
        <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
          <CartPage />
        </div>
      ) : checkout ? (
        <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
          <CheckoutPage />
        </div>
      ) : admin ? (
        <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
          <AdminPage />
        </div>
      ) : (
        <SmoothScroll enabled={!loading}>
          <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
            <Home ready={!loading} />
          </div>
        </SmoothScroll>
      )}
    </>
  )
}

export default App
