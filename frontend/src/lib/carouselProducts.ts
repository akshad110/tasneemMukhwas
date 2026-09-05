/** Bright semi-circle glow tones — matched to each pouch colorway. */
export type CarouselGlowColors = {
  light: string
  mid: string
  dark: string
}

export type CarouselProduct = {
  id: string
  name: string
  image: string
  ingredients: string
  glowColors: CarouselGlowColors
}

/** Home carousel — transparent PNG pouches with color-matched hover glows. */
export const CAROUSEL_PRODUCTS: CarouselProduct[] = [
  {
    id: 'shahi',
    name: 'Shahi Mukhwas',
    image: '/products/shahi-mukhwas.png',
    ingredients:
      'Sesame Seeds, Coriander Seeds, Fennel Seeds, Dill Seeds, Rock Salt, Turmeric.',
    glowColors: { light: '#f0b8bc', mid: '#c74452', dark: '#8f1a28' },
  },
  {
    id: 'mango-slice',
    name: 'Mango Slice Mukhwas',
    image: '/products/mango-slice-mukhwas.png',
    ingredients:
      'Dried Mango Pulp, Sugar, Dry Mango Powder, Salt, Black Pepper, Cumin, Black Salt.',
    glowColors: { light: '#fff2b8', mid: '#f0c840', dark: '#c99200' },
  },
  {
    id: 'paan-shots',
    name: 'Paan Shots Mukhwas',
    image: '/products/paan-shots-mukhwas.png',
    ingredients:
      'Betel Leaves, Gulkand, Fennel Seeds, Desiccated Coconut, Dried Fruits, Rose Petals, Melon Seeds, Paan Masala.',
    glowColors: { light: '#c8f5dc', mid: '#5ec99a', dark: '#2a9d6a' },
  },
  {
    id: 'mouth-freshener',
    name: 'Mouth Freshener Mukhwas',
    image: '/products/mouth-freshener-mukhwas.png',
    ingredients:
      'Coriander Seeds, Fennel Seeds, Sweet Vermicelli, Sugar Coated Fennel Seeds.',
    glowColors: { light: '#b8d4f5', mid: '#4a7ab8', dark: '#1e4a78' },
  },
  {
    id: 'alsi-til',
    name: 'Alsi Til Mukhwas',
    image: '/products/alsi-til-mukhwas.png',
    ingredients: 'Sesame Seeds, Dry Mango Seeds, Rock Salt.',
    glowColors: { light: '#ecd0a8', mid: '#b89060', dark: '#7a5528' },
  },
  {
    id: 'panchratan',
    name: 'Panchratan Mukhwas',
    image: '/WhatsApp_Image_2026-08-09_at_8.07.21_PM-removebg-preview.png',
    ingredients:
      'Fennel Seeds, Coriander Seeds, Sesame Seeds, Sugar Coated Saunf, Natural Colours & Spices.',
    glowColors: { light: '#c8ecc8', mid: '#5cb86a', dark: '#2d8a3e' },
  },
  {
    id: 'jamun-shots',
    name: 'Jamun Shots Mukhwas',
    image: '/products/jamun-shots-mukhwas.png',
    ingredients:
      'Jamun Pulp, Fennel Seeds, Sugar, Citric Acid, Rock Salt, Permitted Food Colours.',
    glowColors: { light: '#dcc8f5', mid: '#9b59d0', dark: '#6b2fa0' },
  },
]
