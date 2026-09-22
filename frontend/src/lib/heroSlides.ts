/** Hero banner images — shared by Hero and startup preload in main.tsx */
const HERO_SLIDE_PATHS = [
  '/products/IMG_6882.JPG.jpeg',
  '/products/IMG_6881.JPG.jpeg',
  '/products/IMG_6880.JPG.jpeg',
] as const

/** Native size of the hero banners (all three match). */
export const HERO_SLIDE_ASPECT = '2560 / 1750'

export const HERO_SLIDE_IMAGES = HERO_SLIDE_PATHS.map((path) => encodeURI(path))

export function preloadHeroSlideImages() {
  HERO_SLIDE_IMAGES.forEach((src) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
  })
}
