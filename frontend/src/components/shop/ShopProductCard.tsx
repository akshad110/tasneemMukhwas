import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import {
  getComparePrice,
  getProductImages,
  getSellPrice,
  type ShopProduct,
} from '../../lib/shopCatalog'

const INK = '#0a2e22'
const CREAM = '#f3e6c8'
const GOLD = '#b8860b'
const CARD_BG = '#fffcf7'
const CARD_PANEL = '#f3ebe0'
const MUTED = 'rgba(10,46,34,0.58)'
const BORDER = 'rgba(10,46,34,0.1)'

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'text-[0.85rem]' : 'text-[0.72rem]'
  return (
    <span className={`inline-flex gap-0.5 ${cls}`} aria-label={`${rating} out of 5 stars`}>
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
}

/** Light commerce card — image, wishlist, gallery, price, qty. */
export default function ShopProductCard({ product }: ShopProductCardProps) {
  const images = useMemo(() => getProductImages(product), [product])
  const [imageIndex, setImageIndex] = useState(0)
  const { user } = useAuth()
  const { isWishlisted, toggle } = useWishlist()
  const liked = isWishlisted(product.id)
  const [wishBusy, setWishBusy] = useState(false)
  const { getQty, setQty, addItem } = useCart()

  const activeImage = images[Math.min(imageIndex, Math.max(0, images.length - 1))] ?? product.image
  const variantId = product.variants[0]?.id ?? 'default'
  const qty = getQty(product.id, variantId)
  const inCart = qty > 0
  const sellPrice = getSellPrice(product)
  const comparePrice = getComparePrice(product)
  const total = sellPrice * qty
  const outOfStock = Boolean(product.outOfStock)

  const addToCart = () => {
    if (outOfStock) return
    addItem(product.id, variantId, 1)
  }
  const dec = () => setQty(product.id, variantId, qty - 1)
  const inc = () => {
    if (outOfStock) return
    setQty(product.id, variantId, qty + 1)
  }

  const toggleWishlist = async () => {
    if (!user) {
      navigateApp(APP_ROUTES.login)
      return
    }
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
      className="flex flex-col overflow-hidden rounded-2xl border p-4"
      style={{
        backgroundColor: CARD_BG,
        borderColor: BORDER,
        boxShadow: '0 18px 40px -28px rgba(10,46,34,0.35)',
      }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl"
        style={{ backgroundColor: CARD_PANEL }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={activeImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="relative z-[1] h-[78%] w-auto max-w-[85%] object-contain drop-shadow-[0_14px_22px_rgba(10,46,34,0.18)]"
            draggable={false}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: outOfStock ? 0.45 : 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>

        {outOfStock && (
          <span
            className="absolute top-2.5 left-2.5 z-10 rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wide"
            style={{ backgroundColor: 'rgba(163,32,32,0.92)', color: CREAM }}
          >
            Out of stock
          </span>
        )}

        <button
          type="button"
          onClick={() => void toggleWishlist()}
          disabled={wishBusy}
          className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 transition hover:scale-105 disabled:opacity-70"
          style={{
            backgroundColor: liked ? GOLD : 'rgba(255,255,255,0.85)',
            color: liked ? INK : INK,
            boxShadow: '0 4px 12px -6px rgba(10,46,34,0.35)',
          }}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={liked}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((src, i) => {
            const selected = i === imageIndex
            return (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setImageIndex(i)}
                className="h-10 w-10 cursor-pointer overflow-hidden rounded-lg border-2 p-0.5 transition"
                style={{
                  borderColor: selected ? GOLD : 'rgba(10,46,34,0.12)',
                  backgroundColor: CARD_PANEL,
                }}
                aria-label={`Image ${i + 1}`}
                aria-pressed={selected}
              >
                <span className="flex h-full w-full items-center justify-center rounded-md">
                  <img src={src} alt="" className="h-7 w-auto object-contain" draggable={false} loading="lazy" decoding="async" />
                </span>
              </button>
            )
          })}
        </div>
      )}

      <h3
        className="mt-3 m-0 text-[1.05rem] font-semibold tracking-tight"
        style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
      >
        {product.name}
      </h3>

      <span
        className="mt-1.5 inline-flex w-fit rounded-full border px-2.5 py-0.5 text-[0.62rem] font-semibold tracking-[0.12em] uppercase"
        style={{
          color: GOLD,
          borderColor: 'rgba(184,134,11,0.45)',
          backgroundColor: 'rgba(184,134,11,0.1)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {product.category}
      </span>

      <div className="mt-2 flex items-center gap-2">
        <Stars rating={product.rating} />
        <span className="text-[0.72rem]" style={{ color: MUTED }}>
          ({product.reviews})
        </span>
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span
          className="text-[1.2rem] font-bold"
          style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
        >
          ₹{sellPrice}
        </span>
        {comparePrice != null && comparePrice > sellPrice && (
          <span
            className="text-[0.85rem] line-through"
            style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
          >
            ₹{comparePrice}
          </span>
        )}
      </div>

      <div className="mt-4 flex min-h-[40px] items-center justify-between gap-3">
        {outOfStock ? (
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg border-0 py-2.5 text-[0.75rem] font-semibold tracking-wide uppercase opacity-70"
            style={{
              backgroundColor: 'rgba(10,46,34,0.12)',
              color: INK,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Out of stock
          </button>
        ) : !inCart ? (
          <button
            type="button"
            onClick={addToCart}
            className="w-full cursor-pointer rounded-lg border-0 py-2.5 text-[0.75rem] font-semibold tracking-wide uppercase transition hover:brightness-110"
            style={{
              backgroundColor: INK,
              color: CREAM,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Add to Cart
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={dec}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 text-lg font-semibold transition hover:brightness-110"
                style={{ backgroundColor: INK, color: CREAM }}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span
                className="min-w-[1.5rem] text-center text-[0.95rem] font-semibold"
                style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={inc}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 text-lg font-semibold transition hover:brightness-110"
                style={{ backgroundColor: INK, color: CREAM }}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <button
                type="button"
                onClick={() => navigateApp(APP_ROUTES.cart)}
                className="cursor-pointer border-0 bg-transparent p-0 text-[0.7rem] font-semibold tracking-wide uppercase underline-offset-2 transition hover:underline"
                style={{
                  color: INK,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                View Cart
              </button>
              <p
                className="m-0 text-[0.95rem] font-bold tracking-tight"
                style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
              >
                <span className="mr-1 text-[0.72rem] font-semibold tracking-wide uppercase opacity-80">
                  Total :
                </span>
                ₹{total}
              </p>
            </div>
          </>
        )}
      </div>
    </motion.article>
  )
}
