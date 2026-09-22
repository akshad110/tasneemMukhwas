/** Hero banner images — shared by Hero and startup preload in main.tsx */
const HERO_SLIDE_PATHS = [
  '/products/ChatGPT Image Sep 22, 2026, 01_12_39 PM.png',
  '/products/ChatGPT Image Sep 22, 2026, 01_21_12 PM.png',
  '/products/ChatGPT Image Sep 22, 2026, 01_25_43 PM.png',
] as const

/** Keeps headlines in frame when the banner fills the viewport. */
export const HERO_SLIDE_FOCUS = [
  '16% center',
  '16% center',
  'center 58%',
] as const

/** Fill the hero edge-to-edge; third slide focus keeps the top headline in view. */
export const HERO_SLIDE_FIT = ['cover', 'cover', 'cover'] as const

export const HERO_SLIDE_IMAGES = HERO_SLIDE_PATHS.map((path) => encodeURI(path))

export function preloadHeroSlideImages() {
  HERO_SLIDE_IMAGES.forEach((src) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
  })
}
