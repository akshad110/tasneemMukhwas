/** Hero banner images — shared by Hero and startup preload in main.tsx */
const HERO_SLIDE_PATHS = [
  '/WhatsApp Image 2026-09-07 at 11.10.20 PM.jpeg',
  '/WhatsApp Image 2026-09-08 at 9.40.04 AM (1).jpeg',
  '/WhatsApp Image 2026-09-08 at 9.40.04 AM.jpeg',
] as const

export const HERO_SLIDE_IMAGES = HERO_SLIDE_PATHS.map((path) => encodeURI(path))

export function preloadHeroSlideImages() {
  HERO_SLIDE_IMAGES.forEach((src) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
  })
}
