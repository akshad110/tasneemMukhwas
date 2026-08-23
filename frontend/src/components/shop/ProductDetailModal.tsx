import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { productsApi } from '../../lib/services'
import {
  getComparePrice,
  getProductImages,
  getProductPanelFill,
  getSellPrice,
  normalizeProductVariants,
  type ShopProduct,
} from '../../lib/shopCatalog'

const INK = '#0a2e22'
const CREAM = '#f2f4f5'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.62)'
const BORDER = 'rgba(10,46,34,0.12)'

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5 text-[0.9rem]" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? GOLD : 'rgba(10,46,34,0.18)' }}>
          ★
        </span>
      ))}
    </span>
  )
}

type ProductDetailModalProps = {
  product: ShopProduct | null
  promoLabel?: string
  onClose: () => void
}

export default function ProductDetailModal({ product, promoLabel, onClose }: ProductDetailModalProps) {
  const [detail, setDetail] = useState<ShopProduct | null>(product)
  const activeProduct = detail ?? product
  const images = useMemo(() => (activeProduct ? getProductImages(activeProduct) : []), [activeProduct])
  const variants = useMemo(
    () => (activeProduct ? normalizeProductVariants(activeProduct.variants) : []),
    [activeProduct],
  )
  const [imageIndex, setImageIndex] = useState(0)
  const { user } = useAuth()
  const { addItem, clearCart, getQty, setQty } = useCart()
  const { isWishlisted, toggle } = useWishlist()
  const [wishBusy, setWishBusy] = useState(false)
  const [variantId, setVariantId] = useState('100g')

  useEffect(() => {
    if (!product) {
      setDetail(null)
      return
    }
    setDetail(product)
    let cancelled = false
    void productsApi
      .get(product.id)
      .then((full) => {
        if (!cancelled) setDetail(full)
      })
      .catch(() => {
        /* keep summary product */
      })
    return () => {
      cancelled = true
    }
  }, [product])

  useEffect(() => {
    if (!activeProduct) return
    setImageIndex(0)
    setVariantId(variants[0]?.id ?? '100g')
  }, [activeProduct, variants])

  useEffect(() => {
    if (!product) {
      document.body.style.removeProperty('overflow')
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.removeProperty('overflow')
      window.removeEventListener('keydown', onKey)
    }
  }, [product, onClose])

  const variantIdResolved = variants.some((v) => v.id === variantId)
    ? variantId
    : (variants[0]?.id ?? '100g')
  const cartQty = activeProduct ? getQty(activeProduct.id, variantIdResolved) : 0
  const sellPrice = activeProduct ? getSellPrice(activeProduct) : 0
  const comparePrice = activeProduct ? getComparePrice(activeProduct) : undefined
  const displayQty = cartQty > 0 ? cartQty : 1
  const total = sellPrice * displayQty
  const outOfStock = Boolean(activeProduct?.outOfStock)
  const liked = activeProduct ? isWishlisted(activeProduct.id) : false
  const activeImage =
    activeProduct &&
    (images[Math.min(imageIndex, Math.max(0, images.length - 1))] ?? activeProduct.image)
  const panelFill = activeProduct ? getProductPanelFill(activeProduct) : CREAM

  const requireAuth = () => {
    if (user) return true
    navigateApp(APP_ROUTES.login)
    return false
  }

  const handleAddToCart = () => {
    if (!activeProduct || outOfStock) return
    if (!requireAuth()) return
    setQty(activeProduct.id, variantIdResolved, 1)
  }

  const changeQty = (delta: number) => {
    if (!activeProduct || outOfStock) return
    if (!requireAuth()) return
    setQty(activeProduct.id, variantIdResolved, cartQty + delta)
  }

  const handlePayNow = () => {
    if (!activeProduct || outOfStock) return
    if (!requireAuth()) return
    clearCart()
    addItem(activeProduct.id, variantIdResolved, displayQty)
    onClose()
    navigateApp(APP_ROUTES.checkout)
  }

  const toggleWishlist = async () => {
    if (!activeProduct || !requireAuth()) return
    if (wishBusy) return
    setWishBusy(true)
    try {
      await toggle(activeProduct.id)
    } finally {
      setWishBusy(false)
    }
  }

  return (
    <AnimatePresence>
      {product && activeProduct && activeImage && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
        >
          <motion.button
            type="button"
            className="absolute inset-0 cursor-pointer border-0 bg-[rgba(6,14,11,0.62)] backdrop-blur-[6px]"
            aria-label="Close product details"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative z-[1] flex max-h-[94svh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[1.75rem] border shadow-[0_40px_90px_-30px_rgba(10,46,34,0.55)] sm:max-h-[88svh] sm:rounded-[1.75rem]"
            style={{ borderColor: BORDER, backgroundColor: CREAM }}
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3.5 right-3.5 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 shadow-md transition hover:scale-105"
              style={{ backgroundColor: 'rgba(10,46,34,0.88)', color: CREAM }}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </button>

            <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-[1.05fr_0.95fr] md:overflow-hidden">
              <div
                className="relative flex flex-col p-5 pb-4 sm:p-6 md:overflow-y-auto"
                style={{ backgroundColor: panelFill }}
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt={activeProduct.name}
                    className="h-full w-full object-contain object-center"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: outOfStock ? 0.5 : 1, scale: 1 }}
                    transition={{ duration: 0.28 }}
                  />
                  {promoLabel && !outOfStock && (
                    <span
                      className="absolute top-3 left-3 rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-wide uppercase"
                      style={{ backgroundColor: GOLD, color: INK }}
                    >
                      {promoLabel}
                    </span>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="mt-4 flex gap-2.5 overflow-x-auto pb-1">
                    {images.map((src, i) => (
                      <button
                        key={`${src}-${i}`}
                        type="button"
                        onClick={() => setImageIndex(i)}
                        className="h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 p-0 transition"
                        style={{
                          borderColor: i === imageIndex ? GOLD : 'rgba(10,46,34,0.12)',
                          backgroundColor: panelFill,
                        }}
                        aria-label={`View image ${i + 1}`}
                        aria-pressed={i === imageIndex}
                      >
                        <img src={src} alt="" className="h-full w-full object-contain object-center" draggable={false} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col p-5 sm:p-6 md:overflow-y-auto">
                <span
                  className="inline-flex w-fit rounded-full px-3 py-1 text-[0.62rem] font-semibold tracking-[0.14em] uppercase"
                  style={{
                    color: GOLD,
                    border: '1px solid rgba(184,134,11,0.35)',
                    backgroundColor: 'rgba(184,134,11,0.1)',
                  }}
                >
                  {activeProduct.category}
                </span>

                <h2
                  id="product-detail-title"
                  className="mt-3 m-0 text-[clamp(1.35rem,3vw,1.85rem)] font-bold leading-tight tracking-tight"
                  style={{ color: INK, fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  {activeProduct.name}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Stars rating={activeProduct.rating} />
                  <span className="text-[0.82rem]" style={{ color: MUTED }}>
                    ({activeProduct.reviews} reviews)
                  </span>
                  <button
                    type="button"
                    onClick={() => void toggleWishlist()}
                    disabled={wishBusy}
                    className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-[0.72rem] font-semibold transition hover:bg-white/60 disabled:opacity-60"
                    style={{ borderColor: BORDER, color: INK }}
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
                    </svg>
                    {liked ? 'Saved' : 'Wishlist'}
                  </button>
                </div>

                <div className="mt-4 flex items-baseline gap-2.5">
                  <span className="text-[1.65rem] font-bold" style={{ color: INK }}>
                    ₹{sellPrice.toFixed(2)}
                  </span>
                  {comparePrice != null && comparePrice > sellPrice && (
                    <span className="text-[1rem] line-through" style={{ color: GOLD }}>
                      ₹{comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {variants.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {variants.map((variant) => {
                      const selected = variant.id === variantIdResolved
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setVariantId(variant.id)}
                          className="cursor-pointer rounded-full border px-3 py-1.5 text-[0.72rem] font-semibold tracking-wide uppercase transition"
                          style={{
                            borderColor: selected ? GOLD : 'rgba(184,134,11,0.45)',
                            backgroundColor: selected ? 'rgba(184,134,11,0.16)' : 'transparent',
                            color: selected ? INK : MUTED,
                          }}
                          aria-pressed={selected}
                        >
                          {variant.label}
                        </button>
                      )
                    })}
                  </div>
                )}

                <p
                  className="mt-4 m-0 text-[0.88rem] leading-relaxed"
                  style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
                >
                  {activeProduct.description}
                </p>

                <div
                  className="mt-6 flex items-center justify-between rounded-xl border px-4 py-3"
                  style={{ borderColor: BORDER, backgroundColor: 'rgba(255,255,255,0.65)' }}
                >
                  <span
                    className="text-[0.72rem] font-semibold tracking-[0.14em] uppercase"
                    style={{ color: MUTED }}
                  >
                    Total
                  </span>
                  <span className="text-[1.25rem] font-bold" style={{ color: INK }}>
                    ₹{total}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {outOfStock ? (
                    <button
                      type="button"
                      disabled
                      className="col-span-full cursor-not-allowed rounded-xl border-0 py-3.5 text-[0.78rem] font-bold tracking-[0.1em] uppercase opacity-70 sm:col-span-2"
                      style={{ backgroundColor: 'rgba(10,46,34,0.12)', color: INK }}
                    >
                      Out of stock
                    </button>
                  ) : (
                    <>
                      {cartQty > 0 ? (
                        <div
                          className="flex items-center justify-between rounded-xl border px-3 py-2"
                          style={{ borderColor: INK, backgroundColor: 'rgba(255,255,255,0.88)' }}
                        >
                          <button
                            type="button"
                            onClick={() => changeQty(-1)}
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-0 text-[1.15rem] leading-none transition hover:bg-[rgba(10,46,34,0.06)]"
                            style={{ color: INK }}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span
                            className="min-w-[2rem] text-center text-[1.05rem] font-bold tabular-nums"
                            style={{ color: INK }}
                            aria-live="polite"
                          >
                            {cartQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => changeQty(1)}
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-0 text-[1.15rem] leading-none transition hover:bg-[rgba(10,46,34,0.06)]"
                            style={{ color: INK }}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleAddToCart}
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border py-3.5 text-[0.78rem] font-bold tracking-[0.1em] uppercase transition hover:bg-white"
                          style={{ borderColor: INK, color: INK, backgroundColor: 'transparent' }}
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M6 6h15l-1.5 9h-12z" />
                            <path d="M6 6 5 3H2" />
                          </svg>
                          Add to Cart
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handlePayNow}
                        className="cursor-pointer rounded-xl border-0 py-3.5 text-[0.78rem] font-bold tracking-[0.1em] uppercase transition hover:brightness-110"
                        style={{ backgroundColor: INK, color: CREAM }}
                      >
                        Pay Now
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
