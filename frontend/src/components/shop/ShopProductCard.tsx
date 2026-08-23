import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { loadProductImages } from '../../lib/productImageCache'
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
const CARD = '#ffffff'
const MUTED = 'rgba(10,46,34,0.58)'
const OUTER_BORDER = `2.5px solid ${GOLD}`
const INNER_BORDER = '1px solid rgba(184,134,11,0.28)'
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5 text-[0.72rem]" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? GOLD : 'rgba(10,46,34,0.16)' }}>
          ★
        </span>
      ))}
    </span>
  )
}

function formatRupee(amount: number) {
  return `₹${amount.toFixed(2)}`
}

type ShopProductCardProps = {
  product: ShopProduct
  revealIndex?: number
  promoLabel?: string
  onOpenDetail?: () => void
}

function stop(e: MouseEvent) {
  e.stopPropagation()
}

export default function ShopProductCard({
  product,
  revealIndex = 0,
  promoLabel,
  onOpenDetail,
}: ShopProductCardProps) {
  const images = useMemo(() => getProductImages(product), [product])
  const variants = useMemo(() => normalizeProductVariants(product.variants), [product.variants])
  const imageHostRef = useRef<HTMLDivElement>(null)
  const [lazyImages, setLazyImages] = useState<string[]>(() =>
    images.length ? images : [],
  )
  const [imageIndex] = useState(0)
  const { user } = useAuth()
  const { isWishlisted, toggle } = useWishlist()
  const liked = isWishlisted(product.id)
  const [wishBusy, setWishBusy] = useState(false)
  const [imageHovered, setImageHovered] = useState(false)
  const { addItem, clearCart, getQty, setQty } = useCart()

  const [variantId, setVariantId] = useState(variants[0]?.id ?? '100g')

  useEffect(() => {
    setVariantId(variants[0]?.id ?? '100g')
  }, [product.id, variants])

  useEffect(() => {
    if (images.length) {
      setLazyImages(images)
      return
    }
    if (!product.hasStoredImage && !product.image) return

    const host = imageHostRef.current
    if (!host) return

    let cancelled = false
    const loadImages = () => {
      void loadProductImages(product.id)
        .then((data) => {
          if (cancelled) return
          const next = (data.images?.length ? data.images : data.image ? [data.image] : []).filter(Boolean)
          if (next.length) setLazyImages(next)
        })
        .catch(() => {
          /* keep empty panel */
        })
    }

    if (typeof IntersectionObserver === 'undefined') {
      loadImages()
      return () => {
        cancelled = true
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()
        loadImages()
      },
      { rootMargin: '240px' },
    )
    observer.observe(host)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [images, product.hasStoredImage, product.id, product.image])

  const activeImage =
    lazyImages[Math.min(imageIndex, Math.max(0, lazyImages.length - 1))] ?? product.image
  const panelFill = getProductPanelFill(product)
  const cartQty = getQty(product.id, variantId)
  const sellPrice = getSellPrice(product)
  const comparePrice = getComparePrice(product)
  const outOfStock = Boolean(product.outOfStock)

  const requireAuth = () => {
    if (user) return true
    navigateApp(APP_ROUTES.login)
    return false
  }

  const addToCart = (e: MouseEvent) => {
    stop(e)
    if (outOfStock) return
    if (!requireAuth()) return
    setQty(product.id, variantId, 1)
  }

  const changeQty = (e: MouseEvent, delta: number) => {
    stop(e)
    if (outOfStock) return
    if (!requireAuth()) return
    setQty(product.id, variantId, cartQty + delta)
  }

  const payNow = (e: MouseEvent) => {
    stop(e)
    if (outOfStock) return
    if (!requireAuth()) return
    clearCart()
    addItem(product.id, variantId, 1)
    navigateApp(APP_ROUTES.checkout)
  }

  const toggleWishlist = async (e: MouseEvent) => {
    stop(e)
    if (!requireAuth()) return
    if (wishBusy) return
    setWishBusy(true)
    try {
      await toggle(product.id)
    } finally {
      setWishBusy(false)
    }
  }

  const selectVariant = (e: MouseEvent, id: string) => {
    stop(e)
    setVariantId(id)
  }

  return (
    <motion.article
      layout
      role={onOpenDetail ? 'button' : undefined}
      tabIndex={onOpenDetail ? 0 : undefined}
      onClick={onOpenDetail}
      onKeyDown={
        onOpenDetail
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onOpenDetail()
              }
            }
          : undefined
      }
      className={`shop-product-card group relative overflow-hidden rounded-[1.55rem] p-[6px] transition ${
        onOpenDetail
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_28px_48px_-24px_rgba(10,46,34,0.35)]'
          : ''
      }`}
      style={{
        backgroundColor: CARD,
        border: OUTER_BORDER,
        boxShadow: '0 20px 44px -28px rgba(10,46,34,0.22)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.48,
        ease: REVEAL_EASE,
        delay: Math.min(revealIndex * 0.07, 0.42),
      }}
    >
      {/* Inner gold ring — double boundary with white gap */}
      <div
        className="flex h-full flex-col overflow-hidden rounded-[1.28rem] p-[5px]"
        style={{
          backgroundColor: CARD,
          border: INNER_BORDER,
        }}
      >
        <div className="flex h-full flex-col rounded-[1.05rem] p-3 sm:p-3.5">
        <div
          ref={imageHostRef}
          className="relative aspect-[4/5] max-h-[190px] overflow-hidden rounded-xl border sm:max-h-[210px]"
          style={{
            backgroundColor: panelFill,
            borderColor: 'rgba(184,134,11,0.22)',
          }}
          onMouseEnter={() => setImageHovered(true)}
          onMouseLeave={() => setImageHovered(false)}
        >
          {activeImage ? (
          <motion.img
            src={activeImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="relative z-[1] h-full w-full object-contain object-center px-2 pt-2"
            draggable={false}
            animate={{
              scale: imageHovered && !outOfStock ? 1.05 : 1,
              opacity: outOfStock ? 0.45 : 1,
            }}
            transition={{ duration: 0.38, ease: REVEAL_EASE }}
          />
          ) : (
            <div
              className="absolute inset-0 animate-pulse"
              style={{ backgroundColor: 'rgba(10,46,34,0.06)' }}
              aria-hidden
            />
          )}

          {outOfStock && (
            <span
              className="absolute top-2 left-2 z-10 rounded-full px-2.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide"
              style={{ backgroundColor: 'rgba(163,32,32,0.92)', color: CREAM }}
            >
              Out of stock
            </span>
          )}

          {promoLabel && !outOfStock && (
            <span
              className="absolute top-2 left-2 z-10 rounded-full px-2.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide"
              style={{ backgroundColor: GOLD, color: INK }}
            >
              {promoLabel}
            </span>
          )}

          <button
            type="button"
            onClick={(e) => void toggleWishlist(e)}
            disabled={wishBusy}
            className="absolute top-2 right-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border transition hover:scale-105 disabled:opacity-70"
            style={{
              backgroundColor: liked ? GOLD : 'rgba(255,255,255,0.92)',
              color: INK,
              borderColor: 'rgba(184,134,11,0.35)',
            }}
            aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={liked}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <p
          className="mt-3 mb-0 text-center text-[0.72rem] tracking-[0.08em]"
          style={{ color: MUTED, fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          {product.brand || 'Tasneem Mukhwas'}
        </p>

        <h3
          className="mt-1.5 m-0 line-clamp-2 text-center text-[0.98rem] font-semibold leading-snug tracking-[0.01em] sm:text-[1.05rem]"
          style={{ color: INK, fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          {product.name}
        </h3>

        <div className="mt-2 flex justify-center">
          <span
            className="inline-flex rounded-full border px-2.5 py-0.5 text-[0.55rem] font-semibold tracking-[0.12em] uppercase"
            style={{
              color: INK,
              borderColor: 'rgba(184,134,11,0.55)',
              backgroundColor: 'rgba(184,134,11,0.12)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {product.category}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="text-[0.65rem]" style={{ color: MUTED }}>
            ({product.reviews})
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-center gap-2">
          <span className="text-[1.05rem] font-bold" style={{ color: INK, fontFamily: 'Inter, sans-serif' }}>
            {formatRupee(sellPrice)}
          </span>
          {comparePrice != null && comparePrice > sellPrice && (
            <span className="text-[0.78rem] line-through" style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}>
              {formatRupee(comparePrice)}
            </span>
          )}
        </div>

        {variants.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-1.5" onClick={stop}>
            {variants.map((variant) => {
              const selected = variant.id === variantId
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={(e) => selectVariant(e, variant.id)}
                  className="cursor-pointer rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold tracking-wide uppercase transition"
                  style={{
                    borderColor: selected ? GOLD : 'rgba(184,134,11,0.45)',
                    backgroundColor: selected ? 'rgba(184,134,11,0.18)' : 'transparent',
                    color: selected ? INK : MUTED,
                    fontFamily: 'Inter, sans-serif',
                  }}
                  aria-pressed={selected}
                >
                  {variant.label}
                </button>
              )
            })}
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2">
          {outOfStock ? (
            <button
              type="button"
              disabled
              onClick={stop}
              className="col-span-2 cursor-not-allowed rounded-full border-0 py-2.5 text-[0.62rem] font-semibold tracking-[0.08em] uppercase opacity-70"
              style={{ backgroundColor: 'rgba(10,46,34,0.1)', color: INK, fontFamily: 'Inter, sans-serif' }}
            >
              Out of stock
            </button>
          ) : (
            <>
              {cartQty > 0 ? (
                <div
                  className="flex items-center justify-between rounded-full border px-2 py-1.5"
                  style={{ borderColor: 'rgba(184,134,11,0.55)', backgroundColor: 'rgba(184,134,11,0.08)' }}
                  onClick={stop}
                >
                  <button
                    type="button"
                    onClick={(e) => changeQty(e, -1)}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-0 text-[1rem] leading-none"
                    style={{ color: INK }}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span
                    className="min-w-[1.25rem] text-center text-[0.78rem] font-bold tabular-nums"
                    style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                    aria-live="polite"
                  >
                    {cartQty}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => changeQty(e, 1)}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-0 text-[1rem] leading-none"
                    style={{ color: INK }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={addToCart}
                  className="cursor-pointer rounded-full border-0 py-2.5 text-[0.62rem] font-semibold tracking-[0.08em] uppercase transition hover:brightness-105 sm:text-[0.65rem]"
                  style={{
                    background: `linear-gradient(180deg, #d4b56a 0%, ${GOLD} 55%, #9a6f08 100%)`,
                    color: INK,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Add to Cart
                </button>
              )}
              <button
                type="button"
                onClick={payNow}
                className="cursor-pointer rounded-full border py-2.5 text-[0.62rem] font-semibold tracking-[0.08em] uppercase transition hover:brightness-110 sm:text-[0.65rem]"
                style={{
                  borderColor: GOLD,
                  color: GOLD,
                  backgroundColor: INK,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Pay Now
              </button>
            </>
          )}
        </div>
        </div>
      </div>
    </motion.article>
  )
}
