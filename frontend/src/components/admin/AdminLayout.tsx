import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'
import { APP_ROUTES, navigateApp, type AdminSection } from '../../lib/appRoutes'

const INK = '#0a2e22'
const CREAM = '#f3e6c8'
const GOLD = '#b8860b'
const SIDEBAR_BG = '#f3f8f4'
const PAGE_BG = '#eef3ef'
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

export default function AdminLayout({
  section,
  children,
}: {
  section: AdminSection
  children: ReactNode
}) {
  const { user, logout } = useAuth()
  const initials = (user?.name || 'AT')
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: PAGE_BG, fontFamily: 'Inter, sans-serif' }}>
      <aside
        className="sticky top-0 flex h-screen w-[250px] shrink-0 flex-col border-r px-3 py-5"
        style={{ backgroundColor: SIDEBAR_BG, borderColor: 'rgba(10,46,34,0.08)' }}
      >
        <button
          type="button"
          onClick={() => navigateApp(APP_ROUTES.home)}
          className="mb-6 cursor-pointer border-0 bg-transparent px-2 text-left"
          aria-label="Tasneem Mukhwas home"
        >
          <span className="permanent-marker-regular text-[1.05rem] leading-none">
            <span style={{ color: INK }}>Tasneem</span>{' '}
            <span style={{ color: GOLD }}>Admin</span>
          </span>
          <span className="mt-1 block text-[0.68rem]" style={{ color: MUTED }}>
            Control panel
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigateApp(APP_ROUTES.shop)}
              className="cursor-pointer rounded-lg border-0 px-3 py-1.5 text-[0.75rem] font-semibold transition hover:brightness-110"
              style={{ backgroundColor: INK, color: CREAM }}
            >
              View shop
            </button>
            <button
              type="button"
              onClick={() => {
                logout()
                navigateApp(APP_ROUTES.login)
              }}
              className="cursor-pointer rounded-lg border px-3 py-1.5 text-[0.75rem] font-semibold"
              style={{ borderColor: 'rgba(10,46,34,0.15)', backgroundColor: 'transparent', color: INK }}
            >
              Log out
            </button>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-[0.75rem] font-bold"
              style={{ backgroundColor: GOLD, color: INK }}
              title={user?.email || 'Admin'}
              aria-hidden
            >
              {initials}
            </div>
          </div>
        </header>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )
}
