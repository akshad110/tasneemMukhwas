import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { dashboardApi, type DashboardData } from '../../lib/services'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.55)'
const CARD = '#ffffff'
const LINE = 'rgba(10,46,34,0.08)'

function inr(n: number) {
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n}`
}

function Card({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 ${className}`}
      style={{
        backgroundColor: CARD,
        borderColor: LINE,
        boxShadow: '0 10px 30px -22px rgba(10,46,34,0.28)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function MetricCard({
  label,
  value,
  tint,
  icon,
}: {
  label: string
  value: string
  tint: string
  icon: ReactNode
}) {
  return (
    <div
      className="rounded-xl border px-3 py-2.5"
      style={{
        backgroundColor: tint,
        borderColor: LINE,
        boxShadow: '0 6px 16px -12px rgba(10,46,34,0.22)',
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="m-0 text-[0.68rem] font-medium leading-none" style={{ color: MUTED }}>
            {label}
          </p>
          <p className="mt-1.5 m-0 text-[1.15rem] font-bold leading-none tracking-tight" style={{ color: INK }}>
            {value}
          </p>
        </div>
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'rgba(255,255,255,0.75)', color: INK }}
        >
          <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
        </span>
      </div>
    </div>
  )
}

function SalesChart({ data }: { data: DashboardData['salesByMonth'] }) {
  const maxY = 100
  const w = 720
  const h = 132
  const padL = 36
  const padR = 12
  const padT = 38
  const padB = 20
  const chartW = w - padL - padR
  const chartH = h - padT - padB
  const yTicks = [0, 20, 40, 60, 80, 100]
  const values = data.length
    ? data.map((d) => d.v)
    : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const months = data.length ? data.map((d) => d.m) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const pts = values.map((v, i) => {
    const x = padL + (i * chartW) / Math.max(values.length - 1, 1)
    const y = padT + chartH - (v / maxY) * chartH
    return { x, y, v, m: months[i]!, amount: data[i]?.amount ?? 0 }
  })
  const linePts = pts.map((p) => `${p.x},${p.y}`).join(' ')
  const areaPts = `${padL},${padT + chartH} ${linePts} ${padL + chartW},${padT + chartH}`
  const peak = pts.reduce((best, p) => (p.v >= best.v ? p : best), pts[0] ?? { x: 0, y: 0, v: 0, m: '', amount: 0 })

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-[132px] w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Sales overview chart"
    >
      <defs>
        <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34c759" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#34c759" stopOpacity="0" />
        </linearGradient>
      </defs>

      {yTicks.map((t) => {
        const y = padT + chartH - (t / maxY) * chartH
        return (
          <g key={t}>
            <line
              x1={padL}
              x2={w - padR}
              y1={y}
              y2={y}
              stroke="rgba(10,46,34,0.12)"
              strokeDasharray="4 4"
            />
            <text
              x={padL - 8}
              y={y + 3}
              textAnchor="end"
              fontSize="9"
              fill="rgba(10,46,34,0.4)"
              fontFamily="Inter, sans-serif"
            >
              {t}K
            </text>
          </g>
        )
      })}

      <polygon points={areaPts} fill="url(#salesFill)" />
      <polyline
        points={linePts}
        fill="none"
        stroke="#22c55e"
        strokeWidth="2.25"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {pts.map((p) => (
        <text
          key={p.m}
          x={p.x}
          y={h - 4}
          textAnchor="middle"
          fontSize="9"
          fontFamily="Inter, sans-serif"
          fill={p.m === peak.m ? '#22c55e' : 'rgba(10,46,34,0.45)'}
          fontWeight={p.m === peak.m ? 600 : 400}
        >
          {p.m}
        </text>
      ))}

      {peak.v > 0 && (
        <>
          <circle cx={peak.x} cy={peak.y} r="4.5" fill="#22c55e" stroke="#fff" strokeWidth="2" />
          <rect x={peak.x - 48} y={peak.y - 44} width="96" height="34" rx="8" fill="#22c55e" />
          <text
            x={peak.x}
            y={peak.y - 30}
            textAnchor="middle"
            fontSize="9"
            fontWeight="600"
            fill="#fff"
            fontFamily="Inter, sans-serif"
          >
            {peak.m}
          </text>
          <text
            x={peak.x}
            y={peak.y - 17}
            textAnchor="middle"
            fontSize="9"
            fill="#fff"
            fontFamily="Inter, sans-serif"
          >
            Total sale {peak.amount >= 1000 ? `${(peak.amount / 1000).toFixed(2)}k` : peak.amount}
          </text>
        </>
      )}
    </svg>
  )
}

