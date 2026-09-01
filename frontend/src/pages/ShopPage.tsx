import { useEffect, useMemo, useRef, useState, type ReactNode, lazy, Suspense } from 'react'
import Navbar from '../components/nav/Navbar'
import ShopProductCard from '../components/shop/ShopProductCard'
import { ProductCardSkeletonGrid } from '../components/shop/ProductCardSkeleton'
import SiteFooter from '../components/shared/SiteFooter'
import FloatingActions from '../components/shared/FloatingActions'
import SectionPlaceholder from '../components/shared/SectionPlaceholder'
import { useCatalog } from '../context/CatalogContext'
import { couponsApi } from '../lib/services'
import { navigateApp, shopProductPath } from '../lib/appRoutes'
import { DEFAULT_CATEGORIES, getProductMaxSellPrice, getProductPackFormat, getSellPrice, PACK_FORMAT_FILTER_LABELS, type PackType } from '../lib/shopCatalog'
import { scrollAppToTop } from '../lib/scrollControl'
import {
  BRAND_CREAM,
  BRAND_CREAM_LIGHT,
  BRAND_GOLD,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
} from '../lib/brand'

const HomeTestimonials = lazy(() => import('../components/testimonials/HomeTestimonials'))
const HomeReviewStrip = lazy(() => import('../components/reviews/HomeReviewStrip'))

const INK = BRAND_INK
const GOLD = BRAND_GOLD
const PAGE = BRAND_CREAM
const MUTED = BRAND_MUTED
const PANEL = 'rgba(255,254,242,0.94)'
const BORDER = 'rgba(184,134,11,0.18)'
const TEXTURE = '/image.png_2K_202608092240.jpeg'
const SHOP_BANNER = '/Storefront_showcasing_mukhwas_packs_2K_202609020005.jpeg'

function ShopBanner() {
  return (
    <section className="relative w-full overflow-hidden border-b" style={{ borderColor: BORDER }} aria-label="Shop banner">
      <div className="relative h-[11.5rem] w-full sm:h-[14rem] lg:h-[16rem]">
        <img
          src={SHOP_BANNER}
          alt="Tasneem Mukhwas storefront with mukhwas packs on display"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,46,34,0.28) 0%, rgba(10,46,34,0.08) 45%, rgba(10,46,34,0.32) 100%)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center px-5 text-center sm:px-8 lg:px-10">
          <div>
            <p
              className="m-0 text-[0.68rem] font-semibold tracking-[0.22em] uppercase"
              style={{ color: 'rgba(255,254,242,0.82)', fontFamily: BRAND_SANS }}
            >
              Tasneem Mukhwas
            </p>
            <h1
              className="mt-1.5 m-0 text-[clamp(1.75rem,4vw,2.35rem)] leading-tight tracking-tight uppercase"
              style={{ color: '#f2f4f5', fontFamily: 'Anton, Impact, sans-serif' }}
            >
              Our Shop
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}

type SortMode = 'default' | 'name-asc' | 'name-desc'

type ShopFilters = {
  packFormat: PackType | null
  category: string | null
  rating: number | null
  priceMax: number | null
}

const EMPTY_FILTERS: ShopFilters = {
  packFormat: null,
  category: null,
  rating: null,
  priceMax: null,
}

function FilterBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className="border-b px-4 py-4 last:border-b-0"
      style={{ borderColor: BORDER }}
    >
      <p
        className="m-0 mb-3 text-[0.72rem] font-semibold tracking-[0.14em] uppercase"
        style={{ color: GOLD, fontFamily: BRAND_SANS }}
      >
        {title}
      </p>
      {children}
    </div>
  )
}

