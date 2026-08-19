import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  LayerCard,
  MiniSparkline,
  ProfileSidebarCard,
} from '../account/AccountDashboard'
import { useAuth } from '../../context/AuthContext'
import { ApiRequestError } from '../../lib/api'
import { ACCOUNT_EASE, ACCOUNT_GOLD, ACCOUNT_MUTED } from '../../lib/accountTheme'

type AdminTab = 'profile' | 'notifications' | 'security'

const TABS: { id: AdminTab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'notifications', label: 'Alerts' },
  { id: 'security', label: 'Security' },
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

export default function AdminSettings() {
  const { user, updateProfile, changePassword } = useAuth()
  const [tab, setTab] = useState<AdminTab>('profile')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [store, setStore] = useState('')
  const [timezone, setTimezone] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')

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
    if (!user) return
    setName(user.name)
    setPhone(user.phone ?? '')
    setStore(user.store ?? '')
    setTimezone(user.timezone ?? 'Asia/Kolkata')
    setNotifyOrders(Boolean(user.notifyOrders))
    setNotifyLowStock(Boolean(user.notifyLowStock))
    setNotifyReviews(Boolean(user.notifyReviews))
  }, [user])

  const activeAlerts = useMemo(
    () => [notifyOrders, notifyLowStock, notifyReviews].filter(Boolean).length,
    [notifyOrders, notifyLowStock, notifyReviews],
  )

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setProfileSaving(true)
    setProfileMsg('')
    try {
      await updateProfile({ name, phone, store, timezone })
      setProfileMsg('Profile saved')
      window.setTimeout(() => setProfileMsg(''), 2200)
    } catch (err) {
      setProfileMsg(err instanceof ApiRequestError ? err.message : 'Could not save profile')
    } finally {
      setProfileSaving(false)
    }
  }

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

  if (!user) {
    return (
      <p className="m-0 text-[0.95rem]" style={{ color: ACCOUNT_MUTED }}>
        Loading…
      </p>
    )
  }

  return (
    <div className="settings-dash admin-settings-dash">
      <div className="settings-dash__inner !px-0 !pt-0">
        <header className="mb-5">
          <h1 className="m-0 text-[1.65rem] font-bold" style={{ color: '#0a2e22' }}>
            Account & Settings
          </h1>
          <p className="mt-1 m-0 text-[0.88rem]" style={{ color: ACCOUNT_MUTED }}>
            Admin profile, store identity, and notification preferences.
          </p>
        </header>

        <div className="settings-dash__grid">
          <ProfileSidebarCard
            name={user.name}
            email={user.email}
            phone={user.phone}
            timezone={user.timezone}
            isAdmin
            ctaLabel="Edit profile"
            onCta={() => setTab('profile')}
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
                <span className="settings-stat-card__value">Admin</span>
                <span className="settings-stat-card__label">Access level</span>
              </div>
              <MiniSparkline bars={[28, 45, 38, 50, 62, 58, 72]} />
            </LayerCard>
            <LayerCard className="settings-stat-card" lift>
              <div>
                <span className="settings-stat-card__value">{store ? 'IN' : '—'}</span>
                <span className="settings-stat-card__label">{store || 'Store region'}</span>
              </div>
              <MiniSparkline bars={[42, 48, 55, 60, 72, 85, 100]} accentLast />
            </LayerCard>
          </div>

          <LayerCard className="settings-main-card">
            <div className="settings-main-card__tabs" role="tablist">
              {TABS.map((t) => (
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
                {tab === 'profile' && 'Update your admin identity and store details'}
                {tab === 'notifications' && 'Choose which admin alerts you receive'}
                {tab === 'security' && 'Password and access controls'}
              </p>
            </div>

            <div className="settings-main-card__body">
              <AnimatePresence mode="wait">
                {tab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: ACCOUNT_EASE }}
                  >
                    <form onSubmit={(e) => void saveProfile(e)} className="settings-form-stack">
                      <label>
                        <span className="settings-soft-label">Full name</span>
                        <input
                          className="settings-soft-input"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        <span className="settings-soft-label">Email</span>
                        <input className="settings-soft-input" value={user.email} readOnly />
                      </label>
                      <label>
                        <span className="settings-soft-label">Phone</span>
                        <input
                          className="settings-soft-input"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </label>
                      <label>
                        <span className="settings-soft-label">Role</span>
                        <input className="settings-soft-input capitalize" value={user.role} readOnly />
                      </label>
                      <label>
                        <span className="settings-soft-label">Store</span>
                        <input
                          className="settings-soft-input"
                          value={store}
                          onChange={(e) => setStore(e.target.value)}
                        />
                      </label>
                      <label>
                        <span className="settings-soft-label">Timezone</span>
                        <input
                          className="settings-soft-input"
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                        />
                      </label>
                      {profileMsg ? (
                        <p
                          className="m-0 text-[0.78rem]"
                          style={{ color: profileMsg.includes('saved') ? '#1b7a3e' : '#a32020' }}
                        >
                          {profileMsg}
                        </p>
                      ) : null}
                      <button type="submit" className="settings-soft-btn" disabled={profileSaving}>
                        {profileSaving ? 'Saving…' : 'Save profile'}
                      </button>
                    </form>
                  </motion.div>
                )}

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
                      title="New order alerts"
                      desc="Instant notification when a customer places an order."
                      active={notifyOrders}
                      onToggle={setNotifyOrders}
                    />
                    <PrefRow
                      day="02"
                      month="Stk"
                      title="Low stock warnings"
                      desc="When inventory drops below safe levels."
                      active={notifyLowStock}
                      onToggle={setNotifyLowStock}
                    />
                    <PrefRow
                      day="03"
                      month="Rev"
                      title="Product review alerts"
                      desc="When customers submit new product reviews."
                      active={notifyReviews}
                      onToggle={setNotifyReviews}
                    />
                    {notifMsg ? (
                      <p
                        className="mt-3 m-0 text-[0.78rem]"
                        style={{ color: notifMsg.includes('saved') ? '#1b7a3e' : '#a32020' }}
                      >
                        {notifMsg}
                      </p>
                    ) : null}
                    <div className="mt-4">
                      <button
                        type="button"
                        className="settings-soft-btn"
                        disabled={notifSaving}
                        onClick={() => void saveNotifications()}
                      >
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
              </AnimatePresence>
            </div>
          </LayerCard>
        </div>
      </div>
    </div>
  )
}
