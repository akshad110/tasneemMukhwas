export const SECTION_ROUTES = [
  { id: 'home', path: '/' },
  { id: 'about', path: '/about' },
  { id: 'products', path: '/products' },
  { id: 'wholesale', path: '/wholesale' },
  { id: 'contact', path: '/contact' },
] as const

export type SectionId = (typeof SECTION_ROUTES)[number]['id']

const PATH_BY_ID = Object.fromEntries(
  SECTION_ROUTES.map((s) => [s.id, s.path]),
) as Record<SectionId, string>

const ID_BY_PATH = Object.fromEntries(
  SECTION_ROUTES.map((s) => [s.path, s.id]),
) as Record<string, SectionId>

/** Ignore scroll-driven URL updates while a nav click is animating. */
let navLockUntil = 0

export function pathForSection(id: SectionId): string {
  return PATH_BY_ID[id] ?? '/'
}

export function sectionFromPath(pathname: string): SectionId {
  return ID_BY_PATH[pathname] ?? 'home'
}

/** Soft URL sync — no hash fragments, no full reload. */
export function setSectionPath(path: string) {
  const next = path || '/'
  if (window.location.pathname === next && !window.location.hash) return
  window.history.replaceState(null, '', next)
}

/** Always land on `/` after refresh / hard load. */
export function resetPathToHome() {
  navLockUntil = 0
  if (window.location.pathname !== '/' || window.location.hash || window.location.search) {
    window.history.replaceState(null, '', '/')
  }
}

type ScrollTarget = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { offset?: number; immediate?: boolean; duration?: number },
  ) => void
}

export function scrollToSection(id: SectionId, lenis?: ScrollTarget | null) {
  const path = pathForSection(id)
  navLockUntil = Date.now() + 1400
  setSectionPath(path)

  if (id === 'home') {
    if (lenis) lenis.scrollTo(0, { duration: 1.1 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const el = document.getElementById(id)
  if (!el) return

  if (lenis) lenis.scrollTo(el, { offset: -96, duration: 1.1 })
  else {
    const top = el.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

/** Which section owns the current scroll position (footer counts as contact). */
export function getActiveSectionId(): SectionId {
  if (window.scrollY < 80) return 'home'

  const marker = window.scrollY + Math.min(140, window.innerHeight * 0.22)
  // Page order (not nav order): wholesale sits above about
  const order: Exclude<SectionId, 'home'>[] = [
    'wholesale',
    'about',
    'products',
    'contact',
  ]

  let current: SectionId = 'home'
  for (const id of order) {
    const el = document.getElementById(id)
    if (!el) continue
    if (el.offsetTop <= marker) current = id
  }

  // Past contact (footer) still counts as contact
  const contact = document.getElementById('contact')
  if (contact && window.scrollY + window.innerHeight * 0.45 >= contact.offsetTop) {
    current = 'contact'
  }

  return current
}

/** Scrollspy helper — skips URL/underline updates while a click-nav animation runs. */
export function syncActiveSectionFromScroll(): SectionId {
  if (Date.now() < navLockUntil) {
    return sectionFromPath(window.location.pathname)
  }
  const current = getActiveSectionId()
  setSectionPath(pathForSection(current))
  return current
}
