/** Hero banner images — shared by Hero and startup preload in main.tsx */
const HERO_SLIDE_PATHS = [
  '/products/wmremove-transformed.jpeg',
  '/products/wmremove-transformed (1) (1).jpeg',
  '/products/WhatsApp_Image_2026-09-08_at_9.40.04_2K_20260910075725 (1).jpeg',
] as const

/** Keeps baked-in headline areas visible when banners crop on narrow screens. */
export const HERO_SLIDE_FOCUS = [
  '32% center',
  '68% center',
  '30% center',
] as const

export const HERO_SLIDE_IMAGES = HERO_SLIDE_PATHS.map((path) => encodeURI(path))

export function preloadHeroSlideImages() {
  HERO_SLIDE_IMAGES.forEach((src) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
  })
}
