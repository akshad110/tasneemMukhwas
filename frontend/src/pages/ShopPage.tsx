import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Navbar from '../components/nav/Navbar'
import ShopProductCard from '../components/shop/ShopProductCard'
import { useCatalog } from '../context/CatalogContext'
import { CATEGORIES, getSellPrice } from '../lib/shopCatalog'

const INK = '#0a2e22'
const CREAM = '#f3e6c8'
const GOLD = '#b8860b'
const TEXTURE = '/image.png_2K_202608092240.jpeg'
const PANEL = 'rgba(243,230,200,0.06)'
const BORDER = 'rgba(243,230,200,0.14)'

function FilterBox({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="border px-3.5 py-3.5" style={{ borderColor: BORDER, backgroundColor: PANEL }}>
      <p
        className="m-0 mb-3 text-[0.72rem] font-semibold tracking-[0.14em] uppercase"
        style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
      >
        {title}
      </p>
      {children}
    </div>
  )
}

/**
 * Shop — navbar + filter sidebar + search + dark product cards.
 */
export default function ShopPage() {
  const { products, loading, error } = useCatalog()
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(1000)
  const [minRating, setMinRating] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    document.title = 'Shop · Tasneem Mukhwas'
    window.scrollTo(0, 0)
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

  const toggle = (list: string[], value: string, set: (v: string[]) => void) => {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value])
  }

  const clearFilters = () => {
    setCategories([])
    setMaxPrice(priceCeiling)
    setMinRating(0)
    setQuery('')
  }

  const sidebar = (
    <aside className="flex w-full flex-col gap-3 lg:w-[260px] lg:shrink-0 lg:self-start lg:sticky lg:top-24">
      <FilterBox title="Product categories">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <label
                className="flex cursor-pointer items-center gap-2.5 text-[0.82rem]"
                style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
              >
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={() => toggle(categories, cat, setCategories)}
                  className="h-3.5 w-3.5 cursor-pointer accent-[#b8860b]"
                />
                <span className="opacity-85">{cat}</span>
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
        <p
          className="mt-2 m-0 text-[0.8rem] opacity-70"
          style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
        >
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
                    color: CREAM,
                    fontFamily: 'Inter, sans-serif',
                    opacity: minRating === r ? 1 : 0.7,
                  }}
                >
                  <span style={{ color: GOLD }}>{'★'.repeat(r)}</span>
                  <span className="opacity-40">{'★'.repeat(5 - r)}</span>
                  <span className="opacity-50">({count})</span>
                </button>
              </li>
            )
          })}
        </ul>
      </FilterBox>

      <button
        type="button"
        onClick={clearFilters}
        className="cursor-pointer border px-3 py-2 text-[0.72rem] font-semibold tracking-[0.12em] uppercase transition hover:bg-white/5"
        style={{
          color: CREAM,
          borderColor: BORDER,
          backgroundColor: 'transparent',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Clear filters
      </button>
    </aside>
  )

  return (
    <div className="relative min-h-svh w-full" style={{ backgroundColor: INK }}>
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src={TEXTURE}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover brightness-[0.88] saturate-[0.92]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,46,34,0.72) 0%, rgba(6,22,16,0.88) 100%)',
          }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto w-full max-w-7xl px-4 pt-6 pb-16 sm:px-8 lg:px-10" aria-label="Shop">
          <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p
                className="m-0 text-[0.62rem] font-semibold tracking-[0.18em] uppercase"
                style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
              >
                Full range
              </p>
              <h1
                className="mt-1 m-0 uppercase"
                style={{
                  color: CREAM,
                  fontFamily: 'Anton, Impact, sans-serif',
                  fontSize: 'clamp(2.2rem, 6vw, 3.6rem)',
                  letterSpacing: '0.04em',
                  lineHeight: 0.95,
                }}
              >
                Shop
              </h1>
            </div>

            <div className="relative w-full max-w-md">
              <label htmlFor="shop-search" className="sr-only">
                Search products
              </label>
              <span
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 opacity-55"
                style={{ color: CREAM }}
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
                className="w-full border py-3 pr-4 pl-10 text-[0.9rem] outline-none transition placeholder:opacity-40 focus:border-[#b8860b]/55"
                style={{
                  color: CREAM,
                  backgroundColor: 'rgba(243,230,200,0.08)',
                  borderColor: BORDER,
                  fontFamily: 'Inter, sans-serif',
                  borderRadius: 0,
                  backdropFilter: 'blur(10px)',
                }}
              />
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="cursor-pointer border px-4 py-2 text-[0.75rem] font-semibold tracking-[0.12em] uppercase"
              style={{
                color: CREAM,
                borderColor: BORDER,
                backgroundColor: PANEL,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {filtersOpen ? 'Hide filters' : 'Filters'}
            </button>
            <p className="m-0 text-[0.78rem] opacity-55" style={{ color: CREAM }}>
              {filtered.length} products
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
            <div className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>{sidebar}</div>

            <section className="min-w-0 flex-1">
              <div className="mb-4 hidden items-center justify-between lg:flex">
                <p className="m-0 text-[0.8rem] opacity-55" style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}>
                  Showing <span style={{ color: GOLD }}>{filtered.length}</span> of {products.length} products
                </p>
              </div>

              {loading ? (
                <p className="m-0 py-16 text-center text-[0.95rem]" style={{ color: CREAM }}>
                  Loading products…
                </p>
              ) : error ? (
                <div
                  className="border px-6 py-16 text-center"
                  style={{ borderColor: BORDER, backgroundColor: PANEL }}
                >
                  <p className="m-0 text-[1rem]" style={{ color: CREAM }}>
                    {error}
                  </p>
                  <p className="mt-2 m-0 text-[0.8rem] opacity-60" style={{ color: CREAM }}>
                    Make sure the API is running and MongoDB is connected.
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div
                  className="border px-6 py-16 text-center"
                  style={{ borderColor: BORDER, backgroundColor: PANEL }}
                >
                  <p className="m-0 text-[1rem]" style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}>
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
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((product) => (
                    <ShopProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