function SortIcon({ mode }: { mode: SortMode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      {mode === 'name-desc' ? (
        <>
          <path d="M4 6h12M4 12h8M4 18h4" strokeLinecap="round" />
          <path d="M18 8v10M18 18l2-2M18 18l-2-2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <path d="M4 18h12M4 12h8M4 6h4" strokeLinecap="round" />
          <path d="M18 16V6M18 6l2 2M18 6l-2 2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  )
}

export default function ShopPage() {
  const { products, loading, error, refresh, categories: catalogCategories } = useCatalog()
  const categoryOptions = catalogCategories.length ? catalogCategories : [...DEFAULT_CATEGORIES]
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<ShopFilters>(EMPTY_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sort, setSort] = useState<SortMode>('default')
  const [promos, setPromos] = useState<
    { scope: string; productId?: string; category?: string; label: string }[]
  >([])
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const toolbar = toolbarRef.current
    if (!toolbar) return

    const syncToolbarHeight = () => {
      document.documentElement.style.setProperty('--shop-toolbar-height', `${toolbar.offsetHeight}px`)
    }

    syncToolbarHeight()
    const observer = new ResizeObserver(syncToolbarHeight)
    observer.observe(toolbar)
    window.addEventListener('resize', syncToolbarHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncToolbarHeight)
    }
  }, [])

  useEffect(() => {
    couponsApi
      .activePromos()
      .then((res) => setPromos(res.items))
      .catch(() => setPromos([]))
  }, [])

  const promoForProduct = (productId: string, category: string) => {
    const productPromo = promos.find((p) => p.scope === 'product' && p.productId === productId)
    if (productPromo) return productPromo.label
    const catPromo = promos.find((p) => p.scope === 'category' && p.category === category)
    return catPromo?.label
  }

  useEffect(() => {
    document.title = 'Shop · Tasneem Mukhwas'
    scrollAppToTop(true)
    return () => {
      document.title = 'Tasneem Mukhwas'
    }
  }, [])

  const priceCeiling = useMemo(
    () => Math.max(...products.map((p) => getProductMaxSellPrice(p)), 1000),
    [products],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (q) {
        const hay = `${p.name} ${p.category} ${p.brand} ${p.description}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (filters.packFormat && getProductPackFormat(p) !== filters.packFormat) return false
      if (filters.category && p.category !== filters.category) return false
      if (filters.rating != null && p.rating < filters.rating) return false
      if (filters.priceMax != null && getSellPrice(p) > filters.priceMax) return false
      return true
    })
  }, [products, query, filters])

  const sorted = useMemo(() => {
    const list = [...filtered]
    if (sort === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name))
    return list
  }, [filtered, sort])

  const toggleFilter = <K extends keyof ShopFilters>(key: K, value: NonNullable<ShopFilters[K]>) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }))
  }

  const setPriceMax = (value: number) => {
    setFilters((prev) => ({
      ...prev,
      priceMax: value >= priceCeiling ? null : value,
    }))
  }

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS)
    setQuery('')
    setSort('default')
  }

  const cycleSort = () => {
    setSort((prev) => (prev === 'default' ? 'name-asc' : prev === 'name-asc' ? 'name-desc' : 'default'))
  }

  const sortLabel =
    sort === 'name-asc' ? 'A → Z' : sort === 'name-desc' ? 'Z → A' : 'Sort'

  const sidebar = (
    <aside
      className="shop-sidebar flex w-full flex-col lg:w-[248px] lg:shrink-0"
      style={{
        backgroundColor: PANEL,
        borderRight: `1px solid ${BORDER}`,
        boxShadow: '8px 0 28px -24px rgba(10,46,34,0.35)',
      }}
    >
      <FilterBox title="Pack type">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {(['packet', 'bottle'] as const).map((format) => {
            const count = products.filter((p) => getProductPackFormat(p) === format).length
            const selected = filters.packFormat === format
            return (
              <li key={format}>
                <label
                  className="flex cursor-pointer items-center gap-2.5 text-[0.82rem]"
                  style={{ color: INK, fontFamily: BRAND_SANS, opacity: selected ? 1 : 0.82 }}
                >
                  <input
                    type="radio"
                    name="shop-pack-format"
                    checked={selected}
                    onChange={() => toggleFilter('packFormat', format)}
                    className="h-3.5 w-3.5 cursor-pointer accent-[#b8860b]"
                  />
                  <span style={{ color: MUTED }}>
                    {PACK_FORMAT_FILTER_LABELS[format]} ({count})
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </FilterBox>

      <FilterBox title="Product categories">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {categoryOptions.map((cat) => {
            const selected = filters.category === cat
            return (
            <li key={cat}>
              <label
                className="flex cursor-pointer items-center gap-2.5 text-[0.82rem]"
                style={{ color: INK, fontFamily: BRAND_SANS, opacity: selected ? 1 : 0.82 }}
              >
                <input
                  type="radio"
                  name="shop-category"
                  checked={selected}
                  onChange={() => toggleFilter('category', cat)}
                  className="h-3.5 w-3.5 cursor-pointer accent-[#b8860b]"
                />
                <span style={{ color: MUTED }}>{cat}</span>
              </label>
            </li>
            )
          })}
        </ul>
      </FilterBox>

      <FilterBox title="Filter by price">
        <input
          type="range"
          min={50}
          max={priceCeiling}
          step={10}
          value={filters.priceMax ?? priceCeiling}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full cursor-pointer accent-[#b8860b]"
          aria-label="Maximum price"
        />
        <p className="mt-2 m-0 text-[0.8rem]" style={{ color: MUTED, fontFamily: BRAND_SANS }}>
          ₹0 – ₹{filters.priceMax ?? priceCeiling}
        </p>
      </FilterBox>

      <FilterBox title="Ratings">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {[5, 4, 3].map((r) => {
            const count = products.filter((p) => p.rating >= r).length
            const selected = filters.rating === r
            return (
              <li key={r}>
                <button
                  type="button"
                  onClick={() => toggleFilter('rating', r)}
                  className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-0 text-left text-[0.8rem]"
                  style={{
                    color: INK,
                    fontFamily: BRAND_SANS,
                    opacity: selected ? 1 : 0.72,
                  }}
                >
                  <input
                    type="radio"
                    name="shop-rating"
                    readOnly
                    checked={selected}
                    className="h-3.5 w-3.5 pointer-events-none accent-[#b8860b]"
                    aria-hidden
                  />
                  <span style={{ color: GOLD }}>{'★'.repeat(r)}</span>
                  <span style={{ color: 'rgba(10,46,34,0.22)' }}>{'★'.repeat(5 - r)}</span>
                  <span style={{ color: MUTED }}>({count})</span>
                </button>
              </li>
            )
          })}
        </ul>
      </FilterBox>

      <div className="px-4 py-4">
        <button
          type="button"
          onClick={clearFilters}
          className="w-full cursor-pointer rounded-xl border px-3 py-2.5 text-[0.72rem] font-semibold tracking-[0.12em] uppercase transition hover:bg-white/60"
          style={{
            color: INK,
            borderColor: BORDER,
            backgroundColor: 'rgba(255,255,255,0.55)',
            fontFamily: BRAND_SANS,
          }}
        >
          Clear filters
        </button>
      </div>
    </aside>
  )

  return (
    <div className="relative min-h-svh w-full max-w-full overflow-x-clip page-shell" style={{ backgroundColor: PAGE }}>
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src={TEXTURE}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            filter: 'brightness(1.55) saturate(0.35) contrast(0.88)',
            opacity: 0.4,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, rgba(248,243,231,0.88) 0%, rgba(248,243,231,0.55) 48%, rgba(248,243,231,0.92) 100%),
              radial-gradient(ellipse 70% 45% at 80% 0%, rgba(255,254,242,0.65) 0%, transparent 60%)
            `,
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col">
        <Navbar />

        <main className="flex min-w-0 w-full max-w-full flex-1 flex-col pt-0 pb-0" aria-label="Shop">
          <ShopBanner />

          <div className="shop-layout flex min-w-0 w-full max-w-full items-stretch">
            <div
              className={`shop-layout__sidebar ${filtersOpen ? 'fixed inset-0 z-50 lg:static lg:inset-auto lg:z-auto' : 'hidden lg:block'}`}
            >
              {filtersOpen && (
                <button
                  type="button"
                  className="absolute inset-0 cursor-pointer border-0 bg-[rgba(6,14,11,0.4)] lg:hidden"
                  aria-label="Close filters"
                  onClick={() => setFiltersOpen(false)}
                />
              )}
              <div
                className="fixed inset-x-0 bottom-0 top-[calc(env(safe-area-inset-top,0px)+7.25rem)] z-[1] flex max-h-[min(78svh,640px)] w-full flex-col overflow-hidden rounded-t-[1.25rem] shadow-[0_-12px_40px_-16px_rgba(10,46,34,0.35)] lg:static lg:max-h-none lg:w-auto lg:rounded-none lg:shadow-none"
                style={{ backgroundColor: PANEL }}
              >
                <div
                  className="flex shrink-0 items-center justify-between border-b px-4 py-3 lg:hidden"
                  style={{ borderColor: BORDER }}
                >
                  <p
                    className="m-0 text-[0.78rem] font-semibold tracking-[0.12em] uppercase"
                    style={{ color: INK, fontFamily: BRAND_SANS }}
                  >
                    Filters
                  </p>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 text-[1.1rem] leading-none"
                    style={{ backgroundColor: 'rgba(10,46,34,0.08)', color: INK }}
                    aria-label="Close filters"
                  >
                    ×
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{sidebar}</div>
              </div>
            </div>

            <div className="shop-main min-w-0 flex-1 flex flex-col">
              <div
                ref={toolbarRef}
                className="shop-toolbar shrink-0 border-b px-3 py-2.5 sm:px-5 sm:py-3"
                style={{
                  borderColor: BORDER,
                }}
              >
                <div className="shop-toolbar__row">
                  <div className="shop-toolbar__meta">
                    <button
                      type="button"
                      onClick={() => setFiltersOpen((v) => !v)}
                      className="shrink-0 cursor-pointer rounded-lg border px-2.5 py-2 text-[0.68rem] font-semibold tracking-[0.1em] uppercase lg:hidden"
                      style={{
                        color: INK,
                        borderColor: BORDER,
                        backgroundColor: PANEL,
                        fontFamily: BRAND_SANS,
                      }}
                    >
                      {filtersOpen ? 'Hide' : 'Filters'}
                    </button>

                    <p
                      className="m-0 min-w-0 flex-1 truncate text-[0.72rem] sm:flex-none sm:text-[0.82rem] sm:whitespace-nowrap"
                      style={{ color: MUTED, fontFamily: BRAND_SANS }}
                    >
                      Showing <span style={{ color: GOLD, fontWeight: 600 }}>{sorted.length}</span> of{' '}
                      {products.length}
                    </p>
                  </div>

                  <div className="shop-toolbar__controls flex min-w-0 items-center gap-2 sm:max-w-[18rem] lg:max-w-[15.5rem]">
                    <div className="relative min-w-0 flex-1">
                      <label htmlFor="shop-search" className="sr-only">
                        Search products
                      </label>
                      <span
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                        style={{ color: MUTED }}
                        aria-hidden
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="7" />
                          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
                        </svg>
                      </span>
                      <input
                        id="shop-search"
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search mukhwas, paan, seeds…"
                        enterKeyHint="search"
                        autoComplete="off"
                        className="w-full min-w-0 rounded-xl border py-2 pr-3 pl-9 text-[0.86rem] outline-none transition placeholder:opacity-45 focus:border-[#b8860b]/70"
                        style={{
                          color: INK,
                          backgroundColor: BRAND_CREAM_LIGHT,
                          borderColor: BORDER,
                          fontFamily: BRAND_SANS,
                        }}
                      />
                    </div>

                    {sort !== 'default' && (
                      <span className="hidden shrink-0 text-[0.72rem] font-semibold tracking-wide sm:inline" style={{ color: GOLD }}>
                        {sortLabel}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={cycleSort}
                      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition hover:bg-white/70"
                      style={{ borderColor: BORDER, color: INK, backgroundColor: PANEL }}
                      aria-label={`Sort products${sort !== 'default' ? `: ${sortLabel}` : ''}`}
                      title={sort === 'default' ? 'Sort A → Z' : sort === 'name-asc' ? 'Sort Z → A' : 'Clear sort'}
                    >
                      <SortIcon mode={sort === 'name-desc' ? 'name-desc' : 'name-asc'} />
                    </button>
                  </div>
                </div>
              </div>

              <section className="shop-products-pane px-2 py-4 sm:px-5 sm:py-6 lg:px-8">
              {loading && products.length === 0 ? (
                <ProductCardSkeletonGrid count={8} className="grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 min-[480px]:gap-3 md:grid-cols-3 xl:grid-cols-4 items-stretch" />
              ) : error ? (
                <div
                  className="rounded-2xl border px-6 py-16 text-center"
                  style={{ borderColor: BORDER, backgroundColor: PANEL }}
                >
                  <p className="m-0 text-[1rem]" style={{ color: INK }}>
                    {error}
                  </p>
                  <p className="mt-2 m-0 text-[0.8rem]" style={{ color: MUTED }}>
                    Make sure the API is running and MongoDB is connected.
                  </p>
                  <button
                    type="button"
                    onClick={() => void refresh()}
                    className="mt-5 cursor-pointer rounded-xl border-0 px-5 py-2.5 text-[0.85rem] font-semibold transition hover:brightness-110"
                    style={{ backgroundColor: INK, color: BRAND_CREAM_LIGHT, fontFamily: BRAND_SANS }}
                  >
                    Try again
                  </button>
                </div>
              ) : sorted.length === 0 ? (
                <div
                  className="rounded-2xl border px-6 py-16 text-center"
                  style={{ borderColor: BORDER, backgroundColor: PANEL }}
                >
                  <p className="m-0 text-[1rem]" style={{ color: INK, fontFamily: BRAND_SANS }}>
                    No products match your search.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 cursor-pointer border-0 bg-transparent text-[0.8rem] font-semibold underline-offset-2 hover:underline"
                    style={{ color: GOLD }}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 min-[480px]:gap-3 md:grid-cols-3 xl:grid-cols-4 items-stretch">
                  {sorted.map((product, index) => (
                    <ShopProductCard
                      key={product.id}
                      product={product}
                      revealIndex={index}
                      promoLabel={promoForProduct(product.id, product.category)}
                      onOpenDetail={() => navigateApp(shopProductPath(product.id))}
                    />
                  ))}
                </div>
              )}
              </section>
            </div>
          </div>

          <Suspense fallback={<SectionPlaceholder minHeight="40vh" />}>
            <HomeTestimonials />
          </Suspense>
          <Suspense fallback={<SectionPlaceholder minHeight="28vh" />}>
            <HomeReviewStrip />
          </Suspense>
        </main>

        <SiteFooter />
        <FloatingActions />
      </div>
    </div>
  )
}
