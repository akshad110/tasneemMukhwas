/** Shared copy for home teaser + dedicated What Tasneem Do page (no duplicate bullets). */

import { getManufacturingProcessStep } from './manufacturingProcessContent'

const img = (filename: string) => encodeURI(`/${filename}`)

const STEP_SOURCED = getManufacturingProcessStep(1)!

export const WHAT_TASNEEM_DO_HOME = {
  eyebrow: 'Seeds & flavours',
  title: 'What Tasneem Do',
  intro:
    'At Tasneem Mukhwas, we believe good mukhwas starts with good ingredients — selected, prepared, roasted, and blended for the right taste, aroma, crunch, and after-meal experience.',
  points: [
    {
      title: 'Respect every ingredient',
      body: 'Each seed has its own character — some bring freshness, some add crunch, some carry a familiar Indian aroma.',
    },
    {
      title: 'Our seed collection',
      body: 'Flax Seeds (Alsi), Sesame Seeds (Til), Fennel Seeds (Saunf), Coriander Dal (Dhanadal), and Dill Seeds (Suva).',
    },
    {
      title: 'Balance is the art',
      body: 'The real craft is not simply mixing seeds — it is finding the right combination of flavour, texture, and aroma.',
    },
    {
      title: 'Tradition, made relevant',
      body: 'Familiar Indian ingredients presented with the transparency, hygiene, and consistency today’s consumers expect.',
    },
  ],
  image: STEP_SOURCED.image,
  imageAlt: STEP_SOURCED.alt,
} as const

export const INGREDIENT_TABLE = [
  { name: 'Flax Seeds (Alsi)', character: 'Nutty & crunchy', role: 'Adds texture and nutritional variety' },
  { name: 'Sesame Seeds (Til)', character: 'Nutty & roasted', role: 'Adds crunch and rich flavour' },
  { name: 'Fennel Seeds (Saunf)', character: 'Sweet & refreshing', role: 'Classic aromatic ingredient' },
  { name: 'Coriander Dal (Dhanadal)', character: 'Earthy & aromatic', role: 'Adds traditional Indian character' },
  { name: 'Dill Seeds (Suva)', character: 'Herbal & distinctive', role: 'Adds depth and aroma' },
] as const

