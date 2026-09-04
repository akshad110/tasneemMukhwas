import type { ShopProduct } from './shopCatalog'

/** Decorative hover backgrounds — matched to packet / bottle colorways. */
export const PRODUCT_HOVER_PATTERNS = {
  maroonDark: '/image.png_2K_202608101652.jpeg',
  navy: '/image.png_2K_202608101704.jpeg',
  mint: '/image.png_2K_202608101711.jpeg',
  gold: '/image.png_2K_202608101721.jpeg',
  redCream: '/image.png_2K_202608101724.jpeg',
  greenBotanical: '/image.png_202608101729.jpeg',
  yellowFloral: encodeURI('/Decorative_pattern_with_flowers_…_2K_202609050114.jpeg'),
  maroonFloral: encodeURI('/Decorative_pattern_with_floral_m…_2K_202609050114.jpeg'),
  purple: encodeURI('/Screenshot 2026-09-05 012104.png'),
  brown: encodeURI('/Screenshot 2026-09-05 012148.png'),
  goldBronze: encodeURI('/Screenshot 2026-09-05 012158.png'),
} as const

const DEFAULT_PATTERN = PRODUCT_HOVER_PATTERNS.gold

const GENERIC_FILLS = new Set(['#0a2e22', '#f8f3e7', '#fffef2', '#ffffff'])

/** Stable id → pattern (covers API slug variants). */
const ID_PATTERN_MAP: Record<string, string> = {
  shahi: PRODUCT_HOVER_PATTERNS.maroonDark,
  'mango-slice': PRODUCT_HOVER_PATTERNS.yellowFloral,
  'paan-shots': PRODUCT_HOVER_PATTERNS.mint,
  'mouth-freshener': PRODUCT_HOVER_PATTERNS.navy,
  'alsi-til': PRODUCT_HOVER_PATTERNS.brown,
  panchratan: PRODUCT_HOVER_PATTERNS.greenBotanical,
  'jamun-shots': PRODUCT_HOVER_PATTERNS.purple,
  gutli: PRODUCT_HOVER_PATTERNS.goldBronze,
  'jet-imli': PRODUCT_HOVER_PATTERNS.redCream,
  'dil-mastana': PRODUCT_HOVER_PATTERNS.maroonFloral,
}

const NAME_PATTERN_RULES: { match: RegExp; pattern: string }[] = [
  { match: /shahi|royal/i, pattern: PRODUCT_HOVER_PATTERNS.maroonDark },
  { match: /mango/i, pattern: PRODUCT_HOVER_PATTERNS.yellowFloral },
  { match: /paan/i, pattern: PRODUCT_HOVER_PATTERNS.mint },
  { match: /mouth|freshener/i, pattern: PRODUCT_HOVER_PATTERNS.navy },
  { match: /alsi|til|flax|sesame/i, pattern: PRODUCT_HOVER_PATTERNS.brown },
  { match: /panch/i, pattern: PRODUCT_HOVER_PATTERNS.greenBotanical },
  { match: /jamun/i, pattern: PRODUCT_HOVER_PATTERNS.purple },
  { match: /imli|jet/i, pattern: PRODUCT_HOVER_PATTERNS.redCream },
  { match: /dil mastana|mastana/i, pattern: PRODUCT_HOVER_PATTERNS.maroonFloral },
  { match: /gutli/i, pattern: PRODUCT_HOVER_PATTERNS.goldBronze },
  { match: /festive|classic blend|sweet vermicelli/i, pattern: PRODUCT_HOVER_PATTERNS.maroonFloral },
]

function isGenericFill(fill?: string) {
  if (!fill?.trim()) return true
  return GENERIC_FILLS.has(fill.trim().toLowerCase())
}

function hexToRgb(hex: string) {
  const raw = hex.replace('#', '').trim()
  if (raw.length === 3) {
    return {
      r: parseInt(raw[0] + raw[0], 16),
      g: parseInt(raw[1] + raw[1], 16),
      b: parseInt(raw[2] + raw[2], 16),
    }
  }
  if (raw.length !== 6) return null
  return {
    r: parseInt(raw.slice(0, 2), 16),
    g: parseInt(raw.slice(2, 4), 16),
    b: parseInt(raw.slice(4, 6), 16),
  }
}

/** Pick a pattern from a brand / pouch hex when name rules do not match. */
function patternFromFill(fill: string): string | null {
  const rgb = hexToRgb(fill)
  if (!rgb) return null

  const { r, g, b } = rgb
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const spread = max - min

  if (spread < 28) {
    if (max < 80) return PRODUCT_HOVER_PATTERNS.navy
    if (max > 210) return PRODUCT_HOVER_PATTERNS.gold
    return PRODUCT_HOVER_PATTERNS.brown
  }

  if (r >= g && r >= b) {
    if (g > 120 && b < 90) return PRODUCT_HOVER_PATTERNS.goldBronze
    if (b > 100 && r < 140) return PRODUCT_HOVER_PATTERNS.purple
    return r > 150 ? PRODUCT_HOVER_PATTERNS.redCream : PRODUCT_HOVER_PATTERNS.maroonDark
  }

  if (g >= r && g >= b) {
    return g > 140 && b > 100 ? PRODUCT_HOVER_PATTERNS.mint : PRODUCT_HOVER_PATTERNS.greenBotanical
  }

  if (b >= r && b >= g) {
    return PRODUCT_HOVER_PATTERNS.navy
  }

  return null
}

function normalizeProductId(id: string) {
  return id.trim().toLowerCase().replace(/_/g, '-')
}

export function getProductPacketHoverPattern(product: ShopProduct): string {
  const id = normalizeProductId(product.id)
  if (ID_PATTERN_MAP[id]) return ID_PATTERN_MAP[id]

  const hay = `${product.id} ${product.name} ${product.category}`.toLowerCase()
  for (const rule of NAME_PATTERN_RULES) {
    if (rule.match.test(hay)) return rule.pattern
  }

  if (product.packFormat === 'bottle') {
    if (/imli|jet|tang/i.test(hay)) return PRODUCT_HOVER_PATTERNS.redCream
    return PRODUCT_HOVER_PATTERNS.navy
  }

  if (!isGenericFill(product.fill)) {
    const fromFill = patternFromFill(product.fill!)
    if (fromFill) return fromFill
  }

  return DEFAULT_PATTERN
}
