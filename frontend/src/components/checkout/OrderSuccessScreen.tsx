import { motion } from 'framer-motion'
import { useMemo } from 'react'
import BackToHomeButton from '../shared/BackToHomeButton'
import { BRAND_TEXTURE } from '../../lib/brand'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { ordersApi, type AuthUser } from '../../lib/services'
import { ApiRequestError } from '../../lib/api'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const EASE = [0.22, 1, 0.36, 1] as const

type PaymentMethod = 'cod' | 'razorpay'

type OrderSuccessScreenProps = {
  orderId: string
  invoiceNo: string
  invoiceReady: boolean
  paidVia: PaymentMethod | null
  orderTotal: number
  user: AuthUser | null
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M5 12.5 10 17l9-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CelebrationLayer() {
  const confetti = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) => ({
        id: i,
        x: (i * 11.3 + 3) % 100,
        delay: (i % 10) * 0.08,
        duration: 2.6 + (i % 6) * 0.4,
        w: i % 5 === 0 ? 11 : i % 3 === 0 ? 7 : 9,
        h: i % 4 === 1 ? 15 : 9,
        color: [GOLD, INK, '#1b7a3e', '#d4a017', '#fff', '#c9971c'][i % 6]!,
        drift: -50 + (i % 19) * 6,
        rot: (i * 53) % 360,
        round: i % 4 === 0,
      })),
    [],
  )

  const sparkles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: 4 + ((i * 17) % 92),
        y: 6 + ((i * 13) % 88),
        delay: 0.15 + i * 0.1,
        size: 3 + (i % 4) * 2,
      })),
    [],
  )

  return (
    <div className="order-celebrate-layer" aria-hidden>
      {confetti.map((c) => (
        <motion.span
          key={c.id}
          className="order-celebrate-confetti"
          style={{
            left: `${c.x}%`,
            width: c.w,
            height: c.h,
            borderRadius: c.round ? '50%' : 2,
            backgroundColor: c.color,
          }}
          initial={{ y: '-10vh', x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: '110vh',
            x: [0, c.drift * 0.35, c.drift],
            opacity: [0, 1, 1, 0.7, 0],
            rotate: [0, c.rot * 0.6, c.rot],
          }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            ease: 'linear',
            repeat: Infinity,
            repeatDelay: 1.4 + (c.id % 5) * 0.25,
          }}
        />
      ))}

      {sparkles.map((s) => (
        <motion.span
          key={`spark-${s.id}`}
          className="order-celebrate-sparkle"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.6, 0] }}
          transition={{ duration: 1.2, delay: s.delay, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}
    </div>
  )
}

const STEPS = [
  { key: 'confirmed', label: 'Order confirmed', detail: 'We received your order' },
  { key: 'processing', label: 'Preparing', detail: 'Packed with care' },
  { key: 'shipping', label: 'On the way', detail: 'Delivered to your door' },
] as const

