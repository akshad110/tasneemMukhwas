/** Hero banner images — shared by Hero and startup preload in main.tsx */
const HERO_SLIDE_PATHS = [
  '/products/ChatGPT Image Sep 22, 2026, 11_57_22 AM.png',
  '/products/ChatGPT Image Sep 22, 2026, 11_50_20 AM.png',
  '/products/ChatGPT Image Sep 22, 2026, 11_55_26 AM.png',
] as const

/** Keeps headlines in frame when the banner fills the viewport. */
export const HERO_SLIDE_FOCUS = [
  '16% center',
  '18% center',
  '16% center',
] as const

export const HERO_SLIDE_IMAGES = HERO_SLIDE_PATHS.map((path) => encodeURI(path))

export function preloadHeroSlideImages() {
  HERO_SLIDE_IMAGES.forEach((src) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
  })
}
