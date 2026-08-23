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
import { ApiRequestError, warmApi } from '../lib/api'
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
  upsertProduct: (product: ShopProduct) => Promise<ShopProduct>
  removeProduct: (id: string) => Promise<void>
  getProduct: (id: string) => ShopProduct | undefined
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

const MAX_LOAD_ATTEMPTS = 4
const CART_STORAGE_KEY = 'tm-cart-v1'

function loadDelayMs(attempt: number) {
  return Math.min(500 * 2 ** attempt, 3000)
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

function shouldLoadCatalog(pathname = window.location.pathname) {
  return isCatalogPath(pathname) || hasPersistedCartLines()
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasLoadedRef = useRef(false)
  const loadGenRef = useRef(0)
  const loadPromiseRef = useRef<Promise<void> | null>(null)

  const refresh = useCallback(async (options?: RefreshOptions) => {
    const gen = ++loadGenRef.current
    const silent = options?.silent && hasLoadedRef.current

    if (!silent) {
      setLoading(true)
    }
    setError(null)

    if (!hasLoadedRef.current) {
      await warmApi(2)
    }

    for (let attempt = 0; attempt < MAX_LOAD_ATTEMPTS; attempt += 1) {
      if (gen !== loadGenRef.current) return

      try {
        const data = await productsApi.list({ limit: 100 })
        if (gen !== loadGenRef.current) return

        setProducts(data.items)
        setCategories(data.categories?.length ? data.categories : [])
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
          if (attempt >= 1) await warmApi(1)
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
    if (hasLoadedRef.current) return
    if (loadPromiseRef.current) {
      await loadPromiseRef.current
      return
    }
    const promise = refresh()
    loadPromiseRef.current = promise
    try {
      await promise
    } finally {
      loadPromiseRef.current = null
    }
  }, [refresh])

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
      upsertProduct,
      removeProduct,
      getProduct,
    }),
    [products, categories, loading, error, refresh, ensureLoaded, upsertProduct, removeProduct, getProduct],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
