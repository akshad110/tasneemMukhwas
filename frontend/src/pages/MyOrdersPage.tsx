import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/nav/Navbar'
import { useAuth } from '../context/AuthContext'
import { ApiRequestError } from '../lib/api'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'
import {
  ordersApi,
  reviewsApi,
  type AdminOrder,
} from '../lib/services'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const CREAM = '#f3e6c8'
const PAGE = '#f4f7f5'
const CARD = '#ffffff'
const MUTED = 'rgba(10,46,34,0.55)'
const LINE = 'rgba(10,46,34,0.08)'

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  shipped: { bg: '#d8f3e0', fg: '#1b7a3e' },
  processing: { bg: '#fde8d4', fg: '#b35c00' },
  completed: { bg: '#dceefc', fg: '#1a5f8a' },
  pending: { bg: '#f7efe0', fg: '#8a6a1a' },
  cancelled: { bg: '#f8d7d4', fg: '#a32020' },
}

const FLOW: AdminOrder['status'][] = ['pending', 'processing', 'shipped', 'completed']

type ReviewTarget = {
  orderId: string
  productId: string
  productName: string
  image?: string
}

function OrderTracker({ status }: { status: AdminOrder['status'] }) {
  const fullyDone = status === 'completed'
  const cur = status === 'cancelled' ? -1 : FLOW.indexOf(status)

  return (
    <ol className="m-0 flex list-none items-start p-0">
      {FLOW.map((s, i) => {
        const done = fullyDone || cur > i
        const active = !fullyDone && cur === i

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
                      backgroundColor: fullyDone || cur > i ? '#067d62' : '#d5d9d9',
                    }}
                    aria-hidden
                  />
                )}
              </div>
              <p
                className="mt-2 m-0 max-w-[4.5rem] text-center text-[0.62rem] font-semibold capitalize leading-tight sm:text-[0.68rem]"
                style={{ color: done || active ? INK : MUTED }}
              >
                {s}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function ReviewModal({
  target,
  onClose,
  onSaved,
}: {
  target: ReviewTarget
  onClose: () => void
  onSaved: () => void
}) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    if (rating < 1) {
      setError('Please select a star rating')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await reviewsApi.create({
        orderId: target.orderId,
        productId: target.productId,
        rating,
        comment: comment.trim(),
      })
      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not save review')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal
      aria-labelledby="review-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-5 sm:p-6"
        style={{ backgroundColor: CARD, borderColor: LINE }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="review-title" className="m-0 text-[1.2rem] font-bold" style={{ color: INK }}>
          Review product
        </h2>
        <p className="mt-1 m-0 text-[0.88rem]" style={{ color: MUTED }}>
          {target.productName}
        </p>

        <div className="mt-5 flex gap-1.5" role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = (hover || rating) >= n
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n === 1 ? '' : 's'}`}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                className="cursor-pointer border-0 bg-transparent p-0 text-[1.75rem] leading-none transition"
                style={{ color: filled ? GOLD : 'rgba(10,46,34,0.2)' }}
              >
                ★
              </button>
            )
          })}
        </div>

        <label className="mt-5 block">
          <span className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-wide" style={{ color: GOLD }}>
            Your review
          </span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="Share what you liked — this may appear in testimonials later."
            className="w-full resize-y rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none focus:border-[#b8860b]/70"
            style={{ borderColor: LINE, color: INK, fontFamily: 'Inter, sans-serif' }}
          />
        </label>

        {error && (
          <p className="mt-3 m-0 text-[0.82rem]" style={{ color: '#a32020' }}>
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-xl border px-4 py-2.5 text-[0.8rem] font-semibold"
            style={{ borderColor: LINE, color: INK, backgroundColor: 'transparent' }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={submit}
            className="flex-1 cursor-pointer rounded-xl border-0 px-4 py-2.5 text-[0.8rem] font-semibold disabled:opacity-60"
            style={{ backgroundColor: INK, color: CREAM }}
          >
            {saving ? 'Saving…' : 'Submit review'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [selected, setSelected] = useState<AdminOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null)

  const load = () => {
    setLoading(true)
    setError(null)
    ordersApi
      .mine()
      .then((res) => {
        setOrders(res.items)
        setSelected((prev) => {
          if (!res.items.length) return null
          if (prev) {
            const updated = res.items.find((o) => o.id === prev.id)
            if (updated) return updated
          }
          return res.items[0]
        })
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load orders')
        setOrders([])
        setSelected(null)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    document.title = 'My Orders · Tasneem Mukhwas'
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Tasneem Mukhwas'
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigateApp(APP_ROUTES.login)
      return
    }
    load()
  }, [user, authLoading])

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE, fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <motion.button
          type="button"
          onClick={() => navigateApp(APP_ROUTES.profile)}
          className="group mb-6 inline-flex cursor-pointer items-center gap-3 border-0 bg-transparent px-0 py-1"
          style={{ fontFamily: 'Inter, sans-serif' }}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          aria-label="Back to profile"
        >
          <span
            className="flex h-8 w-8 items-center justify-center border transition group-hover:border-[rgba(184,134,11,0.9)]"
            style={{
              borderRadius: 0,
              borderColor: LINE,
              backgroundColor: CARD,
              color: INK,
            }}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="flex flex-col items-start gap-0.5 text-left">
            <span
              className="text-[0.62rem] font-semibold tracking-[0.16em] uppercase"
              style={{ color: GOLD }}
            >
              Return
            </span>
            <span className="text-[0.88rem] font-semibold" style={{ color: INK }}>
              Back to profile
            </span>
          </span>
        </motion.button>

        <h1 className="m-0 text-[1.85rem] font-bold" style={{ color: INK }}>
          My Orders
        </h1>
        <p className="mt-1.5 m-0 text-[0.9rem]" style={{ color: MUTED }}>
          Track fulfillment and review products after delivery.
        </p>

        {loading || authLoading ? (
          <p className="mt-10 m-0 text-[0.95rem]" style={{ color: MUTED }}>
            Loading orders…
          </p>
        ) : error ? (
          <div className="mt-8 rounded-2xl border px-5 py-8" style={{ borderColor: LINE, backgroundColor: CARD }}>
            <p className="m-0" style={{ color: '#a32020' }}>
              {error}
            </p>
            <button
              type="button"
              onClick={load}
              className="mt-4 cursor-pointer border-0 bg-transparent p-0 text-[0.85rem] font-semibold underline"
              style={{ color: GOLD }}
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-2xl border px-6 py-16 text-center" style={{ borderColor: LINE, backgroundColor: CARD }}>
            <p className="m-0 text-[1.05rem] font-semibold" style={{ color: INK }}>
              No orders yet
            </p>
            <p className="mt-2 m-0 text-[0.9rem]" style={{ color: MUTED }}>
              Place an order while signed in to track it here.
            </p>
            <button
              type="button"
              onClick={() => navigateApp(APP_ROUTES.shop)}
              className="mt-6 cursor-pointer rounded-xl border-0 px-6 py-3 text-[0.8rem] font-semibold uppercase"
              style={{ backgroundColor: INK, color: CREAM }}
            >
              Browse shop
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: LINE, backgroundColor: CARD }}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left text-[0.85rem]">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                      {['Order', 'Date', 'Items', 'Total', 'Status'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-wide"
                          style={{ color: MUTED }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => {
                      const st = STATUS_STYLE[o.status] ?? STATUS_STYLE.pending
                      const active = selected?.id === o.id
                      return (
                        <tr
                          key={o.id}
                          onClick={() => setSelected(o)}
                          className="cursor-pointer transition"
                          style={{
                            borderBottom: `1px solid ${LINE}`,
                            backgroundColor: active ? 'rgba(184,134,11,0.08)' : undefined,
                          }}
                        >
                          <td className="px-4 py-3.5 font-semibold" style={{ color: INK }}>
                            {o.id}
                          </td>
                          <td className="px-4 py-3.5" style={{ color: MUTED }}>
                            {o.date}
                          </td>
                          <td className="px-4 py-3.5" style={{ color: INK }}>
                            {o.items}
                          </td>
                          <td className="px-4 py-3.5 font-semibold" style={{ color: GOLD }}>
                            ₹{o.total}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className="inline-block rounded-full px-2.5 py-1 text-[0.68rem] font-semibold capitalize"
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
            </div>

            <aside className="rounded-2xl border p-5" style={{ backgroundColor: CARD, borderColor: LINE }}>
              {selected ? (
                <>
                  <h2 className="m-0 text-[1.15rem] font-bold" style={{ color: INK }}>
                    {selected.id}
                  </h2>
                  <p className="mt-1 m-0 text-[0.85rem]" style={{ color: MUTED }}>
                    {selected.date} · {selected.payment.toUpperCase()}
                    {selected.tracking ? ` · ${selected.tracking}` : ''}
                  </p>

                  <div className="mt-5">
                    <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-wide" style={{ color: GOLD }}>
                      Fulfillment
                    </p>
                    <div className="mt-4">
                      <OrderTracker status={selected.status} />
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-5" style={{ borderColor: LINE }}>
                    <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-wide" style={{ color: GOLD }}>
                      Items
                    </p>
                    <ul className="mt-3 m-0 list-none space-y-3 p-0">
                      {(selected.lineItems ?? []).map((item) => (
                        <li
                          key={`${selected.id}-${item.productId}-${item.variantId}`}
                          className="flex gap-3 border-b pb-3 last:border-b-0"
                          style={{ borderColor: LINE }}
                        >
                          <div
                            className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
                            style={{ borderColor: LINE, backgroundColor: '#f7f1e4' }}
                          >
                            {item.image ? (
                              <img src={item.image} alt="" className="h-[80%] w-auto object-contain" />
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="m-0 truncate text-[0.88rem] font-semibold" style={{ color: INK }}>
                              {item.name}
                            </p>
                            <p className="mt-0.5 m-0 text-[0.75rem]" style={{ color: MUTED }}>
                              {item.qty}× · {item.variantLabel ?? 'Default'} · ₹{item.lineTotal}
                            </p>
                            {selected.status === 'completed' && (
                              <div className="mt-2">
                                {item.reviewed ? (
                                  <span className="text-[0.72rem] font-semibold" style={{ color: '#1b7a3e' }}>
                                    Reviewed ✓
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setReviewTarget({
                                        orderId: selected.id,
                                        productId: item.productId,
                                        productName: item.name,
                                        image: item.image,
                                      })
                                    }
                                    className="cursor-pointer border-0 bg-transparent p-0 text-[0.72rem] font-semibold underline-offset-2 hover:underline"
                                    style={{ color: GOLD }}
                                  >
                                    Review our product
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <dl className="mt-5 space-y-2 text-[0.85rem]">
                    <div className="flex justify-between">
                      <dt style={{ color: MUTED }}>Subtotal</dt>
                      <dd className="m-0 font-semibold" style={{ color: INK }}>
                        ₹{selected.subtotal ?? selected.total}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt style={{ color: MUTED }}>Delivery</dt>
                      <dd className="m-0 font-semibold" style={{ color: INK }}>
                        ₹{selected.deliveryFee ?? 0}
                      </dd>
                    </div>
                    <div className="flex justify-between border-t pt-2" style={{ borderColor: LINE }}>
                      <dt className="font-semibold" style={{ color: INK }}>
                        Total
                      </dt>
                      <dd className="m-0 font-bold" style={{ color: GOLD }}>
                        ₹{selected.total}
                      </dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p className="m-0" style={{ color: MUTED }}>
                  Select an order to see tracking.
                </p>
              )}
            </aside>
          </div>
        )}
      </main>

      {reviewTarget && (
        <ReviewModal
          target={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSaved={load}
        />
      )}
    </div>
  )
}
