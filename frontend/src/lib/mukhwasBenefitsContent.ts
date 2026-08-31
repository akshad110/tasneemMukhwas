/** Home teaser + tabbed benefits page (condensed from brand articles). */

export type BenefitCategoryId = 'mukhwas' | 'saunf' | 'til' | 'alsi'

export const MUKHWAS_BENEFITS_HOME = {
  eyebrow: 'After-meal tradition',
  title: 'Benefits of Mukhwas',
  intro:
    'Mukhwas is a traditional Indian after-meal refreshment — aromatic, refreshing, and made from seeds and spice blends Indians have enjoyed for generations.',
  points: [
    {
      title: 'Refreshing finish',
      body: 'A pleasant way to end a meal with familiar aroma and a fresh mouthfeel.',
    },
    {
      title: 'Naturally nutritious seeds',
      body: 'Many blends include fennel, sesame, flax, and coriander — ingredients with fiber, healthy fats, and plant compounds.',
    },
    {
      title: 'Digestive comfort tradition',
      body: 'Saunf and seed-based mukhwas are traditionally enjoyed after meals for everyday digestive comfort.',
    },
    {
      title: 'Variety for every taste',
      body: 'Sweet, salted, paan, and seed blends — something for every preference and occasion.',
    },
  ],
  image: '/Bowls_of_mukhwas_displayed_2K_202608312345.jpeg',
  imageAlt: 'Bowls of assorted mukhwas blends displayed on a linen table',
} as const

export type BenefitCategory = {
  id: BenefitCategoryId
  tabLabel: string
  title: string
  intro: string
  heroImage: string
  heroImageAlt: string
  benefits: readonly { title: string; body: string }[]
  closing: string
  faqs: readonly { q: string; a: string }[]
}

