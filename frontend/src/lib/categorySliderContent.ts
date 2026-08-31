import { DEFAULT_CATEGORIES, type ShopProduct } from './shopCatalog'

const IMG_JET_IMLI = encodeURI('/WhatsApp Image 2026-08-31 at 10.14.41 AM.jpeg')
const IMG_MANGO = encodeURI('/WhatsApp Image 2026-08-31 at 10.14.44 AM.jpeg')
const IMG_MOUTH_FRESHENER = encodeURI('/WhatsApp Image 2026-08-31 at 10.14.53 AM.jpeg')
const IMG_ALSI_TIL = encodeURI('/WhatsApp Image 2026-08-31 at 10.15.06 AM.jpeg')
const IMG_PAAN_SHOTS = encodeURI('/WhatsApp Image 2026-08-31 at 10.14.59 AM.jpeg')

export type CategorySliderItem = {
  id: string
  name: string
  tabLabel: string
  headline: string
  description: string
  sampleProductName: string
  promoImage: string
  accent: string
}

export const CATEGORY_SLIDER_FALLBACKS: CategorySliderItem[] = [
  {
    id: 'salted',
    name: 'Our Salted Mukhwas',
    tabLabel: 'Salted',
    headline: 'A colourful crunch of freshness.',
    description:
      'Roasted seeds and savoury spices — aromatic flavour, colourful crunch, and a refreshing bite after every meal.',
    sampleProductName: 'Mouth Freshener Mukhwas',
    promoImage: IMG_MOUTH_FRESHENER,
    accent: '#0c3d4a',
  },
  {
    id: 'sweet',
    name: 'Our Sweet Mukhwas',
    tabLabel: 'Sweet',
    headline: 'Sweet moments start right here.',
    description:
      'Soft, rich, and made for every celebration — naturally sweet blends with fennel, coconut, and familiar notes.',
    sampleProductName: 'Shahi Mukhwas',
    promoImage: IMG_ALSI_TIL,
    accent: '#6b1018',
  },
  {
    id: 'taste-shots',
    name: 'Our Taste Shots',
    tabLabel: 'Taste Shots',
    headline: 'The paan experience in every bite.',
    description:
      'Bold paan-style shots and concentrated mouth fresheners — fun, fresh, and full of character.',
    sampleProductName: 'Paan Shots Mukhwas',
    promoImage: IMG_PAAN_SHOTS,
    accent: '#0a4a52',
  },
  {
    id: 'imli',
    name: 'Our Imli Masti',
    tabLabel: 'Imli Masti',
    headline: 'A refreshing taste of tradition.',
    description:
      'Tangy imli-forward blends with classic taste, sweet refreshment, and authentic delight in every pouch.',
    sampleProductName: 'Jet Imli Mukhwas',
    promoImage: IMG_JET_IMLI,
    accent: '#8b3e2f',
  },
  {
    id: 'mango',
    name: 'Our Mango Masti',
    tabLabel: 'Mango Masti',
    headline: 'Mango magic in every bite.',
    description:
      'Fruity mango-inspired mukhwas with tropical taste, fruity freshness, and bright flavour in every serving.',
    sampleProductName: 'Mango Slice Mukhwas',
    promoImage: IMG_MANGO,
    accent: '#008f94',
  },
]

export function buildCategorySliderItems(
  categoryNames: readonly string[],
  products: ShopProduct[],
): CategorySliderItem[] {
  const names = categoryNames.length ? categoryNames : [...DEFAULT_CATEGORIES]

  return names.map((name, index) => {
    const fallback = CATEGORY_SLIDER_FALLBACKS[index] ?? CATEGORY_SLIDER_FALLBACKS[0]
    const match = CATEGORY_SLIDER_FALLBACKS.find((item) => item.name === name) ?? fallback
    const sample = products.find((p) => p.category === name)

    return {
      ...match,
      name,
      sampleProductName: sample?.name ?? match.sampleProductName,
      accent: sample?.fill?.trim() || match.accent,
    }
  })
}

function parseHex(hex: string) {
  const raw = hex.replace('#', '').trim()
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw
  if (full.length !== 6) return null
  const n = Number.parseInt(full, 16)
  if (Number.isNaN(n)) return null
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  }
}

function toHex(r: number, g: number, b: number) {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  return `#${[clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

function shadeColor(hex: string, amount: number) {
  const rgb = parseHex(hex)
  if (!rgb) return hex
  const factor = amount / 100
  if (factor >= 0) {
    return toHex(
      rgb.r + (255 - rgb.r) * factor,
      rgb.g + (255 - rgb.g) * factor,
      rgb.b + (255 - rgb.b) * factor,
    )
  }
  const scale = 1 + factor
  return toHex(rgb.r * scale, rgb.g * scale, rgb.b * scale)
}

function relativeLuminance(hex: string) {
  const rgb = parseHex(hex)
  if (!rgb) return 0
  const channel = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b)
}

export function getCategoryCardTheme(accent: string) {
  const base = accent.startsWith('#') ? accent : '#0a2e22'
  const darker = shadeColor(base, -18)
  const onDark = relativeLuminance(base) < 0.42

  return {
    cardBg: base,
    cardBgDeep: darker,
    text: '#FFFEF2',
    textMuted: 'rgba(255,254,242,0.88)',
    tabBg: base,
    tabBorder: shadeColor(base, 22),
    tabText: '#FFFEF2',
    buttonBg: '#e8b923',
    buttonBorder: onDark ? '#1a4fd6' : '#0a2e22',
    buttonText: '#FFFEF2',
    blobGlow: `${base}99`,
  }
}
