import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCatalog } from '../../context/CatalogContext'
import { ApiRequestError } from '../../lib/api'
import { CATEGORIES } from '../../lib/shopCatalog'
import {
  campaignsApi,
  couponsApi,
  type CampaignRecord,
  type CouponRecord,
} from '../../lib/services'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.55)'
const CARD = '#ffffff'
const LINE = 'rgba(10,46,34,0.08)'

type Tab = 'coupons' | 'campaigns'

const EMPTY_COUPON = {
  title: '',
  description: '',
  scope: 'global' as CouponRecord['scope'],
  productId: '',
  category: CATEGORIES[0] || 'Classic Mukhwas',
  discountType: 'percent' as CouponRecord['discountType'],
  value: 10,
  expiresAt: '',
  maxRedemptions: 0,
  maxRedemptionsPerUser: 1,
  minOrderValue: 0,
  maxDiscountAmount: 0,
  autoApply: false,
  isActive: true,
}

function scopeLabel(c: CouponRecord) {
  if (c.scope === 'global') return 'Global code'
  if (c.scope === 'product') return `Product · ${c.productId || '—'}`
  return `Category · ${c.category || '—'}`
}

function discountLabel(c: CouponRecord) {
  return c.discountType === 'percent' ? `${c.value}% off` : `₹${c.value} off`
}

