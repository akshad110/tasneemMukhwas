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
  isAdminPath,
  isCartPath,
  isCheckoutPath,
  isShopPath,
  isWishlistPath,
} from '../lib/appRoutes'
import { productsApi } from '../lib/services'
import type { ShopProduct } from '../lib/shopCatalog'

type RefreshOptions = {
  /** Keep showing current products while reloading */
  silent?: boolean
}

type CatalogContextValue = {
  products: ShopProduct[]
  categories: string[]
  loading: boolean
  error: string | null
  refresh: (options?: RefreshOptions) => Promise<void>
  ensureLoaded: () => Promise<void>
  prefetch: () => void
  upsertProduct: (product: ShopProduct) => Promise<ShopProduct>
  removeProduct: (id: string) => Promise<void>
  getProduct: (id: string) => ShopProduct | undefined
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

const MAX_LOAD_ATTEMPTS = 2
const CART_STORAGE_KEY = 'tm-cart-v1'
const CACHE_KEY = 'tm-catalog-v1'
const CACHE_TTL_MS = 10 * 60_000

function catalogViewForPath(pathname = window.location.pathname): 'summary' | 'full' {
  return isAdminPath(pathname) ? 'full' : 'summary'
}

function loadDelayMs(attempt: number) {
  return Math.min(350 * 2 ** attempt, 1500)
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function isCatalogPath(pathname: string) {
  return (
    isShopPath(pathname) ||
    isCartPath(pathname) ||
    isCheckoutPath(pathname) ||
    isAdminPath(pathname) ||
    isWishlistPath(pathname)
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

function readCache(): { items: ShopProduct[]; categories: string[] } | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
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

function writeCache(items: ShopProduct[], categories: string[]) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ items, categories, ts: Date.now() }),
    )
  } catch {
    /* quota / private mode */
  }
}

function shouldLoadCatalog(pathname = window.location.pathname) {
  return isCatalogPath(pathname) || hasPersistedCartLines()
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const cached = readCache()
  const [products, setProducts] = useState<ShopProduct[]>(() => cached?.items ?? [])
  const [categories, setCategories] = useState<string[]>(() => cached?.categories ?? [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasLoadedRef = useRef(Boolean(cached?.items.length))
  const catalogViewRef = useRef<'summary' | 'full'>(catalogViewForPath())
  const loadGenRef = useRef(0)
  const loadPromiseRef = useRef<Promise<void> | null>(null)

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
        const data = await productsApi.list({ limit: 100, view })
        if (gen !== loadGenRef.current) return

        setProducts(data.items)
        setCategories(data.categories?.length ? data.categories : [])
        if (view === 'summary') {
          writeCache(data.items, data.categories?.length ? data.categories : [])
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
    if (hasLoadedRef.current && !error && catalogViewRef.current === view) return
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
    const prefetchSoon = () => prefetch()
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(prefetchSoon, { timeout: 800 })
      return () => window.cancelIdleCallback(id)
    }
    const t = window.setTimeout(prefetchSoon, 400)
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
    const exists = Boolean(product.id) && products.some((p) => p.id === product.id)
    const saved = exists
      ? await productsApi.update(product.id, product)
      : await productsApi.create(
          (({ id: _id, ...rest }) => rest)(product) as Parameters<typeof productsApi.create>[0],
        )
    setProducts((prev) => {
      const i = prev.findIndex((p) => p.id === saved.id)
      if (i >= 0) {
        const next = [...prev]
        next[i] = saved
        return next
      }
      return [saved, ...prev]
    })
    hasLoadedRef.current = true
    return saved
  }, [ensureLoaded, products])

  const removeProduct = useCallback(async (id: string) => {
    await productsApi.remove(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  )

  const value = useMemo(
    () => ({
      products,
      categories,
      loading,
      error,
      refresh,
      ensureLoaded,
      prefetch,
      upsertProduct,
      removeProduct,
      getProduct,
    }),
    [products, categories, loading, error, refresh, ensureLoaded, prefetch, upsertProduct, removeProduct, getProduct],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