export default function OrderSuccessScreen({
  orderId,
  invoiceNo,
  invoiceReady,
  paidVia,
  orderTotal,
  user,
}: OrderSuccessScreenProps) {
  const paymentLabel =
    paidVia === 'cod' ? 'Cash on Delivery' : paidVia === 'razorpay' ? 'Paid · Razorpay' : 'Confirmed'

  const activeStep = paidVia === 'razorpay' ? 1 : 0

  const detailRows = [
    orderId ? { label: 'Order ID', value: orderId } : null,
    invoiceNo ? { label: 'Invoice', value: invoiceNo } : null,
    { label: 'Payment', value: paymentLabel },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div className="order-success-wrap">
      <CelebrationLayer />

      <div className="order-success-inner">
        <BackToHomeButton className="mb-6" />

        <motion.div
          className="order-success-split"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Left — celebration hero */}
          <aside className="order-success-hero">
            <div className="order-success-hero__texture" aria-hidden>
              <img
                src={BRAND_TEXTURE}
                alt=""
                className="order-success-hero__texture-img"
              />
              <div className="order-success-hero__overlay" />
            </div>

            <div className="order-success-hero__content">

          <motion.span
            className="order-success-stamp"
            initial={{ opacity: 0, rotate: -24, scale: 0.6 }}
            animate={{ opacity: 1, rotate: -12, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.35 }}
          >
            Confirmed
          </motion.span>

          <motion.div
            className="order-success-orb"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 14, delay: 0.15 }}
          >
            <span className="order-success-orb__ring" aria-hidden />
            <span className="order-success-orb__ring order-success-orb__ring--2" aria-hidden />
            <CheckIcon className="relative z-[2] h-9 w-9" />
          </motion.div>

          <motion.p
            className="order-success-hero__eyebrow"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            Celebration time
          </motion.p>
          <motion.h1
            className="order-success-hero__title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
          >
            You&apos;re
            <br />
            all set!
          </motion.h1>
          <motion.p
            className="order-success-hero__copy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.56 }}
          >
            {paidVia === 'cod'
              ? 'Your Cash on Delivery order is locked in. Sit back — we will notify you when it ships.'
              : 'Payment received. Your Tasneem Mukhwas order is being prepared with care.'}
          </motion.p>

          <ol className="order-success-rail" aria-label="Order progress">
            {STEPS.map((step, i) => {
              const done = i < activeStep
              const current = i === activeStep
              return (
                <motion.li
                  key={step.key}
                  className={`order-success-rail__item ${current ? 'order-success-rail__item--current' : ''} ${done ? 'order-success-rail__item--done' : ''}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.62 + i * 0.1 }}
                >
                  <span className="order-success-rail__marker" aria-hidden>
                    {done ? <CheckIcon className="h-3 w-3" /> : null}
                  </span>
                  <span className="order-success-rail__text">
                    <span className="order-success-rail__label">{step.label}</span>
                    <span className="order-success-rail__detail">{step.detail}</span>
                  </span>
                </motion.li>
              )
            })}
            </ol>
            </div>
          </aside>

        {/* Right — ticket panel */}
        <div className="order-success-ticket">
          <div className="order-success-ticket__notch order-success-ticket__notch--top" aria-hidden />
          <div className="order-success-ticket__notch order-success-ticket__notch--bottom" aria-hidden />

          <div className="order-success-ticket__body">
            <motion.header
              className="order-success-ticket__head"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <span className="order-success-ticket__kicker">Receipt</span>
              <h2 className="order-success-ticket__heading">Order summary</h2>
            </motion.header>

            <motion.dl
              className="order-success-ticket__grid"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              {detailRows.map((row) => (
                <div key={row.label} className="order-success-ticket__row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </motion.dl>

            {orderTotal > 0 ? (
              <motion.div
                className="order-success-total"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65, type: 'spring', stiffness: 220, damping: 18 }}
              >
                <span className="order-success-total__label">Total paid</span>
                <span className="order-success-total__amount">
                  ₹{orderTotal.toLocaleString('en-IN')}
                </span>
              </motion.div>
            ) : null}

            <motion.div
              className="order-success-ticket__actions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72 }}
            >
              <button
                type="button"
                onClick={() => navigateApp(APP_ROUTES.myOrders)}
                className="order-success-btn order-success-btn--gold order-success-ticket__cta"
              >
                Track my order
              </button>

              <div className="order-success-ticket__action-row">
                {invoiceReady && orderId ? (
                  user ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          void ordersApi
                            .downloadInvoice(orderId, `Invoice-${invoiceNo || orderId}.pdf`)
                            .catch((err) => {
                              alert(
                                err instanceof ApiRequestError
                                  ? err.message
                                  : 'Could not download invoice. Please try again.',
                              )
                            })
                        }}
                        className="order-success-btn order-success-btn--ink"
                      >
                        Invoice
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateApp(APP_ROUTES.shop)}
                        className="order-success-btn order-success-btn--ghost"
                      >
                        Continue shopping
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => navigateApp(APP_ROUTES.login)}
                        className="order-success-btn order-success-btn--ink"
                      >
                        Sign in
                      </button>
                      <button
                        type="button"
                        onClick={() => navigateApp(APP_ROUTES.shop)}
                        className="order-success-btn order-success-btn--ghost"
                      >
                        Continue shopping
                      </button>
                    </>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => navigateApp(APP_ROUTES.shop)}
                    className="order-success-btn order-success-btn--ghost order-success-ticket__action-full"
                  >
                    Continue shopping
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  )
}
