import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { productsApi } from '../lib/services'
import type { ShopProduct } from '../lib/shopCatalog'

type CatalogContextValue = {
  products: ShopProduct[]
  categories: string[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  upsertProduct: (product: ShopProduct) => Promise<ShopProduct>
  removeProduct: (id: string) => Promise<void>
  getProduct: (id: string) => ShopProduct | undefined
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await productsApi.list({ limit: 100 })
      setProducts(data.items)
      setCategories(data.categories?.length ? data.categories : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const upsertProduct = useCallback(async (product: ShopProduct) => {
    const exists = products.some((p) => p.id === product.id)
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
    return saved
  }, [products])

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
      upsertProduct,
      removeProduct,
      getProduct,
    }),
    [products, categories, loading, error, refresh, upsertProduct, removeProduct, getProduct],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
