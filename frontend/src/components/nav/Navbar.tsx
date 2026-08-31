import { useLenis } from 'lenis/react'
import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useCatalog } from '../../context/CatalogContext'
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
import { DEFAULT_CATEGORIES } from '../../lib/shopCatalog'
import MobileBottomNav from './MobileBottomNav'
import {
  pathForSection,
  scrollToSection,
  syncActiveSectionFromScroll,
  ensureHomePath,
  type SectionId,
} from '../../lib/sectionNav'
import BrandLogo from '../shared/BrandLogo'

const LEFT_NAV_LINKS = [
  { label: 'Home', id: 'home' as const },
  { label: 'About Us', id: 'about' as const },
  { label: 'Dealership', id: 'wholesale' as const },
] as const

const RIGHT_NAV_LINKS = [
  { label: 'Shop', id: 'products' as const },
  { label: 'Contact Us', id: 'contact' as const },
] as const

const NAV_LINKS = [...LEFT_NAV_LINKS, ...RIGHT_NAV_LINKS]

type NavLinkItem = (typeof NAV_LINKS)[number]

type NavDropdownItem = {
  label: string
}

const ABOUT_DROPDOWN_ITEMS: NavDropdownItem[] = [
  { label: 'Our Services' },
  { label: 'Why Choose Us' },
]

const NAV_DROPDOWN_BY_ID: Partial<Record<SectionId, NavDropdownItem[]>> = {
  about: ABOUT_DROPDOWN_ITEMS,
}

const INK = '#0a2e22'
const GOLD = '#b8860b'
const NAV_LINK = 'rgba(10,46,34,0.62)'
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const SCROLL_COMPACT_AT = 96
const SCROLL_EXPAND_AT = 8

function shouldShowMobileBottomNav(pathname: string) {
  return !isAdminPath(pathname) && !isAuthPath(pathname) && !isCheckoutPath(pathname)
}

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
    if (pathname === '/' || isHomeScrollPath(pathname)) return 'home'
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
        if (pathname !== '/') ensureHomePath()
        setActiveId(syncActiveSectionFromScroll())
      } else {
        setActiveId(resolveActive(pathname))
      }
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
}: {
  count: number
  label: string
  variant?: 'cart' | 'wishlist'
}) {
  if (count <= 0) return null

  const display = count > 99 ? '99+' : String(count)

  return (
    <span
      className="absolute -right-1 -top-1 z-10 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[0.65rem] font-bold leading-none"
      style={{
        backgroundColor: variant === 'wishlist' ? '#b91c1c' : INK,
        color: '#ffffff',
        boxShadow: '0 0 0 2px #ffffff',
      }}
      aria-label={`${label}: ${display}`}
    >
      {display}
    </span>
  )
}

