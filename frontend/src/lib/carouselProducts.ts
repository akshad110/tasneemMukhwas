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
    id: 'ajwain',
    name: 'Ajwain Mukhwas',
    image: '/WhatsApp_Image_2026-09-01_at_1.49.36_AM-removebg-preview.png',
    ingredients:
      'Carom Seeds (Ajwain), Fennel Seeds, Coriander Seeds, Rock Salt, Turmeric, Natural Spices.',
    glowColors: { light: '#c8e6c8', mid: '#2d6b3a', dark: '#1a4a28' },
  },
  {
    id: 'mango-slice',
    name: 'Mango Slice Mukhwas',
    image: '/WhatsApp_Image_2026-09-01_at_1.49.53_AM-removebg-preview.png',
    ingredients:
      'Dried Mango Pulp, Sugar, Dry Mango Powder, Salt, Black Pepper, Cumin, Black Salt.',
    glowColors: { light: '#fff2b8', mid: '#f0c840', dark: '#c99200' },
  },
  {
    id: 'paan-shots',
    name: 'Paan Shots Mukhwas',
    image: '/WhatsApp_Image_2026-09-01_at_1.49.53_AM__1_-removebg-preview.png',
    ingredients:
      'Betel Leaves, Gulkand, Fennel Seeds, Desiccated Coconut, Dried Fruits, Rose Petals, Melon Seeds, Paan Masala.',
    glowColors: { light: '#c8f5dc', mid: '#5ec99a', dark: '#2a9d6a' },
  },
  {
    id: 'mouth-freshener',
    name: 'Mouth Freshener Mukhwas',
    image: '/WhatsApp_Image_2026-09-01_at_1.49.39_AM-removebg-preview.png',
    ingredients:
      'Coriander Seeds, Fennel Seeds, Sweet Vermicelli, Sugar Coated Fennel Seeds.',
    glowColors: { light: '#b8d4f5', mid: '#4a7ab8', dark: '#1e4a78' },
  },
  {
    id: 'alsi-til',
    name: 'Alsi Til Mukhwas',
    image: '/WhatsApp_Image_2026-09-01_at_2.01.39_AM__1_-removebg-preview.png',
    ingredients: 'Flax Seeds (Alsi), Sesame Seeds (Til), Rock Salt, Natural Spices.',
    glowColors: { light: '#ecd0a8', mid: '#b89060', dark: '#7a5528' },
  },
  {
    id: 'dil-mastana',
    name: 'Dil Mastana Mukhwas',
    image: '/WhatsApp_Image_2026-09-01_at_1.49.35_AM__1_-removebg-preview.png',
    ingredients:
      'Sugar Coated Fennel, Melon Seeds, Cashew, Almond, Raisins, Natural Colours & Spices.',
    glowColors: { light: '#fff0d8', mid: '#e8b88a', dark: '#a85828' },
  },
  {
    id: 'jamun-shots',
    name: 'Jamun Shots Mukhwas',
    image: '/WhatsApp_Image_2026-09-01_at_1.49.48_AM__2_-removebg-preview.png',
    ingredients:
      'Jamun Pulp, Fennel Seeds, Sugar, Citric Acid, Rock Salt, Permitted Food Colours.',
    glowColors: { light: '#dcc8f5', mid: '#9b59d0', dark: '#6b2fa0' },
  },
]
