/** Tasneem mukhwas — farm-to-pack process infographics (public assets). */

const img = (filename: string) => encodeURI(`/${filename}`)

export type ManufacturingProcessStep = {
  number: number
  title: string
  body: string
  image: string
  alt: string
}

export const MANUFACTURING_PROCESS_INTRO = {
  eyebrow: 'Our process',
  title: 'From carefully sourced seeds to your pack',
  description:
    'Every Tasneem mukhwas blend passes through disciplined sourcing, cleaning, roasting, blending, packing, and quality testing at our Chhapi facility.',
} as const

export const MANUFACTURING_PROCESS_STEPS: readonly ManufacturingProcessStep[] = [
  {
    number: 1,
    title: 'Carefully Sourced',
    body: 'We work closely with trusted farmers to buy the best quality seeds and ingredients.',
    image: img('WhatsApp Image 2026-09-01 at 5.19.32 PM (2).jpeg'),
    alt: 'Tasneem team inspecting crops with a trusted farmer in the field',
  },
  {
    number: 2,
    title: 'Quality Checked',
    body: 'Every ingredient is inspected for purity, freshness, and natural goodness.',
    image: img('WhatsApp Image 2026-09-01 at 5.19.35 PM (1).jpeg'),
    alt: 'Assorted mukhwas seeds and ingredients in burlap sacks for quality inspection',
  },
  {
    number: 3,
    title: 'Sortex Cleaning',
    body: 'Advanced Sortex machines remove dust, stones, and unwanted particles to ensure perfection.',
    image: img('WhatsApp Image 2026-09-01 at 5.19.35 PM.jpeg'),
    alt: 'Operator running a SORTEX Z+ cleaning machine in a hygienic facility',
  },
  {
    number: 4,
    title: 'Manual Sorting',
    body: 'Our team carefully handpicks to remove any remaining impurities. Only the best moves forward.',
    image: img('WhatsApp Image 2026-09-01 at 5.19.34 PM (3).jpeg'),
    alt: 'Workers in protective gear manually sorting mukhwas ingredients',
  },
  {
    number: 5,
    title: 'Roasting & Processing',
    body: 'Ingredients are roasted and processed hygienically to bring out the best flavour and aroma.',
    image: img('WhatsApp Image 2026-09-01 at 5.19.34 PM (2).jpeg'),
    alt: 'Worker roasting mukhwas ingredients in stainless steel equipment at Tasneem',
  },
  {
    number: 6,
    title: 'Hygienic Blending',
    body: 'Perfectly balanced recipes blended in a clean and controlled environment.',
    image: img('WhatsApp Image 2026-09-01 at 5.19.34 PM (1).jpeg'),
    alt: 'Large stainless steel blender mixing colourful mukhwas ingredients',
  },
  {
    number: 7,
    title: 'Premium Packaging',
    body: 'Packed using high-quality, food-safe materials to lock in freshness and taste.',
    image: img('WhatsApp Image 2026-09-01 at 5.19.34 PM.jpeg'),
    alt: 'Workers packing mukhwas pouches on an automated packaging line',
  },
  {
    number: 8,
    title: 'Quality Tested',
    body: 'Every batch is tested for quality, taste, and hygiene before it reaches you.',
    image: img('WhatsApp Image 2026-09-01 at 5.19.33 PM (1).jpeg'),
    alt: 'Lab technician testing mukhwas quality under a microscope',
  },
  {
    number: 9,
    title: 'Deliver to You',
    body: 'With care, consistency, and trust — bringing you the finest mukhwas experience.',
    image: img('WhatsApp Image 2026-09-01 at 5.19.33 PM.jpeg'),
    alt: 'Tasneem Mouth Freshener mukhwas pouch beside a serving bowl of the blend',
  },
] as const

/** Additional facility photos used beside the numbered process cards. */
export const MANUFACTURING_PROCESS_EXTRAS = {
  traditionalRoasting: {
    image: img('WhatsApp Image 2026-09-01 at 5.19.32 PM (1).jpeg'),
    alt: 'Traditional rooftop roasting of mukhwas ingredients in a large kadai',
  },
  batchMixing: {
    image: img('WhatsApp Image 2026-09-01 at 5.19.32 PM.jpeg'),
    alt: 'Worker adding ingredients into a industrial coating drum at the Tasneem facility',
  },
} as const

export function getManufacturingProcessStep(number: number) {
  return MANUFACTURING_PROCESS_STEPS.find((step) => step.number === number)
}
