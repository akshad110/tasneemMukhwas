import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getSellPrice, parsePackTypeFromVariantId, type ShopProduct, type ShopVariant } from '../lib/shopCatalog'
import { useCatalog } from './CatalogContext'

const STORAGE_KEY = 'tm-cart-v1'

export type CartLine = {
  productId: string
  variantId: string
  qty: number
}

export type CartResolvedItem = CartLine & {
  product: ShopProduct
  variant: ShopVariant
  lineTotal: number
}

type CartContextValue = {
  lines: CartLine[]
  items: CartResolvedItem[]
  itemCount: number
  subtotal: number
  getQty: (productId: string, variantId: string) => number
  setQty: (productId: string, variantId: string, qty: number) => void
  addItem: (productId: string, variantId: string, qty?: number) => void
  removeItem: (productId: string, variantId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function lineKey(productId: string, variantId: string) {
  return `${productId}::${variantId}`
}

function loadLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLine[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (l) =>
        typeof l?.productId === 'string' &&
        typeof l?.variantId === 'string' &&
        typeof l?.qty === 'number' &&
        l.qty > 0,
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useCatalog()
  const [lines, setLines] = useState<CartLine[]>(() =>
    typeof window === 'undefined' ? [] : loadLines(),
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines])

  const setQty = useCallback((productId: string, variantId: string, qty: number) => {
    const next = Math.max(0, Math.min(99, Math.floor(qty)))
    setLines((prev) => {
      const key = lineKey(productId, variantId)
      const without = prev.filter((l) => lineKey(l.productId, l.variantId) !== key)
      if (next <= 0) return without
      return [...without, { productId, variantId, qty: next }]
    })
  }, [])

  const addItem = useCallback((productId: string, variantId: string, qty = 1) => {
    setLines((prev) => {
      const key = lineKey(productId, variantId)
      const existing = prev.find((l) => lineKey(l.productId, l.variantId) === key)
      if (existing) {
        return prev.map((l) =>
          lineKey(l.productId, l.variantId) === key
            ? { ...l, qty: Math.min(99, l.qty + qty) }
            : l,
        )
      }
      return [...prev, { productId, variantId, qty: Math.min(99, qty) }]
    })
  }, [])

  const removeItem = useCallback((productId: string, variantId: string) => {
    setLines((prev) =>
      prev.filter((l) => lineKey(l.productId, l.variantId) !== lineKey(productId, variantId)),
    )
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const getQty = useCallback(
    (productId: string, variantId: string) =>
      lines.find((l) => lineKey(l.productId, l.variantId) === lineKey(productId, variantId))
        ?.qty ?? 0,
    [lines],
  )

  const items = useMemo(() => {
    const resolved: CartResolvedItem[] = []
    for (const line of lines) {
      const product = products.find((p) => p.id === line.productId)
      if (!product || product.outOfStock) continue
      const variant =
        product.variants.find((v) => v.id === line.variantId) ?? product.variants[0]
      if (!variant) continue
      resolved.push({
        ...line,
        variantId: variant.id,
        product,
        variant,
        lineTotal: getSellPrice(product, parsePackTypeFromVariantId(variant.id)) * line.qty,
      })
    }
    return resolved
  }, [lines, products])

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.lineTotal, 0), [items])

  const value = useMemo(
    () => ({
      lines,
      items,
      itemCount,
      subtotal,
      getQty,
      setQty,
      addItem,
      removeItem,
      clearCart,
    }),
    [lines, items, itemCount, subtotal, getQty, setQty, addItem, removeItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
