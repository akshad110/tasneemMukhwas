export type ShopVariant = {
  id: string
  label: string
  color: string
  image: string
}

export type PackType = 'packet' | 'bottle'

export const PACK_FORMAT_FILTER_LABELS: Record<PackType, string> = {
  packet: 'Tasneem Standy Mukhwas',
  bottle: 'Tasneem Bottle Mukhwas',
}

export const PACK_FORMAT_BADGE_LABELS: Record<PackType, string> = {
  packet: 'Packet',
  bottle: 'Bottle',
}

/** Default product categories — seeded on backend; fallback for offline UI. */
export const DEFAULT_CATEGORIES = [
  'Our Salted Mukhwas',
  'Our Sweet Mukhwas',
  'Our Taste Shots',
  'Our Imli Masti',
  'Our Mango Masti',
] as const

/** @deprecated Use categories from CatalogContext or DEFAULT_CATEGORIES */
export const CATEGORIES = DEFAULT_CATEGORIES

export const GRAM_STEP = 10
export const DEFAULT_GRAM = 100

/** Admin-selectable pack sizes (grams) — legacy checkbox grid */
export const GRAM_OPTIONS = [100, 250, 500, 750, 1000] as const

export type GramOption = (typeof GRAM_OPTIONS)[number]

export function isLegacyDefaultVariant(variant: ShopVariant) {
  return variant.id === 'default' || /^default$/i.test(variant.label.trim())
}

export function parsePackTypeFromVariantId(variantId: string): PackType {
  if (variantId.startsWith('bottle-')) return 'bottle'
  return 'packet'
}

export function getProductPackFormat(product: ShopProduct): PackType {
  if (product.packFormat === 'bottle') return 'bottle'
  if (product.packFormat === 'packet') return 'packet'
  if (product.bottleEnabled && product.packetEnabled === false) return 'bottle'
  return 'packet'
}

export function getProductPackTypes(product: ShopProduct): PackType[] {
  return [getProductPackFormat(product)]
}

export function parseGramOptionsFromVariants(
  variants: ShopVariant[],
  packType?: PackType,
): number[] {
  const scoped = packType
    ? variants.filter((v) => parsePackTypeFromVariantId(v.id) === packType)
    : variants

  const found = scoped
    .map((v) => {
      if (isLegacyDefaultVariant(v)) return DEFAULT_GRAM
      const fromId = /^(?:packet-|bottle-)?(\d+)g$/i.exec(v.id)?.[1]
      const fromLabel = /(\d+)\s*g/i.exec(v.label)?.[1]
      const n = Number(fromId ?? fromLabel)
      return Number.isFinite(n) ? n : null
    })
    .filter((n): n is number => n != null)

  const valid = [...new Set(found.filter((g) => g >= GRAM_STEP))]
  if (valid.length) return valid.sort((a, b) => a - b)
  return [DEFAULT_GRAM]
}

export function buildPackVariants(
  packType: PackType,
  grams: number[],
  fill: string,
  image: string,
): ShopVariant[] {
  const sorted = [...new Set(grams.filter((g) => g >= GRAM_STEP))].sort((a, b) => a - b)
  return sorted.map((g) => ({
    id: `${packType}-${g}g`,
    label: `${g} gm`,
    color: fill,
    image,
  }))
}

export function buildAllPackVariants(
  packetGrams: number[],
  bottleGrams: number[],
  fill: string,
  image: string,
  options?: { packetEnabled?: boolean; bottleEnabled?: boolean },
): ShopVariant[] {
  const variants: ShopVariant[] = []
  if (options?.packetEnabled !== false) {
    variants.push(...buildPackVariants('packet', packetGrams, fill, image))
  }
  if (options?.bottleEnabled) {
    variants.push(...buildPackVariants('bottle', bottleGrams, fill, image))
  }
  return variants.length ? variants : buildPackVariants('packet', [DEFAULT_GRAM], fill, image)
}

/** @deprecated Use buildPackVariants / buildAllPackVariants */
export function buildGramVariants(grams: number[], fill: string, image: string): ShopVariant[] {
  return buildPackVariants('packet', grams, fill, image)
}

/** Uniform light panel behind product imagery on shop cards */
export const PRODUCT_CARD_PANEL_BG = '#F8F3E7'

/** Max gallery images stored per product (admin + API). */
export const PRODUCT_MAX_GALLERY_IMAGES = 4

/** Map old "Default" / plain gram variants to normalized pack-prefixed ids. */
export function normalizeProductVariants(variants: ShopVariant[]): ShopVariant[] {
  if (!variants.length) {
    return [{ id: 'packet-100g', label: '100 gm', color: '#0a2e22', image: '' }]
  }

  return variants.map((variant) => {
    if (isLegacyDefaultVariant(variant)) {
      return { ...variant, id: 'packet-100g', label: '100 gm' }
    }
    const packGram = /^(packet|bottle)-(\d+)g$/i.exec(variant.id)
    if (packGram) {
      return { ...variant, id: `${packGram[1].toLowerCase()}-${packGram[2]}g`, label: `${packGram[2]} gm` }
    }
    const grams = /^(\d+)g$/i.exec(variant.id)?.[1]
    if (grams) {
      return { ...variant, id: `packet-${grams}g`, label: `${grams} gm` }
    }
    return variant
  })
}

