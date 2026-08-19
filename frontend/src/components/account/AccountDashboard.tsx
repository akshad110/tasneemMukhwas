import { motion } from 'framer-motion'
import { Pencil } from 'lucide-react'
import type { ReactNode } from 'react'
import { ACCOUNT_EASE } from '../../lib/accountTheme'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'

export const HUB_TABS = [
  { id: 'profile' as const, label: 'Profile', route: APP_ROUTES.profile },
  { id: 'orders' as const, label: 'My Orders', route: APP_ROUTES.myOrders },
  { id: 'settings' as const, label: 'Settings', route: APP_ROUTES.settings },
]

export type HubTabId = (typeof HUB_TABS)[number]['id']

export function MiniSparkline({ bars, accentLast = false }: { bars: number[]; accentLast?: boolean }) {
  return (
    <div className="settings-sparkline" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className={`settings-sparkline__bar ${accentLast && i === bars.length - 1 ? 'settings-sparkline__bar--accent' : ''}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}

export function LayerCard({
  children,
  className = '',
  lift = false,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  lift?: boolean
  delay?: number
}) {
  return (
    <motion.div
      className={`settings-layer-card ${lift ? 'settings-layer-card--lift' : ''} ${className}`.trim()}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: ACCOUNT_EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

export function HubNav({ active }: { active: HubTabId }) {
  return (
    <nav className="settings-hub-nav" aria-label="Account sections">
      {HUB_TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => {
            if (t.id !== active) navigateApp(t.route)
          }}
          className={`settings-hub-nav__pill ${t.id === active ? 'settings-hub-nav__pill--active' : ''}`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}

type ProfileSidebarProps = {
  name: string
  email: string
  phone?: string
  timezone?: string
  isAdmin?: boolean
  ctaLabel: string
  onCta: () => void
  onEdit?: () => void
}

export function ProfileSidebarCard({
  name,
  email,
  phone,
  timezone,
  isAdmin,
  ctaLabel,
  onCta,
  onEdit,
}: ProfileSidebarProps) {
  const initial = (name?.trim()?.[0] || 'U').toUpperCase()

  return (
    <LayerCard className="settings-profile-card settings-dash__sidebar">
      <div className="settings-profile-card__avatar-wrap">
        <div className="settings-profile-card__avatar">{initial}</div>
        {onEdit ? (
          <button type="button" className="settings-profile-card__edit" aria-label="Edit profile" onClick={onEdit}>
            <Pencil size={14} strokeWidth={2.25} />
          </button>
        ) : null}
      </div>
      <h1 className="settings-profile-card__name">{name}</h1>
      <span className="settings-profile-card__badge">{isAdmin ? 'Store administrator' : 'Verified member'}</span>
      <button type="button" className="settings-profile-card__cta" onClick={onCta}>
        {ctaLabel}
      </button>

      <div className="settings-inset-field">
        <span className="settings-inset-field__label">Email</span>
        <span className="settings-inset-field__value">{email}</span>
      </div>
      <div className="settings-inset-field">
        <span className="settings-inset-field__label">Phone</span>
        <span className="settings-inset-field__value">{phone || 'Not set'}</span>
      </div>
      <div className="settings-inset-field">
        <span className="settings-inset-field__label">Timezone</span>
        <span className="settings-inset-field__value">{timezone || 'Asia/Kolkata'}</span>
      </div>
    </LayerCard>
  )
}

export function StatLayerCard({
  value,
  label,
  bars,
  lift = false,
  accentLast = false,
  onClick,
  delay = 0,
}: {
  value: string | number
  label: string
  bars: number[]
  lift?: boolean
  accentLast?: boolean
  onClick?: () => void
  delay?: number
}) {
  const Tag = onClick ? 'button' : 'div'

  return (
    <LayerCard
      lift={lift}
      delay={delay}
      className={`settings-stat-card ${onClick ? 'settings-stat-card--clickable' : ''}`}
    >
      <Tag type={onClick ? 'button' : undefined} onClick={onClick} className="settings-stat-card__inner">
        <div>
          <span className="settings-stat-card__value">{value}</span>
          <span className="settings-stat-card__label">{label}</span>
        </div>
        <MiniSparkline bars={bars} accentLast={accentLast} />
      </Tag>
    </LayerCard>
  )
}

export function ShortcutRow({
  day,
  month,
  title,
  desc,
  badge,
  badgeTone = 'neutral',
  onClick,
}: {
  day: string
  month: string
  title: string
  desc: string
  badge?: string
  badgeTone?: 'on' | 'off' | 'neutral'
  onClick: () => void
}) {
  return (
    <button type="button" className="settings-pref-row settings-shortcut-row" onClick={onClick}>
      <div className="settings-pref-row__date">
        <strong>{day}</strong>
        <span>{month}</span>
      </div>
      <div className="text-left">
        <span className="settings-pref-row__title">{title}</span>
        <span className="settings-pref-row__desc">{desc}</span>
      </div>
      {badge ? (
        <span className={`settings-status-badge settings-status-badge--${badgeTone}`}>{badge}</span>
      ) : (
        <span className="settings-shortcut-row__arrow" aria-hidden>
          →
        </span>
      )}
    </button>
  )
}

export function orderStatusTone(status: string): 'on' | 'off' | 'neutral' {
  const s = status.toLowerCase()
  if (s === 'completed' || s === 'delivered') return 'on'
  if (s === 'cancelled') return 'off'
  return 'neutral'
}

export function formatOrderDate(dateStr: string): { day: string; month: string } {
  const parsed = new Date(dateStr)
  if (Number.isNaN(parsed.getTime())) {
    return { day: '—', month: 'Ord' }
  }
  return {
    day: String(parsed.getDate()).padStart(2, '0'),
    month: parsed.toLocaleString('en-IN', { month: 'short' }),
  }
}
