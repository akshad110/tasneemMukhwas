import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import { wishlistApi } from '../lib/services'
import type { ShopProduct } from '../lib/shopCatalog'

type WishlistContextValue = {
  items: ShopProduct[]
  productIds: Set<string>
  count: number
  loading: boolean
  isWishlisted: (productId: string) => boolean
  toggle: (productId: string) => Promise<boolean>
  remove: (productId: string) => Promise<void>
  refresh: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<ShopProduct[]>([])
  const [productIds, setProductIds] = useState<Set<string>>(() => new Set())
  const [loading, setLoading] = useState(false)

  const applyPayload = useCallback((nextItems: ShopProduct[], ids: string[]) => {
    setItems(nextItems)
    setProductIds(new Set(ids))
  }, [])

  const refresh = useCallback(async () => {
    if (!user) {
      applyPayload([], [])
      return
    }
    setLoading(true)
    try {
      const data = await wishlistApi.get()
      applyPayload(data.items, data.wishlist.productIds)
    } catch {
      applyPayload([], [])
    } finally {
      setLoading(false)
    }
  }, [user, applyPayload])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      applyPayload([], [])
      return
    }
    void refresh()
  }, [user, authLoading, refresh, applyPayload])

  const isWishlisted = useCallback(
    (productId: string) => productIds.has(productId),
    [productIds],
  )

  const toggle = useCallback(
    async (productId: string) => {
      if (!user) return false

      const wasWishlisted = productIds.has(productId)
      if (wasWishlisted) {
        const data = await wishlistApi.remove(productId)
        applyPayload(data.items, data.wishlist.productIds)
        return false
      }

      const data = await wishlistApi.add(productId)
      applyPayload(data.items, data.wishlist.productIds)
      return true
    },
    [user, productIds, applyPayload],
  )

  const remove = useCallback(
    async (productId: string) => {
      if (!user) return
      const data = await wishlistApi.remove(productId)
      applyPayload(data.items, data.wishlist.productIds)
    },
    [user, applyPayload],
  )

  const value = useMemo(
    () => ({
      items,
      productIds,
      count: productIds.size,
      loading,
      isWishlisted,
      toggle,
      remove,
      refresh,
    }),
    [items, productIds, loading, isWishlisted, toggle, remove, refresh],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
