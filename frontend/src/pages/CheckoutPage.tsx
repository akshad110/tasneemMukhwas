import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import {
  CheckoutFlowShell,
  CheckoutFlowStepperBar,
} from '../components/checkout/CheckoutFlow'
import Navbar from '../components/nav/Navbar'
import { useCart } from '../context/CartContext'
import { ApiRequestError } from '../lib/api'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'
import { ordersApi } from '../lib/services'

const INK = '#0a2e22'
const CREAM = '#f3e6c8'
const GOLD = '#b8860b'
const DELIVERY_FEE = 49

const LINE = 'rgba(243,230,200,0.35)'
const MUTED = 'rgba(243,230,200,0.62)'
const CARD_BG = 'rgba(7,26,20,0.92)'

type PaymentMethod = 'cod' | 'razorpay'
type PayStep = 'form' | 'pay' | 'done'

type FormState = {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  country: string
  postal: string
  phone: string
  agreed: boolean
}

const EMPTY: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  country: 'India',
  postal: '',
  phone: '',
  agreed: false,
}

function LockIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M5 12.5 10 17l9-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Minimal underline field — no glass / no boxed inputs. */
function UnderlineField({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span
        className="mb-2 block text-[0.72rem] font-medium tracking-wide"
        style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
      >
        {label}
      </span>
      {children}
    </label>
  )
}

const underlineInput =
  'w-full border-0 border-b bg-transparent px-0 pb-2.5 pt-0.5 text-[0.95rem] outline-none transition placeholder:text-[rgba(243,230,200,0.28)] focus:border-[rgba(184,134,11,0.85)]'
const underlineStyle = {
  borderBottomColor: LINE,
  color: CREAM,
  fontFamily: 'Inter, sans-serif',
  borderRadius: 0,
} as const

