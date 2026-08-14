import { useLenis } from 'lenis/react'
import { useEffect, useState, type MouseEvent } from 'react'
import { useCart } from '../../context/CartContext'
import { APP_ROUTES, isAppPagePath, navigateApp } from '../../lib/appRoutes'
import {
  pathForSection,
  scrollToSection,
  syncActiveSectionFromScroll,
  type SectionId,
} from '../../lib/sectionNav'

const NAV_LINKS = [
  { label: 'Home', id: 'home' as const },
  { label: 'About us', id: 'about' as const },
  { label: 'Products', id: 'products' as const },
  { label: 'Wholesale', id: 'wholesale' as const },
  { label: 'Contact us', id: 'contact' as const },
]

const PEACH = '#f3e6c8'
const INK = '#0a2e22'
const GOLD = '#b8860b'
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
/** Hysteresis avoids flicker when navbar height change shifts scrollY near the threshold */
const SCROLL_COMPACT_AT = 56
const SCROLL_EXPAND_AT = 12

/** Brand lockup — Tasneem (ink) + Mukhwas (bright gold), Permanent Marker */
function BrandName({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const fontSize =
    size === 'lg' ? '1.15rem' : size === 'sm' ? '0.78rem' : '0.92rem'

  return (
    <span
      className={`permanent-marker-regular inline-flex items-baseline gap-[0.28em] whitespace-nowrap leading-none ${className}`}
      style={{ fontSize }}
    >
      <span style={{ color: INK }}>Tasneem</span>
      <span style={{ color: GOLD }}>Mukhwas</span>
    </span>
  )
}

function DemoLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="20" cy="20" r="18.5" stroke={INK} strokeWidth="1.5" />
      <path
        d="M20 8c-1.2 4.5-1 8.2 0 12.5 1.4-2.8 3.8-4.6 6.8-5.2-2.6 3.2-3.4 6.4-3.1 10.2C27.2 22.8 30 19.4 31 15.2 27.4 16.6 23.8 14.8 20 8Z"
        fill={INK}
      />
      <path
        d="M20 12.5c-.6 3.2-.4 5.8.2 8.6"
        stroke={PEACH}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CartIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="20" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function HeartIcon({ className = '', filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
  )
}

function useActiveSection() {
  const [activeId, setActiveId] = useState<SectionId>('home')

  useEffect(() => {
    if (isAppPagePath(window.location.pathname)) {
      setActiveId('home')
      return
    }

    let ticking = false

    const update = () => {
      if (isAppPagePath(window.location.pathname)) {
        ticking = false
        return
      }
      setActiveId(syncActiveSectionFromScroll())
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return [activeId, setActiveId] as const
}

function NavLinks({
  activeId,
  stacked,
  onNavigate,
}: {
  activeId: SectionId
  stacked?: boolean
  onNavigate?: (id: SectionId) => void
}) {
  return (
    <ul
      className={
        stacked
          ? 'flex flex-col items-center gap-1'
          : 'flex flex-wrap items-center justify-center gap-x-5 gap-y-1 lg:gap-x-8'
      }
    >
      {NAV_LINKS.map((link) => {
        const isActive = activeId === link.id
        return (
          <li key={link.label}>
            <a
              href={pathForSection(link.id)}
              onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault()
                onNavigate?.(link.id)
              }}
              className={`cursor-pointer text-[0.92rem] font-medium tracking-wide no-underline transition-opacity hover:opacity-70 ${
                isActive
                  ? 'border-b-2 border-current pb-0.5'
                  : 'border-b-2 border-transparent pb-0.5'
              }`}
              style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Desktop:
 *  - Top: logo left · brand + links centered · cart/fav/login far right
 *  - Scrolled: logo + name left · links center · actions stay right (smooth morph)
 * Mobile: compact bar + menu
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [favoriteOn, setFavoriteOn] = useState(false)
  const [activeId, setActiveId] = useActiveSection()
  const lenis = useLenis()

  const openAuth = () => {
    setMenuOpen(false)
    navigateApp(APP_ROUTES.login)
  }

  const openCart = () => {
    setMenuOpen(false)
    navigateApp(APP_ROUTES.cart)
  }

  const { itemCount } = useCart()
  const cartBadge = itemCount > 99 ? '99+' : String(itemCount)

  const goTo = (id: SectionId) => {
    setActiveId(id)
    setMenuOpen(false)

    // From shop / auth pages — return home, then scroll to section
    if (isAppPagePath(window.location.pathname)) {
      if (id !== 'home') {
        sessionStorage.setItem('tm-pending-section', id)
      }
      navigateApp(APP_ROUTES.home)
      return
    }

    scrollToSection(id, lenis)
  }

  const goHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    goTo('home')
  }

  useEffect(() => {
    let ticking = false

    const sync = () => {
      const y = window.scrollY
      setScrolled((prev) => {
        if (!prev && y >= SCROLL_COMPACT_AT) return true
        if (prev && y <= SCROLL_EXPAND_AT) return false
        return prev
      })
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(sync)
    }

    sync()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#0a2e22]/10"
      style={{
        backgroundColor: PEACH,
        boxShadow: scrolled ? '0 8px 24px rgba(10,46,34,0.08)' : 'none',
        transition: `box-shadow 450ms ${EASE}`,
      }}
    >
      {/* —— Desktop (single morphing bar) —— */}
      <nav
        className="relative mx-auto hidden max-w-7xl items-center px-6 lg:px-10 md:flex"
        style={{
          paddingTop: scrolled ? 8 : 14,
          paddingBottom: scrolled ? 8 : 14,
          minHeight: scrolled ? 56 : 88,
          transition: `padding 450ms ${EASE}, min-height 450ms ${EASE}`,
        }}
        aria-label="Primary"
      >
        {/* Left — logo (+ name when scrolled) */}
        <a
          href="/"
          onClick={goHome}
          className="relative z-10 flex shrink-0 cursor-pointer items-center no-underline"
          aria-label="Tasneem Mukhwas home"
        >
          <span
            className="inline-flex shrink-0"
            style={{
              width: scrolled ? 32 : 44,
              height: scrolled ? 32 : 44,
              transition: `width 450ms ${EASE}, height 450ms ${EASE}`,
            }}
          >
            <DemoLogo className="h-full w-full" />
          </span>
          <span
            className="overflow-hidden"
            style={{
              maxWidth: scrolled ? 200 : 0,
              opacity: scrolled ? 1 : 0,
              marginLeft: scrolled ? 10 : 0,
              transform: scrolled ? 'translateX(0)' : 'translateX(-6px)',
              transition: `max-width 450ms ${EASE}, opacity 350ms ${EASE}, margin 450ms ${EASE}, transform 450ms ${EASE}`,
            }}
          >
            <BrandName size="sm" />
          </span>
        </a>

        {/* Center — brand (top only) + links */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 z-0 flex w-max -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{
            gap: scrolled ? 0 : 10,
            transition: `gap 450ms ${EASE}`,
          }}
        >
          <a
            href="/"
            onClick={goHome}
            className="pointer-events-auto cursor-pointer no-underline"
            aria-label="Tasneem Mukhwas"
            aria-hidden={scrolled}
            tabIndex={scrolled ? -1 : 0}
            style={{
              lineHeight: 1,
              maxHeight: scrolled ? 0 : 32,
              opacity: scrolled ? 0 : 1,
              overflow: 'hidden',
              transform: scrolled ? 'translateY(-6px)' : 'translateY(0)',
              transition: `max-height 450ms ${EASE}, opacity 350ms ${EASE}, transform 450ms ${EASE}`,
            }}
          >
            <BrandName size="lg" />
          </a>
          <div className="pointer-events-auto">
            <NavLinks activeId={activeId} onNavigate={goTo} />
          </div>
        </div>

        {/* Right — cart / favorite / login (always far right) */}
        <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2.5 md:gap-3">
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#0a2e22]/8"
            style={{ color: INK }}
            aria-label="Cart"
          >
            <CartIcon className="h-[1.2rem] w-[1.2rem]" />
            <span
              className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-sm px-0.5 text-[0.55rem] font-semibold leading-none"
              style={{ backgroundColor: INK, color: PEACH }}
            >
              {cartBadge}
            </span>
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-[#0a2e22]/8"
            style={{ color: favoriteOn ? '#9b1c1c' : INK }}
            aria-label={favoriteOn ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={favoriteOn}
            onClick={() => setFavoriteOn((v) => !v)}
          >
            <HeartIcon className="h-[1.2rem] w-[1.2rem]" filled={favoriteOn} />
          </button>

          <button
            type="button"
            onClick={openAuth}
            className="inline-flex h-9 cursor-pointer items-center rounded-full px-4 text-[0.8rem] font-semibold tracking-wide transition-transform duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: INK,
              color: PEACH,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Login / Signup
          </button>
        </div>
      </nav>

      {/* —— Mobile —— */}
      <nav
        className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 md:hidden"
        aria-label="Primary mobile"
      >
        <a
          href="/"
          onClick={goHome}
          className="flex shrink-0 cursor-pointer items-center gap-2 no-underline"
          aria-label="Tasneem Mukhwas home"
        >
          <DemoLogo className="h-8 w-8" />
          <BrandName size="sm" />
        </a>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md"
            style={{ color: INK }}
            aria-label="Cart"
          >
            <CartIcon className="h-5 w-5" />
            <span
              className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-sm px-0.5 text-[0.55rem] font-semibold leading-none"
              style={{ backgroundColor: INK, color: PEACH }}
            >
              {cartBadge}
            </span>
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md"
            style={{ color: favoriteOn ? '#9b1c1c' : INK }}
            aria-label={favoriteOn ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={favoriteOn}
            onClick={() => setFavoriteOn((v) => !v)}
          >
            <HeartIcon className="h-5 w-5" filled={favoriteOn} />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md"
            style={{ color: INK }}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-[#0a2e22]/10 px-4 pb-4 pt-3 md:hidden"
          style={{ backgroundColor: PEACH }}
        >
          <NavLinks activeId={activeId} stacked onNavigate={goTo} />
          <button
            type="button"
            onClick={openAuth}
            className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center rounded-full text-[0.9rem] font-semibold"
            style={{
              backgroundColor: INK,
              color: PEACH,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Login / Signup
          </button>
        </div>
      )}
    </header>
  )
}
