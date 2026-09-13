import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ApiRequestError } from '../lib/api'
import {
  adminSectionFromPath,
  isAdminPath,
  isCartPath,
  isCheckoutPath,
  isShopPath,
  isWishlistPath,
} from '../lib/appRoutes'
import { productsApi, categoriesApi } from '../lib/services'
import { prefetchProductImages, primeProductImages } from '../lib/productImageCache'
import { getProductImages, type ShopProduct } from '../lib/shopCatalog'

type RefreshOptions = {
  /** Keep showing current products while reloading */
  silent?: boolean
}

export type CatalogCategory = {
  id: string
  name: string
}

type CatalogContextValue = {
  products: ShopProduct[]
  categories: string[]
  categoryItems: CatalogCategory[]
  loading: boolean
  error: string | null
  refresh: (options?: RefreshOptions) => Promise<void>
  ensureLoaded: () => Promise<void>
  prefetch: () => void
  upsertProduct: (product: ShopProduct) => Promise<ShopProduct>
  removeProduct: (id: string) => Promise<void>
  getProduct: (id: string) => ShopProduct | undefined
  addCategory: (name: string) => Promise<string>
  removeCategory: (id: string) => Promise<void>
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

const MAX_LOAD_ATTEMPTS = 2
const CART_STORAGE_KEY = 'tm-cart-v1'
const CACHE_KEY = 'tm-catalog-v1'
const ADMIN_CACHE_KEY = 'tm-catalog-admin-v1'
const CACHE_TTL_MS = 10 * 60_000

function catalogViewForPath(pathname = window.location.pathname): 'summary' | 'admin' {
  return isAdminPath(pathname) ? 'admin' : 'summary'
}

function loadDelayMs(attempt: number) {
  return Math.min(350 * 2 ** attempt, 1500)
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function adminNeedsCatalog(pathname: string) {
  const section = adminSectionFromPath(pathname)
  return section === 'products' || section === 'discounts'
}

function isCatalogPath(pathname: string) {
  return (
    isShopPath(pathname) ||
    isCartPath(pathname) ||
    isCheckoutPath(pathname) ||
    isWishlistPath(pathname) ||
    (isAdminPath(pathname) && adminNeedsCatalog(pathname))
  )
}

function hasPersistedCartLines() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0
  } catch {
    return false
  }
}

function readCacheByKey(key: string): { items: ShopProduct[]; categories: string[] } | null {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as {
      items?: ShopProduct[]
      categories?: string[]
      ts?: number
    }
    if (!parsed.items?.length || !parsed.ts || Date.now() - parsed.ts > CACHE_TTL_MS) {
      return null
    }
    return {
      items: parsed.items,
      categories: parsed.categories ?? [],
    }
  } catch {
    return null
  }
}

function writeCacheByKey(key: string, items: ShopProduct[], categories: string[]) {
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify({ items, categories, ts: Date.now() }),
    )
  } catch {
    /* quota / private mode */
  }
}

function readCache() {
  return readCacheByKey(CACHE_KEY)
}

function writeCache(items: ShopProduct[], categories: string[]) {
  writeCacheByKey(CACHE_KEY, items, categories)
}

function isPersistedProductId(id: string) {
  return /^[a-f0-9]{24}$/i.test(id)
}

function isLocalProductId(id: string) {
  return id.startsWith('prod-')
}

function readCacheForPath(pathname = window.location.pathname): { items: ShopProduct[]; categories: string[] } | null {
  if (isAdminPath(pathname) && adminNeedsCatalog(pathname)) {
    return readCacheByKey(ADMIN_CACHE_KEY)
  }
  if (isAdminPath(pathname)) return null
  return readCache()
}

function syncShopCache(items: ShopProduct[], categories: string[]) {
  if (typeof window === 'undefined' || isAdminPath(window.location.pathname)) return
  writeCache(items, categories)
}