function NavLinks({
  links,
  activeId,
  stacked,
  onNavigate,
  onPrefetchShop,
  shopDropdownItems = [],
}: {
  links: readonly NavLinkItem[]
  activeId: SectionId | null
  stacked?: boolean
  onNavigate?: (id: SectionId) => void
  onPrefetchShop?: () => void
  shopDropdownItems?: NavDropdownItem[]
}) {
  const dropdownMenuClass = (align: 'left' | 'right') =>
    stacked
      ? 'mt-1 flex w-full flex-col gap-0.5 pl-3'
      : `invisible absolute ${align === 'right' ? 'right-0' : 'left-0'} top-[calc(100%+8px)] z-50 min-w-[196px] translate-y-1 rounded-xl border bg-[#FFFEF2] py-1.5 opacity-0 shadow-lg transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100`

  const dropdownItemClass = stacked
    ? 'flex w-full cursor-pointer items-center border-0 bg-transparent px-2 py-2 text-left text-[0.82rem] font-medium transition hover:text-[#b8860b]'
    : 'flex w-full cursor-pointer items-center border-0 bg-transparent px-3.5 py-2 text-left text-[0.78rem] font-semibold transition hover:bg-[#E6D8C3]/45'

  const openDropdownTarget = (linkId: SectionId) => {
    if (linkId === 'about') {
      onNavigate?.('about')
      return
    }
    if (linkId === 'products') {
      onPrefetchShop?.()
      onNavigate?.('products')
    }
  }

  return (
    <ul
      className={
        stacked
          ? 'flex flex-col items-center gap-1'
          : 'flex flex-wrap items-center gap-x-5 gap-y-1 xl:gap-x-8'
      }
    >
      {links.map((link) => {
        const isActive = activeId === link.id
        const dropdownItems =
          link.id === 'products' ? shopDropdownItems : (NAV_DROPDOWN_BY_ID[link.id] ?? [])
        const hasDropdown = dropdownItems.length > 0
        const href =
          link.id === 'about'
            ? APP_ROUTES.knowMore
            : link.id === 'products'
              ? APP_ROUTES.shop
              : link.id === 'wholesale'
                ? APP_ROUTES.dealership
                : link.id === 'contact'
                  ? APP_ROUTES.contact
                  : pathForSection(link.id)

        const dropdownAlignClass = link.id === 'products' ? 'right' : 'left'

        return (
          <li key={link.label} className={hasDropdown && !stacked ? 'group relative' : undefined}>
            <a
              href={href}
              onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault()
                onNavigate?.(link.id)
              }}
              onMouseEnter={() => {
                if (link.id === 'products') onPrefetchShop?.()
              }}
              onFocus={() => {
                if (link.id === 'products') onPrefetchShop?.()
              }}
              onTouchStart={() => {
                if (link.id === 'products') onPrefetchShop?.()
              }}
              className="nav-link group/link inline-flex cursor-pointer items-center gap-1 text-[0.72rem] font-semibold tracking-[0.08em] uppercase no-underline transition-[color,font-weight] duration-200 xl:text-[0.78rem]"
              style={{
                color: isActive ? INK : NAV_LINK,
                fontFamily: 'Inter, sans-serif',
                fontWeight: isActive ? 700 : 600,
                ['--nav-link-hover-color' as string]: GOLD,
                ['--nav-link-hover-border' as string]: GOLD,
              }}
              aria-current={isActive ? 'page' : undefined}
              aria-haspopup={hasDropdown ? 'menu' : undefined}
            >
              <span
                className="nav-link__label border-b-2 pb-0.5 transition-[border-color,color] duration-200"
                style={{
                  borderColor: isActive ? GOLD : 'transparent',
                }}
              >
                {link.label}
              </span>
              {hasDropdown ? (
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                    stacked ? '' : 'group-hover:rotate-180 group-focus-within:rotate-180'
                  }`}
                  strokeWidth={2.4}
                  aria-hidden
                />
              ) : null}
            </a>

            {hasDropdown ? (
              <div
                className={dropdownMenuClass(stacked ? 'left' : dropdownAlignClass)}
                style={
                  stacked
                    ? undefined
                    : {
                        borderColor: '#E6D8C3',
                        boxShadow: '0 16px 36px -18px rgba(10,46,34,0.35)',
                      }
                }
                role="menu"
              >
                {dropdownItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    role="menuitem"
                    onClick={() => openDropdownTarget(link.id)}
                    className={dropdownItemClass}
                    style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

function ProfileAvatarMenu({
  stacked = false,
  onAction,
}: {
  stacked?: boolean
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
          style={{ backgroundColor: INK, color: '#f2f4f5', fontFamily: 'Inter, sans-serif' }}
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
        <button
          type="button"
          onClick={goSettings}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-full border text-[0.9rem] font-semibold"
          style={{
            borderColor: 'rgba(10,46,34,0.2)',
            backgroundColor: 'transparent',
            color: INK,
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
        className="invisible absolute right-0 top-[calc(100%+6px)] z-50 min-w-[168px] translate-y-1 rounded-xl border bg-white py-1.5 opacity-0 shadow-lg transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
        style={{
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

function NavIconButton({
  label,
  onClick,
  children,
  className = '',
}: {
  label: string
  onClick: () => void
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-[#0a2e22] transition-colors hover:bg-[#0a2e22]/8 ${className}`}
      aria-label={label}
    >
      {children}
    </button>
  )
}

/**
 * Desktop: links left · centered logo (hangs below bar, slides in on scroll) · actions right
 * Mobile: logo + actions + menu drawer
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
  const { prefetch: prefetchCatalog, categories } = useCatalog()
  const shopDropdownItems = useMemo(
    () => (categories.length ? categories : [...DEFAULT_CATEGORIES]).map((label) => ({ label })),
    [categories],
  )
  const { count: wishlistCount } = useWishlist()
  const { itemCount } = useCart()
  const cartBadgeCount = user ? itemCount : 0

  const openAuth = () => {
    setMenuOpen(false)
    navigateApp(APP_ROUTES.login)
  }

  const openCart = () => {
    setMenuOpen(false)
    if (!user) {
      navigateApp(APP_ROUTES.login)
      return
    }
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

  const goTo = (id: SectionId) => {
    setMenuOpen(false)

    if (id === 'about') {
      setActiveId('about')
      navigateApp(APP_ROUTES.knowMore)
      return
    }

    if (id === 'products') {
      prefetchCatalog()
      setActiveId('products')
      navigateApp(APP_ROUTES.shop)
      return
    }

    if (id === 'wholesale') {
      setActiveId('wholesale')
      navigateApp(APP_ROUTES.dealership)
      return
    }

    if (id === 'contact') {
      setActiveId('contact')
      navigateApp(APP_ROUTES.contact)
      return
    }

    setActiveId('home')

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

  const showMobileBottomNav = shouldShowMobileBottomNav(pathname)
  const mobileTabActiveId = resolveMobileBottomNavActive(pathname)

  const rightActions = (mobile = false) => (
    <>
      {!authLoading && user ? <NavbarNotifications ink={INK} /> : null}

      <NavIconButton label="Cart" onClick={openCart}>
        <CartIcon className={mobile ? 'h-5 w-5' : 'h-[1.15rem] w-[1.15rem]'} />
        <NavCountBadge count={cartBadgeCount} label="Cart items" />
      </NavIconButton>

      <NavIconButton label="Wishlist" onClick={openWishlist}>
        <HeartIcon
          className={mobile ? 'h-5 w-5' : 'h-[1.15rem] w-[1.15rem]'}
          filled={wishlistCount > 0}
        />
        <NavCountBadge count={wishlistCount} label="Wishlist items" variant="wishlist" />
      </NavIconButton>

      {!authLoading && user ? (
        <ProfileAvatarMenu onAction={() => setMenuOpen(false)} />
      ) : (
        <button
          type="button"
          onClick={openAuth}
          className={
            mobile
              ? 'inline-flex h-8 max-w-[5.5rem] cursor-pointer items-center justify-center rounded-full px-2.5 text-[0.62rem] font-semibold tracking-wide'
              : 'inline-flex h-9 cursor-pointer items-center rounded-full px-3.5 text-[0.72rem] font-semibold tracking-wide transition-transform duration-300 hover:scale-[1.02] xl:px-4 xl:text-[0.78rem]'
          }
          style={{ backgroundColor: INK, color: '#f2f4f5', fontFamily: 'Inter, sans-serif' }}
        >
          {mobile ? 'Login' : 'Login / Signup'}
        </button>
      )}
    </>
  )

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full overflow-visible border-b border-[rgba(10,46,34,0.08)] bg-white"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          boxShadow: scrolled ? '0 4px 18px rgba(10,46,34,0.07)' : 'none',
          transition: `box-shadow 450ms ${EASE}`,
        }}
      >
        {/* Desktop */}
        <nav
          className="relative mx-auto hidden w-full max-w-[1440px] items-stretch overflow-visible px-4 lg:grid lg:grid-cols-[1fr_auto_1fr] xl:px-10"
          style={{
            minHeight: scrolled ? 72 : 84,
            transition: `min-height 450ms ${EASE}`,
          }}
          aria-label="Primary"
        >
          <div className="flex items-center justify-end self-center gap-x-5 pr-6 xl:gap-x-8 xl:pr-12">
            <NavLinks
              links={LEFT_NAV_LINKS}
              activeId={activeId}
              onNavigate={goTo}
              onPrefetchShop={prefetchCatalog}
            />
          </div>

          <div className="relative min-h-full w-[156px] shrink-0 self-stretch xl:w-[176px]">
            <a
              href="/"
              onClick={goHome}
              className="absolute left-1/2 z-30 flex cursor-pointer items-center justify-center no-underline"
              aria-label="Tasneem Mukhwas home"
              style={{
                top: scrolled ? '50%' : '100%',
                width: scrolled ? 76 : 156,
                height: scrolled ? 88 : 176,
                transform: scrolled ? 'translate(-50%, -50%)' : 'translate(-50%, -48%)',
                transition: `top 450ms ${EASE}, width 450ms ${EASE}, height 450ms ${EASE}, transform 450ms ${EASE}`,
              }}
            >
              <BrandLogo className="h-full w-full object-contain object-center drop-shadow-[0_10px_22px_rgba(10,46,34,0.16)]" />
            </a>
          </div>

          <div className="flex items-center justify-start self-center gap-x-5 pl-6 xl:gap-x-8 xl:pl-12">
            <NavLinks
              links={RIGHT_NAV_LINKS}
              activeId={activeId}
              onNavigate={goTo}
              onPrefetchShop={prefetchCatalog}
              shopDropdownItems={shopDropdownItems}
            />
            <div className="ml-auto flex items-center gap-1 sm:gap-1.5">{rightActions()}</div>
          </div>
        </nav>

        {/* Mobile */}
        <nav className="flex w-full items-center gap-1.5 px-2.5 py-2 sm:gap-2 sm:px-4 lg:hidden" aria-label="Primary mobile">
          <a
            href="/"
            onClick={goHome}
            className="relative z-10 flex shrink-0 cursor-pointer items-center no-underline"
            aria-label="Tasneem Mukhwas home"
          >
            <BrandLogo className="h-10 w-9 object-contain object-center sm:h-12 sm:w-11" />
          </a>

          <div className="ml-auto flex min-w-0 items-center gap-0.5">
            {rightActions(true)}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-md text-[#0a2e22]"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
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
            className="border-t border-[rgba(10,46,34,0.08)] bg-white px-3 pb-4 pt-3 sm:px-4 lg:hidden"
          >
            <NavLinks
              links={NAV_LINKS}
              activeId={activeId}
              stacked
              onNavigate={goTo}
              onPrefetchShop={prefetchCatalog}
              shopDropdownItems={shopDropdownItems}
            />
            {!authLoading && user ? (
              <div className="mt-4 border-t border-[rgba(10,46,34,0.08)] pt-4">
                <ProfileAvatarMenu stacked onAction={() => setMenuOpen(false)} />
              </div>
            ) : null}
          </div>
        )}
      </header>

      {showMobileBottomNav ? <MobileBottomNav activeId={mobileTabActiveId} onNavigate={goTo} /> : null}
    </>
  )
}
