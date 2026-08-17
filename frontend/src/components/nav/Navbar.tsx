import { useLenis } from 'lenis/react'
import { useEffect, useState, type MouseEvent } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import {
  APP_ROUTES,
  isAppPagePath,
  isKnowMorePath,
  isShopPath,
  navigateApp,
} from '../../lib/appRoutes'
import {
  pathForSection,
  scrollToSection,
  syncActiveSectionFromScroll,
  type SectionId,
} from '../../lib/sectionNav'
import BrandLogo from '../shared/BrandLogo'
import BrandNameLockup from '../shared/BrandNameLockup'

const NAV_LINKS = [
  { label: 'Home', id: 'home' as const },
  { label: 'About us', id: 'about' as const },
  { label: 'Shop', id: 'products' as const },
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
  const [activeId, setActiveId] = useState<SectionId>(() => {
    if (isKnowMorePath(window.location.pathname)) return 'about'
    if (isShopPath(window.location.pathname)) return 'products'
    return 'home'
  })

  useEffect(() => {
    let ticking = false

    const fromPath = (): SectionId | null => {
      if (isKnowMorePath(window.location.pathname)) return 'about'
      if (isShopPath(window.location.pathname)) return 'products'
      if (isAppPagePath(window.location.pathname)) return 'home'
      return null
    }

    const update = () => {
      const pathActive = fromPath()
      if (pathActive) {
        setActiveId(pathActive)
        ticking = false
        return
      }
      const current = syncActiveSectionFromScroll()
      // About / Shop underlines only on their pages — not home section scroll
      setActiveId((prev) => {
        if (current === 'about') return prev === 'about' ? 'wholesale' : prev
        if (current === 'products') return prev === 'products' ? 'wholesale' : prev
        return current
      })
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    const onPop = () => update()

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('popstate', onPop)
    }
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
        const href =
          link.id === 'about'
            ? APP_ROUTES.knowMore
            : link.id === 'products'
              ? APP_ROUTES.shop
              : pathForSection(link.id)
        return (
          <li key={link.label}>
            <a
              href={href}
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

function ProfileAvatarMenu({ stacked = false }: { stacked?: boolean }) {
  const { user } = useAuth()
  if (!user) return null

  const initial = (user.name?.trim()?.[0] || 'U').toUpperCase()
  const goProfile = () => navigateApp(APP_ROUTES.profile)
  const goOrders = () => navigateApp(APP_ROUTES.myOrders)

  if (stacked) {
    return (
      <div className="mt-4 flex w-full flex-col gap-2">
        <button
          type="button"
          onClick={goProfile}
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full text-[0.9rem] font-semibold"
          style={{
            backgroundColor: INK,
            color: PEACH,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-[0.8rem] font-bold"
            style={{ backgroundColor: GOLD, color: INK }}
          >
            {initial}
          </span>
          Profile
        </button>
        <button
          type="button"
          onClick={goOrders}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-full border text-[0.9rem] font-semibold"
          style={{
            borderColor: 'rgba(10,46,34,0.2)',
            backgroundColor: 'transparent',
            color: INK,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          My Orders
        </button>
      </div>
    )
  }

  return (
    <div className="group relative">
      <button
        type="button"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[0.85rem] font-bold transition-transform duration-300 hover:scale-[1.04]"
        style={{ backgroundColor: GOLD, color: INK, fontFamily: 'Inter, sans-serif' }}
        aria-label={`Account menu for ${user.name}`}
        aria-haspopup="menu"
      >
        {initial}
      </button>
      <div
        className="invisible absolute right-0 top-[calc(100%+6px)] z-50 min-w-[150px] translate-y-1 rounded-xl border py-1.5 opacity-0 shadow-lg transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
        style={{
          backgroundColor: PEACH,
          borderColor: 'rgba(10,46,34,0.12)',
          boxShadow: '0 16px 36px -18px rgba(10,46,34,0.45)',
        }}
        role="menu"
      >
        <button
          type="button"
          role="menuitem"
          onClick={goProfile}
          className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3.5 py-2 text-left text-[0.8rem] font-semibold transition hover:bg-[#0a2e22]/8"
          style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
        >
          Profile
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={goOrders}
          className="flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3.5 py-2 text-left text-[0.8rem] font-semibold transition hover:bg-[#0a2e22]/8"
          style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
        >
          My Orders
        </button>
      </div>
    </div>
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
  const [activeId, setActiveId] = useActiveSection()
  const lenis = useLenis()
  const { user, loading: authLoading } = useAuth()
  const { count: wishlistCount } = useWishlist()

  const openAuth = () => {
    setMenuOpen(false)
    navigateApp(APP_ROUTES.login)
  }

  const openCart = () => {
    setMenuOpen(false)
    navigateApp(APP_ROUTES.cart)
  }

  const openWishlist = () => {
    setMenuOpen(false)
    if (!user) {
      navigateApp(APP_ROUTES.login)
      return
    }
    navigateApp(APP_ROUTES.wishlist)
  }

  const { itemCount } = useCart()
  const cartBadge = itemCount > 99 ? '99+' : String(itemCount)
  const wishlistBadge = wishlistCount > 99 ? '99+' : String(wishlistCount)

  const goTo = (id: SectionId) => {
    setMenuOpen(false)

    // About us → dedicated know-more page (not home #about scroll)
    if (id === 'about') {
      setActiveId('about')
      navigateApp(APP_ROUTES.knowMore)
      return
    }

    // Shop → /shop page
    if (id === 'products') {
      setActiveId('products')
      navigateApp(APP_ROUTES.shop)
      return
    }

    setActiveId(id)

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
            className="inline-flex shrink-0 items-center justify-center"
            style={{
              width: scrolled ? 36 : 48,
              height: scrolled ? 44 : 58,
              transition: `width 450ms ${EASE}, height 450ms ${EASE}`,
            }}
          >
            <BrandLogo className="h-full w-full object-contain object-center" />
          </span>
          <span
            className="overflow-hidden"
            style={{
              maxWidth: scrolled ? 260 : 0,
              opacity: scrolled ? 1 : 0,
              marginLeft: scrolled ? 10 : 0,
              transform: scrolled ? 'translateX(0)' : 'translateX(-6px)',
              transition: `max-width 450ms ${EASE}, opacity 350ms ${EASE}, margin 450ms ${EASE}, transform 450ms ${EASE}`,
            }}
          >
            <BrandNameLockup size="sm" />
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
              maxHeight: scrolled ? 0 : 48,
              opacity: scrolled ? 0 : 1,
              overflow: 'hidden',
              transform: scrolled ? 'translateY(-6px)' : 'translateY(0)',
              transition: `max-height 450ms ${EASE}, opacity 350ms ${EASE}, transform 450ms ${EASE}`,
            }}
          >
            <BrandNameLockup size="lg" />
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

          <div className="group relative">
            <button
              type="button"
              onClick={openWishlist}
              className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#0a2e22]/8"
              style={{ color: wishlistCount > 0 ? '#9b1c1c' : INK }}
              aria-label="Wishlist"
            >
              <HeartIcon className="h-[1.2rem] w-[1.2rem]" filled={wishlistCount > 0} />
              {wishlistCount > 0 && (
                <span
                  className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-sm px-0.5 text-[0.55rem] font-semibold leading-none"
                  style={{ backgroundColor: '#9b1c1c', color: PEACH }}
                >
                  {wishlistBadge}
                </span>
              )}
            </button>
            <span
              className="pointer-events-none invisible absolute left-1/2 top-[calc(100%+8px)] z-50 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide opacity-0 shadow-md transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
              style={{
                backgroundColor: PEACH,
                borderColor: 'rgba(10,46,34,0.12)',
                color: INK,
                fontFamily: 'Inter, sans-serif',
              }}
              role="tooltip"
            >
              Wishlist
            </span>
          </div>

          {!authLoading && user ? (
            <ProfileAvatarMenu />
          ) : (
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
          )}
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
          className="flex shrink-0 cursor-pointer items-center gap-2.5 no-underline"
          aria-label="Tasneem Mukhwas home"
        >
          <BrandLogo className="h-11 w-9 object-contain object-center" />
          <BrandNameLockup size="sm" />
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
          <div className="group relative">
            <button
              type="button"
              onClick={openWishlist}
              className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md"
              style={{ color: wishlistCount > 0 ? '#9b1c1c' : INK }}
              aria-label="Wishlist"
            >
              <HeartIcon className="h-5 w-5" filled={wishlistCount > 0} />
              {wishlistCount > 0 && (
                <span
                  className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-sm px-0.5 text-[0.55rem] font-semibold leading-none"
                  style={{ backgroundColor: '#9b1c1c', color: PEACH }}
                >
                  {wishlistBadge}
                </span>
              )}
            </button>
            <span
              className="pointer-events-none invisible absolute left-1/2 top-[calc(100%+8px)] z-50 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide opacity-0 shadow-md transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
              style={{
                backgroundColor: PEACH,
                borderColor: 'rgba(10,46,34,0.12)',
                color: INK,
                fontFamily: 'Inter, sans-serif',
              }}
              role="tooltip"
            >
              Wishlist
            </span>
          </div>
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
          {!authLoading && user ? (
            <ProfileAvatarMenu stacked />
          ) : (
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
          )}
        </div>
      )}
    </header>
  )
}
