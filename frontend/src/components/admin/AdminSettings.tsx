import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../../context/AuthContext'
import type { AuthUser } from '../../lib/services'

const INK = '#0a2e22'
const CREAM = '#f3e6c8'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.55)'
const CARD = '#ffffff'
const LINE = 'rgba(10,46,34,0.08)'

type ProfileForm = {
  name: string
  email: string
  phone: string
  role: string
  store: string
  timezone: string
  notifyOrders: boolean
  notifyLowStock: boolean
  notifyReviews: boolean
}

function fromUser(user: AuthUser): ProfileForm {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone ?? '',
    role: user.role,
    store: user.store ?? '',
    timezone: user.timezone ?? '',
    notifyOrders: Boolean(user.notifyOrders),
    notifyLowStock: Boolean(user.notifyLowStock),
    notifyReviews: Boolean(user.notifyReviews),
  }
}

export default function AdminSettings() {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState<ProfileForm | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) setProfile(fromUser(user))
  }, [user])

  const onSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    setError(null)
    try {
      await updateProfile({
        name: profile.name,
        phone: profile.phone,
        store: profile.store,
        timezone: profile.timezone,
        notifyOrders: profile.notifyOrders,
        notifyLowStock: profile.notifyLowStock,
        notifyReviews: profile.notifyReviews,
      })
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (!profile) {
    return (
      <p className="m-0 text-[0.95rem]" style={{ color: MUTED }}>
        Loading…
      </p>
    )
  }

  return (
    <div>
      <h1 className="m-0 text-[1.85rem] font-bold" style={{ color: INK }}>
        Account & Settings
      </h1>
      <p className="mt-1 m-0 text-[0.88rem]" style={{ color: MUTED }}>
        Admin profile, store identity, and notification preferences.
      </p>

      {error && (
        <p className="mt-3 m-0 text-[0.85rem]" style={{ color: '#a32020' }}>
          {error}
        </p>
      )}

      <form onSubmit={(e) => void onSave(e)} className="mt-5 grid max-w-3xl gap-4">
        <div className="rounded-2xl border p-5" style={{ backgroundColor: CARD, borderColor: LINE }}>
          <h2 className="m-0 text-[1.05rem] font-bold" style={{ color: GOLD }}>
            Profile
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[0.78rem]" style={{ color: MUTED }}>
              Full name
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
                style={{ borderColor: LINE, color: INK }}
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </label>
            <label className="block text-[0.78rem]" style={{ color: MUTED }}>
              Email
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
                style={{ borderColor: LINE, color: INK, backgroundColor: '#f3f7f4' }}
                value={profile.email}
                readOnly
              />
            </label>
            <label className="block text-[0.78rem]" style={{ color: MUTED }}>
              Phone
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
                style={{ borderColor: LINE, color: INK }}
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </label>
            <label className="block text-[0.78rem]" style={{ color: MUTED }}>
              Role
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none capitalize"
                style={{ borderColor: LINE, color: INK, backgroundColor: '#f3f7f4' }}
                value={profile.role}
                readOnly
              />
            </label>
            <label className="block text-[0.78rem]" style={{ color: MUTED }}>
              Store
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
                style={{ borderColor: LINE, color: INK }}
                value={profile.store}
                onChange={(e) => setProfile({ ...profile, store: e.target.value })}
              />
            </label>
            <label className="block text-[0.78rem]" style={{ color: MUTED }}>
              Timezone
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
                style={{ borderColor: LINE, color: INK }}
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border p-5" style={{ backgroundColor: CARD, borderColor: LINE }}>
          <h2 className="m-0 text-[1.05rem] font-bold" style={{ color: GOLD }}>
            Notifications
          </h2>
          <div className="mt-4 space-y-3">
            {(
              [
                ['notifyOrders', 'New order alerts'],
                ['notifyLowStock', 'Low stock warnings'],
                ['notifyReviews', 'Product review alerts'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex cursor-pointer items-center justify-between gap-3">
                <span className="text-[0.9rem]" style={{ color: INK }}>
                  {label}
                </span>
                <input
                  type="checkbox"
                  checked={profile[key]}
                  onChange={(e) => setProfile({ ...profile, [key]: e.target.checked })}
                  className="h-4 w-4 accent-[#b8860b]"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer rounded-xl border-0 px-5 py-3 text-[0.85rem] font-semibold disabled:opacity-60"
            style={{ backgroundColor: INK, color: CREAM }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {saved && (
            <span className="text-[0.82rem] font-semibold" style={{ color: '#1b7a3e' }}>
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
