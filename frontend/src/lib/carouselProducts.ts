export type CarouselProduct = {
  id: string
  name: string
  image: string
  ingredients: string
  /** Soft tint matched to the pouch — used on media-area hover */
  mediaHoverColor: string
}

/** Home carousel — transparent PNG pouches, no pattern backgrounds. */
export const CAROUSEL_PRODUCTS: CarouselProduct[] = [
  {
    id: 'shahi',
    name: 'Shahi Mukhwas',
    image: '/products/shahi-mukhwas.png',
    ingredients:
      'Sesame Seeds, Coriander Seeds, Fennel Seeds, Dill Seeds, Rock Salt, Turmeric.',
    mediaHoverColor: '#f6e4e6',
  },
  {
    id: 'mango-slice',
    name: 'Mango Slice Mukhwas',
    image: '/products/mango-slice-mukhwas.png',
    ingredients:
      'Dried Mango Pulp, Sugar, Dry Mango Powder, Salt, Black Pepper, Cumin, Black Salt.',
    mediaHoverColor: '#fff3d4',
  },
  {
    id: 'paan-shots',
    name: 'Paan Shots Mukhwas',
    image: '/products/paan-shots-mukhwas.png',
    ingredients:
      'Betel Leaves, Gulkand, Fennel Seeds, Desiccated Coconut, Dried Fruits, Rose Petals, Melon Seeds, Paan Masala.',
    mediaHoverColor: '#dff5ef',
  },
  {
    id: 'mouth-freshener',
    name: 'Mouth Freshener Mukhwas',
    image: '/products/mouth-freshener-mukhwas.png',
    ingredients:
      'Coriander Seeds, Fennel Seeds, Sweet Vermicelli, Sugar Coated Fennel Seeds.',
    mediaHoverColor: '#ddeaf5',
  },
  {
    id: 'alsi-til',
    name: 'Alsi Til Mukhwas',
    image: '/products/alsi-til-mukhwas.png',
    ingredients: 'Sesame Seeds, Dry Mango Seeds, Rock Salt.',
    mediaHoverColor: '#f5eedf',
  },
  {
    id: 'panchratan',
    name: 'Panchratan Mukhwas',
    image: '/WhatsApp_Image_2026-08-09_at_8.07.21_PM-removebg-preview.png',
    ingredients:
      'Fennel Seeds, Coriander Seeds, Sesame Seeds, Sugar Coated Saunf, Natural Colours & Spices.',
    mediaHoverColor: '#f2ebe2',
  },
  {
    id: 'jamun-shots',
    name: 'Jamun Shots Mukhwas',
    image: '/WhatsApp_Image_2026-08-09_at_8.07.23_PM-removebg-preview.png',
    ingredients:
      'Jamun Pulp, Fennel Seeds, Sugar, Citric Acid, Rock Salt, Permitted Food Colours.',
    mediaHoverColor: '#e8ecf8',
  },
]