function Donut({
  data,
  size = 150,
}: {
  data: { label: string; value: number; color: string }[]
  size?: number
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const r = 54
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <svg width={size} height={size} viewBox="0 0 140 140" aria-hidden>
        <g transform="translate(70,70) rotate(-90)">
          {data.map((d) => {
            const len = (d.value / total) * c
            const el = (
              <circle
                key={d.label}
                r={r}
                fill="none"
                stroke={d.color}
                strokeWidth="18"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
              />
            )
            offset += len
            return el
          })}
        </g>
        <circle cx="70" cy="70" r="36" fill="#fff" />
      </svg>
      <ul className="m-0 list-none space-y-2 p-0">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-[0.8rem]" style={{ color: INK }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            {d.label} · {d.value}%
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Dashboard — reference layout with brand light-green / gold accents. */
export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    dashboardApi
      .get()
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <p className="m-0 text-[0.95rem]" style={{ color: MUTED }}>
        Loading dashboard…
      </p>
    )
  }

  if (error || !data) {
    return (
      <p className="m-0 text-[0.95rem]" style={{ color: '#a32020' }}>
        {error || 'Failed to load dashboard'}
      </p>
    )
  }

  const { metrics, salesByMonth, inventoryStatus, shipmentBreakdown, customerActivity, marketingBars, topProducts, recentOrders } =
    data

  return (
    <div>
      <h1 className="m-0 text-[1.85rem] font-bold tracking-tight" style={{ color: INK }}>
        Dashboard
      </h1>

      {/* Metrics */}
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Sales"
          value={inr(metrics.totalSales)}
          tint="#e9f5ee"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M4 16c3-6 5-8 8-8s5 2 8 8" strokeLinecap="round" />
              <path d="M14 8h6v6" strokeLinecap="round" />
            </svg>
          }
        />
        <MetricCard
          label="Orders Today"
          value={String(metrics.ordersToday)}
          tint="#e7f0fa"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6 5 3H2" />
            </svg>
          }
        />
        <MetricCard
          label="Low Stock Items"
          value={String(metrics.lowStock)}
          tint="#f7efe0"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v5M12 16.5v.5" strokeLinecap="round" />
            </svg>
          }
        />
        <MetricCard
          label="Total Customers"
          value={metrics.customers.toLocaleString()}
          tint="#ecefea"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="9" cy="8" r="3" />
              <path d="M3.5 19c.8-3 2.8-4.5 5.5-4.5s4.7 1.5 5.5 4.5" />
            </svg>
          }
        />
      </div>

      {/* Sales + Inventory */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="!p-3 sm:!p-4">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <h2 className="m-0 text-[0.95rem] font-bold" style={{ color: INK }}>
              Sales Overview
            </h2>
            <span
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.68rem] font-medium"
              style={{ borderColor: LINE, color: MUTED, backgroundColor: '#f7faf8' }}
            >
              Monthly
              <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M3 4.5 6 7.5 9 4.5" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <SalesChart data={salesByMonth} />
        </Card>

        <Card className="!p-3 sm:!p-3.5">
          <h2 className="m-0 text-[0.95rem] font-bold" style={{ color: INK }}>
            Inventory Status
          </h2>
          <ul className="mt-2.5 m-0 list-none space-y-1.5 p-0">
            {inventoryStatus.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between rounded-lg px-2.5 py-1.5"
                style={{ backgroundColor: PAGE_SOFT(row.tone) }}
              >
                <span className="flex items-center gap-2 text-[0.78rem] font-medium" style={{ color: INK }}>
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[0.62rem]"
                    style={{
                      backgroundColor:
                        row.tone === 'ok' ? '#d8f3e0' : row.tone === 'warn' ? '#fde8d4' : '#f8d7d4',
                      color: row.tone === 'ok' ? '#1b7a3e' : row.tone === 'warn' ? '#b35c00' : '#a32020',
                    }}
                  >
                    {row.tone === 'ok' ? '✓' : '!'}
                  </span>
                  {row.label}
                </span>
                <span className="text-[0.85rem] font-bold" style={{ color: INK }}>
                  {row.count}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => navigateApp(`${APP_ROUTES.admin}/products`)}
            className="mt-3 w-full cursor-pointer rounded-lg border-0 py-2 text-[0.78rem] font-semibold transition hover:brightness-110"
            style={{ backgroundColor: '#2d6a4f', color: '#fff' }}
          >
            Manage Inventory
          </button>
        </Card>
      </div>

      {/* Top products / Recent orders / Shipment */}
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <h2 className="m-0 text-[1.05rem] font-bold" style={{ color: INK }}>
            Top Selling Products
          </h2>
          <ul className="mt-4 m-0 list-none space-y-3 p-0">
            {topProducts.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <img
                  src={p.image}
                  alt=""
                  className="h-10 w-10 rounded-lg object-contain"
                  style={{ backgroundColor: '#f3f7f4' }}
                />
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-[0.85rem] font-semibold" style={{ color: INK }}>
                    {p.name}
                  </p>
                  <p className="m-0 text-[0.75rem]" style={{ color: MUTED }}>
                    ₹{(p.sales ?? 0).toLocaleString()}
                  </p>
                </div>
                <span className="text-[0.75rem] font-semibold" style={{ color: '#1b7a3e' }}>
                  {p.reviews > 0 ? `${p.reviews} sold` : '—'}
                </span>
              </li>
            ))}
            {topProducts.length === 0 && (
              <li className="text-[0.82rem]" style={{ color: MUTED }}>
                No products yet
              </li>
            )}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-[1.05rem] font-bold" style={{ color: INK }}>
              Recent Orders
            </h2>
            <button
              type="button"
              onClick={() => navigateApp(`${APP_ROUTES.admin}/orders`)}
              className="cursor-pointer border-0 bg-transparent p-0 text-[0.75rem] font-semibold"
              style={{ color: GOLD }}
            >
              View All ›
            </button>
          </div>
          <ul className="mt-4 m-0 list-none divide-y p-0" style={{ borderColor: LINE }}>
            {recentOrders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-2 py-2.5">
                <div>
                  <p className="m-0 text-[0.82rem] font-semibold" style={{ color: INK }}>
                    {o.id}
                  </p>
                  <p className="m-0 text-[0.72rem]" style={{ color: MUTED }}>
                    {o.customer}
                  </p>
                </div>
                <StatusPill status={o.status} />
              </li>
            ))}
            {recentOrders.length === 0 && (
              <li className="py-2.5 text-[0.82rem]" style={{ color: MUTED }}>
                No orders yet
              </li>
            )}
          </ul>
        </Card>

        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="m-0 text-[1.05rem] font-bold" style={{ color: INK }}>
              Shipment Status
            </h2>
            <span className="text-[0.72rem]" style={{ color: MUTED }}>
              Today
            </span>
          </div>
          <Donut data={shipmentBreakdown} />
        </Card>
      </div>

      {/* Activity + Marketing */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="m-0 text-[1.05rem] font-bold" style={{ color: INK }}>
            Customer Activity
          </h2>
          <div className="mt-3">
            <Donut data={customerActivity} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl px-3 py-3" style={{ backgroundColor: '#e9f5ee' }}>
              <p className="m-0 text-[0.72rem]" style={{ color: MUTED }}>
                Active Users
              </p>
              <p className="mt-1 m-0 text-[1.2rem] font-bold" style={{ color: INK }}>
                {metrics.customers.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl px-3 py-3" style={{ backgroundColor: '#f7efe0' }}>
              <p className="m-0 text-[0.72rem]" style={{ color: MUTED }}>
                Orders Today
              </p>
              <p className="mt-1 m-0 text-[1.2rem] font-bold" style={{ color: INK }}>
                {metrics.ordersToday}
              </p>
            </div>
          </div>
        </Card>

        <Card className="!flex !flex-col !p-3 sm:!p-4">
          <h2 className="m-0 text-[0.95rem] font-bold" style={{ color: INK }}>
            Marketing Performance
          </h2>
          <div
            className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[0.78rem]"
            style={{ color: MUTED }}
          >
            <span>
              Channels <strong style={{ color: INK }}>{marketingBars.length}</strong>
            </span>
            <span>
              Top <strong style={{ color: INK }}>{marketingBars[0]?.label ?? '—'}</strong>
            </span>
          </div>

          <div className="relative mt-auto min-h-[140px] flex-1 pt-8">
            <div className="pointer-events-none absolute inset-x-0 top-8 bottom-5 flex flex-col justify-between">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-px w-full" style={{ backgroundColor: 'rgba(10,46,34,0.08)' }} />
              ))}
            </div>
            <div className="relative flex h-full min-h-[120px] items-end justify-between gap-4 px-1 pb-5">
              {marketingBars.map((b) => (
                <div key={b.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <div className="flex min-h-0 w-full flex-1 items-end justify-center gap-1">
                    <div
                      className="w-2.5 rounded-sm"
                      style={{ height: `${b.a}%`, backgroundColor: '#2d6a4f', minHeight: 8 }}
                    />
                    <div
                      className="w-2.5 rounded-sm"
                      style={{ height: `${b.b}%`, backgroundColor: '#95d5b2', minHeight: 8 }}
                    />
                  </div>
                  <span className="shrink-0 text-[0.62rem] leading-none" style={{ color: MUTED }}>
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function PAGE_SOFT(tone: 'ok' | 'warn' | 'bad') {
  if (tone === 'ok') return '#f3faf5'
  if (tone === 'warn') return '#fff8f0'
  return '#fff5f4'
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    shipped: { bg: '#d8f3e0', fg: '#1b7a3e', label: 'Shipped' },
    processing: { bg: '#fde8d4', fg: '#b35c00', label: 'Processing' },
    completed: { bg: '#dceefc', fg: '#1a5f8a', label: 'Completed' },
    pending: { bg: '#f7efe0', fg: '#8a6a1a', label: 'Pending' },
    cancelled: { bg: '#f8d7d4', fg: '#a32020', label: 'Cancelled' },
  }
  const s = map[status] ?? map.pending!
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[0.68rem] font-semibold"
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  )
}
