import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/nav/Navbar'
import { ProductCardSkeletonGrid } from '../components/shop/ProductCardSkeleton'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'
import { scrollAppToTop } from '../lib/scrollControl'
import { getProductPanelFill, getSellPrice, type ShopProduct } from '../lib/shopCatalog'

const INK = '#0a2e22'
const CREAM = '#f2f4f5'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.58)'
const LINE = 'rgba(10,46,34,0.1)'
const PANEL = '#f3ebe0'
const TEXTURE = '/image.png_2K_202608092240.jpeg'

type SortKey = 'recent' | 'price-asc' | 'price-desc' | 'name'

function WishlistItemRow({
  product,
  index,
  onRemove,
  removing,
}: {
  product: ShopProduct
  index: number
  onRemove: () => void
  removing: boolean
}) {
  const { addItem, getQty } = useCart()
  const variantId = product.variants[0]?.id ?? 'default'
  const inCart = getQty(product.id, variantId) > 0
  const price = getSellPrice(product)
  const outOfStock = Boolean(product.outOfStock)

  return (
    <motion.article
      layout
      className="wishlist-item"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, x: -12 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.05, 0.25) }}
    >
      <div className="wishlist-item__thumb" style={{ backgroundColor: getProductPanelFill(product) }}>
        <motion.img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain object-center p-1"
          draggable={false}
          whileHover={{ scale: 1.06, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        />
      </div>

      <div className="min-w-0">
        <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.12em]" style={{ color: GOLD }}>
          {product.category}
        </p>
        <h3 className="mt-1 m-0 truncate text-[1rem] font-bold" style={{ color: INK }}>
          {product.name}
        </h3>
        <p className="mt-1 m-0 text-[0.78rem]" style={{ color: MUTED }}>
          {product.brand} · ★ {product.rating}
        </p>
        <motion.p
          key={price}
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          className="mt-2 m-0 text-[1.15rem] font-bold"
          style={{ color: GOLD }}
        >
          ₹{price}
        </motion.p>
        {inCart && (
          <span
            className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[0.65rem] font-semibold"
            style={{ backgroundColor: 'rgba(27,122,62,0.12)', color: '#1b7a3e' }}
          >
            In cart
          </span>
        )}
      </div>

      <div className="wishlist-item__actions">
        <button
          type="button"
          disabled={outOfStock || removing}
          onClick={() => addItem(product.id, variantId, 1)}
          className="cursor-pointer rounded-xl border-0 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: outOfStock ? 'rgba(10,46,34,0.08)' : INK, color: CREAM }}
        >
          {outOfStock ? 'Out of stock' : inCart ? 'Add more' : 'Add to cart'}
        </button>
        <button
          type="button"
          disabled={removing}
          onClick={onRemove}
          className="cursor-pointer rounded-xl border bg-transparent px-3 py-1.5 text-[0.72rem] font-semibold transition hover:bg-red-50 disabled:opacity-40"
          style={{ borderColor: 'rgba(163,32,32,0.25)', color: '#a32020' }}
        >
          {removing ? 'Removing…' : 'Remove'}
        </button>
      </div>
    </motion.article>
  )
}

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth()
  const { items, count, loading, refresh, remove } = useWishlist()
  const { addItem } = useCart()
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sort, setSort] = useState<SortKey>('recent')
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingAll, setAddingAll] = useState(false)

  useEffect(() => {
    document.title = 'Wishlist · Tasneem Mukhwas'
    scrollAppToTop(true)
    return () => {
      document.title = 'Tasneem Mukhwas'
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigateApp(APP_ROUTES.login)
      return
    }
    void refresh()
  }, [user, authLoading, refresh])

  const categories = useMemo(() => {
    const set = new Set(items.map((p) => p.category))
    return ['all', ...Array.from(set)]
  }, [items])

  const filteredItems = useMemo(() => {
    let list = categoryFilter === 'all' ? items : items.filter((p) => p.category === categoryFilter)
    list = [...list]
    if (sort === 'price-asc') list.sort((a, b) => getSellPrice(a) - getSellPrice(b))
    else if (sort === 'price-desc') list.sort((a, b) => getSellPrice(b) - getSellPrice(a))
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [items, categoryFilter, sort])

  const totalValue = items.reduce((sum, p) => sum + getSellPrice(p), 0)
  const inStockCount = items.filter((p) => !p.outOfStock).length

  const handleRemove = async (productId: string) => {
    setRemovingId(productId)
    try {
      await remove(productId)
    } finally {
      setRemovingId(null)
    }
  }

  const addAllToCart = async () => {
    setAddingAll(true)
    try {
      for (const product of items) {
        if (product.outOfStock) continue
        const variantId = product.variants[0]?.id ?? 'default'
        addItem(product.id, variantId, 1)
      }
    } finally {
      setAddingAll(false)
    }
  }

  return (
    <div className="wishlist-page" style={{ backgroundColor: CREAM, fontFamily: 'Inter, sans-serif' }}>
      <div
        className="wishlist-page__bg"
        style={{
          backgroundImage: `url(${TEXTURE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(1.55) saturate(0.35)',
          opacity: 0.35,
        }}
        aria-hidden
      />
      <div
        className="wishlist-page__bg"
        style={{
          background:
            'linear-gradient(180deg, rgba(242,244,245,0.92) 0%, rgba(242,244,245,0.7) 50%, rgba(242,244,245,0.95) 100%)',
        }}
        aria-hidden
      />

      <div className="relative z-[1]">
        <Navbar />

        <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          <motion.button
            type="button"
            onClick={() => navigateApp(APP_ROUTES.shop)}
            className="group mb-6 inline-flex cursor-pointer items-center gap-3 border-0 bg-transparent"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl border transition group-hover:border-[rgba(184,134,11,0.9)]"
              style={{ borderColor: LINE, backgroundColor: '#fff', color: INK }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-left">
              <span className="block text-[0.62rem] font-semibold tracking-[0.16em] uppercase" style={{ color: GOLD }}>
                Continue
              </span>
              <span className="block text-[0.88rem] font-semibold" style={{ color: INK }}>
                Back to shop
              </span>
            </span>
          </motion.button>

          <header className="wishlist-hero px-6 py-8 sm:px-10 sm:py-10">
            <div
              className="pointer-events-none absolute -right-6 -top-8 h-36 w-36 rounded-full opacity-25 blur-3xl"
              style={{ backgroundColor: GOLD }}
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase" style={{ color: GOLD }}>
                  Saved for later
                </p>
                <h1 className="mt-2 m-0 flex items-center gap-3 text-[2rem] font-bold sm:text-[2.4rem]" style={{ color: INK }}>
                  <motion.span
                    className="wishlist-hero__heart"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
                    </svg>
                  </motion.span>
                  Your Wishlist
                </h1>
                <p className="mt-3 m-0 max-w-lg text-[0.92rem] leading-relaxed" style={{ color: MUTED }}>
                  Curate the mukhwas you love. Hearts sync across every device while you&apos;re signed in.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <motion.div className="wishlist-stat" whileHover={{ y: -2 }}>
                  <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-wide" style={{ color: MUTED }}>
                    Items
                  </p>
                  <motion.p
                    key={count}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-1 m-0 text-[1.4rem] font-bold"
                    style={{ color: INK }}
                  >
                    {count}
                  </motion.p>
                </motion.div>
                <motion.div className="wishlist-stat" whileHover={{ y: -2 }}>
                  <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-wide" style={{ color: MUTED }}>
                    Est. value
                  </p>
                  <motion.p
                    key={totalValue}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-1 m-0 text-[1.4rem] font-bold"
                    style={{ color: GOLD }}
                  >
                    ₹{totalValue}
                  </motion.p>
                </motion.div>
                <motion.div className="wishlist-stat" whileHover={{ y: -2 }}>
                  <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-wide" style={{ color: MUTED }}>
                    In stock
                  </p>
                  <p className="mt-1 m-0 text-[1.4rem] font-bold" style={{ color: '#1b7a3e' }}>
                    {inStockCount}
                  </p>
                </motion.div>
              </div>
            </div>
          </header>

          {loading || authLoading ? (
            <div className="mt-10">
              <ProductCardSkeletonGrid count={3} className="grid grid-cols-1 gap-4 lg:grid-cols-2" />
            </div>
          ) : items.length === 0 ? (
            <motion.div
              className="wishlist-empty mt-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: PANEL, color: GOLD }}
              >
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
                </svg>
              </motion.div>
              <h2 className="mt-5 m-0 text-[1.35rem] font-bold" style={{ color: INK }}>
                Your wishlist is empty
              </h2>
              <p className="mx-auto mt-2 m-0 max-w-md text-[0.92rem]" style={{ color: MUTED }}>
                Tap the heart on any product while browsing the shop to save it here.
              </p>
              <motion.button
                type="button"
                onClick={() => navigateApp(APP_ROUTES.shop)}
                className="mt-7 cursor-pointer rounded-2xl border-0 px-7 py-3 text-[0.78rem] font-bold uppercase tracking-wide"
                style={{ backgroundColor: INK, color: CREAM }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore shop
              </motion.button>
            </motion.div>
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
              <section aria-label="Saved products">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="m-0 text-[0.68rem] font-semibold tracking-[0.18em] uppercase" style={{ color: GOLD }}>
                      Favourites
                    </p>
                    <h2 className="mt-1 m-0 text-[1.2rem] font-bold" style={{ color: INK }}>
                      {filteredItems.length} saved {filteredItems.length === 1 ? 'product' : 'products'}
                    </h2>
                  </div>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="cursor-pointer rounded-xl border px-3 py-2 text-[0.78rem] font-semibold outline-none"
                    style={{ borderColor: LINE, color: INK, backgroundColor: '#fff' }}
                    aria-label="Sort wishlist"
                  >
                    <option value="recent">Recently saved</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                    <option value="name">Name A–Z</option>
                  </select>
                </div>

                {categories.length > 2 && (
                  <div className="wishlist-filter mb-5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoryFilter(cat)}
                        className={`wishlist-filter__chip ${categoryFilter === cat ? 'wishlist-filter__chip--active' : ''}`}
                      >
                        {cat === 'all' ? 'All blends' : cat}
                      </button>
                    ))}
                  </div>
                )}

                <motion.div layout className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((product, index) => (
                      <WishlistItemRow
                        key={product.id}
                        product={product}
                        index={index}
                        removing={removingId === product.id}
                        onRemove={() => void handleRemove(product.id)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {filteredItems.length === 0 && (
                  <p className="mt-6 m-0 text-center text-[0.88rem]" style={{ color: MUTED }}>
                    No products in this category. Try another filter.
                  </p>
                )}
              </section>

              <aside className="wishlist-sidebar hidden lg:block">
                <p className="m-0 text-[0.68rem] font-semibold tracking-[0.14em] uppercase" style={{ color: GOLD }}>
                  Quick actions
                </p>
                <h3 className="mt-1 m-0 text-[1.05rem] font-bold" style={{ color: INK }}>
                  Ready to order?
                </h3>
                <p className="mt-2 m-0 text-[0.8rem] leading-relaxed" style={{ color: MUTED }}>
                  Add everything in stock to your cart in one tap, or review your bag before checkout.
                </p>

                <dl className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: LINE }}>
                  <div className="flex justify-between text-[0.82rem]">
                    <dt style={{ color: MUTED }}>Items</dt>
                    <dd className="m-0 font-bold" style={{ color: INK }}>
                      {count}
                    </dd>
                  </div>
                  <div className="flex justify-between text-[0.82rem]">
                    <dt style={{ color: MUTED }}>Est. total</dt>
                    <dd className="m-0 font-bold" style={{ color: GOLD }}>
                      ₹{totalValue}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 space-y-2.5">
                  <button
                    type="button"
                    disabled={addingAll || inStockCount === 0}
                    onClick={() => void addAllToCart()}
                    className="wishlist-sidebar__btn wishlist-sidebar__btn--gold"
                  >
                    {addingAll ? 'Adding…' : `Add all to cart (${inStockCount})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateApp(APP_ROUTES.cart)}
                    className="wishlist-sidebar__btn wishlist-sidebar__btn--ink"
                  >
                    View cart
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateApp(APP_ROUTES.shop)}
                    className="wishlist-sidebar__btn"
                    style={{ background: '#fff', border: `1.5px solid ${LINE}`, color: INK }}
                  >
                    Continue shopping
                  </button>
                </div>
              </aside>
            </div>
          )}

          {/* Mobile sticky actions */}
          {items.length > 0 && (
            <div
              className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t p-3 lg:hidden"
              style={{
                borderColor: LINE,
                backgroundColor: 'rgba(248,249,250,0.96)',
                backdropFilter: 'blur(10px)',
                paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
              }}
            >
              <button
                type="button"
                disabled={addingAll || inStockCount === 0}
                onClick={() => void addAllToCart()}
                className="flex-1 cursor-pointer rounded-xl border-0 py-3 text-[0.75rem] font-bold uppercase disabled:opacity-40"
                style={{ backgroundColor: GOLD, color: INK }}
              >
                Add all ({inStockCount})
              </button>
              <button
                type="button"
                onClick={() => navigateApp(APP_ROUTES.cart)}
                className="flex-1 cursor-pointer rounded-xl border-0 py-3 text-[0.75rem] font-bold uppercase"
                style={{ backgroundColor: INK, color: CREAM }}
              >
                View cart
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
