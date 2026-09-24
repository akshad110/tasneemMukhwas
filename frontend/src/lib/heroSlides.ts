/** Hero banner images — shared by Hero and startup preload in main.tsx */
const HERO_SLIDE_PATHS = [
  '/products/Untitled-2_page-0001.jpg.jpeg',
  '/products/ChatGPT Image Sep 22, 2026, 01_21_12 PM.png',
  '/products/IMG_6897.JPG.jpeg',
] as const

/** Keeps headlines in frame when the banner fills the viewport. */
export const HERO_SLIDE_FOCUS = [
  '16% center',
  '16% center',
  'center 70%',
] as const

/** Portrait phones — keep left headline and right pack in view. */
export const HERO_SLIDE_FOCUS_MOBILE = [
  'left 46%',
  'left 48%',
  'center 52%',
] as const

/** Tablets — slightly left of desktop so type is not clipped. */
export const HERO_SLIDE_FOCUS_TABLET = [
  '10% 48%',
  '10% 48%',
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
