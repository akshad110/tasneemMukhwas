import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/nav/Navbar'
import ProductDetailView from '../components/shop/ProductDetailView'
import FloatingActions from '../components/shared/FloatingActions'
import SiteFooter from '../components/shared/SiteFooter'
import { useCatalog } from '../context/CatalogContext'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'
import { BRAND_CREAM_LIGHT, BRAND_INK, BRAND_MUTED, BRAND_SANS } from '../lib/brand'
import { productsApi, couponsApi } from '../lib/services'
import { scrollAppToTop } from '../lib/scrollControl'
import { applySeo, SITE_NAME } from '../lib/seo'
import type { ShopProduct } from '../lib/shopCatalog'

const PAGE = BRAND_CREAM_LIGHT
const INK = BRAND_INK
const MUTED = BRAND_MUTED
const BORDER = 'rgba(184,134,11,0.18)'

type ProductDetailPageProps = {
  productId: string
}

export default function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const { products, loading: catalogLoading, ensureLoaded } = useCatalog()
  const [product, setProduct] = useState<ShopProduct | null>(() =>
    products.find((p) => p.id === productId) ?? null,
  )
  const [fetching, setFetching] = useState(!product)
  const [notFound, setNotFound] = useState(false)
  const [promos, setPromos] = useState<
    { scope: string; productId?: string; category?: string; label: string }[]
  >([])

  useEffect(() => {
    void ensureLoaded()
  }, [ensureLoaded])

  useEffect(() => {
    const fromCatalog = products.find((p) => p.id === productId)
    if (fromCatalog) {
      setProduct(fromCatalog)
      setNotFound(false)
    }
  }, [products, productId])

  useEffect(() => {
    let cancelled = false
    setFetching(true)
    void productsApi
      .get(productId)
      .then((full) => {
        if (cancelled) return
        setProduct(full)
        setNotFound(false)
      })
      .catch(() => {
        if (cancelled) return
        if (!products.find((p) => p.id === productId)) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setFetching(false)
      })
    return () => {
      cancelled = true
    }
  }, [productId, products])

  useEffect(() => {
    couponsApi
      .activePromos()
      .then((res) => setPromos(res.items))
      .catch(() => setPromos([]))
  }, [])

  const promoLabel = useMemo(() => {
    if (!product) return undefined
    const productPromo = promos.find((p) => p.scope === 'product' && p.productId === product.id)
    if (productPromo) return productPromo.label
    return promos.find((p) => p.scope === 'category' && p.category === product.category)?.label
  }, [product, promos])

  useEffect(() => {
    applySeo(window.location.pathname)
    if (product) {
      document.title = `${product.name} | ${SITE_NAME}`
    }
    scrollAppToTop(true)
  }, [product])

  const busy = (catalogLoading && !product) || fetching

  return (
    <div className="product-detail-page relative min-h-svh w-full page-shell" style={{ backgroundColor: PAGE }}>
      <Navbar />

      <main className="w-full" aria-label="Product details">
        {busy && !product ? (
          <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
            <div
              className="rounded-[1.75rem] border px-6 py-20 text-center animate-pulse"
              style={{ borderColor: BORDER, backgroundColor: 'rgba(255,254,242,0.92)' }}
            >
              <p className="m-0 text-[0.9rem]" style={{ color: MUTED, fontFamily: BRAND_SANS }}>
                Loading product…
              </p>
            </div>
          </div>
        ) : notFound || !product ? (
          <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
            <div
              className="rounded-[1.75rem] border px-6 py-16 text-center"
              style={{ borderColor: BORDER, backgroundColor: 'rgba(255,254,242,0.92)' }}
            >
              <p className="m-0 text-[1rem]" style={{ color: INK, fontFamily: BRAND_SANS }}>
                Product not found.
              </p>
              <button
                type="button"
                onClick={() => navigateApp(APP_ROUTES.shop)}
                className="mt-5 cursor-pointer rounded-xl border-0 px-5 py-2.5 text-[0.85rem] font-semibold"
                style={{ backgroundColor: INK, color: PAGE, fontFamily: BRAND_SANS }}
              >
                Browse shop
              </button>
            </div>
          </div>
        ) : (
          <ProductDetailView product={product} promoLabel={promoLabel} />
        )}
      </main>

      <SiteFooter />
      <FloatingActions />
    </div>
  )
}
