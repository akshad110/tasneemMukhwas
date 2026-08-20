import { useEffect, useState } from 'react'
import { ordersApi, type AdminOrder } from '../../lib/services'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.55)'
const CARD = '#ffffff'
const LINE = 'rgba(10,46,34,0.08)'
const CREAM = '#f2f4f5'

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  shipped: { bg: '#d8f3e0', fg: '#1b7a3e' },
  processing: { bg: '#fde8d4', fg: '#b35c00' },
  completed: { bg: '#dceefc', fg: '#1a5f8a' },
  pending: { bg: '#f7efe0', fg: '#8a6a1a' },
  cancelled: { bg: '#f8d7d4', fg: '#a32020' },
}

const FLOW: AdminOrder['status'][] = ['pending', 'processing', 'shipped', 'completed']

function nextStatus(current: AdminOrder['status']): AdminOrder['status'] | null {
  const i = FLOW.indexOf(current)
  if (i < 0 || i >= FLOW.length - 1) return null
  return FLOW[i + 1]
}

function AdvanceStatusDialog({
  order,
  advancing,
  onCancel,
  onConfirm,
}: {
  order: AdminOrder
  advancing: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  const upcoming = nextStatus(order.status)
  if (!upcoming) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal
      aria-labelledby="advance-status-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-5 sm:p-6"
        style={{ backgroundColor: CARD, borderColor: LINE }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="advance-status-title" className="m-0 text-[1.2rem] font-bold" style={{ color: INK }}>
          Advance order status?
        </h2>
        <p className="mt-2 m-0 text-[0.9rem] leading-relaxed" style={{ color: MUTED }}>
          Move order <strong style={{ color: INK }}>{order.id}</strong> from{' '}
          <strong style={{ color: INK }} className="capitalize">
            {order.status}
          </strong>{' '}
          to{' '}
          <strong style={{ color: INK }} className="capitalize">
            {upcoming}
          </strong>
          ? This will update fulfillment for {order.customer}.
        </p>
        {upcoming === 'shipped' && !order.tracking && (
          <p className="mt-3 m-0 text-[0.82rem] leading-relaxed" style={{ color: MUTED }}>
            A tracking number will be generated automatically when the order is marked as shipped.
          </p>
        )}
        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={advancing}
            onClick={onCancel}
            className="cursor-pointer rounded-xl border px-4 py-2.5 text-[0.85rem] font-semibold transition hover:bg-black/[0.03] disabled:opacity-60"
            style={{ borderColor: LINE, backgroundColor: CARD, color: INK }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={advancing}
            onClick={onConfirm}
            className="cursor-pointer rounded-xl border-0 px-4 py-2.5 text-[0.85rem] font-semibold disabled:opacity-60"
            style={{ backgroundColor: INK, color: CREAM }}
          >
            {advancing ? 'Updating…' : 'Yes, advance status'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [selected, setSelected] = useState<AdminOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [advancing, setAdvancing] = useState(false)
  const [confirmAdvance, setConfirmAdvance] = useState<AdminOrder | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    ordersApi
      .list()
      .then((res) => {
        if (cancelled) return
        setOrders(res.items)
        setCounts(res.counts ?? {})
        setSelected(res.items[0] ?? null)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load orders')
          setOrders([])
          setSelected(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const advance = async (id: string) => {
    setAdvancing(true)
    setError(null)
    try {
      const next = await ordersApi.advance(id)
      setOrders((prev) => prev.map((o) => (o.id === id ? next : o)))
      setSelected(next)
      setConfirmAdvance(null)
      setCounts((prev) => {
        const c = { ...prev }
        const prevOrder = orders.find((o) => o.id === id)
        if (prevOrder) c[prevOrder.status] = Math.max(0, (c[prevOrder.status] ?? 1) - 1)
        c[next.status] = (c[next.status] ?? 0) + 1
        return c
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to advance order')
    } finally {
      setAdvancing(false)
    }
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Order Management</h1>
          <p className="admin-page-sub">Track orders, shipments, and fulfillment status.</p>
        </div>
      </div>

      {error && (
        <p className="mt-3 m-0 text-[0.85rem]" style={{ color: '#a32020' }}>
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2.5">
        {(['pending', 'processing', 'shipped', 'completed', 'cancelled'] as const).map((s) => (
          <div
            key={s}
            className="min-w-[112px] rounded-xl border px-3 py-2.5"
            style={{
              backgroundColor: CARD,
              borderColor: LINE,
              boxShadow: '0 6px 16px -12px rgba(10,46,34,0.22)',
            }}
          >
            <p className="m-0 text-[0.68rem] font-medium capitalize leading-none" style={{ color: MUTED }}>
              {s}
            </p>
            <p className="mt-1.5 m-0 text-[1.15rem] font-bold leading-none tracking-tight" style={{ color: INK }}>
              {counts[s] ?? 0}
            </p>
          </div>
        ))}
      </div>

      <div className="admin-panel-grid admin-panel-grid--orders mt-5">
        <div className="admin-table-wrap overflow-hidden rounded-2xl border" style={{ backgroundColor: CARD, borderColor: LINE }}>
          <table className="w-full border-collapse text-left text-[0.85rem]">
            <thead>
              <tr style={{ backgroundColor: '#f3f8f4', color: MUTED }}>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Pay</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6" style={{ color: MUTED }}>
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6" style={{ color: MUTED }}>
                    No orders yet
                  </td>
                </tr>
              )}
              {!loading &&
                orders.map((o) => {
                  const st = STATUS_STYLE[o.status]!
                  const on = selected?.id === o.id
                  return (
                    <tr
                      key={o.id}
                      onClick={() => setSelected(o)}
                      className="cursor-pointer border-t hover:bg-[#f7faf8]"
                      style={{
                        borderColor: LINE,
                        backgroundColor: on ? 'rgba(184,134,11,0.1)' : undefined,
                      }}
                    >
                      <td className="px-4 py-3 font-semibold" style={{ color: INK }}>
                        {o.id}
                        <p className="m-0 text-[0.7rem] font-normal" style={{ color: MUTED }}>
                          {o.date}
                        </p>
                      </td>
                      <td className="px-4 py-3" style={{ color: MUTED }}>
                        {o.customer}
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: INK }}>
                        ₹{o.total}
                      </td>
                      <td className="px-4 py-3 uppercase text-[0.75rem]" style={{ color: INK }}>
                        {o.payment}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="rounded-full px-2.5 py-1 text-[0.68rem] font-semibold capitalize"
                          style={{ backgroundColor: st.bg, color: st.fg }}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        <aside className="rounded-2xl border p-5" style={{ backgroundColor: CARD, borderColor: LINE }}>
          {selected ? (
            <>
              <h2 className="m-0 text-[1.15rem] font-bold" style={{ color: INK }}>
                {selected.id}
              </h2>
              <p className="mt-1 m-0 text-[0.85rem]" style={{ color: MUTED }}>
                {selected.customer} · {selected.city}
              </p>
              <dl className="mt-4 space-y-2 text-[0.85rem]">
                <div className="flex justify-between">
                  <dt style={{ color: MUTED }}>Items</dt>
                  <dd className="m-0 font-semibold" style={{ color: INK }}>
                    {selected.items}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: MUTED }}>Total</dt>
                  <dd className="m-0 font-semibold" style={{ color: GOLD }}>
                    ₹{selected.total}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: MUTED }}>Payment</dt>
                  <dd className="m-0 font-semibold uppercase" style={{ color: INK }}>
                    {selected.payment}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: MUTED }}>Tracking</dt>
                  <dd className="m-0 font-semibold" style={{ color: INK }}>
                    {selected.tracking ?? '—'}
                  </dd>
                </div>
              </dl>

              <div className="mt-5">
                <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-wide" style={{ color: GOLD }}>
                  Fulfillment
                </p>
                <div className="mt-5">
                  {(() => {
                    const fullyDone = selected.status === 'completed'
                    const cur =
                      selected.status === 'cancelled' ? -1 : FLOW.indexOf(selected.status)

                    return (
                      <ol className="m-0 flex list-none items-start p-0">
                        {FLOW.map((s, i) => {
                          const done = fullyDone || cur > i
                          const active = !fullyDone && cur === i
                          const upcoming = !fullyDone && cur < i

                          return (
                            <li key={s} className="flex min-w-0 flex-1 items-start">
                              <div className="flex w-full min-w-0 flex-col items-center">
                                <div className="flex w-full items-center">
                                  {i > 0 && (
                                    <div
                                      className="h-[2px] min-w-[6px] flex-1"
                                      style={{
                                        backgroundColor: fullyDone || cur >= i ? '#067d62' : '#d5d9d9',
                                      }}
                                      aria-hidden
                                    />
                                  )}
                                  <div
                                    className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-[0.85rem] font-bold"
                                    style={
                                      done
                                        ? { backgroundColor: '#067d62', color: '#fff' }
                                        : active
                                          ? { backgroundColor: INK, color: '#fff' }
                                          : {
                                              backgroundColor: '#fff',
                                              color: '#565959',
                                              boxShadow: 'inset 0 0 0 2px #d5d9d9',
                                            }
                                    }
                                    aria-current={active ? 'step' : undefined}
                                  >
                                    {done ? (
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path
                                          d="M5 13l4 4L19 7"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    ) : (
                                      <span>{i + 1}</span>
                                    )}
                                  </div>
                                  {i < FLOW.length - 1 && (
                                    <div
                                      className="h-[2px] min-w-[6px] flex-1"
                                      style={{
                                        backgroundColor: done ? '#067d62' : '#d5d9d9',
                                      }}
                                      aria-hidden
                                    />
                                  )}
                                </div>
                                <span
                                  className="mt-2 max-w-[4.5rem] text-center text-[0.58rem] font-semibold uppercase leading-tight tracking-wide"
                                  style={{ color: upcoming ? '#879596' : '#0f1111' }}
                                >
                                  {s}
                                </span>
                              </div>
                            </li>
                          )
                        })}
                      </ol>
                    )
                  })()}
                </div>
              </div>

              {selected.status !== 'completed' && selected.status !== 'cancelled' && (
                <button
                  type="button"
                  disabled={advancing}
                  onClick={() => setConfirmAdvance(selected)}
                  className="mt-5 w-full cursor-pointer rounded-xl border-0 py-3 text-[0.85rem] font-semibold disabled:opacity-60"
                  style={{ backgroundColor: INK, color: CREAM }}
                >
                  {advancing ? 'Updating…' : 'Advance status'}
                </button>
              )}

              <button
                type="button"
                onClick={() => void ordersApi.downloadInvoice(selected.id)}
                className="mt-3 w-full cursor-pointer rounded-xl border py-3 text-[0.85rem] font-semibold transition hover:bg-black/[0.03]"
                style={{ borderColor: LINE, backgroundColor: CARD, color: INK }}
              >
                Download invoice
              </button>
            </>
          ) : (
            <p style={{ color: MUTED }}>{loading ? 'Loading…' : 'Select an order'}</p>
          )}
        </aside>
      </div>

      {confirmAdvance && (
        <AdvanceStatusDialog
          order={confirmAdvance}
          advancing={advancing}
          onCancel={() => {
            if (!advancing) setConfirmAdvance(null)
          }}
          onConfirm={() => void advance(confirmAdvance.id)}
        />
      )}
    </div>
  )
}
