export const SITE_ORIGIN = 'https://tasneemmukhwas.com'
export const SITE_NAME = 'Tasneem Mukhwas'
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/products/wmremove-transformed.jpeg`

export type SeoMeta = {
  title: string
  description: string
  robots?: string
}

const DEFAULT_DESC =
  'Tasneem Mukhwas — premium mukhwas, paan blends, and mouth fresheners. Shop online or enquire for wholesale from Gujarat, India.'

const PAGE_SEO: Record<string, SeoMeta> = {
  '/': {
    title: 'Tasneem Mukhwas | Premium Mukhwas & Mouth Freshener',
    description: DEFAULT_DESC,
  },
  '/shop': {
    title: 'Shop Mukhwas Online | Tasneem Mukhwas',
    description:
      'Buy Tasneem Mukhwas packets and bottles online — salted mukhwas, sweet blends, paan shots, imli and mango masti. Authentic Gujarati mouth freshener.',
  },
  '/know-more': {
    title: 'About Us | Tasneem Mukhwas',
    description:
      'Learn about Tasneem Mukhwas — a Gujarat-based mukhwas maker focused on clean ingredients, hygienic processing, and authentic after-meal blends.',
  },
  '/our-company': {
    title: 'Our Company | Tasneem Mukhwas',
    description:
      'Meet the Tasneem Mukhwas company — manufacturing, packaging, and distribution of traditional Indian mouth fresheners from Banaskantha, Gujarat.',
  },
  '/wholesale': {
    title: 'Wholesale Mukhwas | Tasneem Mukhwas',
    description:
      'Wholesale and bulk mukhwas supply for distributors, kirana, HORECA, and exporters. Enquire for carton MOQs and dealership with Tasneem Mukhwas.',
  },
  '/dealership': {
    title: 'Become a Distributor | Tasneem Mukhwas',
    description:
      'Apply for a Tasneem Mukhwas dealership or distributorship. Partner with us for bulk mouth-freshener supply across India.',
  },
  '/contact': {
    title: 'Contact Us | Tasneem Mukhwas',
    description:
      'Contact Tasneem Mukhwas in Banaskantha, Gujarat. Call, email, or WhatsApp for retail orders, wholesale enquiries, and customer support.',
  },
  '/what-tasneem-do': {
    title: 'What Tasneem Do | Tasneem Mukhwas',
    description:
      'See how Tasneem Mukhwas sources, blends, packs, and delivers traditional mukhwas for retail and bulk customers.',
  },
  '/benefits-of-mukhwas': {
    title: 'Benefits of Mukhwas | Tasneem Mukhwas',
    description:
      'Discover the benefits of mukhwas as a traditional Indian after-meal mouth freshener — digestion, freshness, and everyday ritual.',
  },
  '/privacy': {
    title: 'Privacy Policy | Tasneem Mukhwas',
    description: 'How Tasneem Mukhwas collects, uses, and protects personal information on tasneemmukhwas.com.',
  },
  '/shipping-policy': {
    title: 'Shipping Policy | Tasneem Mukhwas',
    description: 'Shipping and delivery terms for Tasneem Mukhwas retail and bulk orders across India.',
  },
  '/terms': {
    title: 'Terms & Conditions | Tasneem Mukhwas',
    description: 'Terms and conditions for shopping, wholesale enquiries, and using the Tasneem Mukhwas website.',
  },
}

const NOINDEX: SeoMeta = {
  title: `${SITE_NAME}`,
  description: DEFAULT_DESC,
  robots: 'noindex, nofollow',
}

const PRIVATE_PREFIXES = [
  '/admin',
  '/cart',
  '/checkout',
  '/login',
  '/signup',
  '/profile',
  '/settings',
  '/my-orders',
  '/myorderpage',
  '/wishlist',
]

export function canonicalPath(pathname: string) {
  if (!pathname || pathname === '/') return '/'
  const trimmed = pathname.replace(/\/+$/, '')
  return trimmed || '/'
}

export function getSeoForPath(pathname: string): SeoMeta {
  const path = canonicalPath(pathname)
  if (PRIVATE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) {
    return NOINDEX
  }
  if (path.startsWith('/shop/product/')) {
    return {
      title: `Shop Mukhwas | ${SITE_NAME}`,
      description: PAGE_SEO['/shop']!.description,
    }
  }
  return PAGE_SEO[path] ?? {
    title: SITE_NAME,
    description: DEFAULT_DESC,
  }
}

export function canonicalUrl(pathname: string) {
  const path = canonicalPath(pathname)
  return path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function applySeo(pathname: string) {
  const seo = getSeoForPath(pathname)
  const url = canonicalUrl(pathname)
  document.title = seo.title
  upsertMeta('name', 'description', seo.description)
  upsertMeta('name', 'robots', seo.robots ?? 'index, follow')
  upsertLink('canonical', url)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:site_name', SITE_NAME)
  upsertMeta('property', 'og:title', seo.title)
  upsertMeta('property', 'og:description', seo.description)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:image', DEFAULT_OG_IMAGE)
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', seo.title)
  upsertMeta('name', 'twitter:description', seo.description)

  upsertJsonLd('tm-ld-org', {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: `${SITE_ORIGIN}/favicon-96x96.png`,
    email: 'tasneemmukhwas@gmail.com',
    telephone: '+91-91043-01430',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ground Floor, Unit No-24, Galaxy Complex, Opp Hotel Ekta, Chhapi Highway',
      addressLocality: 'Banaskantha',
      addressRegion: 'Gujarat',
      postalCode: '385210',
      addressCountry: 'IN',
    },
  })

  upsertJsonLd('tm-ld-site', {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
  })
}
