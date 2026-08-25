import { createRoot } from 'react-dom/client'
import './tokens.css'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { NotificationsProvider } from './context/NotificationsContext.tsx'
import { CartProvider } from './context/CartContext.tsx'
import { CatalogProvider } from './context/CatalogContext.tsx'
import { WishlistProvider } from './context/WishlistContext.tsx'
import { scrollAppToTop } from './lib/scrollControl'
import { HERO_SLIDES } from './components/hero/Hero'

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
scrollAppToTop(true)

HERO_SLIDES.forEach((src) => {
  const img = new Image()
  img.decoding = 'async'
  img.src = src
})

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <NotificationsProvider>
      <WishlistProvider>
        <CatalogProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </CatalogProvider>
      </WishlistProvider>
    </NotificationsProvider>
  </AuthProvider>,
)
