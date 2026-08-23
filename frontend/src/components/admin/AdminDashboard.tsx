import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import {
  getCachedProductImages,
  queueAdminProductImage,
  resolveProductThumb,
  subscribeProductImages,
} from '../../lib/productImageCache'
import { dashboardApi, type DashboardData, type DashboardPeriod } from '../../lib/services'
import type { ShopProduct } from '../../lib/shopCatalog'

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function currentMonthPeriod(): Extract<DashboardPeriod, { mode: 'month' }> {
  const now = new Date()
  return { mode: 'month', year: now.getFullYear(), month: now.getMonth() + 1 }
}

function shiftMonth(year: number, month: number, delta: number) {
  const d = new Date(year, month - 1 + delta, 1)
  return { year: d.getFullYear(), month: d.getMonth() + 1 }
}

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

      {pts.map((p, i) => {
        const step = values.length > 16 ? Math.ceil(values.length / 8) : values.length > 12 ? 2 : 1
        if (i % step !== 0 && i !== values.length - 1) return null
        return (
          <text
            key={`${p.m}-${i}`}
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
        )
      })}

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

function DashboardPeriodPicker({
  period,
  onChange,
}: {
  period: DashboardPeriod
  onChange: (next: DashboardPeriod) => void
}) {
  const [monthOpen, setMonthOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState(() =>
    period.mode === 'month' ? period.year : new Date().getFullYear(),
  )
  const wrapRef = useRef<HTMLDivElement>(null)

  const anchor =
    period.mode === 'month' ? period : { year: new Date().getFullYear(), month: new Date().getMonth() + 1 }

  useEffect(() => {
    if (!monthOpen) return
    setPickerYear(period.mode === 'month' ? period.year : new Date().getFullYear())
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMonthOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [monthOpen, period])

  const goPrev = () => {
    const base = period.mode === 'month' ? period : currentMonthPeriod()
    onChange({ mode: 'month', ...shiftMonth(base.year, base.month, -1) })
  }

  const goNext = () => {
    const base = period.mode === 'month' ? period : currentMonthPeriod()
    onChange({ mode: 'month', ...shiftMonth(base.year, base.month, 1) })
  }

  const navBtn =
    'flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-[0.95rem] font-semibold transition hover:bg-white/80'

  return (
    <div
      ref={wrapRef}
      className="inline-flex items-center gap-0.5 rounded-full border px-1 py-0.5 text-[0.78rem] font-medium"
      style={{ borderColor: LINE, backgroundColor: '#f7faf8', color: INK }}
    >
      <button type="button" className={navBtn} onClick={goPrev} aria-label="Previous month">
        &lt;
      </button>

      <button
        type="button"
        className="cursor-pointer rounded-md border-0 px-2 py-1 transition hover:bg-white/80"
        style={{
          backgroundColor: period.mode === 'all' ? 'rgba(45,106,79,0.12)' : 'transparent',
          color: period.mode === 'all' ? '#2d6a4f' : MUTED,
          fontWeight: period.mode === 'all' ? 700 : 500,
        }}
        onClick={() => onChange({ mode: 'all' })}
      >
        all
      </button>

      <div className="relative">
        <button
          type="button"
          className="cursor-pointer rounded-md border-0 px-2 py-1 whitespace-nowrap transition hover:bg-white/80"
          style={{
            color: period.mode === 'month' ? INK : MUTED,
            fontWeight: period.mode === 'month' ? 600 : 500,
          }}
          onClick={() => setMonthOpen((o) => !o)}
          aria-expanded={monthOpen}
          aria-haspopup="listbox"
        >
          {MONTH_NAMES[anchor.month - 1]} {anchor.year}
        </button>

        {monthOpen && (
          <div
            className="absolute right-0 top-[calc(100%+6px)] z-[70] min-w-[220px] rounded-xl border p-3 shadow-lg"
            style={{ borderColor: LINE, backgroundColor: CARD }}
            role="listbox"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <button
                type="button"
                className={navBtn}
                style={{ color: INK }}
                onClick={() => setPickerYear((y) => y - 1)}
                aria-label="Previous year"
              >
                &lt;
              </button>
              <span className="text-[0.82rem] font-bold" style={{ color: INK }}>
                {pickerYear}
              </span>
              <button
                type="button"
                className={navBtn}
                style={{ color: INK }}
                onClick={() => setPickerYear((y) => y + 1)}
                aria-label="Next year"
              >
                &gt;
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {MONTH_SHORT.map((label, i) => {
                const month = i + 1
                const selected = period.mode === 'month' && period.year === pickerYear && period.month === month
                return (
                  <button
                    key={label}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className="cursor-pointer rounded-lg border-0 px-2 py-1.5 text-[0.72rem] font-medium transition hover:brightness-95"
                    style={{
                      backgroundColor: selected ? '#2d6a4f' : '#f3f7f4',
                      color: selected ? '#fff' : INK,
                    }}
                    onClick={() => {
                      onChange({ mode: 'month', year: pickerYear, month })
                      setMonthOpen(false)
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <button type="button" className={navBtn} onClick={goNext} aria-label="Next month">
        &gt;
      </button>
    </div>
  )
}

function DashboardProductThumb({ product }: { product: ShopProduct }) {
  const [src, setSrc] = useState<string | null>(() => resolveProductThumb(product) || null)

  useEffect(() => {
    const initial = resolveProductThumb(product)
    if (initial) {
      setSrc(initial)
    } else if (product.hasStoredImage !== false) {
      queueAdminProductImage(product.id)
    }

    return subscribeProductImages((id) => {
      if (id !== product.id) return
      const next = getCachedProductImages(product.id)[0]
      if (next) setSrc(next)
    })
  }, [product])

  if (!src) {
    return (
      <div
        className="h-10 w-10 shrink-0 rounded-lg animate-pulse"
        style={{ backgroundColor: '#f3f7f4' }}
        aria-hidden
      />
    )
  }

  return (
    <img
      src={src}
      alt=""
      className="h-10 w-10 shrink-0 rounded-lg object-contain"
      style={{ backgroundColor: '#f3f7f4' }}
    />
  )
}

function ProductSalesPanel({ products }: { products: DashboardData['topProducts'] }) {
  const [sortOrder, setSortOrder] = useState<'top' | 'least'>('top')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollHints, setScrollHints] = useState({ up: false, down: false })

  const sorted = [...products].sort((a, b) => {
    const unitsA = a.reviews ?? 0
    const unitsB = b.reviews ?? 0
    if (unitsA !== unitsB) return sortOrder === 'top' ? unitsB - unitsA : unitsA - unitsB
    const revA = a.sales ?? 0
    const revB = b.sales ?? 0
    if (revA !== revB) return sortOrder === 'top' ? revB - revA : revA - revB
    return a.name.localeCompare(b.name)
  })

  const refreshScrollHints = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const overflow = el.scrollHeight > el.clientHeight + 2
    setScrollHints({
      up: overflow && el.scrollTop > 2,
      down: overflow && el.scrollTop + el.clientHeight < el.scrollHeight - 2,
    })
  }, [])

  useEffect(() => {
    refreshScrollHints()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', refreshScrollHints, { passive: true })
    const ro = new ResizeObserver(refreshScrollHints)
    ro.observe(el)

    const onWheel = (e: WheelEvent) => {
      if (el.scrollHeight <= el.clientHeight + 2) return
      e.stopPropagation()
      const atTop = el.scrollTop <= 0
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        e.preventDefault()
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false, capture: true })

    return () => {
      el.removeEventListener('scroll', refreshScrollHints)
      el.removeEventListener('wheel', onWheel, { capture: true })
      ro.disconnect()
    }
  }, [sorted.length, sortOrder, refreshScrollHints])

  const toggleSort = () => setSortOrder((s) => (s === 'top' ? 'least' : 'top'))

  const scrollList = (dir: -1 | 1) => {
    scrollRef.current?.scrollBy({ top: dir * 76, behavior: 'smooth' })
  }

  const hintBtn =
    'pointer-events-auto flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-0 shadow-sm transition hover:brightness-95'

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h2 className="m-0 text-[1.05rem] font-bold" style={{ color: INK }}>
          {sortOrder === 'top' ? 'Top Selling Products' : 'Least Selling Products'}
        </h2>
        <button
          type="button"
          onClick={toggleSort}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 transition hover:brightness-95"
          style={{ backgroundColor: '#f3f7f4', color: INK }}
          title={sortOrder === 'top' ? 'Show least selling' : 'Show top selling'}
          aria-label={sortOrder === 'top' ? 'Sort by least selling' : 'Sort by top selling'}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 9l4-4 4 4M8 15l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="relative mt-4">
        {(scrollHints.up || scrollHints.down) && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-0.5">
            {scrollHints.up && (
              <button
                type="button"
                className={hintBtn}
                style={{ backgroundColor: '#fff', color: INK }}
                onClick={() => scrollList(-1)}
                aria-label="Scroll up"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 10l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div
          ref={scrollRef}
          className="max-h-[min(320px,42vh)] overflow-y-auto overscroll-y-contain touch-pan-y [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          onTouchMove={(e) => e.stopPropagation()}
        >
          <ul className="m-0 list-none space-y-3 p-0 pr-0.5">
            {sorted.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <DashboardProductThumb product={p} />
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-[0.85rem] font-semibold" style={{ color: INK }}>
                    {p.name}
                  </p>
                  <p className="m-0 text-[0.75rem]" style={{ color: MUTED }}>
                    ₹{(p.sales ?? 0).toLocaleString()}
                  </p>
                </div>
                <span
                  className="shrink-0 text-[0.75rem] font-semibold"
                  style={{ color: (p.reviews ?? 0) > 0 ? '#1b7a3e' : MUTED }}
                >
                  {(p.reviews ?? 0) > 0 ? `${p.reviews} sold` : '0 sold'}
                </span>
              </li>
            ))}
            {sorted.length === 0 && (
              <li className="text-[0.82rem]" style={{ color: MUTED }}>
                No products yet
              </li>
            )}
          </ul>
        </div>

        {(scrollHints.up || scrollHints.down) && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-0.5">
            {scrollHints.down && (
              <button
                type="button"
                className={hintBtn}
                style={{ backgroundColor: '#fff', color: INK }}
                onClick={() => scrollList(1)}
                aria-label="Scroll down"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        )}

        {scrollHints.down && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b-2xl"
            style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.95), transparent)' }}
            aria-hidden
          />
        )}
        {scrollHints.up && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-8 rounded-t-2xl"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), transparent)' }}
            aria-hidden
          />
        )}
      </div>
    </>
  )
}

/** Dashboard — reference layout with brand light-green / gold accents. */
export default function AdminDashboard() {
  const [period, setPeriod] = useState<DashboardPeriod>({ mode: 'all' })
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const periodKey =
    period.mode === 'month' ? `month:${period.year}:${period.month}` : 'all'

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    dashboardApi
      .get(period, controller.signal)
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((err) => {
        if (cancelled || controller.signal.aborted) return
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [periodKey, reloadKey])

  const retry = () => setReloadKey((k) => k + 1)

  if (loading && !data) {
    return (
      <div>
        <div className="admin-page-head">
          <h1 className="admin-page-title tracking-tight">Dashboard</h1>
          <div className="admin-toolbar">
            <DashboardPeriodPicker period={period} onChange={setPeriod} />
          </div>
        </div>
        <p className="mt-4 m-0 text-[0.95rem]" style={{ color: MUTED }}>
          Loading dashboard…
        </p>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div>
        <div className="admin-page-head">
          <h1 className="admin-page-title tracking-tight">Dashboard</h1>
          <div className="admin-toolbar">
            <DashboardPeriodPicker period={period} onChange={setPeriod} />
          </div>
        </div>
        <p className="mt-4 m-0 text-[0.95rem]" style={{ color: '#a32020' }}>
          {error}
        </p>
        <button
          type="button"
          onClick={retry}
          className="mt-4 cursor-pointer rounded-xl border-0 px-4 py-2.5 text-[0.85rem] font-semibold"
          style={{ backgroundColor: INK, color: '#f2f4f5' }}
        >
          Try again
        </button>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const {
    metrics,
    salesByMonth,
    inventoryStatus,
    shipmentBreakdown,
    customerActivity,
    marketingBars,
    topProducts,
    recentOrders,
    periodLabel,
  } = data

  const isMonthView = period.mode === 'month'
  const ordersLabel = isMonthView ? 'Orders This Month' : 'Orders Today'
  const customersLabel = isMonthView ? 'Customers This Month' : 'Total Customers'
  const salesLabel = isMonthView ? 'Sales This Month' : 'Total Sales'
  const chartBadge = isMonthView ? 'Daily' : 'Monthly'

  return (
    <div>
      <div className="admin-page-head">
        <h1 className="admin-page-title tracking-tight">Dashboard</h1>
        <div className="admin-toolbar">
          <DashboardPeriodPicker period={period} onChange={setPeriod} />
        </div>
      </div>
      {periodLabel && (
        <p className="mt-1.5 m-0 text-[0.75rem] font-medium" style={{ color: MUTED }}>
          Showing {periodLabel}
          {loading ? ' · updating…' : ''}
        </p>
      )}

      {/* Metrics */}
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={salesLabel}
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
          label={ordersLabel}
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
          label="Total Products"
          value={String(metrics.totalProducts)}
          tint="#f7efe0"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" />
              <path d="M12 12v8M4 8.5l8 3.5 8-3.5" />
            </svg>
          }
        />
        <MetricCard
          label={customersLabel}
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
              {chartBadge}
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
          <ProductSalesPanel products={topProducts} />
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
              {isMonthView ? 'This month' : 'All time'}
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
                {ordersLabel}
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