/** Checkout — underline form (brand theme) + sharp-border cart review. */
export default function CheckoutPage() {
  const { items, itemCount, subtotal, clearCart } = useCart()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [step, setStep] = useState<PayStep>('form')
  const [payment, setPayment] = useState<PaymentMethod | null>(null)
  const [error, setError] = useState('')
  const [paidVia, setPaidVia] = useState<PaymentMethod | null>(null)
  const [placing, setPlacing] = useState(false)
  const [orderId, setOrderId] = useState('')

  const shipping = items.length > 0 ? DELIVERY_FEE : 0
  const total = subtotal + shipping

  useEffect(() => {
    document.title = 'Checkout · Tasneem Mukhwas'
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Tasneem Mukhwas'
    }
  }, [])

  useEffect(() => {
    if (step !== 'done' && items.length === 0) {
      navigateApp(APP_ROUTES.cart)
    }
  }, [items.length, step])

  const set =
    (key: keyof FormState) =>
    (value: string | boolean) =>
      setForm((f) => ({ ...f, [key]: value }))

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Please enter your first and last name.')
      return false
    }
    if (!form.email.trim() || !form.phone.trim()) {
      setError('Please fill email and phone.')
      return false
    }
    if (!form.address.trim() || !form.city.trim() || !form.postal.trim()) {
      setError('Please complete address, city, and postal code.')
      return false
    }
    if (!form.agreed) {
      setError('Please agree to the Terms and Conditions.')
      return false
    }
    setError('')
    return true
  }

  const onPayNow = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setPayment(null)
    setStep('pay')
  }

  const confirmPayment = async (method: PaymentMethod) => {
    if (!items.length || placing) return
    setPayment(method)
    setPlacing(true)
    setError('')
    try {
      const result = await ordersApi.create({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        country: form.country.trim() || 'India',
        postal: form.postal.trim(),
        payment: method,
        deliveryFee: DELIVERY_FEE,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          qty: i.qty,
        })),
      })
      setPaidVia(method)
      setOrderId(result.order.id)
      clearCart()
      setStep('done')
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not place order')
      setStep('form')
    } finally {
      setPlacing(false)
    }
  }

  if (step === 'done') {
    return (
      <CheckoutFlowShell>
        <Navbar />
        <CheckoutFlowStepperBar step={3} />
        <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full border px-8 py-12"
            style={{
              borderRadius: 0,
              borderColor: LINE,
              backgroundColor: CARD_BG,
            }}
          >
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center"
              style={{ borderRadius: 0, backgroundColor: GOLD, color: INK }}
            >
              <CheckIcon className="h-6 w-6" />
            </div>
            <h1
              className="mt-5 m-0 text-[1.75rem] font-bold"
              style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
            >
              Order placed
            </h1>
            <p className="mt-2 m-0 text-[0.95rem]" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
              {orderId ? `Order ${orderId}. ` : ''}
              {paidVia === 'cod'
                ? 'Cash on Delivery selected. We will confirm your order shortly.'
                : 'Razorpay selected. Payment recorded — gateway integration can be added next.'}
            </p>
            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => navigateApp(APP_ROUTES.shop)}
                className="cursor-pointer border-0 px-6 py-3 text-[0.8rem] font-semibold uppercase transition hover:brightness-110"
                style={{ borderRadius: 0, backgroundColor: GOLD, color: INK, fontFamily: 'Inter, sans-serif' }}
              >
                Continue shopping
              </button>
              <button
                type="button"
                onClick={() => navigateApp(APP_ROUTES.home)}
                className="cursor-pointer border px-6 py-3 text-[0.8rem] font-semibold uppercase transition hover:bg-white/5"
                style={{
                  borderRadius: 0,
                  borderColor: LINE,
                  backgroundColor: 'transparent',
                  color: CREAM,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Home
              </button>
            </div>
          </motion.div>
        </div>
      </CheckoutFlowShell>
    )
  }

  return (
    <CheckoutFlowShell>
      <Navbar />
      <CheckoutFlowStepperBar step={3} />

      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.85fr)] lg:gap-12 lg:px-8 lg:py-12">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            type="button"
            onClick={() => navigateApp(APP_ROUTES.cart)}
            className="group mb-6 inline-flex cursor-pointer items-center gap-3 border-0 bg-transparent px-0 py-1"
            style={{
              fontFamily: 'Inter, sans-serif',
            }}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          >
            <span
              className="flex h-8 w-8 items-center justify-center border transition group-hover:border-[rgba(184,134,11,0.9)]"
              style={{
                borderRadius: 0,
                borderColor: 'rgba(243,230,200,0.35)',
                backgroundColor: CREAM,
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
              <span className="text-[0.88rem] font-semibold" style={{ color: CREAM }}>
                Back to cart
              </span>
            </span>
          </motion.button>

          <h1
            className="m-0 text-[2.25rem] font-bold tracking-tight sm:text-[2.6rem]"
            style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
          >
            Checkout
          </h1>

          <form id="checkout-form" onSubmit={onPayNow} className="mt-10 space-y-8">
            {/* No glass panel — open underline fields */}
            <div className="grid gap-8 sm:grid-cols-2">
              <UnderlineField label="First Name">
                <input
                  required
                  className={underlineInput}
                  style={underlineStyle}
                  value={form.firstName}
                  onChange={(e) => set('firstName')(e.target.value)}
                  autoComplete="given-name"
                />
              </UnderlineField>
              <UnderlineField label="Last Name">
                <input
                  required
                  className={underlineInput}
                  style={underlineStyle}
                  value={form.lastName}
                  onChange={(e) => set('lastName')(e.target.value)}
                  autoComplete="family-name"
                />
              </UnderlineField>
            </div>

            <UnderlineField label="Email">
              <input
                required
                type="email"
                className={underlineInput}
                style={underlineStyle}
                value={form.email}
                onChange={(e) => set('email')(e.target.value)}
                autoComplete="email"
              />
            </UnderlineField>

            <UnderlineField label="Address">
              <input
                required
                className={underlineInput}
                style={underlineStyle}
                value={form.address}
                onChange={(e) => set('address')(e.target.value)}
                autoComplete="street-address"
              />
            </UnderlineField>

            <div className="grid gap-8 sm:grid-cols-2">
              <UnderlineField label="City">
                <input
                  required
                  className={underlineInput}
                  style={underlineStyle}
                  value={form.city}
                  onChange={(e) => set('city')(e.target.value)}
                  autoComplete="address-level2"
                />
              </UnderlineField>
              <UnderlineField label="Country">
                <select
                  className={underlineInput}
                  style={{ ...underlineStyle, appearance: 'none' as const }}
                  value={form.country}
                  onChange={(e) => set('country')(e.target.value)}
                >
                  <option style={{ backgroundColor: INK, color: CREAM }}>India</option>
                  <option style={{ backgroundColor: INK, color: CREAM }}>United Arab Emirates</option>
                  <option style={{ backgroundColor: INK, color: CREAM }}>United States</option>
                  <option style={{ backgroundColor: INK, color: CREAM }}>United Kingdom</option>
                  <option style={{ backgroundColor: INK, color: CREAM }}>Other</option>
                </select>
              </UnderlineField>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <UnderlineField label="Postal Code">
                <input
                  required
                  className={underlineInput}
                  style={underlineStyle}
                  value={form.postal}
                  onChange={(e) => set('postal')(e.target.value)}
                  autoComplete="postal-code"
                />
              </UnderlineField>
              <UnderlineField label="Phone Number">
                <input
                  required
                  type="tel"
                  className={underlineInput}
                  style={underlineStyle}
                  value={form.phone}
                  onChange={(e) => set('phone')(e.target.value)}
                  placeholder="+91"
                  autoComplete="tel"
                />
              </UnderlineField>
            </div>

            <label className="flex cursor-pointer items-start gap-3 pt-2">
              <input
                type="checkbox"
                checked={form.agreed}
                onChange={(e) => set('agreed')(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#b8860b]"
              />
              <span className="text-[0.82rem] leading-snug" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
                I have read and agree to the Terms and Conditions.
              </span>
            </label>

            {error && (
              <p className="m-0 text-[0.82rem] font-medium" style={{ color: '#f0a8a0', fontFamily: 'Inter, sans-serif' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full cursor-pointer border-0 py-3.5 text-[0.9rem] font-semibold transition hover:brightness-110 lg:hidden"
              style={{ borderRadius: 0, backgroundColor: GOLD, color: INK, fontFamily: 'Inter, sans-serif' }}
            >
              Pay Now · ₹{total}
            </button>
          </form>

          <AnimatePresence>
            {step === 'pay' && (
              <motion.div
                className="mt-8 border p-5 sm:p-6 lg:hidden"
                style={{ borderRadius: 0, borderColor: LINE, backgroundColor: CARD_BG }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <PaymentChooser
                  payment={payment}
                  onSelect={setPayment}
                  onConfirm={confirmPayment}
                  total={total}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Sharp-border review card */}
        <motion.aside
          className="lg:sticky lg:top-8 lg:self-start"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="border p-5 sm:p-6"
            style={{
              borderRadius: 0,
              borderColor: CREAM,
              borderWidth: 1.5,
              backgroundColor: CARD_BG,
            }}
          >
            <h2
              className="m-0 text-[1.15rem] font-bold"
              style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
            >
              Review your cart
            </h2>
            <p className="mt-1 m-0 text-[0.78rem]" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
              {itemCount} item{itemCount === 1 ? '' : 's'}
            </p>

            <ul className="mt-5 space-y-4">
              {items.map((item) => (
                <li key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border"
                    style={{ borderRadius: 0, borderColor: LINE, backgroundColor: 'rgba(243,230,200,0.06)' }}
                  >
                    <img
                      src={item.variant.image}
                      alt=""
                      className="h-[80%] w-auto max-w-[85%] object-contain"
                      draggable={false}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="m-0 truncate text-[0.88rem] font-semibold"
                      style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                    >
                      {item.product.name}
                    </p>
                    <p className="mt-0.5 m-0 text-[0.75rem]" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
                      {item.qty}× · {item.variant.label}
                    </p>
                  </div>
                  <p
                    className="m-0 shrink-0 text-[0.88rem] font-semibold"
                    style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                  >
                    ₹{item.lineTotal}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2.5 border-t pt-5" style={{ borderColor: LINE }}>
              <div className="flex justify-between text-[0.88rem]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <dt style={{ color: MUTED }}>Subtotal</dt>
                <dd className="m-0 font-medium" style={{ color: CREAM }}>
                  ₹{subtotal}
                </dd>
              </div>
              <div className="flex justify-between text-[0.88rem]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <dt style={{ color: MUTED }}>Shipping</dt>
                <dd className="m-0 font-medium" style={{ color: CREAM }}>
                  ₹{shipping}
                </dd>
              </div>
              <div className="flex justify-between pt-2 text-[1.05rem]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <dt className="font-bold" style={{ color: CREAM }}>
                  Total
                </dt>
                <dd className="m-0 font-bold" style={{ color: GOLD }}>
                  ₹{total}
                </dd>
              </div>
            </dl>

            <AnimatePresence mode="wait">
              {step === 'form' ? (
                <motion.div key="pay-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <button
                    type="submit"
                    form="checkout-form"
                    className="mt-6 hidden w-full cursor-pointer border-0 py-3.5 text-[0.92rem] font-semibold tracking-wide transition hover:brightness-110 lg:block"
                    style={{
                      borderRadius: 0,
                      backgroundColor: GOLD,
                      color: INK,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Pay Now
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="pay-choose"
                  className="mt-6 hidden lg:block"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <PaymentChooser
                    payment={payment}
                    onSelect={setPayment}
                    onConfirm={confirmPayment}
                    total={total}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 flex items-start gap-2.5" style={{ color: MUTED }}>
              <LockIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="m-0 text-[0.72rem] leading-relaxed" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
                <span className="font-semibold" style={{ color: CREAM }}>
                  Secure checkout
                </span>
                {' — '}
                Choose Cash on Delivery or Razorpay. Card details are never stored on this site.
              </p>
            </div>
          </div>
        </motion.aside>
      </main>
    </CheckoutFlowShell>
  )
}

function PaymentChooser({
  payment,
  onSelect,
  onConfirm,
  total,
}: {
  payment: PaymentMethod | null
  onSelect: (m: PaymentMethod) => void
  onConfirm: (m: PaymentMethod) => void
  total: number
}) {
  return (
    <div>
      <p
        className="m-0 text-[0.72rem] font-semibold tracking-[0.14em] uppercase"
        style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
      >
        Choose payment
      </p>
      <p className="mt-1 m-0 text-[0.85rem]" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
        How would you like to pay ₹{total}?
      </p>

      <div className="mt-4 grid gap-2.5">
        {(
          [
            { id: 'cod' as const, title: 'Cash on Delivery', hint: 'Pay when your order arrives' },
            { id: 'razorpay' as const, title: 'Razorpay · Online', hint: 'UPI, cards & netbanking (backend soon)' },
          ] as const
        ).map((opt) => {
          const on = payment === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className="flex cursor-pointer items-start gap-3 border px-3.5 py-3.5 text-left transition"
              style={{
                borderRadius: 0,
                borderColor: on ? GOLD : LINE,
                backgroundColor: on ? 'rgba(184,134,11,0.14)' : 'transparent',
              }}
              aria-pressed={on}
            >
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border-2"
                style={{ borderRadius: 0, borderColor: on ? GOLD : LINE }}
              >
                {on && <span className="h-2 w-2" style={{ backgroundColor: GOLD }} />}
              </span>
              <span>
                <span
                  className="block text-[0.9rem] font-semibold"
                  style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                >
                  {opt.title}
                </span>
                <span className="mt-0.5 block text-[0.72rem]" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
                  {opt.hint}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        disabled={!payment}
        onClick={() => payment && onConfirm(payment)}
        className="mt-4 w-full cursor-pointer border-0 py-3.5 text-[0.9rem] font-semibold transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ borderRadius: 0, backgroundColor: GOLD, color: INK, fontFamily: 'Inter, sans-serif' }}
      >
        Confirm · {payment === 'cod' ? 'COD' : payment === 'razorpay' ? 'Razorpay' : 'Select method'}
      </button>
    </div>
  )
}