export default function AdminDiscounts() {
  const { products } = useCatalog()
  const [tab, setTab] = useState<Tab>('coupons')
  const [coupons, setCoupons] = useState<CouponRecord[]>([])
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([])
  const [mailConfigured, setMailConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<CouponRecord | null>(null)
  const [form, setForm] = useState<{ title: string; description: string; scope: CouponRecord['scope']; productId: string; category: string; discountType: CouponRecord['discountType']; value: number; expiresAt: string; maxRedemptions: number; maxRedemptionsPerUser: number; minOrderValue: number; maxDiscountAmount: number; autoApply: boolean; isActive: boolean }>({ ...EMPTY_COUPON })

  const [campaignForm, setCampaignForm] = useState({
    title: '',
    message: '',
    couponId: '',
    recipientFilter: 'all' as 'all' | 'active',
  })
  const [recipientPreview, setRecipientPreview] = useState<{ count: number; sample: { name: string; email: string }[] } | null>(null)

  const globalCoupons = useMemo(() => coupons.filter((c) => c.scope === 'global' && c.isActive), [coupons])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [cRes, campRes] = await Promise.all([couponsApi.list(), campaignsApi.list()])
      setCoupons(cRes.items)
      setCampaigns(campRes.items)
      setMailConfigured(campRes.mailConfigured)
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Failed to load discounts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (tab !== 'campaigns') return
    campaignsApi
      .previewRecipients(campaignForm.recipientFilter)
      .then(setRecipientPreview)
      .catch(() => setRecipientPreview(null))
  }, [tab, campaignForm.recipientFilter])

  const openCreate = () => {
    setEditing(null)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 30)
    setForm({
      ...EMPTY_COUPON,
      expiresAt: tomorrow.toISOString().slice(0, 10),
    })
    setShowForm(true)
  }

  const openEdit = (c: CouponRecord) => {
    setEditing(c)
    setForm({
      title: c.title,
      description: c.description || '',
      scope: c.scope,
      productId: c.productId || '',
      category: c.category || CATEGORIES[0] || '',
      discountType: c.discountType,
      value: c.value,
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '',
      maxRedemptions: c.maxRedemptions,
      maxRedemptionsPerUser: c.maxRedemptionsPerUser,
      minOrderValue: c.minOrderValue,
      maxDiscountAmount: c.maxDiscountAmount || 0,
      autoApply: c.autoApply,
      isActive: c.isActive,
    })
    setShowForm(true)
  }

  const saveCoupon = async () => {
    setBusy(true)
    setMsg('')
    setError('')
    try {
      const body = {
        ...form,
        expiresAt: new Date(form.expiresAt).toISOString(),
      }
      if (editing) {
        await couponsApi.update(editing.id, body)
        setMsg('Discount updated')
      } else {
        await couponsApi.create(body)
        setMsg('Discount created')
      }
      setShowForm(false)
      await load()
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not save discount')
    } finally {
      setBusy(false)
    }
  }

  const removeCoupon = async (id: string) => {
    if (!window.confirm('Remove this discount?')) return
    setBusy(true)
    try {
      await couponsApi.remove(id)
      setMsg('Discount removed')
      await load()
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not remove')
    } finally {
      setBusy(false)
    }
  }

  const regenerateCode = async (id: string) => {
    setBusy(true)
    try {
      await couponsApi.regenerateCode(id)
      setMsg('New 6-character code generated')
      await load()
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not regenerate code')
    } finally {
      setBusy(false)
    }
  }

  const createCampaign = async () => {
    if (!campaignForm.title.trim() || !campaignForm.couponId) {
      setError('Campaign needs a title and linked discount')
      return
    }
    setBusy(true)
    setError('')
    try {
      await campaignsApi.create(campaignForm)
      setCampaignForm({ title: '', message: '', couponId: '', recipientFilter: 'all' })
      setMsg('Campaign draft created')
      await load()
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not create campaign')
    } finally {
      setBusy(false)
    }
  }

  const sendCampaign = async (id: string) => {
    if (!window.confirm('Send this campaign now? Emails will go via Resend.')) return
    setBusy(true)
    setError('')
    try {
      const res = await campaignsApi.send(id)
      setMsg(`Campaign sent — ${res.stats.sent}/${res.stats.total} delivered`)
      await load()
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not send campaign')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Discounts & campaigns</h1>
          <p className="admin-page-sub">
            Global codes, product/category promos, and email campaigns via Resend.
          </p>
        </div>
        {tab === 'coupons' ? (
          <div className="admin-toolbar">
            <button
              type="button"
              onClick={openCreate}
              className="w-full cursor-pointer rounded-full border-0 px-4 py-2 text-[0.8rem] font-semibold sm:w-auto"
              style={{ backgroundColor: GOLD, color: INK }}
            >
              + New discount
            </button>
          </div>
        ) : null}
      </div>

      {!mailConfigured && (
        <p className="mt-3 m-0 rounded-lg border px-3 py-2 text-[0.82rem]" style={{ borderColor: LINE, backgroundColor: '#f7efe0', color: '#8a6a1a' }}>
          Add RESEND_API_KEY in backend .env to enable email campaigns and order alerts.
        </p>
      )}

      {error && (
        <p className="mt-3 m-0 text-[0.85rem]" style={{ color: '#a32020' }}>
          {error}
        </p>
      )}
      {msg && (
        <p className="mt-3 m-0 text-[0.85rem]" style={{ color: '#1b7a3e' }}>
          {msg}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {(['coupons', 'campaigns'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="cursor-pointer rounded-full border-0 px-3 py-1.5 text-[0.75rem] font-semibold capitalize"
            style={{
              backgroundColor: tab === t ? GOLD : CARD,
              color: INK,
              boxShadow: tab === t ? undefined : `inset 0 0 0 1px ${LINE}`,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-6 m-0 text-[0.88rem]" style={{ color: MUTED }}>
          Loading…
        </p>
      ) : tab === 'coupons' ? (
        <div className="mt-5 overflow-x-auto rounded-xl border" style={{ borderColor: LINE, backgroundColor: CARD }}>
          <table className="w-full min-w-[720px] border-collapse text-left text-[0.82rem]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${LINE}`, color: MUTED }}>
                <th className="px-3 py-2.5 font-semibold">Title</th>
                <th className="px-3 py-2.5 font-semibold">Scope</th>
                <th className="px-3 py-2.5 font-semibold">Code</th>
                <th className="px-3 py-2.5 font-semibold">Value</th>
                <th className="px-3 py-2.5 font-semibold">Used</th>
                <th className="px-3 py-2.5 font-semibold">Expires</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${LINE}` }}>
                  <td className="px-3 py-2.5 font-medium" style={{ color: INK }}>
                    {c.title}
                    {c.autoApply && (
                      <span className="ml-1.5 rounded-full px-1.5 py-0.5 text-[0.65rem]" style={{ backgroundColor: '#e9f5ee', color: '#1b7a3e' }}>
                        Auto
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5" style={{ color: MUTED }}>
                    {scopeLabel(c)}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[0.78rem]" style={{ color: INK }}>
                    {c.code || '—'}
                  </td>
                  <td className="px-3 py-2.5">{discountLabel(c)}</td>
                  <td className="px-3 py-2.5">
                    {c.redemptionCount}
                    {c.maxRedemptions > 0 ? ` / ${c.maxRedemptions}` : ''}
                  </td>
                  <td className="px-3 py-2.5">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className="rounded-full px-2 py-0.5 text-[0.68rem] font-semibold"
                      style={{
                        backgroundColor: c.isActive ? '#e9f5ee' : '#f0f0f0',
                        color: c.isActive ? '#1b7a3e' : MUTED,
                      }}
                    >
                      {c.isActive ? 'Active' : 'Off'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      <button type="button" onClick={() => openEdit(c)} className="cursor-pointer border-0 bg-transparent text-[0.75rem] font-semibold" style={{ color: GOLD }}>
                        Edit
                      </button>
                      {c.scope === 'global' && (
                        <button type="button" disabled={busy} onClick={() => regenerateCode(c.id)} className="cursor-pointer border-0 bg-transparent text-[0.75rem] font-semibold" style={{ color: INK }}>
                          New code
                        </button>
                      )}
                      <button type="button" disabled={busy} onClick={() => removeCoupon(c.id)} className="cursor-pointer border-0 bg-transparent text-[0.75rem] font-semibold" style={{ color: '#a32020' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!coupons.length && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center" style={{ color: MUTED }}>
                    No discounts yet. Create a global code or product/category promo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)]">
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: LINE, backgroundColor: CARD }}>
            <table className="w-full min-w-[520px] border-collapse text-left text-[0.82rem]">
              <thead>
                <tr style={{ borderBottom: `1px solid ${LINE}`, color: MUTED }}>
                  <th className="px-3 py-2.5 font-semibold">Campaign</th>
                  <th className="px-3 py-2.5 font-semibold">Discount</th>
                  <th className="px-3 py-2.5 font-semibold">Recipients</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${LINE}` }}>
                    <td className="px-3 py-2.5 font-medium" style={{ color: INK }}>
                      {c.title}
                    </td>
                    <td className="px-3 py-2.5" style={{ color: MUTED }}>
                      {c.coupon?.code || c.coupon?.title || '—'}
                    </td>
                    <td className="px-3 py-2.5">
                      {c.stats.sent}/{c.stats.total} · {c.recipientFilter}
                    </td>
                    <td className="px-3 py-2.5 capitalize">{c.status}</td>
                    <td className="px-3 py-2.5">
                      {c.status === 'draft' || c.status === 'failed' ? (
                        <button
                          type="button"
                          disabled={busy || !mailConfigured}
                          onClick={() => sendCampaign(c.id)}
                          className="cursor-pointer rounded-full border-0 px-2.5 py-1 text-[0.72rem] font-semibold disabled:opacity-40"
                          style={{ backgroundColor: GOLD, color: INK }}
                        >
                          Send
                        </button>
                      ) : (
                        <span className="text-[0.72rem]" style={{ color: MUTED }}>
                          {c.sentAt ? new Date(c.sentAt).toLocaleString() : 'Sent'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {!campaigns.length && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center" style={{ color: MUTED }}>
                      No campaigns yet. Create one using the form.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border p-4" style={{ borderColor: LINE, backgroundColor: CARD }}>
            <h2 className="m-0 text-[1rem] font-bold" style={{ color: INK }}>
              New email campaign
            </h2>
            <p className="mt-1 m-0 text-[0.78rem]" style={{ color: MUTED }}>
              Sends discount codes to customers via Resend. Test mode redirects to your configured test inbox.
            </p>

            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-[0.72rem] font-medium" style={{ color: MUTED }}>
                  Campaign title
                </span>
                <input
                  className="w-full rounded-lg border px-2.5 py-2 text-[0.85rem] outline-none"
                  style={{ borderColor: LINE, color: INK }}
                  value={campaignForm.title}
                  onChange={(e) => setCampaignForm((f) => ({ ...f, title: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[0.72rem] font-medium" style={{ color: MUTED }}>
                  Message (optional)
                </span>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border px-2.5 py-2 text-[0.85rem] outline-none"
                  style={{ borderColor: LINE, color: INK }}
                  value={campaignForm.message}
                  onChange={(e) => setCampaignForm((f) => ({ ...f, message: e.target.value }))}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[0.72rem] font-medium" style={{ color: MUTED }}>
                  Linked discount (global code)
                </span>
                <select
                  className="w-full rounded-lg border px-2.5 py-2 text-[0.85rem] outline-none"
                  style={{ borderColor: LINE, color: INK }}
                  value={campaignForm.couponId}
                  onChange={(e) => setCampaignForm((f) => ({ ...f, couponId: e.target.value }))}
                >
                  <option value="">Select discount</option>
                  {globalCoupons.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} · {c.code}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[0.72rem] font-medium" style={{ color: MUTED }}>
                  Recipients
                </span>
                <select
                  className="w-full rounded-lg border px-2.5 py-2 text-[0.85rem] outline-none"
                  style={{ borderColor: LINE, color: INK }}
                  value={campaignForm.recipientFilter}
                  onChange={(e) =>
                    setCampaignForm((f) => ({
                      ...f,
                      recipientFilter: e.target.value as 'all' | 'active',
                    }))
                  }
                >
                  <option value="all">All customers</option>
                  <option value="active">Active customers only</option>
                </select>
              </label>
              {recipientPreview && (
                <p className="m-0 text-[0.75rem]" style={{ color: MUTED }}>
                  {recipientPreview.count} recipient{recipientPreview.count === 1 ? '' : 's'}
                  {recipientPreview.sample.length
                    ? ` · e.g. ${recipientPreview.sample.map((s) => s.email).join(', ')}`
                    : ''}
                </p>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={createCampaign}
                className="w-full cursor-pointer rounded-full border-0 py-2.5 text-[0.82rem] font-semibold disabled:opacity-40"
                style={{ backgroundColor: GOLD, color: INK }}
              >
                Save draft
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border p-5" style={{ backgroundColor: CARD, borderColor: LINE }}>
            <h2 className="m-0 text-[1.1rem] font-bold" style={{ color: INK }}>
              {editing ? 'Edit discount' : 'New discount'}
            </h2>
            <div className="mt-4 grid gap-3">
              <input
                placeholder="Title"
                className="rounded-lg border px-2.5 py-2 text-[0.85rem]"
                style={{ borderColor: LINE }}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
              <textarea
                placeholder="Description (optional)"
                rows={2}
                className="rounded-lg border px-2.5 py-2 text-[0.85rem]"
                style={{ borderColor: LINE }}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              <select
                className="rounded-lg border px-2.5 py-2 text-[0.85rem]"
                style={{ borderColor: LINE }}
                value={form.scope}
                onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value as CouponRecord['scope'] }))}
              >
                <option value="global">Global — 6-char code at checkout</option>
                <option value="product">Product-specific</option>
                <option value="category">Category-specific</option>
              </select>
              {form.scope === 'product' && (
                <select
                  className="rounded-lg border px-2.5 py-2 text-[0.85rem]"
                  style={{ borderColor: LINE }}
                  value={form.productId}
                  onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
              {form.scope === 'category' && (
                <select
                  className="rounded-lg border px-2.5 py-2 text-[0.85rem]"
                  style={{ borderColor: LINE }}
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="rounded-lg border px-2.5 py-2 text-[0.85rem]"
                  style={{ borderColor: LINE }}
                  value={form.discountType}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, discountType: e.target.value as CouponRecord['discountType'] }))
                  }
                >
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed ₹</option>
                </select>
                <input
                  type="number"
                  min={0}
                  className="rounded-lg border px-2.5 py-2 text-[0.85rem]"
                  style={{ borderColor: LINE }}
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
                />
              </div>
              <input
                type="date"
                className="rounded-lg border px-2.5 py-2 text-[0.85rem]"
                style={{ borderColor: LINE }}
                value={form.expiresAt}
                onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Min order ₹"
                  className="rounded-lg border px-2.5 py-2 text-[0.85rem]"
                  style={{ borderColor: LINE }}
                  value={form.minOrderValue}
                  onChange={(e) => setForm((f) => ({ ...f, minOrderValue: Number(e.target.value) }))}
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Max redemptions (0=∞)"
                  className="rounded-lg border px-2.5 py-2 text-[0.85rem]"
                  style={{ borderColor: LINE }}
                  value={form.maxRedemptions}
                  onChange={(e) => setForm((f) => ({ ...f, maxRedemptions: Number(e.target.value) }))}
                />
              </div>
              {form.scope !== 'global' && (
                <label className="flex items-center gap-2 text-[0.82rem]" style={{ color: INK }}>
                  <input
                    type="checkbox"
                    checked={form.autoApply}
                    onChange={(e) => setForm((f) => ({ ...f, autoApply: e.target.checked }))}
                  />
                  Auto-apply on matching items (shows badge on shop)
                </label>
              )}
              <label className="flex items-center gap-2 text-[0.82rem]" style={{ color: INK }}>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                Active
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="cursor-pointer rounded-full border px-4 py-2 text-[0.8rem]" style={{ borderColor: LINE }}>
                Cancel
              </button>
              <button
                type="button"
                disabled={busy || !form.title.trim() || !form.expiresAt}
                onClick={saveCoupon}
                className="cursor-pointer rounded-full border-0 px-4 py-2 text-[0.8rem] font-semibold disabled:opacity-40"
                style={{ backgroundColor: GOLD, color: INK }}
              >
                {busy ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
