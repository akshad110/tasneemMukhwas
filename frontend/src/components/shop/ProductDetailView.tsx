import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { loadProductImages } from '../../lib/productImageCache'
import { productsApi } from '../../lib/services'
import {
  getComparePrice,
  getProductImages,
  getProductModalDescription,
  getProductPackFormat,
  getProductPanelFill,
  getSellPrice,
  getVariantsForPackType,
  PACK_FORMAT_BADGE_LABELS,
  type ShopProduct,
} from '../../lib/shopCatalog'
import ProductDetailGallery from './ProductDetailGallery'

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

type ProductDetailViewProps = {
  product: ShopProduct
  promoLabel?: string
}

export default function ProductDetailView({ product, promoLabel }: ProductDetailViewProps) {
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [resolvedProduct, setResolvedProduct] = useState<ShopProduct>(product)
  const activeProduct = resolvedProduct
  const packType = useMemo(() => getProductPackFormat(activeProduct), [activeProduct])
  const images = useMemo(() => {
    if (galleryImages.length) return galleryImages
    return getProductImages(activeProduct)
  }, [activeProduct, galleryImages])
  const variants = useMemo(
    () => getVariantsForPackType(activeProduct, packType),
    [activeProduct, packType],
  )
  const { user } = useAuth()
  const { addItem, clearCart, getQty, setQty } = useCart()
  const { isWishlisted, toggle } = useWishlist()
  const [wishBusy, setWishBusy] = useState(false)
  const [variantId, setVariantId] = useState('packet-100g')
  const [imagesLoading, setImagesLoading] = useState(false)

  useEffect(() => {
    setResolvedProduct(product)
    let cancelled = false
    void productsApi
      .get(product.id)
      .then((full) => {
        if (!cancelled) setResolvedProduct((prev) => ({ ...prev, ...full }))
      })
      .catch(() => {
        /* keep catalog snapshot */
      })
    return () => {
      cancelled = true
    }
  }, [product])

  useEffect(() => {
    const initial = getProductImages(product)
    setGalleryImages(initial)
    const format = getProductPackFormat(product)
    setVariantId(getVariantsForPackType(product, format)[0]?.id ?? `${format}-100g`)
    setImagesLoading(!initial.length && Boolean(product.hasStoredImage || product.image))

    let cancelled = false
    void loadProductImages(product.id)
      .then((data) => {
        if (cancelled) return
        const next = (data.images?.length ? data.images : data.image ? [data.image] : []).filter(Boolean)
        if (next.length) setGalleryImages(next)
      })
      .catch(() => {
        /* keep summary / empty state */
      })
      .finally(() => {
        if (!cancelled) setImagesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [product.id])

  useEffect(() => {
    setVariantId(variants[0]?.id ?? `${packType}-100g`)
  }, [activeProduct.id, packType, variants])

  const variantIdResolved = variants.some((v) => v.id === variantId)
    ? variantId
    : (variants[0]?.id ?? `${packType}-100g`)
  const cartQty = getQty(activeProduct.id, variantIdResolved)
  const sellPrice = getSellPrice(activeProduct, packType)
  const comparePrice = getComparePrice(activeProduct, packType)
  const displayQty = cartQty > 0 ? cartQty : 1
  const total = sellPrice * displayQty
  const outOfStock = Boolean(activeProduct.outOfStock)
  const liked = isWishlisted(activeProduct.id)
  const panelFill = getProductPanelFill(activeProduct)
  const modalDescription = getProductModalDescription(activeProduct, packType)

  const requireAuth = () => {
    if (user) return true
    navigateApp(APP_ROUTES.login)
    return false
  }

  const handleAddToCart = () => {
    if (outOfStock) return
    if (!requireAuth()) return
    setQty(activeProduct.id, variantIdResolved, 1)
  }

  const changeQty = (delta: number) => {
    if (outOfStock) return
    if (!requireAuth()) return
    setQty(activeProduct.id, variantIdResolved, cartQty + delta)
  }

  const handlePayNow = () => {
    if (outOfStock) return
    if (!requireAuth()) return
    clearCart()
    addItem(activeProduct.id, variantIdResolved, displayQty)
    navigateApp(APP_ROUTES.checkout)
  }

  const toggleWishlist = async () => {
    if (!requireAuth()) return
    if (wishBusy) return
    setWishBusy(true)
    try {
      await toggle(activeProduct.id)
    } finally {
      setWishBusy(false)
    }
  }

  return (
    <article
      className="overflow-hidden rounded-[1.75rem] border shadow-[0_24px_60px_-32px_rgba(10,46,34,0.35)]"
      style={{ borderColor: BORDER, backgroundColor: CREAM }}
      aria-labelledby="product-detail-title"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr]">
        <div
          className="relative flex min-h-[280px] flex-col overflow-hidden p-5 pb-4 sm:min-h-[360px] sm:p-6 lg:min-h-[420px]"
          style={{ backgroundColor: panelFill }}
        >
          <ProductDetailGallery
            images={images}
            alt={activeProduct.name}
            panelBg={panelFill}
            loading={imagesLoading}
            dimmed={outOfStock}
          />
          {promoLabel && !outOfStock && (
            <span
              className="absolute top-5 left-5 rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-wide uppercase sm:top-6 sm:left-6"
              style={{ backgroundColor: GOLD, color: INK }}
            >
              {promoLabel}
            </span>
          )}
        </div>

        <div className="flex flex-col p-5 sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-2">
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
            <span
              className="inline-flex w-fit rounded-full px-3 py-1 text-[0.62rem] font-semibold tracking-[0.14em] uppercase"
              style={{
                color: INK,
                border: '1px solid rgba(10,46,34,0.18)',
                backgroundColor: 'rgba(10,46,34,0.06)',
              }}
            >
              {PACK_FORMAT_BADGE_LABELS[packType]}
            </span>
          </div>

          <h1
            id="product-detail-title"
            className="mt-3 m-0 text-[clamp(1.35rem,3vw,1.85rem)] font-bold leading-tight tracking-tight"
            style={{ color: INK, fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {activeProduct.name}
          </h1>

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

          {modalDescription ? (
            <div className="mt-4">
              <p
                className="m-0 text-[0.68rem] font-semibold tracking-[0.12em] uppercase"
                style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
              >
                About this product
              </p>
              <p
                className="mt-2 m-0 text-[0.82rem] leading-relaxed sm:text-[0.88rem]"
                style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
              >
                {modalDescription}
              </p>
            </div>
          ) : null}

          <div
            className="mt-6 flex items-center justify-between rounded-xl border px-4 py-3"
            style={{ borderColor: BORDER, backgroundColor: 'rgba(255,255,255,0.65)' }}
          >
            <span className="text-[0.72rem] font-semibold tracking-[0.14em] uppercase" style={{ color: MUTED }}>
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
    </article>
  )
}
