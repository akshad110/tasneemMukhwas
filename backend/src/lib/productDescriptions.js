const PACKED =
  'Hygiene-packed at our Chhapi facility with WHO-GMP standards. Store in a cool, dry place and seal after opening.'

/** Known copy — keyed by normalized product name. */
export const PRODUCT_DESCRIPTION_COPY = {
  'shahi mukhwas': {
    shortDescription: 'Premium royal blend — rich, aromatic, and perfectly balanced after meals.',
    description: `Premium quality digestive mouth freshener crafted for everyday indulgence. Tradition that freshens every bite.

Ingredients: Sesame Seeds, Coriander Seeds, Fennel Seeds, Dill Seeds, Rock Salt, Turmeric.

${PACKED}`,
  },
  'mango slice mukhwas': {
    shortDescription: 'Bright mango-slice crunch with classic mukhwas warmth.',
    description: `Bright mango-slice crunch with classic mukhwas warmth. A fruity favourite for all ages.

Ingredients: Dried Mango Pulp, Sugar, Dry Mango Powder, Salt, Black Pepper, Cumin, Black Salt.

${PACKED}`,
  },
  'paan shots mukhwas': {
    shortDescription: 'Glossy paan-style shots — fun, fresh, and flavourful after every feast.',
    description: `Glossy paan shots in a premium mix — fun, fresh, and flavourful after every feast.

Ingredients: Betel Leaves, Gulkand, Fennel Seeds, Desiccated Coconut, Dried Fruits, Rose Petals, Melon Seeds, Paan Masala.

${PACKED}`,
  },
  'mouth freshener mukhwas': {
    shortDescription: 'Fun. Fresh. Flavourful — a classic everyday mouth freshener.',
    description: `Fun. Fresh. Flavourful. A timeless mukhwas blend for counters, gifting, and daily refreshment.

Ingredients: Coriander Seeds, Fennel Seeds, Sweet Vermicelli, Sugar Coated Fennel Seeds.

${PACKED}`,
  },
  'alsi til mukhwas': {
    shortDescription: 'Flax and sesame seeds in a timeless, nutty blend.',
    description: `Flax and sesame seeds in a timeless blend loved across Gujarat.

Ingredients: Sesame Seeds, Dry Mango Seeds, Rock Salt.

${PACKED}`,
  },
  'gutli mukhwas': {
    shortDescription: 'Crunchy gutli-style mix with bold spice and lasting freshness.',
    description: `Crunchy gutli-style mukhwas with bold spice notes and a satisfying after-meal finish.

Ingredients: Fennel Seeds, Coriander Seeds, Sesame Seeds, Rock Salt, Natural Spices.

${PACKED}`,
  },
  'panchratan mukhwas': {
    shortDescription: 'Five-treasure blend — colourful, crunchy, and celebration-ready.',
    description: `Panchratan — a festive five-ingredient mukhwas mix with colour, crunch, and classic Gujarati character.

Ingredients: Fennel Seeds, Coriander Seeds, Sesame Seeds, Sugar Coated Saunf, Natural Colours & Spices.

${PACKED}`,
  },
  'jamun shots mukhwas': {
    shortDescription: 'Tangy jamun shots with a sweet-spice mukhwas finish.',
    description: `Tangy jamun shots paired with traditional mukhwas warmth — a modern twist on a classic habit.

Ingredients: Jamun Pulp, Fennel Seeds, Sugar, Citric Acid, Rock Salt, Permitted Food Colours.

${PACKED}`,
  },
}

const CATEGORY_FALLBACK = {
  'classic mukhwas': {
    shortDescription: 'Classic Gujarati mukhwas — aromatic, crunchy, and after-meal fresh.',
    description: `A classic Tasneem mukhwas blend — roasted seeds, balanced spice, and hygienic Chhapi packing.

${PACKED}`,
  },
  'fruit blend': {
    shortDescription: 'Fruit-forward mukhwas with a sweet, refreshing finish.',
    description: `Fruit-inspired mukhwas crafted for bright flavour and everyday freshness.

${PACKED}`,
  },
  'paan special': {
    shortDescription: 'Paan-inspired freshness with gulkand and aromatic spices.',
    description: `Paan-special mukhwas with traditional notes of gulkand, saunf, and rose.

${PACKED}`,
  },
  'seed mix': {
    shortDescription: 'Roasted seed mix — light, crunchy, and naturally refreshing.',
    description: `A nourishing seed mix roasted and seasoned the Tasneem way.

${PACKED}`,
  },
  'mouth freshener': {
    shortDescription: 'Everyday mouth freshener — clean taste, lasting coolness.',
    description: `Everyday mouth freshener sealed fresh from Chhapi.

${PACKED}`,
  },
}

export function normalizeProductName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function descriptionsForProduct(product) {
  const key = normalizeProductName(product.name)
  if (PRODUCT_DESCRIPTION_COPY[key]) return PRODUCT_DESCRIPTION_COPY[key]

  const categoryKey = normalizeProductName(product.category)
  const fromCategory = CATEGORY_FALLBACK[categoryKey]
  if (fromCategory) return fromCategory

  const shortName = String(product.name || 'Tasneem Mukhwas').trim()
  return {
    shortDescription: `${shortName} — hygienically packed mukhwas from Chhapi, Gujarat.`,
    description: `${shortName} from Tasneem Mukhwas. Crafted with quality ingredients and packed under strict hygiene at our Chhapi facility.

${PACKED}`,
  }
}
