import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'
import { APP_ROUTES, navigateApp, type AdminSection } from '../../lib/appRoutes'
import BrandLogo from '../shared/BrandLogo'
import BrandNameLockup from '../shared/BrandNameLockup'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const SIDEBAR_BG = '#f3f8f4'
const PAGE_BG = '#f2f4f5'
const MUTED = 'rgba(10,46,34,0.55)'

const NAV: { id: AdminSection; label: string; icon: ReactNode }[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 19c.8-3 2.8-4.5 5.5-4.5s4.7 1.5 5.5 4.5" strokeLinecap="round" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M15 19c.4-1.8 1.5-3 3.2-3.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'products',
    label: 'Product',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" />
        <path d="M12 12v8M4 8.5l8 3.5 8-3.5" />
      </svg>
    ),
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="1.5" />
        <path d="M3 10h18M7 15h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'orders',
    label: 'Order Management',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M6 6h15l-1.5 9h-12z" />
        <path d="M6 6 5 3H2" />
        <circle cx="9" cy="20" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="18" cy="20" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'reviews',
    label: 'Reviews',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'discounts',
    label: 'Discounts',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M20 12v8H4V4h8" strokeLinecap="round" />
        <path d="m14 4 6 6M10 14l4-4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Account & Settings',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 19c1.2-3.2 3.6-5 7-5s5.8 1.8 7 5" strokeLinecap="round" />
      </svg>
    ),
  },
]

function AdminAvatarMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const initials = (user?.name || 'AT')
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const goSettings = () => {
    setOpen(false)
    navigateApp(`${APP_ROUTES.admin}/settings`)
  }

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigateApp(APP_ROUTES.login)
  }

  const menuBtn =
    'flex w-full cursor-pointer items-center gap-2.5 border-0 bg-transparent px-3.5 py-2.5 text-left text-[0.82rem] font-semibold transition hover:bg-[rgba(10,46,34,0.06)]'
  const menuVisible =
    open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'

  return (
    <div
      ref={wrapRef}
      className="group relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 text-[0.75rem] font-bold transition hover:brightness-95"
        style={{ backgroundColor: GOLD, color: INK }}
        title={user?.email || 'Admin'}
        aria-label={user?.name ? `Account menu for ${user.name}` : 'Admin account menu'}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initials}
      </button>

      <div className="absolute right-0 top-full z-50 min-w-[190px] pt-2">
        <div
          className={`rounded-xl border py-1.5 shadow-lg transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${menuVisible}`}
          style={{
            backgroundColor: '#ffffff',
            borderColor: 'rgba(10,46,34,0.1)',
            boxShadow: '0 16px 36px -18px rgba(10,46,34,0.35)',
          }}
          role="menu"
        >
        <button
          type="button"
          role="menuitem"
          onClick={goSettings}
          className={menuBtn}
          style={{ color: INK }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
            <circle cx="12" cy="8" r="3.2" />
            <path d="M5 19c1.2-3.2 3.6-5 7-5s5.8 1.8 7 5" strokeLinecap="round" />
          </svg>
          Profile
        </button>
        <div className="my-1 border-t" style={{ borderColor: 'rgba(10,46,34,0.08)' }} role="separator" />
        <button
          type="button"
          role="menuitem"
          onClick={handleLogout}
          className={`${menuBtn} hover:bg-[rgba(163,32,32,0.08)]`}
          style={{ color: '#a32020' }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" />
            <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Logout
        </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({
  section,
  children,
}: {
  section: AdminSection
  children: ReactNode
}) {
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: PAGE_BG, fontFamily: 'Inter, sans-serif' }}>
      <aside
        className="sticky top-0 flex h-screen w-[250px] shrink-0 flex-col border-r px-3 py-5"
        style={{ backgroundColor: SIDEBAR_BG, borderColor: 'rgba(10,46,34,0.08)' }}
      >
        <button
          type="button"
          onClick={() => navigateApp(APP_ROUTES.admin)}
          className="mb-6 flex w-full min-w-0 cursor-pointer items-center gap-2 border-0 bg-transparent px-2 text-left"
          aria-label="Admin dashboard"
        >
          <BrandLogo className="h-9 w-7 shrink-0 object-contain" />
          <span className="min-w-0 flex-1">
            <BrandNameLockup size="xs" wrap className="leading-snug" />
            <span className="mt-0.5 block text-[0.62rem]" style={{ color: MUTED }}>
              Admin panel
            </span>
          </span>
        </button>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Admin">
          {NAV.map((item) => {
            const active = section === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  navigateApp(
                    item.id === 'dashboard'
                      ? APP_ROUTES.admin
                      : `${APP_ROUTES.admin}/${item.id}`,
                  )
                }
                className="flex cursor-pointer items-center gap-3 rounded-xl border-0 px-3 py-2.5 text-left text-[0.86rem] font-medium transition"
                style={{
                  backgroundColor: active ? GOLD : 'transparent',
                  color: active ? INK : INK,
                  boxShadow: active ? '0 8px 20px -12px rgba(184,134,11,0.7)' : undefined,
                }}
              >
                <span style={{ color: active ? INK : MUTED }}>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {!active && (
                  <span className="text-[0.75rem] opacity-35" aria-hidden>
                    ›
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={() => {
            logout()
            navigateApp(APP_ROUTES.login)
          }}
          className="admin-sidebar-logout mt-auto flex w-full cursor-pointer items-center gap-3 rounded-xl border-0 px-3 py-2.5 text-left text-[0.86rem] font-medium transition"
          style={{ backgroundColor: 'transparent', color: INK }}
        >
          <span style={{ color: MUTED }}>
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" />
              <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="flex-1">Log out</span>
          <span className="text-[0.75rem] opacity-35" aria-hidden>
            ›
          </span>
        </button>
      </aside>

      <div className="min-w-0 flex-1 overflow-x-hidden">
        <header
          className="sticky top-0 z-20 flex items-center justify-between border-b px-6 py-3.5"
          style={{
            backgroundColor: 'rgba(238,243,239,0.92)',
            borderColor: 'rgba(10,46,34,0.08)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p className="m-0 text-[0.78rem]" style={{ color: MUTED }}>
            Admin / <span style={{ color: INK }}>{NAV.find((n) => n.id === section)?.label}</span>
          </p>
          <AdminAvatarMenu />
        </header>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )
}