export const BENEFIT_CATEGORIES: readonly BenefitCategory[] = [
  {
    id: 'mukhwas',
    tabLabel: 'Mukhwas',
    title: '10 Benefits of Mukhwas',
    intro:
      'From homes and restaurants to celebrations — mukhwas brings flavour, tradition, and a refreshing finish to everyday meals.',
    heroImage: encodeURI('/Sesame_seeds_overflowing_jute_bag_202609010053.jpeg'),
    heroImageAlt: 'Organic sesame seeds spilling from a jute bag labeled Til',
    benefits: [
      {
        title: 'Refreshing way to finish a meal',
        body: 'Fennel and aromatic spices leave a pleasant, fresh feeling after eating.',
      },
      {
        title: 'Naturally nutritious ingredients',
        body: 'Seed-based blends can provide fiber, healthy fats, minerals, and plant compounds depending on the recipe.',
      },
      {
        title: 'Fennel for digestive support',
        body: 'Saunf is traditionally consumed after meals and associated with digestive comfort.',
      },
      {
        title: 'Dietary fiber from seeds',
        body: 'Ingredients like flax and fennel contribute fiber that supports normal digestive function.',
      },
      {
        title: 'Convenient tradition',
        body: 'No preparation needed — a small serving after meals suits homes, restaurants, and gatherings.',
      },
      {
        title: 'A taste of Indian food culture',
        body: 'From simple roasted saunf to elaborate blends — mukhwas reflects regional and family preferences.',
      },
    ],
    closing:
      'Enjoyed in moderation, mukhwas brings together flavour, tradition, and a refreshing finish. At Tasneem Mukhwas, we focus on carefully selected ingredients and consistent quality.',
    faqs: [
      {
        q: 'Is mukhwas good after meals?',
        a: 'It is traditionally enjoyed after meals as a refreshing mouth freshener. Ingredients like fennel are also associated with digestive comfort.',
      },
      {
        q: 'Is mukhwas healthy?',
        a: 'Nutritional value depends on ingredients and preparation. Seed-based varieties can provide fiber, healthy fats, and plant compounds.',
      },
      {
        q: 'What is the main ingredient?',
        a: 'There is no single main ingredient — popular varieties may contain fennel, sesame, flax, coriander, spices, and more.',
      },
    ],
  },
  {
    id: 'saunf',
    tabLabel: 'Saunf',
    title: 'Benefits of Fennel Seeds (Saunf)',
    intro:
      'Saunf is one of the most recognised mukhwas ingredients — naturally sweet, aromatic, and deeply rooted in Indian after-meal culture.',
    heroImage: encodeURI('/Fennel_seeds_in_ceramic_dish_202609010053.jpeg'),
    heroImageAlt: 'Fennel seeds and mukhwas mix in a ceramic dish with fresh saunf sprigs',
    benefits: [
      {
        title: 'Traditionally enjoyed after meals',
        body: 'Its sweet, refreshing flavour makes saunf a natural choice to finish a meal.',
      },
      {
        title: 'Supports digestive comfort',
        body: 'Aromatic oils and natural plant compounds have made saunf popular in traditional food practices.',
      },
      {
        title: 'Contains dietary fiber',
        body: 'Fiber supports normal digestive function and regular bowel movements as part of a balanced diet.',
      },
      {
        title: 'Naturally aromatic',
        body: 'Sweet, slightly licorice-like aroma — ideal for refreshing mukhwas and mouth-freshener blends.',
      },
      {
        title: 'Antioxidant plant compounds',
        body: 'Fennel contains naturally occurring compounds that help protect cells from oxidative stress.',
      },
      {
        title: 'Versatile in modern mukhwas',
        body: 'Pairs with sesame, flax, coriander, and spices for sweet or salted varieties.',
      },
    ],
    closing:
      'Whether on its own or in a mukhwas blend, saunf continues to bring traditional flavour, freshness, and aroma to the Indian dining experience.',
    faqs: [
      {
        q: 'Is saunf good after meals?',
        a: 'Yes — it is traditionally enjoyed for its refreshing taste and association with digestive comfort.',
      },
      {
        q: 'Does saunf contain fiber?',
        a: 'Yes, fennel seeds naturally contain dietary fiber depending on serving size.',
      },
      {
        q: 'Is saunf used in mukhwas?',
        a: 'Fennel is one of the most common ingredients in traditional Indian mukhwas.',
      },
    ],
  },
  {
    id: 'til',
    tabLabel: 'Til',
    title: 'Benefits of Sesame Seeds (Til)',
    intro:
      'Tiny seeds with a nutty flavour and naturally occurring nutrients — til has been part of Indian sweets, snacks, and mukhwas for generations.',
    heroImage: encodeURI('/Sesame_seeds_overflowing_jute_bag_202609010052.jpeg'),
    heroImageAlt: 'Organic til sesame seeds overflowing from a jute bag on stone',
    benefits: [
      {
        title: 'Source of healthy fats',
        body: 'Naturally contains unsaturated fats — an important part of balanced nutrition.',
      },
      {
        title: 'Plant-based protein',
        body: 'Useful for those who include plant foods in their everyday diet.',
      },
      {
        title: 'Rich in dietary fiber',
        body: 'Supports normal digestive function as part of a varied diet.',
      },
      {
        title: 'Important minerals',
        body: 'Contains calcium, magnesium, iron, zinc, and phosphorus.',
      },
      {
        title: 'Nutty, roasted flavour',
        body: 'Lightly roasted til enhances aroma and creates a richer taste in snacks and mukhwas.',
      },
      {
        title: 'Versatile mukhwas ingredient',
        body: 'Blends well with flax, fennel, coriander, and spices for unique textures.',
      },
    ],
    closing:
      'From til ladoos to modern mukhwas, sesame seeds add flavour, crunch, and nutritional value when enjoyed in appropriate quantities.',
    faqs: [
      {
        q: 'What are the benefits of sesame seeds?',
        a: 'They provide fiber, plant-based protein, healthy fats, minerals, and antioxidant compounds.',
      },
      {
        q: 'Is til used in mukhwas?',
        a: 'Yes — sesame is commonly combined with fennel, flax, coriander, and spices.',
      },
      {
        q: 'Does til contain protein?',
        a: 'Yes, sesame seeds naturally contain plant-based protein.',
      },
    ],
  },
  {
    id: 'alsi',
    tabLabel: 'Alsi',
    title: 'Benefits of Flax Seeds (Alsi)',
    intro:
      'Small seeds with impressive nutrition — alsi is rich in fiber, healthy fats, plant-based omega-3 (ALA), protein, and lignans.',
    heroImage: encodeURI('/Flax_seeds_in_glass_jar_202609010052.jpeg'),
    heroImageAlt: 'Organic flax seeds (alsi) in a labeled glass jar',
    benefits: [
      {
        title: 'Rich in dietary fiber',
        body: 'Supports normal digestive function and regular bowel movements.',
      },
      {
        title: 'Plant-based omega-3 (ALA)',
        body: 'One of the best-known plant sources of alpha-linolenic acid.',
      },
      {
        title: 'Plant-based protein',
        body: 'A useful addition to meals, snacks, and seed blends.',
      },
      {
        title: 'Naturally occurring lignans',
        body: 'Distinctive plant compounds with antioxidant properties.',
      },
      {
        title: 'Easy to include in everyday foods',
        body: 'Works in oats, yogurt, salads, seed mixes — and traditional mukhwas.',
      },
      {
        title: 'Pairs well with other seeds',
        body: 'Alsi and til together create nutty flavour and crunchy texture in modern mukhwas.',
      },
    ],
    closing:
      'When consumed in appropriate quantities as part of a balanced diet, flax seeds can be a valuable addition — from breakfast to Tasneem seed-based mukhwas.',
    faqs: [
      {
        q: 'What is flax seed called in India?',
        a: 'Flax seeds are commonly known as Alsi (अलसी) in India.',
      },
      {
        q: 'Are flax seeds good for digestion?',
        a: 'They contain soluble and insoluble fiber. Adequate water intake is important with fiber-rich foods.',
      },
      {
        q: 'Can flax seeds be used in mukhwas?',
        a: 'Yes — they combine with sesame, fennel, and spices for flavourful seed-based mukhwas.',
      },
    ],
  },
] as const

export function getBenefitCategory(id: BenefitCategoryId) {
  return BENEFIT_CATEGORIES.find((c) => c.id === id) ?? BENEFIT_CATEGORIES[0]
}
