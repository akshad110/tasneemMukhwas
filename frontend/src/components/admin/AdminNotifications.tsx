import { useEffect, useState } from 'react'
import { notificationsApi, type AppNotification } from '../../lib/services'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.55)'
const CARD = '#ffffff'
const LINE = 'rgba(10,46,34,0.08)'

const TYPE_LABEL: Record<string, string> = {
  order_placed: 'Order confirmed',
  payment_received: 'Payment confirmed',
  order_shipped: 'Shipped',
  order_completed: 'Delivered',
  discount_campaign: 'Bulk discount',
}

const TYPE_STYLE: Record<string, { bg: string; fg: string }> = {
  order_placed: { bg: '#e9f5ee', fg: '#1b7a3e' },
  payment_received: { bg: '#dceefc', fg: '#1a5f8a' },
  order_shipped: { bg: '#f7efe0', fg: '#8a6a1a' },
  order_completed: { bg: '#e9f5ee', fg: '#1b7a3e' },
  discount_campaign: { bg: '#f3ebe0', fg: INK },
}

export default function AdminNotifications() {
  const [filter, setFilter] = useState('all')
  const [items, setItems] = useState<AppNotification[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [mailConfigured, setMailConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    notificationsApi
      .adminList(filter)
      .then((res) => {
        if (cancelled) return
        setItems(res.items)
        setCounts(res.counts)
        setMailConfigured(res.mailConfigured)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load notifications')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [filter])

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'order_placed', label: 'Orders' },
    { id: 'payment_received', label: 'Payments' },
    { id: 'order_shipped', label: 'Shipping' },
    { id: 'order_completed', label: 'Delivered' },
    { id: 'discount_campaign', label: 'Campaigns' },
  ]

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div>
      <h1 className="m-0 text-[1.85rem] font-bold" style={{ color: INK }}>
        Order alerts
      </h1>
      <p className="mt-1 m-0 text-[0.88rem]" style={{ color: MUTED }}>
        Order confirmations, payments, shipping updates, and bulk discount campaigns — no email delivery logs.
      </p>

      {!mailConfigured && (
        <p
          className="mt-3 m-0 rounded-lg border px-3 py-2 text-[0.82rem]"
          style={{ borderColor: LINE, backgroundColor: '#f7efe0', color: '#8a6a1a' }}
        >
          Add RESEND_API_KEY in backend .env to send order and campaign emails. Use RESEND_SANDBOX_TO with your
          verified Resend inbox while testing.
        </p>
      )}

      {error && (
        <p className="mt-3 m-0 text-[0.85rem]" style={{ color: '#a32020' }}>
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2.5">
        {[
          { label: 'Total alerts', value: String(totalCount) },
          { label: 'Orders', value: String(counts.order_placed ?? 0) },
          { label: 'Payments', value: String(counts.payment_received ?? 0) },
        ].map((m) => (
          <div
            key={m.label}
            className="min-w-[120px] rounded-xl border px-3 py-2.5"
            style={{ backgroundColor: CARD, borderColor: LINE }}
          >
            <p className="m-0 text-[0.68rem] font-medium" style={{ color: MUTED }}>
              {m.label}
            </p>
            <p className="mt-1 m-0 text-[1.15rem] font-bold" style={{ color: INK }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className="cursor-pointer rounded-full border-0 px-3 py-1.5 text-[0.75rem] font-semibold"
            style={{
              backgroundColor: filter === f.id ? GOLD : CARD,
              color: INK,
              boxShadow: filter === f.id ? undefined : `inset 0 0 0 1px ${LINE}`,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-6 m-0 text-[0.88rem]" style={{ color: MUTED }}>
          Loading…
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl border" style={{ borderColor: LINE, backgroundColor: CARD }}>
          <table className="w-full min-w-[560px] border-collapse text-left text-[0.82rem]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${LINE}`, color: MUTED }}>
                <th className="px-3 py-2.5 font-semibold">When</th>
                <th className="px-3 py-2.5 font-semibold">Type</th>
                <th className="px-3 py-2.5 font-semibold">Title</th>
                <th className="px-3 py-2.5 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {items.map((n) => {
                const style = TYPE_STYLE[n.type] || { bg: '#f0f0f0', fg: MUTED }
                return (
                  <tr key={n.id} style={{ borderBottom: `1px solid ${LINE}` }}>
                    <td className="px-3 py-2.5 whitespace-nowrap" style={{ color: MUTED }}>
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : '—'}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className="rounded-full px-2 py-0.5 text-[0.68rem] font-semibold"
                        style={{ backgroundColor: style.bg, color: style.fg }}
                      >
                        {TYPE_LABEL[n.type] || n.type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-medium" style={{ color: INK }}>
                      {n.title}
                    </td>
                    <td className="px-3 py-2.5 max-w-[320px]" style={{ color: MUTED }}>
                      {n.body}
                      {n.orderNumber ? (
                        <span className="mt-0.5 block text-[0.72rem]" style={{ color: INK }}>
                          Order {n.orderNumber}
                        </span>
                      ) : null}
                      {n.couponCode ? (
                        <span className="mt-0.5 block font-mono text-[0.72rem]" style={{ color: GOLD }}>
                          {n.couponCode}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                )
              })}
              {!items.length && (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center" style={{ color: MUTED }}>
                    No order alerts yet. They appear when customers confirm orders or you send a campaign.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
