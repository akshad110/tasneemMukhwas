import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import Navbar from '../components/nav/Navbar'
import ShopProductCard from '../components/shop/ShopProductCard'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'
import { getSellPrice } from '../lib/shopCatalog'

const INK = '#0a2e22'
const CREAM = '#f3e6c8'
const GOLD = '#b8860b'
const PAGE = '#f4f7f5'
const CARD = '#fffcf7'
const PANEL = '#f3ebe0'
const MUTED = 'rgba(10,46,34,0.58)'
const LINE = 'rgba(10,46,34,0.1)'

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth()
  const { items, count, loading, refresh } = useWishlist()

  useEffect(() => {
    document.title = 'Wishlist · Tasneem Mukhwas'
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Tasneem Mukhwas'
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigateApp(APP_ROUTES.login)
      return
    }
    void refresh()
  }, [user, authLoading, refresh])

  const totalValue = items.reduce((sum, p) => sum + getSellPrice(p), 0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE, fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <motion.button
          type="button"
          onClick={() => navigateApp(APP_ROUTES.shop)}
          className="group mb-8 inline-flex cursor-pointer items-center gap-3 border-0 bg-transparent px-0 py-1"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          aria-label="Back to shop"
        >
          <span
            className="flex h-8 w-8 items-center justify-center border transition group-hover:border-[rgba(184,134,11,0.9)]"
            style={{ borderRadius: 0, borderColor: LINE, backgroundColor: CARD, color: INK }}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="flex flex-col items-start gap-0.5 text-left">
            <span className="text-[0.62rem] font-semibold tracking-[0.16em] uppercase" style={{ color: GOLD }}>
              Continue
            </span>
            <span className="text-[0.88rem] font-semibold" style={{ color: INK }}>
              Back to shop
            </span>
          </span>
        </motion.button>

        <header
          className="relative overflow-hidden rounded-3xl border px-6 py-10 sm:px-10 sm:py-12"
          style={{
            borderColor: LINE,
            background: `linear-gradient(135deg, ${CREAM} 0%, ${CARD} 42%, rgba(255,252,247,0.95) 100%)`,
            boxShadow: '0 28px 60px -40px rgba(10,46,34,0.45)',
          }}
        >
          <div
            className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full opacity-30 blur-2xl"
            style={{ backgroundColor: GOLD }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-12 left-8 h-32 w-32 rounded-full opacity-20 blur-2xl"
            style={{ backgroundColor: INK }}
            aria-hidden
          />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase"
                style={{ color: GOLD }}
              >
                Saved for later
              </p>
              <h1
                className="mt-2 m-0 flex items-center gap-3 text-[2rem] font-bold tracking-tight sm:text-[2.6rem]"
                style={{ color: INK }}
              >
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: 'rgba(184,134,11,0.14)', color: GOLD }}
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
                  </svg>
                </span>
                Your Wishlist
              </h1>
              <p className="mt-3 m-0 max-w-xl text-[0.95rem] leading-relaxed" style={{ color: MUTED }}>
                Curate the mukhwas you love. Hearts sync across every device while you&apos;re signed in.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div
                className="min-w-[120px] rounded-2xl border px-4 py-3"
                style={{ borderColor: LINE, backgroundColor: 'rgba(255,255,255,0.72)' }}
              >
                <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-wide" style={{ color: MUTED }}>
                  Items
                </p>
                <p className="mt-1 m-0 text-[1.35rem] font-bold" style={{ color: INK }}>
                  {count}
                </p>
              </div>
              <div
                className="min-w-[140px] rounded-2xl border px-4 py-3"
                style={{ borderColor: LINE, backgroundColor: 'rgba(255,255,255,0.72)' }}
              >
                <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-wide" style={{ color: MUTED }}>
                  Est. value
                </p>
                <p className="mt-1 m-0 text-[1.35rem] font-bold" style={{ color: GOLD }}>
                  ₹{totalValue}
                </p>
              </div>
            </div>
          </div>
        </header>

        {loading || authLoading ? (
          <p className="mt-12 m-0 text-center text-[0.95rem]" style={{ color: MUTED }}>
            Loading your wishlist…
          </p>
        ) : items.length === 0 ? (
          <motion.div
            className="mt-10 rounded-3xl border px-6 py-16 text-center sm:py-20"
            style={{ borderColor: LINE, backgroundColor: CARD }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: PANEL, color: GOLD }}
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
              </svg>
            </div>
            <h2 className="mt-5 m-0 text-[1.35rem] font-bold" style={{ color: INK }}>
              Your wishlist is empty
            </h2>
            <p className="mx-auto mt-2 m-0 max-w-md text-[0.92rem]" style={{ color: MUTED }}>
              Tap the heart on any product card while browsing the shop to save it here.
            </p>
            <button
              type="button"
              onClick={() => navigateApp(APP_ROUTES.shop)}
              className="mt-7 cursor-pointer rounded-xl border-0 px-7 py-3 text-[0.78rem] font-semibold uppercase tracking-wide transition hover:brightness-110"
              style={{ backgroundColor: INK, color: CREAM }}
            >
              Explore shop
            </button>
          </motion.div>
        ) : (
          <section className="mt-10" aria-label="Saved products">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="m-0 text-[0.68rem] font-semibold tracking-[0.18em] uppercase" style={{ color: GOLD }}>
                  Favourites
                </p>
                <h2 className="mt-1 m-0 text-[1.25rem] font-bold" style={{ color: INK }}>
                  {count} saved {count === 1 ? 'product' : 'products'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigateApp(APP_ROUTES.cart)}
                className="cursor-pointer rounded-xl border px-4 py-2.5 text-[0.75rem] font-semibold uppercase tracking-wide transition hover:bg-[#0a2e22]/5"
                style={{ borderColor: LINE, color: INK, backgroundColor: CARD }}
              >
                View cart
              </button>
            </div>

            <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {items.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -8 }}
                    transition={{ duration: 0.28 }}
                  >
                    <ShopProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </section>
        )}
      </main>
    </div>
  )
}
