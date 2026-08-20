import { useLenis } from 'lenis/react'
import { useEffect, useState, type MouseEvent } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import NavbarNotifications from './NavbarNotifications'
import {
  APP_ROUTES,
  isAppPagePath,
  isAuthPath,
  isCheckoutPath,
  isAdminPath,
  isKnowMorePath,
  isHomeScrollPath,
  isNavNeutralAppPath,
  isShopPath,
  isWholesalePath,
  isContactPath,
  navigateApp,
} from '../../lib/appRoutes'
import MobileBottomNav from './MobileBottomNav'
import {
  getActiveSectionId,
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

const PEACH = '#f2f4f5'
const INK = '#0a2e22'
const GOLD = '#b8860b'
const NAV_LINK_DARK = 'rgba(242,244,245,0.68)'
const NAV_LINK_LIGHT = 'rgba(10,46,34,0.62)'
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
/** Hysteresis avoids flicker when navbar height change shifts scroll position near the threshold */
const SCROLL_COMPACT_AT = 96
const SCROLL_EXPAND_AT = 8

function shouldShowMobileBottomNav(pathname: string) {
  return !isAdminPath(pathname) && !isAuthPath(pathname) && !isCheckoutPath(pathname)
}

/** Bottom tab highlight follows route only — home stays active for the full home scroll experience. */
function resolveMobileBottomNavActive(pathname: string): SectionId | null {
  if (isKnowMorePath(pathname)) return 'about'
  if (isShopPath(pathname)) return 'products'
  if (isWholesalePath(pathname)) return 'wholesale'
  if (isContactPath(pathname)) return 'contact'
  if (pathname === '/' || isHomeScrollPath(pathname)) return 'home'
  return null
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
  const resolveActive = (pathname: string): SectionId | null => {
    if (isNavNeutralAppPath(pathname)) return null
    if (isKnowMorePath(pathname)) return 'about'
    if (isShopPath(pathname)) return 'products'
    if (isWholesalePath(pathname)) return 'wholesale'
    if (isContactPath(pathname)) return 'contact'

    if (pathname === '/' || isHomeScrollPath(pathname)) {
      const section = getActiveSectionId()
      // Home contact section — keep Home underline; /contact page gets its own underline
      if (section === 'contact') return 'home'
      return section
    }

    return 'home'
  }

  const [activeId, setActiveId] = useState<SectionId | null>(() =>
    resolveActive(window.location.pathname),
  )

  useEffect(() => {
    let ticking = false

    const update = () => {
      const pathname = window.location.pathname

      if (pathname === '/' || isHomeScrollPath(pathname)) {
        syncActiveSectionFromScroll()
      }

      setActiveId(resolveActive(window.location.pathname))
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

function NavCountBadge({
  count,
  label,
  variant = 'cart',
  ringColor,
}: {
  count: number
  label: string
  variant?: 'cart' | 'wishlist'
  ringColor: string
}) {
  if (count <= 0) return null

  const display = count > 99 ? '99+' : String(count)

  return (
    <span
      className="absolute -right-1 -top-1 z-10 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[0.65rem] font-bold leading-none"
      style={{
        backgroundColor: variant === 'wishlist' ? '#b91c1c' : INK,
        color: '#ffffff',
        boxShadow: `0 0 0 2px ${ringColor}`,
      }}
      aria-label={`${label}: ${display}`}
    >
      {display}
    </span>
  )
}

function NavLinks({
  activeId,
  stacked,
  onNavigate,
  onDark = false,
}: {
  activeId: SectionId | null
  stacked?: boolean
  onNavigate?: (id: SectionId) => void
  onDark?: boolean
}) {
  return (
    <ul
      className={
        stacked
          ? 'flex flex-col items-center gap-1'
          : 'flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 lg:gap-x-9'
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
              className={`cursor-pointer text-[0.82rem] font-medium tracking-wide no-underline transition-opacity hover:opacity-80 ${
                isActive ? 'border-b-2 pb-0.5' : 'border-b-2 border-transparent pb-0.5'
              }`}
              style={{
                color: onDark ? NAV_LINK_DARK : NAV_LINK_LIGHT,
                borderColor: isActive ? GOLD : 'transparent',
                fontFamily: 'Inter, sans-serif',
              }}
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

function ProfileAvatarMenu({
  stacked = false,
  onDark = false,
  onAction,
}: {
  stacked?: boolean
  onDark?: boolean
  onAction?: () => void
}) {
  const { user, logout } = useAuth()
  if (!user) return null

  const initial = (user.name?.trim()?.[0] || 'U').toUpperCase()

  const run = (fn: () => void) => {
    onAction?.()
    fn()
  }

  const goProfile = () => run(() => navigateApp(APP_ROUTES.profile))
  const goOrders = () => run(() => navigateApp(APP_ROUTES.myOrders))
  const goSettings = () => run(() => navigateApp(APP_ROUTES.settings))
  const handleLogout = () =>
    run(() => {
      logout()
      navigateApp(APP_ROUTES.home)
    })

  const menuBtn =
    'flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3.5 py-2 text-left text-[0.8rem] font-semibold transition hover:bg-[#0a2e22]/8'
  const menuBtnDanger =
    'flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent px-3.5 py-2 text-left text-[0.8rem] font-semibold transition hover:bg-[#a32020]/8'

  if (stacked) {
    return (
      <div className="flex w-full flex-col gap-2">
        <button
          type="button"
          onClick={goProfile}
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full text-[0.9rem] font-semibold"
          style={{
            backgroundColor: onDark ? GOLD : INK,
            color: onDark ? INK : PEACH,
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
            borderColor: onDark ? 'rgba(242,244,245,0.35)' : 'rgba(10,46,34,0.2)',
            backgroundColor: 'transparent',
            color: onDark ? PEACH : INK,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          My Orders
        </button>
        <button
          type="button"
          onClick={goSettings}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-full border text-[0.9rem] font-semibold"
          style={{
            borderColor: onDark ? 'rgba(242,244,245,0.35)' : 'rgba(10,46,34,0.2)',
            backgroundColor: 'transparent',
            color: onDark ? PEACH : INK,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Settings
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-full border text-[0.9rem] font-semibold"
          style={{
            borderColor: 'rgba(163,32,32,0.28)',
            backgroundColor: 'rgba(163,32,32,0.06)',
            color: '#a32020',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Logout
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
        className="invisible absolute right-0 top-[calc(100%+6px)] z-50 min-w-[168px] translate-y-1 rounded-xl border py-1.5 opacity-0 shadow-lg transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
        style={{
          backgroundColor: PEACH,
          borderColor: 'rgba(10,46,34,0.12)',
          boxShadow: '0 16px 36px -18px rgba(10,46,34,0.45)',
        }}
        role="menu"
      >
        <button type="button" role="menuitem" onClick={goProfile} className={menuBtn} style={{ color: INK, fontFamily: 'Inter, sans-serif' }}>
          Profile
        </button>
        <button type="button" role="menuitem" onClick={goOrders} className={menuBtn} style={{ color: INK, fontFamily: 'Inter, sans-serif' }}>
          My Orders
        </button>
        <button type="button" role="menuitem" onClick={goSettings} className={menuBtn} style={{ color: INK, fontFamily: 'Inter, sans-serif' }}>
          Settings
        </button>
        <div className="my-1.5 border-t" style={{ borderColor: 'rgba(10,46,34,0.1)' }} role="separator" />
        <button type="button" role="menuitem" onClick={handleLogout} className={menuBtnDanger} style={{ color: '#a32020', fontFamily: 'Inter, sans-serif' }}>
          Logout
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
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [activeId, setActiveId] = useActiveSection()
  const lenis = useLenis(({ scroll }) => {
    setScrolled((prev) => {
      if (!prev && scroll >= SCROLL_COMPACT_AT) return true
      if (prev && scroll <= SCROLL_EXPAND_AT) return false
      return prev
    })
  })
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

    // Wholesale → dedicated page
    if (id === 'wholesale') {
      setActiveId('wholesale')
      navigateApp(APP_ROUTES.wholesale)
      return
    }

    // Contact → dedicated page
    if (id === 'contact') {
      setActiveId('contact')
      navigateApp(APP_ROUTES.contact)
      return
    }

    setActiveId('home')

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
    const sync = () => {
      const y = lenis?.scroll ?? window.scrollY
      setScrolled((prev) => {
        if (!prev && y >= SCROLL_COMPACT_AT) return true
        if (prev && y <= SCROLL_EXPAND_AT) return false
        return prev
      })
    }

    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => window.removeEventListener('scroll', sync)
  }, [lenis])

  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    const applyTabBarSpacing = () => {
      const mobile = window.matchMedia('(max-width: 767px)').matches
      const show = mobile && shouldShowMobileBottomNav(window.location.pathname)
      document.body.classList.toggle('tm-mobile-tab-active', show)
    }

    applyTabBarSpacing()
    window.addEventListener('popstate', applyTabBarSpacing)
    window.addEventListener('resize', applyTabBarSpacing)
    return () => {
      window.removeEventListener('popstate', applyTabBarSpacing)
      window.removeEventListener('resize', applyTabBarSpacing)
      document.body.classList.remove('tm-mobile-tab-active')
    }
  }, [pathname])

  const isHome = isHomeScrollPath(pathname)
  const isDarkNav = isHome && !scrolled
  const heroOverlay = isHome && !scrolled
  const navInk = isDarkNav ? 'rgba(242,244,245,0.82)' : INK
  const navHover = isDarkNav ? 'hover:bg-white/10' : 'hover:bg-[#0a2e22]/8'
  const navBorder = heroOverlay ? 'border-transparent' : 'border-[#0a2e22]/08'
  const badgeRing = isDarkNav ? 'rgba(10,46,34,0.85)' : PEACH
  const showMobileBottomNav = shouldShowMobileBottomNav(pathname)
  const mobileTabActiveId = resolveMobileBottomNavActive(pathname)

  return (
    <>
    <header
      className={`sticky top-0 z-50 w-full border-b ${navBorder}`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        background: heroOverlay
          ? 'linear-gradient(180deg, rgba(6,14,11,0.42) 0%, rgba(6,14,11,0.12) 55%, transparent 100%)'
          : PEACH,
        boxShadow: scrolled && !heroOverlay ? '0 6px 20px rgba(10,46,34,0.06)' : 'none',
        transition: `background 450ms ${EASE}, box-shadow 450ms ${EASE}, border-color 450ms ${EASE}`,
      }}
    >
      {/* —— Desktop (single morphing bar) —— */}
      <nav
        className="relative hidden w-full items-center px-3 sm:px-4 md:flex"
        style={{
          paddingTop: scrolled ? 6 : 14,
          paddingBottom: scrolled ? 6 : 22,
          minHeight: scrolled ? 52 : 118,
          transition: `padding 450ms ${EASE}, min-height 450ms ${EASE}`,
        }}
        aria-label="Primary"
      >
        {/* Left — logo (+ stacked name when scrolled) */}
        <a
          href="/"
          onClick={goHome}
          className="relative z-10 flex shrink-0 cursor-pointer items-center gap-2.5 no-underline"
          aria-label="Tasneem Mukhwas home"
        >
          <span
            className="inline-flex shrink-0 items-center justify-center"
            style={{
              width: scrolled ? 52 : 42,
              height: scrolled ? 62 : 50,
              transition: `width 450ms ${EASE}, height 450ms ${EASE}`,
            }}
          >
            <BrandLogo className="h-full w-full object-contain object-center" />
          </span>
          <span
            className="overflow-hidden"
            style={{
              maxWidth: scrolled ? 140 : 0,
              opacity: scrolled ? 1 : 0,
              transform: scrolled ? 'translateX(0)' : 'translateX(-8px)',
              transition: `max-width 450ms ${EASE}, opacity 350ms ${EASE}, transform 450ms ${EASE}`,
            }}
          >
            <BrandNameLockup layout="stacked" stackedPreset="nav" className="!items-start" />
          </span>
        </a>

        {/* Center — stacked brand (top only) + links */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 z-0 flex w-max -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{
            gap: scrolled ? 0 : 22,
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
              maxHeight: scrolled ? 0 : 84,
              opacity: scrolled ? 0 : 1,
              overflow: 'hidden',
              transform: scrolled ? 'translateY(-6px)' : 'translateY(0)',
              transition: `max-height 450ms ${EASE}, opacity 350ms ${EASE}, transform 450ms ${EASE}`,
            }}
          >
            <BrandNameLockup layout="stacked" stackedPreset="hero" tone={isDarkNav ? 'bright' : 'default'} />
          </a>
          <div className="pointer-events-auto" style={{ paddingBottom: scrolled ? 0 : 4, paddingTop: scrolled ? 0 : 2 }}>
            <NavLinks activeId={activeId} onNavigate={goTo} onDark={isDarkNav} />
          </div>
        </div>

        {/* Right — cart / favorite / login (edge-aligned) */}
        <div className="relative z-10 ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={openCart}
            className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors ${navHover}`}
            style={{ color: navInk }}
            aria-label="Cart"
          >
            <CartIcon className="h-[1.2rem] w-[1.2rem]" />
            <NavCountBadge count={itemCount} label="Cart items" ringColor={badgeRing} />
          </button>

          <div className="group relative">
            <button
              type="button"
              onClick={openWishlist}
              className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors ${navHover}`}
              style={{ color: wishlistCount > 0 ? '#f4a4a4' : navInk }}
              aria-label="Wishlist"
            >
              <HeartIcon className="h-[1.2rem] w-[1.2rem]" filled={wishlistCount > 0} />
              <NavCountBadge
                count={wishlistCount}
                label="Wishlist items"
                variant="wishlist"
                ringColor={badgeRing}
              />
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
            <>
              <NavbarNotifications ink={navInk} />
              <ProfileAvatarMenu onDark={isDarkNav} />
            </>
          ) : (
            <button
              type="button"
              onClick={openAuth}
              className="inline-flex h-9 cursor-pointer items-center rounded-full px-4 text-[0.8rem] font-semibold tracking-wide transition-transform duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: isDarkNav ? GOLD : INK,
                color: isDarkNav ? INK : PEACH,
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
        className="flex w-full items-center gap-2 px-3 py-2 sm:px-4 md:hidden"
        aria-label="Primary mobile"
      >
        <a
          href="/"
          onClick={goHome}
          className="flex shrink-0 cursor-pointer items-center gap-2 no-underline"
          aria-label="Tasneem Mukhwas home"
        >
          <BrandLogo className="h-11 w-9 object-contain object-center" />
          <BrandNameLockup
            layout="stacked"
            stackedPreset="nav"
            className="!items-start"
            tone={isDarkNav ? 'bright' : 'default'}
          />
        </a>

        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md"
            style={{ color: navInk }}
            aria-label="Cart"
          >
            <CartIcon className="h-5 w-5" />
            <NavCountBadge count={itemCount} label="Cart items" ringColor={badgeRing} />
          </button>
          <div className="group relative">
            <button
              type="button"
              onClick={openWishlist}
              className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md"
              style={{ color: wishlistCount > 0 ? '#f4a4a4' : navInk }}
              aria-label="Wishlist"
            >
              <HeartIcon className="h-5 w-5" filled={wishlistCount > 0} />
              <NavCountBadge
                count={wishlistCount}
                label="Wishlist items"
                variant="wishlist"
                ringColor={badgeRing}
              />
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
          {!authLoading && user ? <NavbarNotifications ink={navInk} /> : null}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md"
            style={{ color: navInk }}
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
          className={`border-t px-3 pb-4 pt-3 sm:px-4 md:hidden ${navBorder}`}
          style={{
            backgroundColor: 'rgba(242,244,245,0.92)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <p
            className="m-0 mb-3 text-center text-[0.62rem] font-semibold tracking-[0.18em] uppercase"
            style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
          >
            Account
          </p>
          {!authLoading && user ? (
            <ProfileAvatarMenu stacked onDark={false} onAction={() => setMenuOpen(false)} />
          ) : (
            <button
              type="button"
              onClick={openAuth}
              className="flex h-11 w-full cursor-pointer items-center justify-center rounded-full text-[0.9rem] font-semibold"
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

    {showMobileBottomNav ? <MobileBottomNav activeId={mobileTabActiveId} onNavigate={goTo} /> : null}
    </>
  )
}
