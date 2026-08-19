export type ShopVariant = {
  id: string
  label: string
  color: string
  image: string
}

export type ShopProduct = {
  id: string
  name: string
  description: string
  image: string
  fill?: string
  lightText?: boolean
  price: number
  compareAt?: number
  images?: string[]
  showDiscountedPrice?: boolean
  discountedPrice?: number
  outOfStock?: boolean
  stock?: number
  category: string
  rating: number
  reviews: number
  brand: string
  variants: ShopVariant[]
  sales?: number
}

/** Selling price used in cart / cards */
export function getSellPrice(p: ShopProduct): number {
  if (p.showDiscountedPrice && p.discountedPrice != null && p.discountedPrice > 0) {
    return p.discountedPrice
  }
  return p.price
}

/** Struck-through “was” price when a discount is shown */
export function getComparePrice(p: ShopProduct): number | undefined {
  if (p.showDiscountedPrice && p.discountedPrice != null && p.discountedPrice > 0) {
    return p.price
  }
  return p.compareAt
}

export function getProductImages(p: ShopProduct): string[] {
  const fromList = (p.images ?? []).filter(Boolean)
  if (fromList.length) return fromList.slice(0, 3)
  return p.image ? [p.image] : []
}

export const CATEGORIES = [
  'Classic Mukhwas',
  'Fruit Blend',
  'Paan Special',
  'Seed Mix',
  'Mouth Freshener',
] as const

export const BRANDS = ['Tasneem', 'Tasneem Mukhwas', 'Patel Mukhwas', 'Master Paan'] as const