function shouldLoadCatalog(pathname = window.location.pathname) {
  return isCatalogPath(pathname) || hasPersistedCartLines()
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const initialPath = typeof window !== 'undefined' ? window.location.pathname : '/'
  const cached = readCacheForPath(initialPath)
  const [products, setProducts] = useState<ShopProduct[]>(() => cached?.items ?? [])
  const [categories, setCategories] = useState<string[]>(() => cached?.categories ?? [])
  const [categoryItems, setCategoryItems] = useState<CatalogCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasLoadedRef = useRef(Boolean(cached?.items.length))
  const catalogViewRef = useRef<'summary' | 'admin'>(catalogViewForPath())
  const loadGenRef = useRef(0)
  const loadPromiseRef = useRef<Promise<void> | null>(null)
  const imagePrefetchKeyRef = useRef('')

  const refresh = useCallback(async (options?: RefreshOptions) => {
    const gen = ++loadGenRef.current
    const view = catalogViewForPath()
    const silent = options?.silent && hasLoadedRef.current && catalogViewRef.current === view

    if (!silent) {
      setLoading(!hasLoadedRef.current)
    }
    setError(null)

    for (let attempt = 0; attempt < MAX_LOAD_ATTEMPTS; attempt += 1) {
      if (gen !== loadGenRef.current) return

      try {
        const [data, dbCategories] = await Promise.all([
          productsApi.list({ limit: 100, view }),
          categoriesApi.list().catch(() => [] as CatalogCategory[]),
        ])
        if (gen !== loadGenRef.current) return

        const categoryNames = [
          ...new Set([
            ...dbCategories.map((c) => c.name),
            ...(data.categories?.length ? data.categories : []),
          ]),
        ]
        setCategoryItems(dbCategories)
        setProducts(data.items)
        setCategories(categoryNames)
        if (view === 'summary') {
          writeCache(data.items, categoryNames)
        } else if (view === 'admin') {
          writeCacheByKey(ADMIN_CACHE_KEY, data.items, categoryNames)
        }
        catalogViewRef.current = view
        hasLoadedRef.current = true
        setError(null)
        setLoading(false)
        return
      } catch (err) {
        if (gen !== loadGenRef.current) return

        const retryable =
          err instanceof ApiRequestError &&
          (err.status === 0 || err.status === 502 || err.status === 503 || err.status === 504 || err.status === 429)

        if (retryable && attempt < MAX_LOAD_ATTEMPTS - 1) {
          await sleep(loadDelayMs(attempt))
          continue
        }

        setError(err instanceof Error ? err.message : 'Failed to load products')
        if (!hasLoadedRef.current) {
          setProducts([])
        }
        setLoading(false)
        return
      }
    }
  }, [])

  const ensureLoaded = useCallback(async () => {
    const view = catalogViewForPath()
    const mustRefetch = view === 'admin' || catalogViewRef.current !== view
    if (hasLoadedRef.current && !error && !mustRefetch) return
    if (loadPromiseRef.current) {
      await loadPromiseRef.current
      return
    }
    const promise = refresh({ silent: hasLoadedRef.current && catalogViewRef.current === view })
    loadPromiseRef.current = promise
    try {
      await promise
    } finally {
      loadPromiseRef.current = null
    }
  }, [error, refresh])

  const prefetch = useCallback(() => {
    if (hasLoadedRef.current || loadPromiseRef.current) return
    void refresh({ silent: products.length > 0 })
  }, [refresh, products.length])

  useEffect(() => {
    if (loading || !products.length) return
    const view = catalogViewForPath()
    if (view !== 'summary' && view !== 'admin') return
    const key = `${view}:${products.map((p) => p.id).join('|')}`
    if (imagePrefetchKeyRef.current === key) return
    imagePrefetchKeyRef.current = key
    void prefetchProductImages(products).catch(() => {
      imagePrefetchKeyRef.current = ''
    })
  }, [products, loading])

  useEffect(() => {
    const maybeLoad = () => {
      if (shouldLoadCatalog()) {
        void ensureLoaded()
      }
    }

    maybeLoad()
    window.addEventListener('popstate', maybeLoad)
    return () => window.removeEventListener('popstate', maybeLoad)
  }, [ensureLoaded])

  useEffect(() => {
    const t = window.setTimeout(() => prefetch(), 0)
    return () => window.clearTimeout(t)
  }, [prefetch])

  useEffect(() => {
    const retryIfNeeded = () => {
      if (document.visibilityState !== 'visible') return
      if (loading) return
      if (!shouldLoadCatalog()) return
      if (error || !hasLoadedRef.current) {
        void refresh({ silent: hasLoadedRef.current })
      }
    }

    window.addEventListener('focus', retryIfNeeded)
    document.addEventListener('visibilitychange', retryIfNeeded)
    return () => {
      window.removeEventListener('focus', retryIfNeeded)
      document.removeEventListener('visibilitychange', retryIfNeeded)
    }
  }, [error, loading, refresh])

  const upsertProduct = useCallback(async (product: ShopProduct) => {
    await ensureLoaded()
    const exists =
      isPersistedProductId(product.id) && products.some((p) => p.id === product.id)
    const submittedImages = getProductImages(product)
    const saved = exists
      ? await productsApi.update(product.id, product)
      : await productsApi.create(
          (({ id: _id, ...rest }) => rest)(product) as Parameters<typeof productsApi.create>[0],
        )
    const merged: ShopProduct = {
      ...saved,
      image: submittedImages[0] || saved.image,
      images: submittedImages.length ? submittedImages : saved.images,
      hasStoredImage: submittedImages.length > 0 || saved.hasStoredImage,
    }
    if (submittedImages.length) {
      primeProductImages(saved.id, { image: submittedImages[0], images: submittedImages })
    }
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== product.id)
      const i = next.findIndex((p) => p.id === merged.id)
      if (i >= 0) {
        next[i] = merged
      } else {
        next.unshift(merged)
      }
      syncShopCache(next, categories)
      return next
    })
    hasLoadedRef.current = true
    return merged
  }, [ensureLoaded, products, categories])

  const removeProduct = useCallback(async (id: string) => {
    if (!isLocalProductId(id)) {
      try {
        await productsApi.remove(id)
      } catch (err) {
        const gone = err instanceof ApiRequestError && err.status === 404
        if (!gone) throw err
      }
    }

    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id)
      syncShopCache(next, categories)
      return next
    })
    hasLoadedRef.current = true
    await refresh({ silent: true })
  }, [categories, refresh])

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  )

  const addCategory = useCallback(async (name: string) => {
    const trimmed = name.trim()
    if (trimmed.length < 2) throw new Error('Category name is required')
    const created = await categoriesApi.create(trimmed)
    setCategoryItems((prev) =>
      prev.some((c) => c.id === created.id) ? prev : [...prev, created],
    )
    setCategories((prev) => (prev.includes(created.name) ? prev : [...prev, created.name]))
    return created.name
  }, [])

  const removeCategory = useCallback(async (id: string) => {
    const target = categoryItems.find((c) => c.id === id)
    await categoriesApi.remove(id)
    setCategoryItems((prev) => prev.filter((c) => c.id !== id))
    if (target) {
      setCategories((prev) => prev.filter((name) => name !== target.name))
    }
    await refresh({ silent: true })
  }, [categoryItems, refresh])

  const value = useMemo(
    () => ({
      products,
      categories,
      categoryItems,
      loading,
      error,
      refresh,
      ensureLoaded,
      prefetch,
      upsertProduct,
      removeProduct,
      getProduct,
      addCategory,
      removeCategory,
    }),
    [products, categories, categoryItems, loading, error, refresh, ensureLoaded, prefetch, upsertProduct, removeProduct, getProduct, addCategory, removeCategory],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
