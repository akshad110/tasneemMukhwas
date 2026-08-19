import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  formatOrderDate,
  HubNav,
  LayerCard,
  orderStatusTone,
  ProfileSidebarCard,
  ShortcutRow,
  StatLayerCard,
} from '../components/account/AccountDashboard'
import Navbar from '../components/nav/Navbar'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { ApiRequestError } from '../lib/api'
import { ACCOUNT_CREAM, ACCOUNT_EASE, ACCOUNT_GOLD, ACCOUNT_MUTED } from '../lib/accountTheme'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'
import { scrollAppToTop } from '../lib/scrollControl'
import { ordersApi, type AdminOrder } from '../lib/services'

type ProfileTab = 'identity' | 'activity' | 'shortcuts'

const MAIN_TABS: { id: ProfileTab; label: string }[] = [
  { id: 'identity', label: 'Identity' },
  { id: 'activity', label: 'Activity' },
  { id: 'shortcuts', label: 'Shortcuts' },
]

export default function ProfilePage() {
  const { user, loading, updateProfile, isAdmin } = useAuth()
  const { count: wishlistCount } = useWishlist()
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [tab, setTab] = useState<ProfileTab>('identity')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    document.title = 'Profile · Tasneem Mukhwas'
    scrollAppToTop(true)
    return () => {
      document.title = 'Tasneem Mukhwas'
    }
  }, [])

  useEffect(() => {
    if (!loading && !user) navigateApp(APP_ROUTES.login)
  }, [loading, user])

  useEffect(() => {
    if (!user) return
    setName(user.name)
    setPhone(user.phone || '')
  }, [user])

  useEffect(() => {
    if (!user) return
    let cancelled = false
    setOrdersLoading(true)
    ordersApi
      .mine()
      .then((data) => {
        if (!cancelled) setOrders(data.items)
      })
      .catch(() => {
        if (!cancelled) setOrders([])
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const stats = useMemo(() => {
    const active = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length
    const spent = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    return { total: orders.length, active, spent }
  }, [orders])

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders])

  const onSaveProfile = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setProfileSaving(true)
    setProfileMsg('')
    setProfileError('')
    try {
      await updateProfile({ name: name.trim(), phone: phone.trim() })
      setProfileMsg('Profile updated')
      window.setTimeout(() => setProfileMsg(''), 2200)
    } catch (err) {
      setProfileError(err instanceof ApiRequestError ? err.message : 'Could not save profile')
    } finally {
      setProfileSaving(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: ACCOUNT_CREAM }}>
        <p className="m-0 text-[0.95rem]" style={{ color: ACCOUNT_MUTED }}>
          Loading your profile…
        </p>
      </div>
    )
  }

  return (
    <div className="settings-dash">
      <Navbar />

      <div className="settings-dash__inner">
        <HubNav active="profile" />

        <div className="settings-dash__grid">
          <ProfileSidebarCard
            name={user.name}
            email={user.email}
            phone={user.phone}
            timezone={user.timezone}
            isAdmin={isAdmin}
            ctaLabel="Account settings"
            onCta={() => navigateApp(APP_ROUTES.settings)}
            onEdit={() => setTab('identity')}
          />

          <div className="settings-stats-row">
            <StatLayerCard
              value={ordersLoading ? '…' : stats.total}
              label="Lifetime orders"
              bars={[30, 48, 42, 58, 65, 72, 85]}
              onClick={() => navigateApp(APP_ROUTES.myOrders)}
              delay={0.05}
            />
            <StatLayerCard
              value={ordersLoading ? '…' : stats.active}
              label="In progress"
              bars={[22, 38, 45, 52, 48, 60, 68]}
              onClick={() => navigateApp(APP_ROUTES.myOrders)}
              delay={0.1}
            />
            <StatLayerCard
              value={ordersLoading ? '…' : `₹${stats.spent.toLocaleString('en-IN')}`}
              label="Total spent"
              bars={[40, 55, 62, 70, 78, 88, 100]}
              lift
              accentLast
              delay={0.15}
            />
          </div>

          <LayerCard className="settings-main-card">
            <div className="settings-main-card__tabs" role="tablist">
              {MAIN_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`settings-main-card__tab ${tab === t.id ? 'settings-main-card__tab--active' : ''}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="settings-main-card__toolbar">
              <p className="m-0 text-[0.82rem]" style={{ color: ACCOUNT_MUTED }}>
                {tab === 'identity' && 'Update how we address you on orders and receipts'}
                {tab === 'activity' && 'Your latest orders at a glance'}
                {tab === 'shortcuts' && 'Jump to orders, wishlist, and settings'}
              </p>
              {tab === 'activity' ? (
                <button
                  type="button"
                  className="settings-soft-btn settings-soft-btn--ghost"
                  onClick={() => navigateApp(APP_ROUTES.myOrders)}
                >
                  View all
                </button>
              ) : null}
              {tab === 'identity' ? (
                <span className="settings-status-badge settings-status-badge--on">{wishlistCount} saved</span>
              ) : null}
            </div>

            <div className="settings-main-card__body">
              <AnimatePresence mode="wait">
                {tab === 'identity' && (
                  <motion.div
                    key="identity"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: ACCOUNT_EASE }}
                  >
                    <form onSubmit={(e) => void onSaveProfile(e)} className="settings-form-stack">
                      <label>
                        <span className="settings-soft-label">Display name</span>
                        <input
                          className="settings-soft-input"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        <span className="settings-soft-label">Phone</span>
                        <input
                          className="settings-soft-input"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 …"
                        />
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="settings-inset-field">
                          <span className="settings-inset-field__label">Email</span>
                          <span className="settings-inset-field__value">{user.email}</span>
                        </div>
                        <div className="settings-inset-field">
                          <span className="settings-inset-field__label">Timezone</span>
                          <span className="settings-inset-field__value">{user.timezone || 'Asia/Kolkata'}</span>
                        </div>
                      </div>
                      {profileError ? (
                        <p className="m-0 text-[0.78rem]" style={{ color: '#a32020' }} role="alert">
                          {profileError}
                        </p>
                      ) : null}
                      {profileMsg ? (
                        <p className="m-0 text-[0.78rem]" style={{ color: '#1b7a3e' }}>
                          {profileMsg}
                        </p>
                      ) : null}
                      <button type="submit" className="settings-soft-btn" disabled={profileSaving}>
                        {profileSaving ? 'Saving…' : 'Save profile'}
                      </button>
                    </form>
                  </motion.div>
                )}

                {tab === 'activity' && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: ACCOUNT_EASE }}
                  >
                    {ordersLoading ? (
                      <div className="space-y-3 py-2">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="product-skeleton-block h-16 rounded-2xl" />
                        ))}
                      </div>
                    ) : recentOrders.length === 0 ? (
                      <p className="m-0 py-10 text-center text-[0.88rem]" style={{ color: ACCOUNT_MUTED }}>
                        No orders yet — explore the shop and your first batch will show up here.
                      </p>
                    ) : (
                      recentOrders.map((order) => {
                        const { day, month } = formatOrderDate(order.date)
                        const tone = orderStatusTone(order.status)
                        return (
                          <button
                            key={order.id}
                            type="button"
                            className="settings-pref-row settings-shortcut-row"
                            onClick={() => navigateApp(APP_ROUTES.myOrders)}
                          >
                            <div className="settings-pref-row__date">
                              <strong>{day}</strong>
                              <span>{month}</span>
                            </div>
                            <div className="text-left">
                              <span className="settings-pref-row__title">
                                Order #{order.id.slice(-6).toUpperCase()}
                              </span>
                              <span className="settings-pref-row__desc">
                                {order.items} items · {order.date}
                              </span>
                            </div>
                            <span className={`settings-status-badge settings-status-badge--${tone}`}>
                              {order.status}
                            </span>
                            <span className="text-[0.95rem] font-bold" style={{ color: ACCOUNT_GOLD }}>
                              ₹{order.total}
                            </span>
                          </button>
                        )
                      })
                    )}
                  </motion.div>
                )}

                {tab === 'shortcuts' && (
                  <motion.div
                    key="shortcuts"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: ACCOUNT_EASE }}
                  >
                    <ShortcutRow
                      day="01"
                      month="Ord"
                      title="Track my orders"
                      desc="Live status, delivery tracker, and product reviews."
                      badge="Open"
                      badgeTone="on"
                      onClick={() => navigateApp(APP_ROUTES.myOrders)}
                    />
                    <ShortcutRow
                      day="02"
                      month="Sav"
                      title="Browse wishlist"
                      desc="Jump back to flavours you saved for later."
                      badge={String(wishlistCount)}
                      badgeTone="neutral"
                      onClick={() => navigateApp(APP_ROUTES.wishlist)}
                    />
                    <ShortcutRow
                      day="03"
                      month="Set"
                      title="Account settings"
                      desc="Password, alerts, and sign-out controls."
                      badge="Go"
                      badgeTone="neutral"
                      onClick={() => navigateApp(APP_ROUTES.settings)}
                    />
                    {isAdmin ? (
                      <ShortcutRow
                        day="04"
                        month="Adm"
                        title="Admin command center"
                        desc="Products, orders, reviews, and store controls."
                        badge="Admin"
                        badgeTone="on"
                        onClick={() => navigateApp(APP_ROUTES.admin)}
                      />
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </LayerCard>
        </div>
      </div>
    </div>
  )
}
