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
export const PRODUCT_CARD_PANEL_BG = '#F8F3E7'

/** Max gallery images stored per product (admin + API). */
export const PRODUCT_MAX_GALLERY_IMAGES = 4

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
  /** One-line teaser shown on shop cards */
  shortDescription?: string
  /** Full product description shown in detail modal */
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
  if (fromList.length) return fromList.slice(0, PRODUCT_MAX_GALLERY_IMAGES)
  return p.image ? [p.image] : []
}

/** Fixed panel color for shop / cart / wishlist product imagery. */
export function getProductPanelFill(_p?: ShopProduct): string {
  return PRODUCT_CARD_PANEL_BG
}

/** Teaser line for shop cards — prefers shortDescription, else first line of long text. */
export function getProductCardTeaser(p: ShopProduct): string {
  const short = p.shortDescription?.trim()
  if (short) return short
  const long = p.description?.trim()
  if (!long) return ''
  const firstLine = long.split(/\n/)[0]?.trim() ?? long
  return firstLine.length > 120 ? `${firstLine.slice(0, 117)}…` : firstLine
}

/** Whether the detail modal has more copy than the card teaser. */
export function productHasLongDescription(p: ShopProduct): boolean {
  const long = p.description?.trim()
  if (!long) return false
  const teaser = getProductCardTeaser(p)
  return long.length > teaser.length || long.includes('\n')
}

function normalizeCopy(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

/** Full stored description — description field only, never duplicated with short. */
export function getProductLongDescription(p: ShopProduct): string {
  return p.description?.trim() || p.shortDescription?.trim() || ''
}

/** Modal / expanded copy — intro only, skips card teaser overlap, ingredients & boilerplate. */
export function getProductModalDescription(p: ShopProduct): string {
  const long = p.description?.trim() || ''
  const short = p.shortDescription?.trim() || ''
  if (!long) return short

  const paragraphs = long
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith('Ingredients:') && !line.startsWith('Hygiene-packed'))

  if (!paragraphs.length) return short || long.split(/\n+/)[0]?.trim() || long

  const shortNorm = normalizeCopy(short)
  let start = 0
  if (shortNorm) {
    const firstNorm = normalizeCopy(paragraphs[0])
    const sharesOpening =
      firstNorm.slice(0, 36) === shortNorm.slice(0, 36) ||
      firstNorm.includes(shortNorm.slice(0, 24)) ||
      shortNorm.includes(firstNorm.slice(0, 24))
    if (sharesOpening && paragraphs.length > 1) start = 1
  }

  const intro = paragraphs.slice(start, start + 2).join(' ')
  return intro || paragraphs[0] || short
}

export const CATEGORIES = [
  'Classic Mukhwas',
  'Fruit Blend',
  'Paan Special',
  'Seed Mix',
  'Mouth Freshener',
] as const

export const BRANDS = ['Tasneem', 'Tasneem Mukhwas', 'Patel Mukhwas', 'Master Paan'] as const
