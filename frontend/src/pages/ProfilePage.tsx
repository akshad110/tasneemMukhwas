import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import Navbar from '../components/nav/Navbar'
import { useAuth } from '../context/AuthContext'
import { ApiRequestError } from '../lib/api'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'

const INK = '#0a2e22'
const CREAM = '#f3e6c8'
const GOLD = '#b8860b'
const PAGE_BG = '#eef3ef'
const MUTED = 'rgba(10,46,34,0.55)'
const LINE = 'rgba(10,46,34,0.08)'
const CARD = '#f7faf8'

function DetailRow({
  label,
  value,
  last = false,
}: {
  label: string
  value: ReactNode
  last?: boolean
}) {
  return (
    <div
      className={`grid gap-1 py-3.5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-center sm:gap-4 ${
        last ? '' : 'border-b'
      }`}
      style={{ borderColor: LINE }}
    >
      <p className="m-0 text-[0.78rem]" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
        {label}
      </p>
      <div className="text-[0.92rem] font-medium" style={{ color: INK, fontFamily: 'Inter, sans-serif' }}>
        {value}
      </div>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-3">
      <span className="text-[0.9rem]" style={{ color: INK, fontFamily: 'Inter, sans-serif' }}>
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full border-0 transition"
        style={{ backgroundColor: checked ? '#9b7235' : '#d8d8d8' }}
      >
        <span
          className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full shadow-sm transition-transform"
          style={{
            backgroundColor: checked ? '#0e291f' : '#ffffff',
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
          }}
        />
      </button>
    </label>
  )
}

