import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CheckoutFlowShell,
  CheckoutFlowStepperBar,
} from '../components/checkout/CheckoutFlow'
import Navbar from '../components/nav/Navbar'
import BackToHomeButton from '../components/shared/BackToHomeButton'
import ShopProductCard from '../components/shop/ShopProductCard'
import ProductCardSkeleton from '../components/shop/ProductCardSkeleton'
import { useCart, type CartResolvedItem } from '../context/CartContext'
import { useCatalog } from '../context/CatalogContext'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'
import { scrollAppToTop } from '../lib/scrollControl'
import { getProductPanelFill, getSellPrice, type ShopProduct } from '../lib/shopCatalog'

const INK = '#0a2e22'
const CREAM = '#f2f4f5'
const GOLD = '#b8860b'
const SURFACE = 'rgba(248,249,250,0.9)'
const MUTED = 'rgba(10,46,34,0.58)'
const LINE = 'rgba(10,46,34,0.12)'
const PANEL = '#f3ebe0'
const DELIVERY_FEE = 49
const SUGGEST_VISIBLE = 4

function TrashIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" />
      <path d="M6.5 7l1 12a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4l1-12" strokeLinecap="round" />
      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    </svg>
  )
}

function CartLineRow({ item }: { item: CartResolvedItem }) {
  const { setQty, removeItem } = useCart()

  return (
    <motion.article
      layout
      className="flex gap-3 border-b py-5 last:border-b-0 sm:gap-4 sm:py-6"
      style={{ borderColor: LINE }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div
        className="flex h-[100px] w-[100px] shrink-0 items-center justify-center overflow-hidden rounded-xl border sm:h-[124px] sm:w-[124px]"
        style={{ borderColor: LINE, backgroundColor: getProductPanelFill(item.product) }}
      >
        <img
          src={item.variant.image}
          alt={item.product.name}
          className="h-full w-full object-contain object-center p-1.5"
          draggable={false}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              className="m-0 truncate text-[0.98rem] font-bold sm:text-[1.05rem]"
              style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
            >
              {item.product.name}
            </h2>
            <p className="mt-1.5 m-0 text-[0.78rem]" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
              Variant: <span style={{ color: INK }}>{item.variant.label}</span>
            </p>
            <p className="mt-0.5 m-0 text-[0.78rem]" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
              Category: <span style={{ color: INK }}>{item.product.category}</span>
            </p>
            <p
              className="mt-3 m-0 text-[1.15rem] font-bold"
              style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
            >
              ₹{getSellPrice(item.product)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.productId, item.variantId)}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 transition hover:bg-black/5"
            style={{ color: '#a32020', backgroundColor: 'transparent' }}
            aria-label={`Remove ${item.product.name}`}
          >
            <TrashIcon className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="mt-auto flex justify-end pt-3">
          <div
            className="inline-flex items-center gap-3 rounded-xl border px-3 py-1.5"
            style={{ borderColor: LINE, backgroundColor: PANEL }}
          >
            <button
              type="button"
              onClick={() => setQty(item.productId, item.variantId, item.qty - 1)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center border-0 text-lg leading-none transition hover:bg-black/5"
              style={{ backgroundColor: 'transparent', color: INK }}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span
              className="min-w-[1.25rem] text-center text-[0.9rem] font-semibold"
              style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
            >
              {item.qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(item.productId, item.variantId, item.qty + 1)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center border-0 text-lg leading-none transition hover:bg-black/5"
              style={{ backgroundColor: 'transparent', color: INK }}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function SuggestedForYou() {
  const { items } = useCart()
  const { products, loading: catalogLoading } = useCatalog()
  const [heldIds, setHeldIds] = useState<string[]>([])
  const prevCart = useRef<Set<string>>(new Set())

  const inCartIds = useMemo(() => new Set(items.map((i) => i.productId)), [items])

  useEffect(() => {
    const newly = [...inCartIds].filter((id) => !prevCart.current.has(id))
    if (newly.length) {
      setHeldIds((prev) => [...new Set([...prev, ...newly])])
    }
    setHeldIds((prev) => prev.filter((id) => inCartIds.has(id)))
    prevCart.current = inCartIds
  }, [inCartIds])

  const remaining = useMemo(
    () => products.filter((p) => !inCartIds.has(p.id) && !p.outOfStock),
    [products, inCartIds],
  )

  const visible = useMemo(() => {
    const held = heldIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is ShopProduct => Boolean(p))
    const seen = new Set(held.map((p) => p.id))
    const rest = remaining.filter((p) => !seen.has(p.id))
    return [...held, ...rest].slice(0, SUGGEST_VISIBLE)
  }, [heldIds, remaining, products])

  if (items.length === 0) return null

  const sectionHeader = (
    <div className="mb-6">
      <p
        className="m-0 text-[0.68rem] font-semibold tracking-[0.18em] uppercase"
        style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
      >
        You may also like
      </p>
      <h2
        id="suggested-heading"
        className="mt-1.5 m-0 text-[1.55rem] font-bold tracking-tight sm:text-[1.85rem]"
        style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
      >
        Suggested for you
      </h2>
    </div>
  )

  if (catalogLoading) {
    return (
      <section className="mt-14 sm:mt-16" aria-labelledby="suggested-heading" aria-busy>
        {sectionHeader}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: SUGGEST_VISIBLE }, (_, i) => (
            <ProductCardSkeleton key={i} index={i} />
          ))}
        </div>
      </section>
    )
  }

  if (visible.length === 0) return null

  return (
    <section className="mt-14 sm:mt-16" aria-labelledby="suggested-heading">
      {sectionHeader}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((product, index) => (
            <motion.div key={product.id} layout>
              <ShopProductCard product={product} revealIndex={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

/** Cart — light cream theme matching shop. */
export default function CartPage() {
  const { items, itemCount, subtotal } = useCart()

  const delivery = items.length === 0 ? 0 : DELIVERY_FEE
  const total = Math.max(0, subtotal + delivery)

  useEffect(() => {
    document.title = 'Cart · Tasneem Mukhwas'
    scrollAppToTop(true)
    return () => {
      document.title = 'Tasneem Mukhwas'
    }
  }, [])

  return (
    <CheckoutFlowShell>
      <Navbar />
      <CheckoutFlowStepperBar step={1} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <BackToHomeButton className="mb-6" />

        {items.length === 0 ? (
          <motion.div
            className="mt-8 rounded-2xl border px-6 py-16 text-center"
            style={{
              borderColor: LINE,
              backgroundColor: SURFACE,
              boxShadow: '0 14px 36px -28px rgba(10,46,34,0.35)',
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="m-0 text-[1.05rem]" style={{ color: INK, fontFamily: 'Inter, sans-serif' }}>
              Your cart is empty.
            </p>
            <p className="mt-2 m-0 text-[0.9rem]" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
              Browse the shop to add fragrant mukhwas to your cart.
            </p>
            <button
              type="button"
              onClick={() => navigateApp(APP_ROUTES.shop)}
              className="mt-8 cursor-pointer rounded-xl border-0 px-8 py-3 text-[0.8rem] font-semibold uppercase transition hover:brightness-110"
              style={{ backgroundColor: INK, color: CREAM, fontFamily: 'Inter, sans-serif' }}
            >
              Browse Shop
            </button>
          </motion.div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.9fr)] lg:items-start lg:gap-6">
            <div
              className="rounded-2xl border px-4 sm:px-6"
              style={{
                borderColor: LINE,
                backgroundColor: SURFACE,
                boxShadow: '0 14px 36px -28px rgba(10,46,34,0.35)',
              }}
            >
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <CartLineRow key={`${item.productId}-${item.variantId}`} item={item} />
                ))}
              </AnimatePresence>
            </div>

            <aside
              className="rounded-2xl border p-5 sm:p-6 lg:sticky lg:top-24"
              style={{
                borderColor: LINE,
                backgroundColor: SURFACE,
                boxShadow: '0 14px 36px -28px rgba(10,46,34,0.35)',
              }}
            >
              <h2
                className="m-0 text-[1.2rem] font-bold"
                style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
              >
                Order Summary
              </h2>

              <dl className="mt-5 space-y-3.5">
                <div className="flex justify-between gap-3 text-[0.92rem]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <dt style={{ color: MUTED }}>Subtotal ({itemCount})</dt>
                  <dd className="m-0 font-semibold" style={{ color: INK }}>
                    ₹{subtotal}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 text-[0.92rem]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <dt style={{ color: MUTED }}>Delivery Fee</dt>
                  <dd className="m-0 font-semibold" style={{ color: INK }}>
                    ₹{delivery}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex justify-between gap-3 border-t pt-4" style={{ borderColor: LINE }}>
                <span className="text-[0.95rem] font-semibold" style={{ color: INK, fontFamily: 'Inter, sans-serif' }}>
                  Total
                </span>
                <span className="text-[1.2rem] font-bold" style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}>
                  ₹{total}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigateApp(APP_ROUTES.checkout)}
                className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-0 py-3.5 text-[0.9rem] font-semibold transition hover:brightness-110"
                style={{ backgroundColor: INK, color: CREAM, fontFamily: 'Inter, sans-serif' }}
              >
                Go to Checkout
                <span aria-hidden>→</span>
              </button>
            </aside>
          </div>
        )}

        <SuggestedForYou />
      </main>
    </CheckoutFlowShell>
  )
}
