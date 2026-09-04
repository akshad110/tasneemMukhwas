import { PRODUCT_HOVER_PATTERNS } from './productHoverTheme'

export type CarouselProduct = {
  id: string
  name: string
  image: string
  ingredients: string
  /** Pattern background shown on media-area hover */
  mediaHoverBg: string
}

/** Home carousel — transparent PNG pouches with color-matched hover patterns. */
export const CAROUSEL_PRODUCTS: CarouselProduct[] = [
  {
    id: 'shahi',
    name: 'Shahi Mukhwas',
    image: '/products/shahi-mukhwas.png',
    ingredients:
      'Sesame Seeds, Coriander Seeds, Fennel Seeds, Dill Seeds, Rock Salt, Turmeric.',
    mediaHoverBg: PRODUCT_HOVER_PATTERNS.maroonDark,
  },
  {
    id: 'mango-slice',
    name: 'Mango Slice Mukhwas',
    image: '/products/mango-slice-mukhwas.png',
    ingredients:
      'Dried Mango Pulp, Sugar, Dry Mango Powder, Salt, Black Pepper, Cumin, Black Salt.',
    mediaHoverBg: PRODUCT_HOVER_PATTERNS.yellowFloral,
  },
  {
    id: 'paan-shots',
    name: 'Paan Shots Mukhwas',
    image: '/products/paan-shots-mukhwas.png',
    ingredients:
      'Betel Leaves, Gulkand, Fennel Seeds, Desiccated Coconut, Dried Fruits, Rose Petals, Melon Seeds, Paan Masala.',
    mediaHoverBg: PRODUCT_HOVER_PATTERNS.mint,
  },
  {
    id: 'mouth-freshener',
    name: 'Mouth Freshener Mukhwas',
    image: '/products/mouth-freshener-mukhwas.png',
    ingredients:
      'Coriander Seeds, Fennel Seeds, Sweet Vermicelli, Sugar Coated Fennel Seeds.',
    mediaHoverBg: PRODUCT_HOVER_PATTERNS.navy,
  },
  {
    id: 'alsi-til',
    name: 'Alsi Til Mukhwas',
    image: '/products/alsi-til-mukhwas.png',
    ingredients: 'Sesame Seeds, Dry Mango Seeds, Rock Salt.',
    mediaHoverBg: PRODUCT_HOVER_PATTERNS.brown,
  },
  {
    id: 'panchratan',
    name: 'Panchratan Mukhwas',
    image: '/WhatsApp_Image_2026-08-09_at_8.07.21_PM-removebg-preview.png',
    ingredients:
      'Fennel Seeds, Coriander Seeds, Sesame Seeds, Sugar Coated Saunf, Natural Colours & Spices.',
    mediaHoverBg: PRODUCT_HOVER_PATTERNS.greenBotanical,
  },
  {
    id: 'jamun-shots',
    name: 'Jamun Shots Mukhwas',
    image: '/products/jamun-shots-mukhwas.png',
    ingredients:
      'Jamun Pulp, Fennel Seeds, Sugar, Citric Acid, Rock Salt, Permitted Food Colours.',
    mediaHoverBg: PRODUCT_HOVER_PATTERNS.purple,
  },
]
