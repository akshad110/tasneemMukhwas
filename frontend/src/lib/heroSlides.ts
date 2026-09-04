/** Hero banner images — shared by Hero and startup preload in main.tsx */
export const HERO_SLIDE_IMAGES = [
  '/Mukhwas_pouches_on_wooden_table_202608251659.jpeg',
  '/Mukhwas_pouches_on_wooden_table_202608251630.jpeg',
  '/Red_pouch_and_mukhwas_bowl_202608251659.jpeg',
] as const

export function preloadHeroSlideImages() {
  HERO_SLIDE_IMAGES.forEach((src) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
  })
}
