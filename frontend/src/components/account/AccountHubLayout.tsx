import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import Navbar from '../nav/Navbar'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import {
  ACCOUNT_CREAM,
  ACCOUNT_EASE,
  ACCOUNT_GOLD,
  ACCOUNT_TEXTURE,
} from '../../lib/accountTheme'

type HubTab = 'profile' | 'settings' | 'orders'

const TABS: { id: HubTab; label: string; route: string; z: number; rotY: number }[] = [
  { id: 'profile', label: 'Profile', route: APP_ROUTES.profile, z: 18, rotY: -6 },
  { id: 'orders', label: 'My Orders', route: APP_ROUTES.myOrders, z: 28, rotY: 0 },
  { id: 'settings', label: 'Settings', route: APP_ROUTES.settings, z: 18, rotY: 6 },
]

type AccountHubLayoutProps = {
  active: HubTab
  eyebrow: string
  title: string
  subtitle?: string
  heroExtra?: ReactNode
  children: ReactNode
}

export default function AccountHubLayout({
  active,
  eyebrow,
  title,
  subtitle,
  heroExtra,
  children,
}: AccountHubLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: ACCOUNT_CREAM, fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <section className="account-vault-hero relative overflow-hidden">
        <img
          src={ACCOUNT_TEXTURE}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-35 brightness-[0.7] saturate-[0.8]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(10,46,34,0.94) 0%, rgba(10,46,34,0.82) 42%, rgba(4,22,16,0.97) 100%)',
          }}
        />
        <div className="account-vault-hero__floor" aria-hidden />
        <div className="account-vault-hero__orb account-vault-hero__orb--gold" aria-hidden />
        <div className="account-vault-hero__orb account-vault-hero__orb--ink" aria-hidden />

        <div
          className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-12"
          style={{ perspective: '1100px' }}
        >
          <motion.p
            className="m-0 text-[0.68rem] font-semibold tracking-[0.22em] uppercase"
            style={{ color: ACCOUNT_GOLD }}
            initial={{ opacity: 0, y: 10, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.45, ease: ACCOUNT_EASE }}
          >
            {eyebrow}
          </motion.p>
          <motion.h1
            className="mt-2 m-0 text-[clamp(1.85rem,5vw,2.85rem)] font-bold tracking-tight"
            style={{ color: ACCOUNT_CREAM, textShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
            initial={{ opacity: 0, y: 20, rotateX: 14 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.55, ease: ACCOUNT_EASE, delay: 0.05 }}
          >
            {title}
          </motion.h1>
          {subtitle ? (
            <motion.p
              className="mt-2 m-0 max-w-2xl text-[0.92rem] leading-relaxed opacity-82"
              style={{ color: ACCOUNT_CREAM }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 0.82, y: 0 }}
              transition={{ duration: 0.5, ease: ACCOUNT_EASE, delay: 0.1 }}
            >
              {subtitle}
            </motion.p>
          ) : null}

          {heroExtra ? (
            <motion.div
              className="mt-7"
              initial={{ opacity: 0, rotateY: -10, z: -20 }}
              animate={{ opacity: 1, rotateY: 0, z: 0 }}
              transition={{ duration: 0.6, ease: ACCOUNT_EASE, delay: 0.12 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {heroExtra}
            </motion.div>
          ) : null}

          <motion.nav
            className="account-vault-nav mt-9"
            aria-label="Account sections"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: ACCOUNT_EASE, delay: 0.16 }}
          >
            {TABS.map((tab) => {
              const isActive = tab.id === active
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (!isActive) navigateApp(tab.route)
                  }}
                  className={`account-vault-nav__pill ${isActive ? 'account-vault-nav__pill--active' : ''}`}
                  style={{
                    transform: `rotateY(${tab.rotY}deg) translateZ(${isActive ? tab.z + 12 : tab.z}px)`,
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </motion.nav>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8">{children}</main>
    </div>
  )
}