export default function ProfilePage() {
  const { user, loading, updateProfile, changePassword, logout, isAdmin } = useAuth()
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
    document.title = 'Profile · Tasneem Mukhwas'
    window.scrollTo(0, 0)
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

  const initial = (user?.name?.trim()?.[0] || 'U').toUpperCase()
  const roleLabel = isAdmin ? 'Super Admin' : 'Customer'
  const badgeLabel = isAdmin ? 'Admin account' : 'Tasneem member'

  const saveNotifications = async () => {
    if (!user) return
    setNotifSaving(true)
    setNotifMsg('')
    try {
      await updateProfile({ notifyOrders, notifyLowStock, notifyReviews })
      setNotifMsg('Notification preferences saved')
      window.setTimeout(() => setNotifMsg(''), 2000)
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
      setPwMsg('Password updated')
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

  if (loading || !user) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: PAGE_BG }}>
        <Navbar />
        <p className="m-0 px-6 py-20 text-center text-[0.95rem]" style={{ color: MUTED }}>
          Loading…
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG }}>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Top: identity + details */}
        <div className="grid gap-4 lg:grid-cols-[0.85fr_1.35fr]">
          <section
            className="flex flex-col rounded-[22px] border px-6 py-7"
            style={{
              backgroundColor: CARD,
              borderColor: LINE,
              boxShadow: '0 12px 32px -24px rgba(10,46,34,0.28)',
            }}
          >
            <h1
              className="m-0 text-[1.65rem] font-bold tracking-tight sm:text-[1.85rem]"
              style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
            >
              {user.name}
            </h1>
            <p
              className="mt-1.5 m-0 text-[0.82rem] font-semibold"
              style={{ color: '#1b7a3e', fontFamily: 'Inter, sans-serif' }}
            >
              {badgeLabel}
            </p>

            <div className="mt-8 flex flex-1 items-center justify-center py-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-[1.15rem] font-bold"
                style={{
                  backgroundColor: GOLD,
                  color: INK,
                  boxShadow: '0 0 0 5px rgba(184,134,11,0.16)',
                }}
                aria-hidden
              >
                {initial}
              </div>
            </div>
          </section>

          <section
            className="rounded-[22px] border px-5 py-5 sm:px-7 sm:py-6"
            style={{
              backgroundColor: CARD,
              borderColor: LINE,
              boxShadow: '0 12px 32px -24px rgba(10,46,34,0.28)',
            }}
          >
            <h2
              className="m-0 text-[1.05rem] font-semibold"
              style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
            >
              Bio & other details
            </h2>

            <div className="mt-2">
              <DetailRow label="My role" value={roleLabel} />
              <DetailRow label="Email" value={user.email} />
              <DetailRow label="Phone" value={user.phone?.trim() || '—'} />
              <DetailRow label="Store" value={user.store || 'Tasneem Mukhwas'} />
              <DetailRow label="Timezone" value={user.timezone || 'Asia/Kolkata'} />
              <DetailRow
                label="Account status"
                value={
                  <span
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.78rem] font-semibold"
                    style={{
                      borderColor: 'rgba(27,122,62,0.25)',
                      backgroundColor: '#e9f5ee',
                      color: '#1b7a3e',
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#1b7a3e' }} />
                    Active
                  </span>
                }
              />
              <DetailRow
                label="Badges"
                value={isAdmin ? 'Store Admin' : 'Verified Shopper'}
                last
              />
            </div>

            {isAdmin ? (
              <button
                type="button"
                onClick={() => navigateApp(APP_ROUTES.admin)}
                className="mt-4 cursor-pointer rounded-xl border-0 px-4 py-2.5 text-[0.8rem] font-semibold"
                style={{ backgroundColor: GOLD, color: INK }}
              >
                Open admin panel
              </button>
            ) : null}
          </section>
        </div>

        {/* Settings */}
        <section
          className="mt-4 rounded-[22px] border px-5 py-5 sm:px-7 sm:py-6"
          style={{
            backgroundColor: CARD,
            borderColor: LINE,
            boxShadow: '0 12px 32px -24px rgba(10,46,34,0.28)',
          }}
        >
          <h2
            className="m-0 text-[1.05rem] font-semibold"
            style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
          >
            Settings
          </h2>

          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            <form onSubmit={onChangePassword} className="space-y-3">
              <p
                className="m-0 text-[0.78rem] font-semibold tracking-wide uppercase"
                style={{ color: GOLD }}
              >
                Change password
              </p>
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
                style={{ borderColor: LINE, color: INK, backgroundColor: '#ffffff' }}
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
                style={{ borderColor: LINE, color: INK, backgroundColor: '#ffffff' }}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
                style={{ borderColor: LINE, color: INK, backgroundColor: '#ffffff' }}
              />
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
              <button
                type="submit"
                disabled={pwSaving}
                className="cursor-pointer rounded-xl border-0 px-4 py-2.5 text-[0.8rem] font-semibold disabled:opacity-60"
                style={{ backgroundColor: INK, color: CREAM }}
              >
                {pwSaving ? 'Updating…' : 'Update password'}
              </button>
            </form>

            <div>
              <p
                className="m-0 text-[0.78rem] font-semibold tracking-wide uppercase"
                style={{ color: GOLD }}
              >
                Notifications
              </p>
              <div className="mt-1">
                <Toggle
                  label="Order updates"
                  checked={notifyOrders}
                  onChange={setNotifyOrders}
                />
                <div className="border-t" style={{ borderColor: LINE }}>
                  <Toggle
                    label="Low stock alerts"
                    checked={notifyLowStock}
                    onChange={setNotifyLowStock}
                  />
                </div>
                <div className="border-t" style={{ borderColor: LINE }}>
                  <Toggle
                    label="Product review alerts"
                    checked={notifyReviews}
                    onChange={setNotifyReviews}
                  />
                </div>
              </div>
              {notifMsg ? (
                <p className="mt-2 m-0 text-[0.78rem]" style={{ color: '#1b7a3e' }}>
                  {notifMsg}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => void saveNotifications()}
                disabled={notifSaving}
                className="mt-3 cursor-pointer rounded-xl border-0 px-4 py-2.5 text-[0.8rem] font-semibold disabled:opacity-60"
                style={{ backgroundColor: INK, color: CREAM }}
              >
                {notifSaving ? 'Saving…' : 'Save notifications'}
              </button>
            </div>
          </div>

          <div className="mt-8 border-t pt-5" style={{ borderColor: LINE }}>
            <button
              type="button"
              onClick={() => {
                logout()
                navigateApp(APP_ROUTES.home)
              }}
              className="cursor-pointer rounded-xl border px-5 py-2.5 text-[0.82rem] font-semibold"
              style={{
                borderColor: 'rgba(163,32,32,0.28)',
                backgroundColor: '#fff5f4',
                color: '#a32020',
              }}
            >
              Log out
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
