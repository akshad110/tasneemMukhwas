/** Hero banner images — shared by Hero and startup preload in main.tsx */
const HERO_SLIDE_PATHS = [
  '/WhatsApp_Image_2026-09-08_at_9.40.04_2K_202609092332.jpeg',
  '/WhatsApp_Image_2026-09-08_at_10.53.42_2K_202609092340.jpeg',
  '/WhatsApp_Image_2026-09-07_at_11.10.20_2K_202609092313.jpeg',
] as const

export const HERO_SLIDE_IMAGES = HERO_SLIDE_PATHS.map((path) => encodeURI(path))

export function preloadHeroSlideImages() {
  HERO_SLIDE_IMAGES.forEach((src) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
  })
}
