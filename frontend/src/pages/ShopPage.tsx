import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Navbar from '../components/nav/Navbar'
import ProductDetailModal from '../components/shop/ProductDetailModal'
import ShopProductCard from '../components/shop/ShopProductCard'
import { ProductCardSkeletonGrid } from '../components/shop/ProductCardSkeleton'
import SiteFooter from '../components/shared/SiteFooter'
import FloatingActions from '../components/shared/FloatingActions'
import { useCatalog } from '../context/CatalogContext'
import { couponsApi } from '../lib/services'
import { CATEGORIES, getSellPrice, type ShopProduct } from '../lib/shopCatalog'
import { scrollAppToTop } from '../lib/scrollControl'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const PAGE = '#f2f4f5'
const MUTED = 'rgba(10,46,34,0.62)'
const PANEL = 'rgba(248,249,250,0.92)'
const BORDER = 'rgba(10,46,34,0.12)'
const TEXTURE = '/image.png_2K_202608092240.jpeg'
const SHOP_BANNER = encodeURI('/Mukhwas_ingredients_arranged_on_…_202608182142.jpeg')

function ShopBanner() {
  return (
    <section className="relative w-full overflow-hidden border-b" style={{ borderColor: BORDER }} aria-label="Shop banner">
      <div className="relative h-[11.5rem] w-full sm:h-[14rem] lg:h-[16rem]">
        <img
          src={SHOP_BANNER}
          alt="Fresh mukhwas ingredients and blends"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.88]"
          loading="eager"
          fetchPriority="high"
        />
        <img
          src={TEXTURE}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-multiply"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, rgba(10,46,34,0.52) 0%, rgba(10,46,34,0.18) 42%, rgba(10,46,34,0.55) 100%),
              linear-gradient(90deg, rgba(10,46,34,0.38) 0%, transparent 18%, transparent 82%, rgba(10,46,34,0.38) 100%),
              radial-gradient(ellipse 62% 78% at 50% 44%, rgba(10,46,34,0.22) 0%, transparent 68%)
            `,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center px-5 text-center sm:px-8 lg:px-10">
          <div>
            <p
              className="m-0 text-[0.68rem] font-semibold tracking-[0.22em] uppercase"
              style={{ color: 'rgba(242,244,245,0.62)', fontFamily: 'Inter, sans-serif' }}
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

function FilterBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className="border-b px-4 py-4 last:border-b-0"
      style={{ borderColor: BORDER }}
    >
      <p
        className="m-0 mb-3 text-[0.72rem] font-semibold tracking-[0.14em] uppercase"
        style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
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
  const { products, loading, error, refresh } = useCatalog()
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(1000)
  const [minRating, setMinRating] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sort, setSort] = useState<SortMode>('default')
  const [detailProduct, setDetailProduct] = useState<ShopProduct | null>(null)
  const [promos, setPromos] = useState<
    { scope: string; productId?: string; category?: string; label: string }[]
  >([])

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
    () => Math.max(...products.map((p) => getSellPrice(p)), 1000),
    [products],
  )

  useEffect(() => {
    setMaxPrice((prev) => Math.min(prev, priceCeiling) || priceCeiling)
  }, [priceCeiling])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (q) {
        const hay = `${p.name} ${p.category} ${p.brand} ${p.description}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (categories.length && !categories.includes(p.category)) return false
      if (getSellPrice(p) > maxPrice) return false
      if (p.rating < minRating) return false
      return true
    })
  }, [products, query, categories, maxPrice, minRating])

  const sorted = useMemo(() => {
    const list = [...filtered]
    if (sort === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name))
    return list
  }, [filtered, sort])

  const toggle = (list: string[], value: string, set: (v: string[]) => void) => {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value])
  }

  const clearFilters = () => {
    setCategories([])
    setMaxPrice(priceCeiling)
    setMinRating(0)
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
      className="shop-sidebar flex w-full flex-col lg:sticky lg:top-[calc(env(safe-area-inset-top,0px)+4rem)] lg:z-30 lg:w-[248px] lg:shrink-0 lg:self-start lg:max-h-[calc(100svh-env(safe-area-inset-top,0px)-4rem)] lg:overflow-y-auto lg:backdrop-blur-md"
      style={{
        backgroundColor: PANEL,
        borderRight: `1px solid ${BORDER}`,
        boxShadow: '8px 0 28px -24px rgba(10,46,34,0.35)',
      }}
    >
      <FilterBox title="Product categories">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <label
                className="flex cursor-pointer items-center gap-2.5 text-[0.82rem]"
                style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
              >
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={() => toggle(categories, cat, setCategories)}
                  className="h-3.5 w-3.5 cursor-pointer accent-[#b8860b]"
                />
                <span style={{ color: MUTED }}>{cat}</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterBox>

      <FilterBox title="Filter by price">
        <input
          type="range"
          min={50}
          max={priceCeiling}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full cursor-pointer accent-[#b8860b]"
          aria-label="Maximum price"
        />
        <p className="mt-2 m-0 text-[0.8rem]" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
          ₹0 – ₹{maxPrice}
        </p>
      </FilterBox>

      <FilterBox title="Ratings">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {[5, 4, 3].map((r) => {
            const count = products.filter((p) => p.rating >= r).length
            return (
              <li key={r}>
                <button
                  type="button"
                  onClick={() => setMinRating((prev) => (prev === r ? 0 : r))}
                  className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-0 text-left text-[0.8rem]"
                  style={{
                    color: INK,
                    fontFamily: 'Inter, sans-serif',
                    opacity: minRating === r ? 1 : 0.72,
                  }}
                >
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
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Clear filters
        </button>
      </div>
    </aside>
  )

  return (
    <div className="relative min-h-svh w-full" style={{ backgroundColor: PAGE }}>
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
              linear-gradient(180deg, rgba(242,244,245,0.88) 0%, rgba(242,244,245,0.55) 48%, rgba(242,244,245,0.92) 100%),
              radial-gradient(ellipse 70% 45% at 80% 0%, rgba(255,252,245,0.65) 0%, transparent 60%)
            `,
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col">
        <Navbar />

        <main className="flex flex-1 flex-col pt-0 pb-0" aria-label="Shop">
          <ShopBanner />

          <div className="flex flex-1 items-start">
            <div
              className={`${filtersOpen ? 'fixed inset-0 z-40 lg:static lg:inset-auto lg:z-auto' : 'hidden lg:block'} lg:self-stretch`}
            >
              {filtersOpen && (
                <button
                  type="button"
                  className="absolute inset-0 cursor-pointer border-0 bg-[rgba(6,14,11,0.35)] lg:hidden"
                  aria-label="Close filters"
                  onClick={() => setFiltersOpen(false)}
                />
              )}
              <div className="relative z-[1] h-full w-[min(280px,88vw)] max-h-[85svh] overflow-y-auto shadow-xl lg:h-full lg:max-h-none lg:w-auto lg:overflow-visible lg:shadow-none">
                {sidebar}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div
                className="shop-toolbar sticky top-[calc(env(safe-area-inset-top,0px)+3.75rem)] z-40 flex flex-wrap items-center gap-3 border-b px-3 py-3 backdrop-blur-md md:top-[calc(env(safe-area-inset-top,0px)+4rem)] sm:px-5"
                style={{
                  borderColor: BORDER,
                  backgroundColor: 'rgba(248,249,250,0.92)',
                  boxShadow: '0 1px 0 rgba(10,46,34,0.06)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setFiltersOpen((v) => !v)}
                  className="cursor-pointer rounded-lg border px-3 py-2 text-[0.72rem] font-semibold tracking-[0.12em] uppercase lg:hidden"
                  style={{
                    color: INK,
                    borderColor: BORDER,
                    backgroundColor: PANEL,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {filtersOpen ? 'Hide filters' : 'Filters'}
                </button>

                <p
                  className="m-0 shrink-0 text-[0.78rem] whitespace-nowrap sm:text-[0.82rem]"
                  style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
                >
                  Showing <span style={{ color: GOLD, fontWeight: 600 }}>{sorted.length}</span> of{' '}
                  {products.length} products
                </p>

                <div className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-lg">
                  <div className="relative min-w-0 flex-1 sm:min-w-[220px]">
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
                      className="w-full rounded-xl border py-2.5 pr-3 pl-9 text-[0.86rem] outline-none transition placeholder:opacity-45 focus:border-[#b8860b]/70"
                      style={{
                        color: INK,
                        backgroundColor: 'rgba(255,255,255,0.88)',
                        borderColor: BORDER,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    />
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={cycleSort}
                      className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition hover:bg-white/70"
                      style={{ borderColor: BORDER, color: INK, backgroundColor: PANEL }}
                      aria-label={`Sort products${sort !== 'default' ? `: ${sortLabel}` : ''}`}
                      title={sort === 'default' ? 'Sort A → Z' : sort === 'name-asc' ? 'Sort Z → A' : 'Clear sort'}
                    >
                      <SortIcon mode={sort === 'name-desc' ? 'name-desc' : 'name-asc'} />
                    </button>
                    {sort !== 'default' && (
                      <span className="hidden text-[0.72rem] font-semibold tracking-wide sm:inline" style={{ color: GOLD }}>
                        {sortLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <section className="px-2 py-4 sm:px-5 sm:py-6 lg:px-8">
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
                    style={{ backgroundColor: INK, color: '#f2f4f5', fontFamily: 'Inter, sans-serif' }}
                  >
                    Try again
                  </button>
                </div>
              ) : sorted.length === 0 ? (
                <div
                  className="rounded-2xl border px-6 py-16 text-center"
                  style={{ borderColor: BORDER, backgroundColor: PANEL }}
                >
                  <p className="m-0 text-[1rem]" style={{ color: INK, fontFamily: 'Inter, sans-serif' }}>
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
                      onOpenDetail={() => setDetailProduct(product)}
                    />
                  ))}
                </div>
              )}
              </section>
            </div>
          </div>
        </main>

        <SiteFooter />
        <FloatingActions />
      </div>

      <ProductDetailModal
        product={detailProduct}
        promoLabel={
          detailProduct ? promoForProduct(detailProduct.id, detailProduct.category) : undefined
        }
        onClose={() => setDetailProduct(null)}
      />
    </div>
  )
}
