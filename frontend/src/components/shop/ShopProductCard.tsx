import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import {
  getCachedProductImages,
  loadProductImages,
  productNeedsImageFetch,
  subscribeProductImages,
  whenImagesPrefetchDone,
} from '../../lib/productImageCache'
import {
  getComparePrice,
  getProductCardTeaser,
  getProductImages,
  getProductPackFormat,
  getSellPrice,
  getVariantsForPackType,
  type ShopProduct,
} from '../../lib/shopCatalog'
import ProductImageCarousel from './ProductImageCarousel'
import {
  BRAND_CREAM,
  BRAND_CREAM_DEEP,
  BRAND_CREAM_LIGHT,
  BRAND_GOLD,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
} from '../../lib/brand'

const INK = BRAND_INK
const CREAM = BRAND_CREAM_LIGHT
const GOLD = BRAND_GOLD
const CARD = BRAND_CREAM_LIGHT
const IMAGE_BG = BRAND_CREAM
const MUTED = BRAND_MUTED
const BTN_GOLD_GRADIENT = `linear-gradient(180deg, #d4b56a 0%, ${GOLD} 55%, #9a6f08 100%)`
const BTN_TEXT = '#ffffff'
const OUTER_BORDER = '2px solid rgba(184,134,11,0.42)'
const INNER_BORDER = '1px solid rgba(184,134,11,0.26)'
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const
function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5 text-[0.62rem] min-[480px]:text-[0.72rem]" aria-label={`${rating} out of 5 stars`}>
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
  const packType = useMemo(() => getProductPackFormat(product), [product])
  const variants = useMemo(
    () => getVariantsForPackType(product, packType),
    [product, packType],
  )
  const imageHostRef = useRef<HTMLDivElement>(null)
  const [lazyImages, setLazyImages] = useState<string[]>(() => {
    const cached = getCachedProductImages(product.id)
    if (cached.length) return cached
    return getProductImages(product)
  })
  const { user } = useAuth()
  const { isWishlisted, toggle } = useWishlist()
  const liked = isWishlisted(product.id)
  const [wishBusy, setWishBusy] = useState(false)
  const [imageHovered, setImageHovered] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const { addItem, clearCart, getQty, setQty } = useCart()

  const [variantId, setVariantId] = useState(variants[0]?.id ?? `${packType}-100g`)

  useEffect(() => {
    setVariantId(variants[0]?.id ?? `${packType}-100g`)
  }, [product.id, packType, variants])

  useEffect(() => {
    setCarouselIndex(0)
  }, [product.id, lazyImages.join('|')])

  useEffect(() => {
    const applyImages = () => {
      const cached = getCachedProductImages(product.id)
      if (cached.length) {
        setLazyImages(cached)
        return true
      }
      const fromProduct = getProductImages(product)
      if (fromProduct.length) {
        setLazyImages(fromProduct)
        return true
      }
      return false
    }

    if (applyImages()) return

    const unsub = subscribeProductImages((id) => {
      if (id === product.id) applyImages()
    })

    let cancelled = false
    void whenImagesPrefetchDone().then(() => {
      if (cancelled || applyImages()) return
      if (!productNeedsImageFetch(product)) return
      return loadProductImages(product.id)
        .then((data) => {
          if (cancelled) return
          const next = (data.images?.length ? data.images : data.image ? [data.image] : []).filter(
            Boolean,
          )
          if (next.length) setLazyImages(next)
        })
        .catch(() => {
          /* prefetch + retry handle transient 503 */
        })
    })

    return () => {
      cancelled = true
      unsub()
    }
  }, [product])

  const cartQty = getQty(product.id, variantId)
  const sellPrice = getSellPrice(product, packType)
  const comparePrice = getComparePrice(product, packType)
  const outOfStock = Boolean(product.outOfStock)
  const cardTeaser = getProductCardTeaser(product, packType)
  const showSeeMore = Boolean(onOpenDetail)
  const hasGallery = lazyImages.length > 1

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

  const openDetail = (e: MouseEvent) => {
    stop(e)
    onOpenDetail?.()
  }

  const handleCardClick = (e: MouseEvent<HTMLElement>) => {
    if (!onOpenDetail) return
    if ((e.target as HTMLElement).closest('[data-card-action]')) return
    onOpenDetail()
  }

  return (
    <motion.article
      layout
      role={onOpenDetail ? 'button' : undefined}
      tabIndex={onOpenDetail ? 0 : undefined}
      onClick={handleCardClick}
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
      className={`shop-product-card group relative flex h-full min-w-0 select-none flex-col overflow-hidden rounded-[1.05rem] p-[4px] min-[480px]:rounded-[1.35rem] min-[480px]:p-[5px] transition max-sm:hover:translate-y-0 max-sm:hover:shadow-[0_20px_44px_-28px_rgba(10,46,34,0.22)] ${
        onOpenDetail
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_28px_48px_-24px_rgba(10,46,34,0.35)]'
          : ''
      }`}
      style={{
        backgroundColor: CARD,
        border: OUTER_BORDER,
        boxShadow: '0 18px 40px -28px rgba(10,46,34,0.18)',
      }}
      data-product-id={product.id}
      data-product-category={product.category}
      data-product-pack-format={packType}
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
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[0.9rem] p-[3px] min-[480px]:rounded-[1.12rem] min-[480px]:p-[4px]"
        style={{
          backgroundColor: CARD,
          border: INNER_BORDER,
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col rounded-[0.8rem] p-1.5 min-[480px]:rounded-[0.95rem] min-[480px]:p-2 sm:p-2.5">
        <div
          ref={imageHostRef}
          className={`relative shrink-0 overflow-hidden rounded-md border min-[480px]:rounded-lg ${
            hasGallery
              ? 'shop-product-card__media--gallery h-[180px] min-[480px]:h-[200px] sm:h-[220px]'
              : 'h-[108px] min-[480px]:h-[118px] sm:h-[128px]'
          }`}
          style={{
            backgroundColor: IMAGE_BG,
            borderColor: 'rgba(184,134,11,0.2)',
          }}
          onMouseEnter={() => setImageHovered(true)}
          onMouseLeave={() => setImageHovered(false)}
        >
          <ProductImageCarousel
            images={lazyImages}
            alt={product.name}
            panelBg={IMAGE_BG}
            dimmed={outOfStock}
            hovered={imageHovered}
            variant="shop-card"
            index={carouselIndex}
            onIndexChange={setCarouselIndex}
          />

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
            data-card-action
            onClick={(e) => void toggleWishlist(e)}
            disabled={wishBusy}
            className="absolute top-1.5 right-1.5 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition hover:scale-105 disabled:opacity-70 min-[480px]:h-7 min-[480px]:w-7 touch-manipulation"
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

        <div className="mt-1 flex flex-col min-[480px]:mt-1.5">
        {hasGallery ? (
          <div
            className="shop-product-card__dots mb-0 flex items-center justify-center gap-1.5 py-0.5"
            role="tablist"
            aria-label="Product image slides"
            data-card-action
            onClick={stop}
          >
            {lazyImages.map((_, i) => (
              <button
                key={`${product.id}-dot-${i}`}
                type="button"
                role="tab"
                aria-selected={i === carouselIndex}
                aria-label={`Show image ${i + 1}`}
                onClick={(e) => {
                  stop(e)
                  setCarouselIndex(i)
                }}
                className="h-1.5 cursor-pointer rounded-full border-0 p-0 transition-all duration-300 touch-manipulation"
                style={{
                  width: i === carouselIndex ? '1.15rem' : '0.38rem',
                  backgroundColor:
                    i === carouselIndex ? 'rgba(184,134,11,0.95)' : 'rgba(10,46,34,0.2)',
                }}
              />
            ))}
          </div>
        ) : (
          <p
            className="mb-0 text-center text-[0.58rem] tracking-[0.05em] min-[480px]:text-[0.62rem]"
            style={{ color: MUTED, fontFamily: BRAND_SERIF }}
          >
            {product.brand || 'Tasneem Mukhwas'}
          </p>
        )}

        <h3
          className="mt-0.5 m-0 line-clamp-2 text-center text-[0.74rem] font-semibold leading-snug tracking-[0.01em] min-[480px]:min-h-[2em] min-[480px]:text-[0.82rem] sm:text-[0.88rem]"
          style={{ color: INK, fontFamily: BRAND_SERIF }}
        >
          {product.name}
        </h3>

        {(cardTeaser || showSeeMore) && (
          <div className="mt-1.5 px-0.5 text-left min-[480px]:mt-2 min-[480px]:px-1">
            {cardTeaser ? (
              <p
                className="m-0 line-clamp-3 text-[0.65rem] leading-relaxed min-[480px]:text-[0.72rem]"
                style={{ color: MUTED, fontFamily: BRAND_SANS }}
              >
                {cardTeaser}
              </p>
            ) : null}
            {showSeeMore ? (
              <button
                type="button"
                data-card-action
                onClick={openDetail}
                className="mt-1 inline-block cursor-pointer border-0 bg-transparent p-0 text-[0.62rem] font-semibold underline decoration-solid underline-offset-[3px] transition hover:opacity-80 min-[480px]:text-[0.68rem]"
                style={{ color: GOLD, fontFamily: BRAND_SANS }}
              >
                See more
              </button>
            ) : null}
          </div>
        )}

        <div
          className="mt-1 flex items-center justify-center min-[480px]:justify-end"
          data-card-action
          onClick={stop}
        >
          <div className="flex shrink-0 items-center gap-1">
            <Stars rating={product.rating} />
            <span className="text-[0.52rem] min-[480px]:text-[0.56rem]" style={{ color: MUTED }}>
              ({product.reviews})
            </span>
          </div>
        </div>

        <div
          className="mt-1 flex min-h-0 flex-col gap-1.5 min-[480px]:h-[44px] min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between min-[480px]:gap-2 min-[480px]:overflow-hidden"
          data-card-action
          onClick={stop}
        >
          <div className="flex shrink-0 flex-row items-baseline gap-1.5 min-[480px]:flex-col min-[480px]:items-start min-[480px]:leading-none">
            <span className="text-[0.82rem] font-bold min-[480px]:text-[0.9rem]" style={{ color: INK, fontFamily: BRAND_SANS }}>
              {formatRupee(sellPrice)}
            </span>
            {comparePrice != null && comparePrice > sellPrice && (
              <span className="text-[0.58rem] line-through min-[480px]:mt-0.5 min-[480px]:text-[0.62rem]" style={{ color: MUTED, fontFamily: BRAND_SANS }}>
                {formatRupee(comparePrice)}
              </span>
            )}
          </div>

          {variants.length > 0 ? (
            <div
              className="flex min-w-0 flex-1 flex-wrap content-start justify-center gap-1 min-[480px]:justify-end min-[480px]:overflow-hidden"
              data-card-action
              onClick={stop}
            >
              {variants.map((variant) => {
                const selected = variant.id === variantId
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={(e) => selectVariant(e, variant.id)}
                    className="cursor-pointer rounded-full border px-1.5 py-0.5 text-[0.46rem] font-semibold tracking-wide uppercase transition min-[480px]:text-[0.5rem] touch-manipulation"
                    style={{
                      borderColor: selected ? GOLD : 'rgba(184,134,11,0.45)',
                      backgroundColor: selected ? BRAND_CREAM_DEEP : 'transparent',
                      color: selected ? INK : MUTED,
                      fontFamily: BRAND_SANS,
                    }}
                    aria-pressed={selected}
                  >
                    {variant.label}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex-1" aria-hidden />
          )}
        </div>

        </div>

        <div className="mt-auto shrink-0 grid grid-cols-2 gap-1 pt-1 min-[480px]:gap-1.5 min-[480px]:pt-1.5" data-card-action onClick={stop}>
          {outOfStock ? (
            <button
              type="button"
              disabled
              onClick={stop}
              className="col-span-2 min-h-[40px] cursor-not-allowed rounded-full border-0 py-2 text-[0.52rem] font-semibold tracking-[0.06em] uppercase opacity-70 min-[480px]:min-h-0 min-[480px]:text-[0.58rem] touch-manipulation"
              style={{ backgroundColor: 'rgba(10,46,34,0.08)', color: INK, fontFamily: BRAND_SANS }}
            >
              Out of stock
            </button>
          ) : (
            <>
              {cartQty > 0 ? (
                <div
                  className="flex min-h-[40px] items-center justify-between rounded-full border px-1.5 py-1 min-[480px]:min-h-0 touch-manipulation"
                  style={{
                    borderColor: 'rgba(184,134,11,0.55)',
                    background: BTN_GOLD_GRADIENT,
                  }}
                  onClick={stop}
                >
                  <button
                    type="button"
                    onClick={(e) => changeQty(e, -1)}
                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-0 text-[0.9rem] leading-none"
                    style={{ color: BTN_TEXT }}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span
                    className="min-w-[1.1rem] text-center text-[0.72rem] font-bold tabular-nums"
                    style={{ color: BTN_TEXT, fontFamily: BRAND_SANS }}
                    aria-live="polite"
                  >
                    {cartQty}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => changeQty(e, 1)}
                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-0 text-[0.9rem] leading-none"
                    style={{ color: BTN_TEXT }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={addToCart}
                  className="shop-card-btn shop-card-btn--cart min-h-[40px] cursor-pointer rounded-full border-0 py-2 text-[0.52rem] font-semibold tracking-[0.06em] uppercase min-[480px]:min-h-0 min-[480px]:text-[0.58rem] sm:text-[0.6rem] touch-manipulation"
                  style={{
                    background: BTN_GOLD_GRADIENT,
                    color: BTN_TEXT,
                    fontFamily: BRAND_SANS,
                  }}
                >
                  Add to Cart
                </button>
              )}
              <button
                type="button"
                onClick={payNow}
                className="shop-card-btn shop-card-btn--pay min-h-[40px] cursor-pointer rounded-full border py-2 text-[0.52rem] font-semibold tracking-[0.06em] uppercase min-[480px]:min-h-0 min-[480px]:text-[0.58rem] sm:text-[0.6rem] touch-manipulation"
                style={{
                  borderColor: INK,
                  color: BTN_TEXT,
                  backgroundColor: INK,
                  fontFamily: BRAND_SANS,
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