export const WHAT_TASNEEM_DO_PAGE = {
  heroTitle: 'From Our Ingredients to Your Mukhwas',
  heroSubtitle: 'The Seeds & Flavours Behind Tasneem',
  heroIntro:
    'Mukhwas may look simple in a small bowl after a meal, but creating the right taste, aroma, crunch, and overall experience takes care at every step. Here is how we work with the seeds and traditional ingredients that shape every Tasneem blend.',
  ingredientsTitle: 'Our Seed & Traditional Ingredient Collection',
  ingredientsIntro:
    'These five ingredients are important in traditional and modern mukhwas — each chosen for the role it plays in taste, texture, and familiarity.',
  ingredients: [
    {
      title: 'Flax Seeds (Alsi)',
      subtitle: 'A nutty, modern touch to traditional mukhwas',
      body: 'Small seeds with a naturally nutty flavour and pleasant crunch. At Tasneem, alsi brings a different character to seed-based mukhwas — working beautifully with sesame and aromatic spices while adding dietary fiber, healthy fats, plant-based omega-3 (ALA), protein, and lignans.',
    },
    {
      title: 'Sesame Seeds (Til)',
      subtitle: 'Small seeds with a rich traditional taste',
      body: 'Part of Indian food traditions for generations, til adds texture and roasted flavour without overpowering other ingredients. Naturally rich in plant-based protein, fiber, healthy fats, calcium, magnesium, iron, zinc, and phosphorus — familiar from til ladoos, chikki, snacks, and mukhwas alike.',
    },
    {
      title: 'Fennel Seeds (Saunf)',
      subtitle: 'The classic mukhwas favourite',
      body: 'Saunf is the ingredient most people associate with Indian mukhwas — naturally sweet, aromatic, and refreshing. Its familiar after-meal character makes it the traditional heart of our blends, suited to sweet, salted, and mixed varieties.',
    },
    {
      title: 'Coriander Dal (Dhanadal)',
      subtitle: 'A familiar Indian flavour',
      body: 'Roasted or split coriander seed with a distinctive earthy, aromatic character. Dhanadal feels instantly familiar in savoury and mixed mukhwas — contributing traditional aroma, mild earthy flavour, pleasant texture, and roasted depth when balanced with fennel, sesame, flax, and spices.',
    },
    {
      title: 'Dill Seeds (Suva)',
      subtitle: 'A distinctive traditional ingredient',
      body: 'Suva carries a more noticeable herbal and aromatic character than fennel or sesame. Used with care, it creates depth and individuality — because a good mukhwas does not need every ingredient to taste the same; each should have its own role.',
    },
  ],
  ingredientImage: img('Mukhwas_pouches_on_wooden_table_202608251630.jpeg'),
  ingredientImageAlt: 'Tasneem mukhwas pouches on wooden table',
  selectionTitle: 'Why Ingredient Selection Matters to Us',
  selectionIntro:
    'When someone enjoys a spoonful of mukhwas, they notice the flavour. From our side, there is much more behind that small serving.',
  selectionPoints: [
    'Is the ingredient suitable for the product we are creating?',
    'Does its flavour complement the other ingredients?',
    'Does it provide the right crunch and mouthfeel?',
    'Does it contribute to the overall freshness of the blend?',
    'Does roasting or processing bring out the desired character?',
    'Does one ingredient overpower the others?',
  ],
  approachTitle: 'The Tasneem Approach',
  approachIntro:
    'Tasneem Mukhwas is not just about making a mouth freshener — it is about respecting an Indian food tradition that has been part of meals, hospitality, and celebrations for generations.',
  approachPoints: [
    { title: 'Good ingredients', body: 'Every blend begins with seeds and flavours chosen for their role in the final experience.' },
    { title: 'Good flavour', body: 'Saunf, til, alsi, dhanadal, and suva each have a purpose — balanced together, not overpowering one another.' },
    { title: 'Good hygiene', body: 'Production that meets the expectations of families, retailers, and partners who trust what they serve after a meal.' },
    { title: 'Good preparation', body: 'Roasting, flavouring, and blending carried out with discipline so taste and aroma stay consistent.' },
    { title: 'Consistent quality', body: 'The same refreshing character, pack after pack — from kirana counter to hospitality tray.' },
  ],
  closingThought:
    'Mukhwas is often enjoyed in just a small serving, but the ingredients behind it carry a long history of Indian food culture. At Tasneem, we are proud to work with these familiar ingredients and give them a place in a modern mukhwas experience — because every blend begins with respect for the ingredient, respect for the tradition, and making every bite worth enjoying.',
  faqTitle: 'Frequently Asked Questions',
  faqs: [
    {
      q: 'What are the main ingredients used in traditional mukhwas?',
      a: 'Traditional mukhwas can contain fennel seeds, sesame seeds, flax seeds, coriander seeds, dill seeds, spices, coconut, and other flavouring ingredients — the exact combination depends on the recipe.',
    },
    {
      q: 'What is Alsi?',
      a: 'Alsi is the Indian name for flax seeds. They have a naturally nutty flavour and contain dietary fiber, healthy fats, ALA omega-3, protein, and lignans.',
    },
    {
      q: 'What is Til?',
      a: 'Til is the Indian name for sesame seeds — known for their nutty flavour and crunchy texture, widely used in Indian cuisine.',
    },
    {
      q: 'What is Saunf?',
      a: 'Saunf is the Hindi name for fennel seeds. It has a naturally sweet and aromatic flavour and is one of the most familiar ingredients in Indian mukhwas.',
    },
    {
      q: 'What is Dhanadal?',
      a: 'Dhanadal generally refers to a roasted or split coriander-seed preparation used in traditional Indian food and mukhwas blends, contributing an earthy and aromatic flavour.',
    },
    {
      q: 'What are Dill Seeds called in India?',
      a: 'Dill seeds are commonly known as Suva in India. They have a distinctive herbal and aromatic flavour.',
    },
    {
      q: 'Can these seeds be used together in mukhwas?',
      a: 'Yes. Flax, sesame, fennel, coriander dal, and dill seeds can be combined with other ingredients to create different traditional and modern mukhwas blends — the exact formulation depends on the desired taste and product style.',
    },
  ],
  hygiene: {
    eyebrow: 'For every customer',
    title: 'Hygiene for Customers',
    intro:
      'Consumers today look for better ingredient transparency, convenient packaging, consistent quality, interesting flavours, hygienic production, and modern presentation. Freshness is not only taste — it is how ingredients are handled from selection through sealing.',
    points: [
      {
        title: 'Suitable ingredients only',
        body: 'We evaluate whether each seed and spice is right for the product — considering flavour fit, texture, and the role it will play in the final blend.',
      },
      {
        title: 'Disciplined preparation',
        body: 'Roasting and processing are carried out to bring out the desired character of each ingredient without compromising cleanliness or batch consistency.',
      },
      {
        title: 'Hygienic production standards',
        body: 'Every pack is prepared with the safety and shelf confidence families, retailers, and hospitality partners expect from a trusted mukhwas brand.',
      },
      {
        title: 'Balanced, clean formulations',
        body: 'Ingredients are combined so no single seed overpowers the others — creating blends that feel familiar, enjoyable, and thoughtfully made.',
      },
      {
        title: 'Transparent, consistent quality',
        body: 'From ingredient selection to sealed pouches, we focus on the same foundation: good ingredients, good flavour, good hygiene, good preparation, and consistent quality.',
      },
    ],
    images: [
      {
        src: img('WhatsApp Image 2026-09-01 at 5.19.32 PM (1).jpeg'),
        alt: 'Traditional rooftop roasting of mukhwas ingredients in a large kadai',
        caption: 'Carefully selected ingredients',
      },
      {
        src: img('WhatsApp Image 2026-09-01 at 5.19.32 PM (2).jpeg'),
        alt: 'Tasneem team sourcing quality seeds and ingredients with trusted farmers',
        caption: 'Sealed retail packs',
        fit: 'infographic',
      },
      {
        src: img('WhatsApp Image 2026-09-01 at 5.19.32 PM.jpeg'),
        alt: 'Worker preparing mukhwas ingredients in hygienic batch mixing equipment',
        caption: 'Modern presentation',
      },
    ],
  },
} as const
