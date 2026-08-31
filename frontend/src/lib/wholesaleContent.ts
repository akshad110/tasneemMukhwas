/** Dealership / wholesale page content. */
export const DEALERSHIP_HERO = {
  eyebrow: 'B2B · Dealership · Bulk',
  title: 'Partner with Tasneem Mukhwas for Unforgettable Experiences',
  subtitle:
    'Collaborate with us to source wholesale mukhwas and create memorable gifts that leave a lasting impression on your clients and guests.',
} as const

export const DEALERSHIP_INTRO =
  'Tasneem Mukhwas collaborates with B2B partners, retailers, hotels, and event companies to offer bespoke mukhwas hampers and mouth-freshener packs that enhance your clients\' experiences. From welcome gifts to corporate gifting, our products are crafted to make every occasion feel premium — with party favours, goodie bags, and personalised packs for your brand.'

export const WHY_CHOOSE = [
  'Uniquely Indian and premium — stands out from every standard corporate gift',
  'Custom branding on every jar or pouch — your company logo, your message',
  'FSSAI certified — safe to give to every employee and client',
  'Pan-India delivery to all major cities',
  'Dedicated support for orders above ₹25,000',
  'Minimum order: 50 units',
] as const

export const GROW_SECTION = {
  eyebrow: 'Grow with the crunch',
  title: 'Ready to scale your business?',
  body: 'Partner with Tasneem Mukhwas and bring the most loved mukhwas blends to your region. We ensure every order reaches you on time, meticulously packed to preserve freshness and flavour. Join us in spreading tradition — one pack at a time.',
} as const

export const PARTNER_BENEFITS = [
  'Superior product quality and hygiene',
  'Reliable supply chain and logistics',
  'Best-in-class margins for our partners',
  'Widest variety of mukhwas options in the market',
  'Our signature product range',
] as const

export const DEALERSHIP_STATS = [
  { value: '500+', label: 'Trade partners', hint: 'Retailers & distributors across India' },
  { value: '40+', label: 'Product SKUs', hint: 'Bulk-ready catalogue' },
  { value: 'FSSAI', label: 'Certified packs', hint: 'Hygienic manufacturing' },
] as const

export const SOLUTION_CARDS = [
  {
    tag: 'Retail',
    title: 'Counters & modern trade',
    body: 'Sealed pouches and display packs for kirana, supermarkets, and quick-commerce listings.',
    image: encodeURI('/Tasneem_Mukhwas_pouches_on_shelf_202609010137.jpeg'),
  },
  {
    tag: 'HORECA',
    title: 'Hotels & hospitality',
    body: 'Consistent blends for restaurants, catering, and hotel welcome trays — volume dispatch from Chhapi.',
    image: encodeURI('/Mukhwas_served_on_welcome_tray_202609010137.jpeg'),
  },
  {
    tag: 'Corporate',
    title: 'Gifting & private label',
    body: 'Branded hampers, OEM pouches, and export-ready cartons with documentation support.',
    image: encodeURI('/Corporate_gift_hamper_display_2K_202609010137.jpeg'),
  },
] as const

export const FEATURE_GRID = [
  {
    title: 'WHO-GMP facility',
    body: 'Certified manufacturing, roasting, and packing from our Chhapi unit in Banaskantha.',
  },
  {
    title: 'Export ready',
    body: 'IEC AAEFF9922C — lawful import and export with DGFT documentation support.',
  },
  {
    title: 'Flexible MOQs',
    body: 'From 50 units for trial listings to mixed-SKU cartons for regional distributors.',
  },
  {
    title: 'Partner desk',
    body: 'Dedicated coordination for pricing, samples, artwork, and dispatch timelines.',
  },
] as const

/** @deprecated use dealership exports — kept for any legacy imports */
export const WHOLESALE_STATS = DEALERSHIP_STATS
export const WHOLESALE_INTRO = {
  eyebrow: DEALERSHIP_HERO.eyebrow,
  title: DEALERSHIP_HERO.title,
  body: DEALERSHIP_INTRO,
}
