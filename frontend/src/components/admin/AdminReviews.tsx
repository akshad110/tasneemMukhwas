import { useCallback, useEffect, useState } from 'react'
import { reviewsApi, type AdminReview } from '../../lib/services'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const CREAM = '#f2f4f5'
const MUTED = 'rgba(10,46,34,0.55)'
const CARD = '#ffffff'
const LINE = 'rgba(10,46,34,0.08)'

type Filter = 'all' | 'pending' | 'approved' | 'ignored'

const STATUS_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  pending: { bg: '#fde8d4', fg: '#b35c00', label: 'Pending' },
  approved: { bg: '#d8f3e0', fg: '#1b7a3e', label: 'Approved' },
  ignored: { bg: '#eceff1', fg: '#5f6b73', label: 'Ignored' },
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? GOLD : 'rgba(10,46,34,0.15)' }}>
          ★
        </span>
      ))}
    </span>
  )
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export default function AdminReviews() {
  const [filter, setFilter] = useState<Filter>('pending')
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [counts, setCounts] = useState({ pending: 0, approved: 0, ignored: 0, total: 0 })
  const [selected, setSelected] = useState<AdminReview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    return reviewsApi
      .adminList(filter)
      .then((res) => {
        setReviews(res.items)
        setCounts(res.counts)
        setSelected((prev) => {
          if (!res.items.length) return null
          if (prev) {
            const hit = res.items.find((r) => r.id === prev.id)
            if (hit) return hit
          }
          return res.items[0] ?? null
        })
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load reviews')
        setReviews([])
        setSelected(null)
      })
      .finally(() => setLoading(false))
  }, [filter])

  useEffect(() => {
    void load()
  }, [load])

  const setStatus = async (id: string, status: 'approved' | 'ignored' | 'pending') => {
    setUpdating(true)
    setError(null)
    try {
      const { review } = await reviewsApi.setStatus(id, status)
      const recount = await reviewsApi.adminList('all')
      setCounts(recount.counts)

      if (filter !== 'all' && review.status !== filter) {
        setReviews((prev) => {
          const next = prev.filter((r) => r.id !== id)
          setSelected(next[0] ?? null)
          return next
        })
      } else {
        setReviews((prev) => prev.map((r) => (r.id === id ? review : r)))
        setSelected(review)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update review')
    } finally {
      setUpdating(false)
    }
  }

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.total },
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'approved', label: 'Approved', count: counts.approved },
    { id: 'ignored', label: 'Ignored', count: counts.ignored },
  ]

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Review Management</h1>
          <p className="admin-page-sub max-w-xl">
            Moderate customer feedback. Approved reviews appear in the home page testimonials marquee.
          </p>
        </div>
        <div className="admin-toolbar">
          <button
            type="button"
            onClick={() => void load()}
            className="cursor-pointer rounded-xl border px-4 py-2 text-[0.78rem] font-semibold"
            style={{ borderColor: LINE, backgroundColor: CARD, color: INK }}
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 m-0 text-[0.85rem]" style={{ color: '#a32020' }}>
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2.5">
        {(['pending', 'approved', 'ignored'] as const).map((s) => {
          const st = STATUS_STYLE[s]
          return (
            <div
              key={s}
              className="min-w-[118px] rounded-xl border px-3 py-2.5"
              style={{
                backgroundColor: CARD,
                borderColor: LINE,
                boxShadow: '0 6px 16px -12px rgba(10,46,34,0.22)',
              }}
            >
              <p className="m-0 text-[0.68rem] font-medium capitalize leading-none" style={{ color: MUTED }}>
                {st.label}
              </p>
              <p className="mt-1.5 m-0 text-[1.15rem] font-bold leading-none" style={{ color: INK }}>
                {counts[s]}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = filter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className="cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.75rem] font-semibold transition"
              style={{
                borderColor: active ? GOLD : LINE,
                backgroundColor: active ? 'rgba(184,134,11,0.12)' : CARD,
                color: INK,
              }}
            >
              {f.label}
              <span className="ml-1.5 opacity-60">({f.count})</span>
            </button>
          )
        })}
      </div>

      {loading ? (
        <p className="mt-10 m-0 text-[0.9rem]" style={{ color: MUTED }}>
          Loading reviews…
        </p>
      ) : reviews.length === 0 ? (
        <div
          className="mt-8 rounded-2xl border px-6 py-14 text-center"
          style={{ backgroundColor: CARD, borderColor: LINE }}
        >
          <p className="m-0 text-[1rem] font-semibold" style={{ color: INK }}>
            No reviews in this queue
          </p>
          <p className="mt-2 m-0 text-[0.88rem]" style={{ color: MUTED }}>
            {filter === 'pending'
              ? 'New customer reviews will appear here for approval.'
              : 'Try another filter to see more reviews.'}
          </p>
        </div>
      ) : (
        <div className="admin-panel-grid admin-panel-grid--split mt-5">
          <div className="overflow-hidden rounded-2xl border" style={{ backgroundColor: CARD, borderColor: LINE }}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-[0.85rem]">
                <thead>
                  <tr style={{ backgroundColor: '#f3f8f4', color: MUTED }}>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Rating</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => {
                    const st = STATUS_STYLE[r.status ?? 'pending'] ?? STATUS_STYLE.pending
                    const active = selected?.id === r.id
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelected(r)}
                        className="cursor-pointer transition"
                        style={{
                          borderTop: `1px solid ${LINE}`,
                          backgroundColor: active ? 'rgba(184,134,11,0.08)' : undefined,
                        }}
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={r.authorAvatar}
                              alt=""
                              className="h-8 w-8 rounded-full border object-cover"
                              style={{ borderColor: LINE }}
                            />
                            <div>
                              <p className="m-0 font-semibold" style={{ color: INK }}>
                                {r.customerName}
                              </p>
                              <p className="m-0 text-[0.72rem]" style={{ color: MUTED }}>
                                {r.orderNumber}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5" style={{ color: INK }}>
                          {r.productName || '—'}
                        </td>
                        <td className="px-4 py-3.5">
                          <Stars rating={r.rating} />
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className="inline-block rounded-full px-2.5 py-1 text-[0.68rem] font-semibold"
                            style={{ backgroundColor: st.bg, color: st.fg }}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5" style={{ color: MUTED }}>
                          {formatDate(r.createdAt)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <aside
            className="rounded-2xl border p-5"
            style={{
              backgroundColor: CARD,
              borderColor: LINE,
              boxShadow: '0 18px 40px -28px rgba(10,46,34,0.25)',
            }}
          >
            {selected ? (
              <>
                <div className="flex items-start gap-3">
                  <img
                    src={selected.authorAvatar}
                    alt=""
                    className="h-14 w-14 rounded-full border object-cover"
                    style={{ borderColor: LINE }}
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="m-0 text-[1.1rem] font-bold" style={{ color: INK }}>
                      {selected.customerName}
                    </h2>
                    <p className="mt-0.5 m-0 truncate text-[0.78rem]" style={{ color: MUTED }}>
                      {selected.customerEmail}
                    </p>
                    <p className="mt-1 m-0 text-[0.75rem]" style={{ color: MUTED }}>
                      {selected.orderNumber} · {selected.productName}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <Stars rating={selected.rating} />
                  <span
                    className="rounded-full px-2.5 py-1 text-[0.68rem] font-semibold"
                    style={{
                      backgroundColor: STATUS_STYLE[selected.status ?? 'pending'].bg,
                      color: STATUS_STYLE[selected.status ?? 'pending'].fg,
                    }}
                  >
                    {STATUS_STYLE[selected.status ?? 'pending'].label}
                  </span>
                </div>

                <div
                  className="mt-5 rounded-xl border px-4 py-4"
                  style={{ borderColor: LINE, backgroundColor: '#f9fbf9' }}
                >
                  <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-wide" style={{ color: GOLD }}>
                    Review
                  </p>
                  <p className="mt-2 m-0 text-[0.92rem] leading-relaxed" style={{ color: INK }}>
                    {selected.comment?.trim() ||
                      `Customer rated ${selected.rating} stars for ${selected.productName}.`}
                  </p>
                </div>

                <p className="mt-3 m-0 text-[0.72rem]" style={{ color: MUTED }}>
                  Submitted {formatDate(selected.createdAt)}
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {selected.status !== 'approved' && (
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => void setStatus(selected.id, 'approved')}
                      className="flex-1 cursor-pointer rounded-xl border-0 px-4 py-2.5 text-[0.78rem] font-semibold disabled:opacity-60"
                      style={{ backgroundColor: INK, color: CREAM }}
                    >
                      Approve for testimonials
                    </button>
                  )}
                  {selected.status !== 'ignored' && (
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => void setStatus(selected.id, 'ignored')}
                      className="cursor-pointer rounded-xl border px-4 py-2.5 text-[0.78rem] font-semibold disabled:opacity-60"
                      style={{ borderColor: LINE, backgroundColor: 'transparent', color: INK }}
                    >
                      Ignore
                    </button>
                  )}
                  {selected.status !== 'pending' && (
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => void setStatus(selected.id, 'pending')}
                      className="cursor-pointer rounded-xl border px-4 py-2.5 text-[0.78rem] font-semibold disabled:opacity-60"
                      style={{ borderColor: LINE, backgroundColor: '#f3f8f4', color: MUTED }}
                    >
                      Reset to pending
                    </button>
                  )}
                </div>

                {selected.status === 'approved' && (
                  <p className="mt-4 m-0 rounded-lg px-3 py-2 text-[0.75rem]" style={{ backgroundColor: '#d8f3e0', color: '#1b7a3e' }}>
                    Live on home page testimonials marquee.
                  </p>
                )}
              </>
            ) : (
              <p className="m-0" style={{ color: MUTED }}>
                Select a review to moderate.
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
