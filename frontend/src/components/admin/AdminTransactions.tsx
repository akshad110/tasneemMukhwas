import { useEffect, useState } from 'react'
import { ordersApi, transactionsApi, type AdminTransaction } from '../../lib/services'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.55)'
const CARD = '#ffffff'
const LINE = 'rgba(10,46,34,0.08)'

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  paid: { bg: '#d8f3e0', fg: '#1b7a3e' },
  pending: { bg: '#f7efe0', fg: '#8a6a1a' },
  refunded: { bg: '#dceefc', fg: '#1a5f8a' },
  failed: { bg: '#f8d7d4', fg: '#a32020' },
}

export default function AdminTransactions() {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'refunded' | 'failed'>('all')
  const [rows, setRows] = useState<AdminTransaction[]>([])
  const [totals, setTotals] = useState({ paid: 0, pending: 0, count: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    transactionsApi
      .list(filter)
      .then((res) => {
        if (cancelled) return
        setRows(res.items)
        setTotals(res.summary)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load transactions')
          setRows([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [filter])

  return (
    <div>
      <h1 className="m-0 text-[1.85rem] font-bold" style={{ color: INK }}>
        Transactions
      </h1>
      <p className="mt-1 m-0 text-[0.88rem]" style={{ color: MUTED }}>
        Billing history, invoices, and payment status.
      </p>

      {error && (
        <p className="mt-3 m-0 text-[0.85rem]" style={{ color: '#a32020' }}>
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2.5">
        {[
          { label: 'Collected', value: `₹${totals.paid.toLocaleString()}`, tint: '#e9f5ee' },
          { label: 'Pending COD', value: `₹${totals.pending.toLocaleString()}`, tint: '#f7efe0' },
          { label: 'Records', value: String(totals.count), tint: '#ecefea' },
        ].map((m) => (
          <div
            key={m.label}
            className="min-w-[140px] rounded-xl border px-3 py-2.5"
            style={{
              backgroundColor: m.tint,
              borderColor: LINE,
              boxShadow: '0 6px 16px -12px rgba(10,46,34,0.22)',
            }}
          >
            <p className="m-0 text-[0.68rem] font-medium leading-none" style={{ color: MUTED }}>
              {m.label}
            </p>
            <p className="mt-1.5 m-0 text-[1.15rem] font-bold leading-none tracking-tight" style={{ color: INK }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(['all', 'paid', 'pending', 'refunded', 'failed'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className="cursor-pointer rounded-full border-0 px-3 py-1.5 text-[0.75rem] font-semibold capitalize"
            style={{
              backgroundColor: filter === f ? GOLD : CARD,
              color: INK,
              boxShadow: filter === f ? undefined : `inset 0 0 0 1px ${LINE}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div
        className="mt-4 overflow-hidden rounded-2xl border"
        style={{ backgroundColor: CARD, borderColor: LINE }}
      >
        <table className="w-full border-collapse text-left text-[0.85rem]">
          <thead>
            <tr style={{ backgroundColor: '#f3f8f4', color: MUTED }}>
              <th className="px-4 py-3 font-semibold">Txn / Invoice</th>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Method</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-6" style={{ color: MUTED }}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6" style={{ color: MUTED }}>
                  No transactions found
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((t) => {
                const st = STATUS_STYLE[t.status]!
                return (
                  <tr key={t.id} className="border-t" style={{ borderColor: LINE }}>
                    <td className="px-4 py-3">
                      <p className="m-0 font-semibold" style={{ color: INK }}>
                        {t.id}
                      </p>
                      <p className="m-0 text-[0.72rem]" style={{ color: GOLD }}>
                        {t.invoice}
                      </p>
                    </td>
                    <td className="px-4 py-3" style={{ color: INK }}>
                      {t.orderId}
                    </td>
                    <td className="px-4 py-3" style={{ color: MUTED }}>
                      {t.customer}
                    </td>
                    <td className="px-4 py-3 uppercase" style={{ color: INK }}>
                      {t.method}
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: INK }}>
                      ₹{t.amount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2.5 py-1 text-[0.68rem] font-semibold capitalize"
                        style={{ backgroundColor: st.bg, color: st.fg }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: MUTED }}>
                      {t.date}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void ordersApi.downloadInvoice(t.orderId, `${t.invoice}.pdf`)}
                        className="cursor-pointer border-0 bg-transparent p-0 text-[0.78rem] font-semibold underline"
                        style={{ color: GOLD }}
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