export function getVariantsForPackType(product: ShopProduct, packType: PackType): ShopVariant[] {
  const all = normalizeProductVariants(product.variants)
  const filtered = all.filter((v) => parsePackTypeFromVariantId(v.id) === packType)
  if (filtered.length) return filtered
  if (packType === 'packet') {
    const grams =
      product.packetGrams?.length ? product.packetGrams : parseGramOptionsFromVariants(all, 'packet')
    return buildPackVariants('packet', grams, product.fill || '#0a2e22', product.image || '')
  }
  const grams =
    product.bottleGrams?.length ? product.bottleGrams : parseGramOptionsFromVariants(all, 'bottle')
  return buildPackVariants('bottle', grams, product.fill || '#0a2e22', product.image || '')
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
  /** Single catalog format — packet (standy) or bottle */
  packFormat?: PackType
  packetEnabled?: boolean
  bottleEnabled?: boolean
  packetGrams?: number[]
  bottleGrams?: number[]
  bottlePrice?: number
  bottleShowDiscountedPrice?: boolean
  bottleDiscountedPrice?: number
  bottleShortDescription?: string
  bottleDescription?: string
}

function resolvePackCopy(p: ShopProduct, packType: PackType) {
  if (packType === 'bottle') {
    if (p.packFormat === 'bottle') {
      return {
        shortDescription: p.shortDescription?.trim() || '',
        description: p.description?.trim() || '',
      }
    }
    return {
      shortDescription: p.bottleShortDescription?.trim() || p.shortDescription?.trim() || '',
      description: p.bottleDescription?.trim() || p.description?.trim() || '',
    }
  }
  return {
    shortDescription: p.shortDescription?.trim() || '',
    description: p.description?.trim() || '',
  }
}

function resolvePackPricing(p: ShopProduct, packType: PackType) {
  if (packType === 'bottle') {
    const price = p.packFormat === 'bottle' ? p.price : (p.bottlePrice ?? p.price)
    const showDiscountedPrice =
      p.packFormat === 'bottle' ? Boolean(p.showDiscountedPrice) : Boolean(p.bottleShowDiscountedPrice)
    const discountedPrice =
      p.packFormat === 'bottle' ? p.discountedPrice : p.bottleDiscountedPrice
    return { price, showDiscountedPrice, discountedPrice }
  }
  return {
    price: p.price,
    showDiscountedPrice: Boolean(p.showDiscountedPrice),
    discountedPrice: p.discountedPrice,
  }
}

/** Highest sell price for filters / sorting. */
export function getProductMaxSellPrice(p: ShopProduct): number {
  return getSellPrice(p, getProductPackFormat(p))
}

/** Selling price used in cart / cards */
export function getSellPrice(p: ShopProduct, packType: PackType = 'packet'): number {
  const { price, showDiscountedPrice, discountedPrice } = resolvePackPricing(p, packType)
  if (showDiscountedPrice && discountedPrice != null && discountedPrice > 0) {
    return discountedPrice
  }
  return price
}

/** Struck-through “was” price when a discount is shown */
export function getComparePrice(p: ShopProduct, packType: PackType = 'packet'): number | undefined {
  const { price, showDiscountedPrice, discountedPrice } = resolvePackPricing(p, packType)
  if (showDiscountedPrice && discountedPrice != null && discountedPrice > 0) {
    return price
  }
  return packType === 'bottle' ? undefined : p.compareAt
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
export function getProductCardTeaser(p: ShopProduct, packType: PackType = 'packet'): string {
  const { shortDescription, description } = resolvePackCopy(p, packType)
  if (shortDescription) return shortDescription
  const long = description
  if (!long) return ''
  const firstLine = long.split(/\n/)[0]?.trim() ?? long
  return firstLine.length > 120 ? `${firstLine.slice(0, 117)}…` : firstLine
}

/** Whether the detail modal has more copy than the card teaser. */
export function productHasLongDescription(p: ShopProduct, packType: PackType = 'packet'): boolean {
  const long = resolvePackCopy(p, packType).description
  if (!long) return false
  const teaser = getProductCardTeaser(p, packType)
  return long.length > teaser.length || long.includes('\n')
}

function normalizeCopy(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

/** Full stored description — description field only, never duplicated with short. */
export function getProductLongDescription(p: ShopProduct, packType: PackType = 'packet'): string {
  const copy = resolvePackCopy(p, packType)
  return copy.description || copy.shortDescription || ''
}

/** Modal / expanded copy — intro only, skips card teaser overlap, ingredients & boilerplate. */
export function getProductModalDescription(p: ShopProduct, packType: PackType = 'packet'): string {
  const copy = resolvePackCopy(p, packType)
  const long = copy.description || ''
  const short = copy.shortDescription || ''
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

export const BRANDS = ['Tasneem', 'Tasneem Mukhwas', 'Patel Mukhwas', 'Master Paan'] as const
