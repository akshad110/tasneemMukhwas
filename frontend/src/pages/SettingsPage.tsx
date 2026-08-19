import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  HubNav,
  LayerCard,
  MiniSparkline,
  ProfileSidebarCard,
} from '../components/account/AccountDashboard'
import UserNotificationsFeed from '../components/account/UserNotificationsFeed'
import Navbar from '../components/nav/Navbar'
import { useAuth } from '../context/AuthContext'
import { ApiRequestError } from '../lib/api'
import { ACCOUNT_CREAM, ACCOUNT_EASE, ACCOUNT_GOLD, ACCOUNT_MUTED } from '../lib/accountTheme'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'
import { scrollAppToTop } from '../lib/scrollControl'

type SettingsTab = 'notifications' | 'security' | 'account'

const MAIN_TABS: { id: SettingsTab; label: string }[] = [
  { id: 'notifications', label: 'Alerts' },
  { id: 'security', label: 'Security' },
  { id: 'account', label: 'Account' },
]

function SoftToggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`settings-soft-toggle ${checked ? 'settings-soft-toggle--on' : ''}`}
    >
      <span className="settings-soft-toggle__knob" />
    </button>
  )
}

function PrefRow({
  day,
  month,
  title,
  desc,
  active,
  onToggle,
}: {
  day: string
  month: string
  title: string
  desc: string
  active: boolean
  onToggle: (v: boolean) => void
}) {
  return (
    <div className="settings-pref-row">
      <div className="settings-pref-row__date">
        <strong>{day}</strong>
        <span>{month}</span>
      </div>
      <div>
        <span className="settings-pref-row__title">{title}</span>
        <span className="settings-pref-row__desc">{desc}</span>
      </div>
      <span className={`settings-status-badge settings-pref-row__badge ${active ? 'settings-status-badge--on' : 'settings-status-badge--off'}`}>
        {active ? 'Active' : 'Off'}
      </span>
      <div className="settings-pref-row__toggle">
        <SoftToggle checked={active} onChange={onToggle} label={title} />
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { user, loading, updateProfile, changePassword, logout, isAdmin } = useAuth()
  const [tab, setTab] = useState<SettingsTab>('notifications')

  const [notifyOrders, setNotifyOrders] = useState(true)
  const [notifyLowStock, setNotifyLowStock] = useState(true)
  const [notifyReviews, setNotifyReviews] = useState(false)
  const [notifSaving, setNotifSaving] = useState(false)
  const [notifMsg, setNotifMsg] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState('')
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    document.title = 'Settings · Tasneem Mukhwas'
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
    setNotifyOrders(Boolean(user.notifyOrders))
    setNotifyLowStock(Boolean(user.notifyLowStock))
    setNotifyReviews(Boolean(user.notifyReviews))
  }, [user])

  const activeAlerts = useMemo(
    () => [notifyOrders, notifyLowStock, notifyReviews].filter(Boolean).length,
    [notifyOrders, notifyLowStock, notifyReviews],
  )

  const saveNotifications = async () => {
    if (!user) return
    setNotifSaving(true)
    setNotifMsg('')
    try {
      await updateProfile({ notifyOrders, notifyLowStock, notifyReviews })
      setNotifMsg('Alert preferences saved')
      window.setTimeout(() => setNotifMsg(''), 2200)
    } catch (err) {
      setNotifMsg(err instanceof ApiRequestError ? err.message : 'Could not save')
    } finally {
      setNotifSaving(false)
    }
  }

  const onChangePassword = async (e: FormEvent) => {
    e.preventDefault()
    setPwError('')
    setPwMsg('')
    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match')
      return
    }
    setPwSaving(true)
    try {
      await changePassword({ currentPassword, newPassword })
      setPwMsg('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      window.setTimeout(() => setPwMsg(''), 2500)
    } catch (err) {
      setPwError(err instanceof ApiRequestError ? err.message : 'Could not change password')
    } finally {
      setPwSaving(false)
    }
  }

  const passwordStrength =
    newPassword.length === 0
      ? 0
      : newPassword.length < 6
        ? 1
        : newPassword.length < 10
          ? 2
          : /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)
            ? 4
            : 3

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: ACCOUNT_CREAM }}>
        <p className="m-0 text-[0.95rem]" style={{ color: ACCOUNT_MUTED }}>
          Loading settings…
        </p>
      </div>
    )
  }

  return (
    <div className="settings-dash">
      <Navbar />

      <div className="settings-dash__inner">
        <HubNav active="settings" />

        <div className="settings-dash__grid">
          <ProfileSidebarCard
            name={user.name}
            email={user.email}
            phone={user.phone}
            timezone={user.timezone}
            isAdmin={isAdmin}
            ctaLabel="Edit profile"
            onCta={() => navigateApp(APP_ROUTES.profile)}
          />

          <div className="settings-stats-row">
            <LayerCard className="settings-stat-card">
              <div>
                <span className="settings-stat-card__value">{activeAlerts}</span>
                <span className="settings-stat-card__label">Active alerts</span>
              </div>
              <MiniSparkline bars={[35, 52, 40, 68, 55, 78, 90]} />
            </LayerCard>
            <LayerCard className="settings-stat-card">
              <div>
                <span className="settings-stat-card__value">1</span>
                <span className="settings-stat-card__label">Secure session</span>
              </div>
              <MiniSparkline bars={[28, 45, 38, 50, 62, 58, 72]} />
            </LayerCard>
            <LayerCard className="settings-stat-card" lift>
              <div>
                <span className="settings-stat-card__value">{user.store ? 'IN' : '—'}</span>
                <span className="settings-stat-card__label">{user.store || 'Store region'}</span>
              </div>
              <MiniSparkline bars={[42, 48, 55, 60, 72, 85, 100]} accentLast />
            </LayerCard>
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
                {tab === 'notifications' && 'Manage what we notify you about'}
                {tab === 'security' && 'Password and access controls'}
                {tab === 'account' && 'Session and regional defaults'}
              </p>
              {tab === 'notifications' ? (
                <select className="settings-main-card__filter" defaultValue="all" aria-label="Filter preferences">
                  <option value="all">All preferences</option>
                  <option value="active">Active only</option>
                  <option value="off">Turned off</option>
                </select>
              ) : null}
            </div>

            <div className="settings-main-card__body">
              <AnimatePresence mode="wait">
                {tab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: ACCOUNT_EASE }}
                  >
                    <PrefRow
                      day="01"
                      month="Ord"
                      title="Order updates"
                      desc="Dispatch, shipping, and delivery milestones."
                      active={notifyOrders}
                      onToggle={setNotifyOrders}
                    />
                    <PrefRow
                      day="02"
                      month="Stk"
                      title="Restock alerts"
                      desc="When a favourite blend is back in stock."
                      active={notifyLowStock}
                      onToggle={setNotifyLowStock}
                    />
                    <PrefRow
                      day="03"
                      month="Rev"
                      title="Review reminders"
                      desc="Gentle nudges to rate products after delivery."
                      active={notifyReviews}
                      onToggle={setNotifyReviews}
                    />

                    <div className="settings-notif-feed-wrap">
                      <p className="settings-notif-feed-wrap__heading">Activity feed</p>
                      <UserNotificationsFeed />
                    </div>

                    {notifMsg ? (
                      <p className="mt-3 m-0 text-[0.78rem]" style={{ color: notifMsg.includes('saved') ? '#1b7a3e' : '#a32020' }}>
                        {notifMsg}
                      </p>
                    ) : null}
                    <div className="mt-4">
                      <button type="button" className="settings-soft-btn" disabled={notifSaving} onClick={() => void saveNotifications()}>
                        {notifSaving ? 'Saving…' : 'Save alert preferences'}
                      </button>
                    </div>
                  </motion.div>
                )}

                {tab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: ACCOUNT_EASE }}
                  >
                    <form onSubmit={(e) => void onChangePassword(e)} className="settings-form-stack">
                      <label>
                        <span className="settings-soft-label">Current password</span>
                        <input
                          type="password"
                          className="settings-soft-input"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        <span className="settings-soft-label">New password</span>
                        <input
                          type="password"
                          className="settings-soft-input"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </label>
                      <div className="settings-strength" aria-hidden>
                        {[1, 2, 3, 4].map((level) => (
                          <span
                            key={level}
                            className="settings-strength__bar"
                            style={{
                              backgroundColor:
                                passwordStrength >= level
                                  ? passwordStrength <= 1
                                    ? '#a32020'
                                    : passwordStrength <= 2
                                      ? ACCOUNT_GOLD
                                      : '#1b7a3e'
                                  : '#e2e6ea',
                            }}
                          />
                        ))}
                      </div>
                      <label>
                        <span className="settings-soft-label">Confirm new password</span>
                        <input
                          type="password"
                          className="settings-soft-input"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </label>
                      {pwError ? (
                        <p className="m-0 text-[0.78rem]" style={{ color: '#a32020' }} role="alert">
                          {pwError}
                        </p>
                      ) : null}
                      {pwMsg ? (
                        <p className="m-0 text-[0.78rem]" style={{ color: '#1b7a3e' }}>
                          {pwMsg}
                        </p>
                      ) : null}
                      <button type="submit" className="settings-soft-btn" disabled={pwSaving}>
                        {pwSaving ? 'Updating…' : 'Update password'}
                      </button>
                    </form>
                  </motion.div>
                )}

                {tab === 'account' && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: ACCOUNT_EASE }}
                  >
                    <div className="settings-pref-row">
                      <div className="settings-pref-row__date">
                        <strong>St</strong>
                        <span>Reg</span>
                      </div>
                      <div>
                        <span className="settings-pref-row__title">Store region</span>
                        <span className="settings-pref-row__desc">{user.store || 'Tasneem Mukhwas'}</span>
                      </div>
                      <span className="settings-status-badge settings-status-badge--neutral">Default</span>
                    </div>
                    <div className="settings-pref-row">
                      <div className="settings-pref-row__date">
                        <strong>TZ</strong>
                        <span>Set</span>
                      </div>
                      <div>
                        <span className="settings-pref-row__title">Timezone</span>
                        <span className="settings-pref-row__desc">{user.timezone || 'Asia/Kolkata'}</span>
                      </div>
                      <span className="settings-status-badge settings-status-badge--on">Synced</span>
                    </div>
                    <div className="settings-pref-row">
                      <div className="settings-pref-row__date">
                        <strong>Id</strong>
                        <span>Acc</span>
                      </div>
                      <div>
                        <span className="settings-pref-row__title">Signed in as</span>
                        <span className="settings-pref-row__desc">{user.email}</span>
                      </div>
                      <button
                        type="button"
                        className="settings-soft-btn settings-soft-btn--ghost"
                        onClick={() => navigateApp(APP_ROUTES.profile)}
                      >
                        Profile
                      </button>
                    </div>

                    <div className="settings-logout-block">
                      <p className="m-0 text-[0.88rem] font-semibold" style={{ color: '#a32020' }}>
                        Sign out everywhere
                      </p>
                      <p className="mt-1 m-0 text-[0.78rem]" style={{ color: ACCOUNT_MUTED }}>
                        Ends your session on this device. You can sign back in anytime.
                      </p>
                      <button
                        type="button"
                        className="settings-soft-btn settings-soft-btn--danger mt-4"
                        onClick={() => {
                          logout()
                          navigateApp(APP_ROUTES.home)
                        }}
                      >
                        Log out
                      </button>
                    </div>
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
