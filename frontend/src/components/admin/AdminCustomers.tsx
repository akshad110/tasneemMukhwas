import { useEffect, useState } from 'react'
import { customersApi, type AdminCustomer } from '../../lib/services'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.55)'
const CARD = '#ffffff'
const LINE = 'rgba(10,46,34,0.08)'

export default function AdminCustomers() {
  const [q, setQ] = useState('')
  const [customers, setCustomers] = useState<AdminCustomer[]>([])
  const [selected, setSelected] = useState<AdminCustomer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const handle = window.setTimeout(() => {
      setLoading(true)
      setError(null)
      customersApi
        .list(q.trim() || undefined)
        .then((res) => {
          if (cancelled) return
          setCustomers(res.items)
          setSelected((prev) => {
            if (!res.items.length) return null
            if (prev && res.items.some((c) => c.id === prev.id)) {
              return res.items.find((c) => c.id === prev.id) ?? res.items[0]!
            }
            return res.items[0] ?? null
          })
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : 'Failed to load customers')
            setCustomers([])
            setSelected(null)
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, q ? 250 : 0)

    return () => {
      cancelled = true
      window.clearTimeout(handle)
    }
  }, [q])

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Customers</h1>
          <p className="admin-page-sub">All registered buyers and their recent interactions.</p>
        </div>
        <div className="admin-toolbar">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, city…"
            className="w-full rounded-xl border px-3 py-2.5 text-[0.85rem] outline-none sm:w-auto"
            style={{ borderColor: LINE, backgroundColor: CARD, color: INK }}
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 m-0 text-[0.85rem]" style={{ color: '#a32020' }}>
          {error}
        </p>
      )}

      <div className="admin-panel-grid admin-panel-grid--split mt-5">
        <div
          className="admin-table-wrap overflow-hidden rounded-2xl border"
          style={{ backgroundColor: CARD, borderColor: LINE }}
        >
          <table className="w-full border-collapse text-left text-[0.85rem]">
            <thead>
              <tr style={{ backgroundColor: '#f3f8f4', color: MUTED }}>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Orders</th>
                <th className="px-4 py-3 font-semibold">Spent</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-6" style={{ color: MUTED }}>
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6" style={{ color: MUTED }}>
                    No customers found
                  </td>
                </tr>
              )}
              {!loading &&
                customers.map((c) => {
                  const on = selected?.id === c.id
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className="cursor-pointer border-t transition hover:bg-[#f7faf8]"
                      style={{
                        borderColor: LINE,
                        backgroundColor: on ? 'rgba(184,134,11,0.1)' : undefined,
                      }}
                    >
                      <td className="px-4 py-3">
                        <p className="m-0 font-semibold" style={{ color: INK }}>
                          {c.name}
                        </p>
                        <p className="m-0 text-[0.75rem]" style={{ color: MUTED }}>
                          {c.email} · {c.city}
                        </p>
                      </td>
                      <td className="px-4 py-3" style={{ color: INK }}>
                        {c.orders}
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: INK }}>
                        ₹{c.spent.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="rounded-full px-2.5 py-1 text-[0.68rem] font-semibold"
                          style={{
                            backgroundColor: c.status === 'active' ? '#d8f3e0' : '#ecefea',
                            color: c.status === 'active' ? '#1b7a3e' : MUTED,
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        <aside
          className="rounded-2xl border p-5"
          style={{ backgroundColor: CARD, borderColor: LINE }}
        >
          {selected ? (
            <>
              <h2 className="m-0 text-[1.15rem] font-bold" style={{ color: INK }}>
                {selected.name}
              </h2>
              <p className="mt-1 m-0 text-[0.82rem]" style={{ color: MUTED }}>
                {selected.phone}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-[0.82rem]">
                <div className="rounded-xl px-3 py-2" style={{ backgroundColor: '#e9f5ee' }}>
                  <dt style={{ color: MUTED }}>Last active</dt>
                  <dd className="m-0 mt-0.5 font-semibold" style={{ color: INK }}>
                    {selected.lastActive}
                  </dd>
                </div>
                <div className="rounded-xl px-3 py-2" style={{ backgroundColor: '#f7efe0' }}>
                  <dt style={{ color: MUTED }}>Lifetime</dt>
                  <dd className="m-0 mt-0.5 font-semibold" style={{ color: INK }}>
                    ₹{selected.spent.toLocaleString()}
                  </dd>
                </div>
              </dl>
              <h3 className="mt-5 m-0 text-[0.9rem] font-bold" style={{ color: GOLD }}>
                Interactions
              </h3>
              <ul className="mt-3 m-0 list-none space-y-2.5 p-0">
                {selected.interactions.map((i) => (
                  <li
                    key={`${i.date}-${i.type}-${i.detail}`}
                    className="rounded-xl border px-3 py-2.5"
                    style={{ borderColor: LINE }}
                  >
                    <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-wide" style={{ color: GOLD }}>
                      {i.type} · {i.date}
                    </p>
                    <p className="mt-1 m-0 text-[0.82rem]" style={{ color: INK }}>
                      {i.detail}
                    </p>
                  </li>
                ))}
                {selected.interactions.length === 0 && (
                  <li className="text-[0.82rem]" style={{ color: MUTED }}>
                    No interactions yet
                  </li>
                )}
              </ul>
            </>
          ) : (
            <p style={{ color: MUTED }}>{loading ? 'Loading…' : 'Select a customer'}</p>
          )}
        </aside>
      </div>
    </div>
  )
}
