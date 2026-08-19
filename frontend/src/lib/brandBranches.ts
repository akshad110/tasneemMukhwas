import { CONTACT_ADDRESS } from './contact'

export type BrandBranch = {
  id: string
  name: string
  short: string
  description: string
  about: string
  location: string
  websiteLabel: string
}

/** Parent company + sister brands — shared by home contact section and /contact page. */
export const BRAND_BRANCHES: BrandBranch[] = [
  {
    id: 'tasneem-mukhwas',
    name: 'TASNEEM MUKHWAS',
    short: 'Tasneem Mukhwas',
    description: 'Our Chhapi manufacturing house for mukhwas, seeds, and traditional mouth fresheners.',
    about:
      'Rooted in Chhapi, Banaskantha — home to Tasneem Mukhwas packing, quality checks, and bulk dispatch.',
    location: CONTACT_ADDRESS,
    websiteLabel: 'Visit here',
  },
  {
    id: 'master-paan',
    name: 'MASTER PAAN',
    short: 'Master Paan',
    description: 'Sister brand for paan-inspired flavours and festive mouth-freshener mixes.',
    about:
      'Crafted under the same hygiene standards — ideal for retail counters, gift packs, and HORECA partners.',
    location: 'Galaxy Complex, Chhapi Highway, Banaskantha — shared Chhapi facility',
    websiteLabel: 'Visit here',
  },
  {
    id: 'patel-mukhwas',
    name: 'PATEL MUKHWAS',
    short: 'Patel Mukhwas',
    description: 'Classic Patel-line mukhwas blends trusted across Gujarat and beyond.',
    about:
      'Everyday digestive mixes and traditional recipes from the same Chhapi facility network.',
    location: 'Chhapi, Banaskantha, Gujarat — production & dispatch hub',
    websiteLabel: 'Visit here',
  },
  {
    id: 'furat-agarbatti',
    name: 'FURAT AGARBATTI',
    short: 'Furat Agarbatti',
    description: 'Sister line for incense and fragrance products from the Furat family of brands.',
    about:
      'Complementary home fragrance range produced alongside our food craft legacy in Banaskantha.',
    location: 'Banaskantha district, Gujarat — sister fragrance division',
    websiteLabel: 'Visit here',
  },
]
