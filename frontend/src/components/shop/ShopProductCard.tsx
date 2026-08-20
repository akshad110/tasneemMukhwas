import { motion } from 'framer-motion'
import { useMemo, useState, type MouseEvent } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import {
  getComparePrice,
  getProductImages,
  getProductPanelFill,
  getSellPrice,
  type ShopProduct,
} from '../../lib/shopCatalog'

const INK = '#0a2e22'
const CREAM = '#f2f4f5'
const GOLD = '#b8860b'
const CARD_BG = '#f8f9fa'
const MUTED = 'rgba(10,46,34,0.58)'
const BORDER = 'rgba(10,46,34,0.1)'
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5 text-[0.62rem]" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? GOLD : 'rgba(10,46,34,0.18)' }}>
          ★
        </span>
      ))}
    </span>
  )
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
  const [imageIndex] = useState(0)
  const { user } = useAuth()
  const { isWishlisted, toggle } = useWishlist()
  const liked = isWishlisted(product.id)
  const [wishBusy, setWishBusy] = useState(false)
  const [imageHovered, setImageHovered] = useState(false)
  const { addItem, clearCart, getQty, setQty } = useCart()

  const activeImage = images[Math.min(imageIndex, Math.max(0, images.length - 1))] ?? product.image
  const panelFill = getProductPanelFill(product)
  const variantId = product.variants[0]?.id ?? 'default'
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
      className={`flex flex-col overflow-hidden rounded-xl border p-2.5 sm:p-3 transition ${
        onOpenDetail
          ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-28px_rgba(10,46,34,0.45)]'
          : ''
      }`}
      style={{
        backgroundColor: CARD_BG,
        borderColor: BORDER,
        boxShadow: '0 18px 40px -28px rgba(10,46,34,0.35)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.48,
        ease: REVEAL_EASE,
        delay: Math.min(revealIndex * 0.07, 0.42),
      }}
    >
      <div
        className="relative aspect-[3/4] max-h-[168px] overflow-hidden rounded-lg sm:max-h-[180px]"
        style={{ backgroundColor: panelFill }}
        onMouseEnter={() => setImageHovered(true)}
        onMouseLeave={() => setImageHovered(false)}
      >
        <motion.img
          src={activeImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="relative z-[1] h-full w-full object-contain object-center"
          draggable={false}
          animate={{
            scale: imageHovered && !outOfStock ? 1.06 : 1,
            opacity: outOfStock ? 0.45 : 1,
          }}
          transition={{ duration: 0.38, ease: REVEAL_EASE }}
        />

        {outOfStock && (
          <span
            className="absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide"
            style={{ backgroundColor: 'rgba(163,32,32,0.92)', color: CREAM }}
          >
            Out of stock
          </span>
        )}

        {promoLabel && !outOfStock && (
          <span
            className="absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide"
            style={{ backgroundColor: GOLD, color: INK }}
          >
            {promoLabel}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => void toggleWishlist(e)}
          disabled={wishBusy}
          className="absolute top-2 right-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-0 transition hover:scale-105 disabled:opacity-70"
          style={{
            backgroundColor: liked ? GOLD : 'rgba(255,255,255,0.85)',
            color: INK,
            boxShadow: '0 4px 12px -6px rgba(10,46,34,0.35)',
          }}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={liked}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <h3
        className="mt-2 m-0 line-clamp-2 text-[0.88rem] font-semibold leading-snug tracking-tight sm:text-[0.92rem]"
        style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
      >
        {product.name}
      </h3>

      <span
        className="mt-1 inline-flex w-fit rounded-full border px-2 py-0.5 text-[0.55rem] font-semibold tracking-[0.1em] uppercase"
        style={{
          color: GOLD,
          borderColor: 'rgba(184,134,11,0.45)',
          backgroundColor: 'rgba(184,134,11,0.1)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {product.category}
      </span>

      <div className="mt-1.5 flex items-center gap-1.5">
        <Stars rating={product.rating} />
        <span className="text-[0.65rem]" style={{ color: MUTED }}>
          ({product.reviews})
        </span>
      </div>

      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="text-[1rem] font-bold sm:text-[1.05rem]" style={{ color: INK, fontFamily: 'Inter, sans-serif' }}>
          ₹{sellPrice}
        </span>
        {comparePrice != null && comparePrice > sellPrice && (
          <span className="text-[0.75rem] line-through" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
            ₹{comparePrice}
          </span>
        )}
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-1.5">
        {outOfStock ? (
          <button
            type="button"
            disabled
            onClick={stop}
            className="col-span-2 cursor-not-allowed rounded-md border-0 py-2 text-[0.62rem] font-semibold tracking-wide uppercase opacity-70"
            style={{ backgroundColor: 'rgba(10,46,34,0.12)', color: INK, fontFamily: 'Inter, sans-serif' }}
          >
            Out of stock
          </button>
        ) : (
          <>
            {cartQty > 0 ? (
              <div
                className="flex items-center justify-between rounded-md border px-2 py-1.5"
                style={{ borderColor: INK, backgroundColor: 'rgba(255,255,255,0.88)' }}
                onClick={stop}
              >
                <button
                  type="button"
                  onClick={(e) => changeQty(e, -1)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 text-[1rem] leading-none transition hover:bg-[rgba(10,46,34,0.06)]"
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
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 text-[1rem] leading-none transition hover:bg-[rgba(10,46,34,0.06)]"
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
                className="cursor-pointer rounded-md border py-2 text-[0.62rem] font-semibold tracking-wide uppercase transition hover:bg-white sm:text-[0.65rem]"
                style={{
                  borderColor: INK,
                  color: INK,
                  backgroundColor: 'transparent',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Add to Cart
              </button>
            )}
            <button
              type="button"
              onClick={payNow}
              className="cursor-pointer rounded-md border-0 py-2 text-[0.62rem] font-semibold tracking-wide uppercase transition hover:brightness-110 sm:text-[0.65rem]"
              style={{
                backgroundColor: INK,
                color: CREAM,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Pay Now
            </button>
          </>
        )}
      </div>
    </motion.article>
  )
}
