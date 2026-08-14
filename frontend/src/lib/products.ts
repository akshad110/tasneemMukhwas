export type ProductPacket = {
  id: string
  name: string
  src: string
  alt: string
}

/** Hero packet trio — distinctive colorways */
export const HERO_PACKETS: ProductPacket[] = [
  {
    id: 'shahi',
    name: 'Shahi Mukhwas',
    src: '/WhatsApp_Image_2026-08-09_at_8.07.20_PM-removebg-preview.png',
    alt: 'Tasneem Shahi Mukhwas pouch',
  },
  {
    id: 'panchratan',
    name: 'Panchratan Mukhwas',
    src: '/WhatsApp_Image_2026-08-09_at_8.07.21_PM-removebg-preview.png',
    alt: 'Tasneem Panchratan Mukhwas pouch',
  },
  {
    id: 'mouth-freshener',
    name: 'Mouth Freshener Mukhwas',
    src: '/WhatsApp_Image_2026-08-09_at_8.07.22_PM-removebg-preview.png',
    alt: 'Tasneem Mouth Freshener Mukhwas pouch',
  },
]

/** Full hero plate: green texture + scattered mukhwas seeds */
export const HERO_BACKGROUND =
  '/Mukhwas_seeds_on_green_background_202608101358.jpeg'

/** Patterned plate for Orbit / Our Range section */
export const SECTION_TEXTURE = '/range-pattern-bg.jpeg'

/** Orbit Projects section — product cards for scroll orbit */
export type OrbitItem = {
  image: string
  label: string
}

export const ORBIT_ITEMS: OrbitItem[] = [
  {
    image: '/WhatsApp_Image_2026-08-09_at_8.07.20_PM-removebg-preview.png',
    label: 'Shahi Mukhwas',
  },
  {
    image: '/WhatsApp_Image_2026-08-09_at_8.07.21_PM-removebg-preview.png',
    label: 'Panchratan Mukhwas',
  },
  {
    image: '/WhatsApp_Image_2026-08-09_at_8.07.22_PM-removebg-preview.png',
    label: 'Mouth Freshener',
  },
  {
    image: '/WhatsApp_Image_2026-08-09_at_8.07.23_PM-removebg-preview.png',
    label: 'Classic Blend',
  },
  {
    image: '/WhatsApp_Image_2026-08-09_at_8.07.24_PM-removebg-preview.png',
    label: 'Festive Mix',
  },
  {
    image: '/WhatsApp_Image_2026-08-09_at_8.07.20_PM__1_-removebg-preview.png',
    label: 'Royal Selection',
  },
]
