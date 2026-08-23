export type ShopVariant = {
  id: string
  label: string
  color: string
  image: string
}

/** Admin-selectable pack sizes (grams) */
export const GRAM_OPTIONS = [100, 250, 500, 750, 1000] as const

export type GramOption = (typeof GRAM_OPTIONS)[number]

export function isLegacyDefaultVariant(variant: ShopVariant) {
  return variant.id === 'default' || /^default$/i.test(variant.label.trim())
}

export function parseGramOptionsFromVariants(variants: ShopVariant[]): number[] {
  const found = variants
    .map((v) => {
      if (isLegacyDefaultVariant(v)) return 100
      const fromId = /^(\d+)g$/i.exec(v.id)?.[1]
      const fromLabel = /(\d+)\s*g/i.exec(v.label)?.[1]
      const n = Number(fromId ?? fromLabel)
      return Number.isFinite(n) ? n : null
    })
    .filter((n): n is number => n != null)

  const valid = [...new Set(found.filter((g) => (GRAM_OPTIONS as readonly number[]).includes(g)))]
  if (valid.length) return valid.sort((a, b) => a - b)
  return [100]
}

export function buildGramVariants(grams: number[], fill: string, image: string): ShopVariant[] {
  const sorted = [...new Set(grams)].sort((a, b) => a - b)
  return sorted.map((g) => ({
    id: `${g}g`,
    label: `${g} gm`,
    color: fill,
    image,
  }))
}

/** Uniform light panel behind product imagery on shop cards */
export const PRODUCT_CARD_PANEL_BG = '#eef0ec'

/** Map old "Default" variants to 100 gm for display and cart. */
export function normalizeProductVariants(variants: ShopVariant[]): ShopVariant[] {
  if (!variants.length) {
    return [{ id: '100g', label: '100 gm', color: '#0a2e22', image: '' }]
  }

  return variants.map((variant) => {
    if (isLegacyDefaultVariant(variant)) {
      return { ...variant, id: '100g', label: '100 gm' }
    }
    const grams = /^(\d+)g$/i.exec(variant.id)?.[1]
    if (grams) {
      return { ...variant, label: `${grams} gm` }
    }
    return variant
  })
}

export type ShopProduct = {
  id: string
  name: string
  description: string
  image: string
  fill?: string
  showPanelBg?: boolean
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
  /** True when product has image data stored server-side (may be lazy-loaded). */
  hasStoredImage?: boolean
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

/** Fixed panel color for shop / cart / wishlist product imagery. */
export function getProductPanelFill(_p?: ShopProduct): string {
  return PRODUCT_CARD_PANEL_BG
}

export const CATEGORIES = [
  'Classic Mukhwas',
  'Fruit Blend',
  'Paan Special',
  'Seed Mix',
  'Mouth Freshener',
] as const

export const BRANDS = ['Tasneem', 'Tasneem Mukhwas', 'Patel Mukhwas', 'Master Paan'] as const
