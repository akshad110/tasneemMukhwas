import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  CheckoutFlowShell,
  CheckoutFlowStepperBar,
} from '../components/checkout/CheckoutFlow'
import Navbar from '../components/nav/Navbar'
import { useAuth } from '../context/AuthContext'
import { useCart, type CartResolvedItem } from '../context/CartContext'
import { ApiRequestError } from '../lib/api'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'
import { scrollAppToTop } from '../lib/scrollControl'
import { ordersApi, paymentsApi, couponsApi, type AuthUser } from '../lib/services'
import { openRazorpayCheckout } from '../lib/razorpay'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const DELIVERY_FEE = 49

const LINE = 'rgba(10,46,34,0.12)'
const MUTED = 'rgba(10,46,34,0.58)'
const PANEL = '#f3ebe0'

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

/** Interactive card field with icon + focus lift */
function CheckoutField({
  label,
  icon,
  children,
  className = '',
  filled = false,
}: {
  label: string
  icon: ReactNode
  children: ReactNode
  className?: string
  filled?: boolean
}) {
  return (
    <label className={`checkout-field ${className}`}>
      <span className="checkout-field__label">{label}</span>
      <span className={`checkout-field__wrap ${filled ? 'checkout-field__wrap--filled' : ''}`}>
        <span className="checkout-field__icon" aria-hidden>
          {icon}
        </span>
        {children}
      </span>
    </label>
  )
}

function FieldIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckoutSectionCard({
  step,
  title,
  subtitle,
  active,
  done,
  onOpen,
  children,
}: {
  step: number
  title: string
  subtitle: string
  active: boolean
  done: boolean
  onOpen: () => void
  children: ReactNode
}) {
  return (
    <motion.div
      layout
      className={`checkout-section ${active ? 'checkout-section--active' : ''} ${done ? 'checkout-section--done' : ''}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <button type="button" className="checkout-section__head" onClick={onOpen} aria-expanded={active}>
        <span
          className="checkout-section__num"
          style={{
            backgroundColor: done ? 'rgba(27,122,62,0.14)' : active ? '#0a2e22' : 'rgba(10,46,34,0.06)',
            color: done ? '#1b7a3e' : active ? '#f2f4f5' : 'rgba(10,46,34,0.55)',
          }}
        >
          {done ? <CheckIcon className="h-3.5 w-3.5" /> : step}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.92rem] font-bold" style={{ color: INK }}>
            {title}
          </span>
          <span className="mt-0.5 block truncate text-[0.75rem]" style={{ color: MUTED }}>
            {subtitle}
          </span>
        </span>
        <motion.span
          animate={{ rotate: active ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-[0.72rem]"
          style={{ color: MUTED }}
          aria-hidden
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            key="body"
            className="checkout-section__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const fieldInputClass = 'checkout-field__input'

/** Checkout — interactive sections + sticky mobile bar */
export default function CheckoutPage() {
  const { items, itemCount, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [step, setStep] = useState<PayStep>('form')
  const [payment, setPayment] = useState<PaymentMethod | null>(null)
  const [error, setError] = useState('')
  const [paidVia, setPaidVia] = useState<PaymentMethod | null>(null)
  const [placing, setPlacing] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [orderTotal, setOrderTotal] = useState(0)
  const [invoiceNo, setInvoiceNo] = useState('')
  const [invoiceReady, setInvoiceReady] = useState(false)
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discountAmount: number
    label: string
  } | null>(null)
  const [couponError, setCouponError] = useState('')
  const [couponBusy, setCouponBusy] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)

  const shipping = items.length > 0 ? DELIVERY_FEE : 0
  const discount = appliedCoupon?.discountAmount ?? 0
  const total = Math.max(0, subtotal + shipping - discount)

  const contactDone = Boolean(
    form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.phone.trim(),
  )
  const shippingDone = Boolean(form.address.trim() && form.city.trim() && form.postal.trim())
  const termsDone = form.agreed

  const progress = useMemo(() => {
    let score = 0
    if (form.firstName.trim()) score += 1
    if (form.lastName.trim()) score += 1
    if (form.email.trim()) score += 1
    if (form.phone.trim()) score += 1
    if (form.address.trim()) score += 1
    if (form.city.trim()) score += 1
    if (form.postal.trim()) score += 1
    if (form.country.trim()) score += 1
    if (form.agreed) score += 1
    return Math.round((score / 9) * 100)
  }, [form])

  useEffect(() => {
    document.title = 'Checkout · Tasneem Mukhwas'
    scrollAppToTop(true)
    return () => {
      document.title = 'Tasneem Mukhwas'
    }
  }, [])

  useEffect(() => {
    if (step !== 'done' && items.length === 0) {
      navigateApp(APP_ROUTES.cart)
    }
  }, [items.length, step])

  useEffect(() => {
    if (!user) return
    setForm((f) => {
      const parts = (user.name || '').trim().split(/\s+/)
      return {
        ...f,
        email: f.email || user.email,
        phone: f.phone || user.phone || f.phone,
        firstName: f.firstName || parts[0] || '',
        lastName: f.lastName || parts.slice(1).join(' ') || '',
      }
    })
  }, [user])

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) {
      setCouponError('Enter a coupon code')
      return
    }
    if (!form.email.trim()) {
      setCouponError('Enter your email first so we can validate the code')
      return
    }
    setCouponBusy(true)
    setCouponError('')
    try {
      const result = await couponsApi.validate({
        code,
        email: form.email.trim(),
        subtotal,
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
      })
      setAppliedCoupon({
        code: result.code,
        discountAmount: result.discountAmount,
        label: result.label,
      })
      setCouponInput(result.code)
    } catch (err) {
      setAppliedCoupon(null)
      setCouponError(err instanceof ApiRequestError ? err.message : 'Invalid coupon code')
    } finally {
      setCouponBusy(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponInput('')
    setCouponError('')
  }

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
      const payload = {
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
        ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
      }

      const result = await ordersApi.create(payload)

      if (method === 'razorpay') {
        if (!result.razorpay) {
          throw new Error('Razorpay checkout could not be started')
        }

        await new Promise<void>((resolve, reject) => {
          openRazorpayCheckout(result.razorpay!, {
            onSuccess: async (response) => {
              try {
                const verified = await paymentsApi.verifyRazorpay({
                  orderNumber: result.order.id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  email: form.email.trim(),
                })
                setPaidVia('razorpay')
                setOrderId(verified.order.id)
                setOrderTotal(total)
                setInvoiceNo(verified.transaction?.invoice || result.transaction.invoice)
                setInvoiceReady(true)
                clearCart()
                setStep('done')
                resolve()
              } catch (err) {
                reject(err)
              }
            },
            onDismiss: async () => {
              try {
                await paymentsApi.cancelRazorpay(result.order.id)
              } catch {
                /* ignore */
              }
              reject(new Error('Payment cancelled'))
            },
          }).catch(reject)
        })
        return
      }

      setPaidVia('cod')
      setOrderId(result.order.id)
      setOrderTotal(total)
      setInvoiceNo(result.transaction.invoice)
      setInvoiceReady(Boolean(result.transaction.invoice))
      clearCart()
      setStep('done')
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : err instanceof Error ? err.message : 'Could not place order')
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
        <OrderSuccessScreen
          orderId={orderId}
          invoiceNo={invoiceNo}
          invoiceReady={invoiceReady}
          paidVia={paidVia}
          orderTotal={orderTotal}
          user={user}
        />
      </CheckoutFlowShell>
    )
  }

  return (
    <CheckoutFlowShell>
      <Navbar />
      <CheckoutFlowStepperBar step={3} />

      <main className="checkout-page-main mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] lg:gap-10 lg:px-8 lg:py-12">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            type="button"
            onClick={() => navigateApp(APP_ROUTES.cart)}
            className="group mb-5 inline-flex cursor-pointer items-center gap-3 border-0 bg-transparent px-0 py-1"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl border transition group-hover:border-[rgba(184,134,11,0.9)]"
              style={{ borderColor: LINE, backgroundColor: '#fff', color: INK }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-left">
              <span className="block text-[0.62rem] font-semibold tracking-[0.16em] uppercase" style={{ color: GOLD }}>
                Return
              </span>
              <span className="block text-[0.88rem] font-semibold" style={{ color: INK }}>
                Back to cart
              </span>
            </span>
          </motion.button>

          {/* Mobile order summary accordion */}
          <div className="checkout-mobile-summary">
            <button
              type="button"
              className="checkout-mobile-summary__toggle"
              onClick={() => setMobileSummaryOpen((v) => !v)}
              aria-expanded={mobileSummaryOpen}
            >
              <span>
                <span className="block text-[0.72rem] font-semibold uppercase tracking-wide" style={{ color: GOLD }}>
                  Order summary
                </span>
                <span className="block text-[0.88rem] font-bold" style={{ color: INK }}>
                  {itemCount} item{itemCount === 1 ? '' : 's'} · ₹{total}
                </span>
              </span>
              <motion.span animate={{ rotate: mobileSummaryOpen ? 180 : 0 }} style={{ color: MUTED }}>
                ▼
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {mobileSummaryOpen && (
                <motion.div
                  className="checkout-mobile-summary__panel mt-2 rounded-2xl border p-4"
                  style={{ borderColor: LINE, backgroundColor: '#fff' }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <OrderSummaryContent
                    items={items}
                    itemCount={itemCount}
                    subtotal={subtotal}
                    shipping={shipping}
                    discount={discount}
                    total={total}
                    appliedCoupon={appliedCoupon}
                    couponInput={couponInput}
                    couponError={couponError}
                    couponBusy={couponBusy}
                    onCouponInput={setCouponInput}
                    onApplyCoupon={() => void applyCoupon()}
                    onRemoveCoupon={removeCoupon}
                    compact
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="m-0 text-[0.68rem] font-semibold tracking-[0.18em] uppercase" style={{ color: GOLD }}>
                Secure checkout
              </p>
              <h1 className="m-0 mt-1 text-[2rem] font-bold tracking-tight sm:text-[2.35rem]" style={{ color: INK }}>
                Complete your order
              </h1>
            </div>
            <motion.span
              key={progress}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-full px-3 py-1 text-[0.72rem] font-bold"
              style={{ backgroundColor: 'rgba(184,134,11,0.16)', color: INK }}
            >
              {progress}% complete
            </motion.span>
          </div>

          <div className="checkout-progress">
            <div className="checkout-progress__track">
              <motion.div
                className="checkout-progress__fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="checkout-progress__meta">
              <span>Contact</span>
              <span>Delivery</span>
              <span>Confirm</span>
            </div>
          </div>

          <form id="checkout-form" onSubmit={onPayNow} className="mt-6 space-y-4">
            <CheckoutSectionCard
              step={1}
              title="Contact details"
              subtitle={contactDone ? `${form.firstName} · ${form.email}` : 'Name, email & phone'}
              active={activeSection === 0}
              done={contactDone}
              onOpen={() => setActiveSection(0)}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <CheckoutField
                  label="First name"
                  filled={Boolean(form.firstName.trim())}
                  icon={<FieldIcon d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4ZM4 20a8 8 0 0 1 16 0" />}
                >
                  <input
                    required
                    className={fieldInputClass}
                    value={form.firstName}
                    onChange={(e) => set('firstName')(e.target.value)}
                    autoComplete="given-name"
                    placeholder="First name"
                  />
                </CheckoutField>
                <CheckoutField
                  label="Last name"
                  filled={Boolean(form.lastName.trim())}
                  icon={<FieldIcon d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4ZM4 20a8 8 0 0 1 16 0" />}
                >
                  <input
                    required
                    className={fieldInputClass}
                    value={form.lastName}
                    onChange={(e) => set('lastName')(e.target.value)}
                    autoComplete="family-name"
                    placeholder="Last name"
                  />
                </CheckoutField>
              </div>
              <div className="mt-3 grid gap-3">
                <CheckoutField
                  label="Email"
                  filled={Boolean(form.email.trim())}
                  icon={<FieldIcon d="M4 6h16v12H4zM4 7l8 6 8-6" />}
                >
                  <input
                    required
                    type="email"
                    className={fieldInputClass}
                    value={form.email}
                    onChange={(e) => set('email')(e.target.value)}
                    autoComplete="email"
                    placeholder="you@email.com"
                  />
                </CheckoutField>
                <CheckoutField
                  label="Phone"
                  filled={Boolean(form.phone.trim())}
                  icon={<FieldIcon d="M6.5 4h3l1.5 3.5-2 1.5a11 11 0 0 0 5 5l1.5-2L20 13.5V17l-2 1.5A14 14 0 0 1 3.5 6.5L6.5 4Z" />}
                >
                  <input
                    required
                    type="tel"
                    className={fieldInputClass}
                    value={form.phone}
                    onChange={(e) => set('phone')(e.target.value)}
                    autoComplete="tel"
                    placeholder="+91 …"
                  />
                </CheckoutField>
              </div>
              <button
                type="button"
                className="checkout-section__continue"
                disabled={!contactDone}
                onClick={() => setActiveSection(1)}
              >
                Continue to delivery
              </button>
            </CheckoutSectionCard>

            <CheckoutSectionCard
              step={2}
              title="Delivery address"
              subtitle={shippingDone ? `${form.city}, ${form.country}` : 'Where should we ship?'}
              active={activeSection === 1}
              done={shippingDone}
              onOpen={() => setActiveSection(1)}
            >
              <CheckoutField
                label="Street address"
                filled={Boolean(form.address.trim())}
                icon={<FieldIcon d="M4 10.5 12 4l8 6.5V20H4zM10 20v-6h4v6" />}
              >
                <input
                  required
                  className={fieldInputClass}
                  value={form.address}
                  onChange={(e) => set('address')(e.target.value)}
                  autoComplete="street-address"
                  placeholder="House no., street, area"
                />
              </CheckoutField>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <CheckoutField
                  label="City"
                  filled={Boolean(form.city.trim())}
                  icon={<FieldIcon d="M3 21h18M6 21V7l6-4 6 4v14M10 10h4M10 14h4" />}
                >
                  <input
                    required
                    className={fieldInputClass}
                    value={form.city}
                    onChange={(e) => set('city')(e.target.value)}
                    autoComplete="address-level2"
                    placeholder="City"
                  />
                </CheckoutField>
                <CheckoutField
                  label="Country"
                  filled={Boolean(form.country.trim())}
                  icon={<FieldIcon d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />}
                >
                  <select
                    className={fieldInputClass}
                    style={{ appearance: 'none' }}
                    value={form.country}
                    onChange={(e) => set('country')(e.target.value)}
                  >
                    <option>India</option>
                    <option>United Arab Emirates</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Other</option>
                  </select>
                </CheckoutField>
              </div>
              <div className="mt-3">
                <CheckoutField
                  label="Postal code"
                  filled={Boolean(form.postal.trim())}
                  icon={<FieldIcon d="M21 10H3M21 6H3v12h18V6Z" />}
                >
                  <input
                    required
                    className={fieldInputClass}
                    value={form.postal}
                    onChange={(e) => set('postal')(e.target.value)}
                    autoComplete="postal-code"
                    placeholder="PIN / ZIP"
                  />
                </CheckoutField>
              </div>
              <button
                type="button"
                className="checkout-section__continue"
                disabled={!shippingDone}
                onClick={() => setActiveSection(2)}
              >
                Review & confirm
              </button>
            </CheckoutSectionCard>

            <CheckoutSectionCard
              step={3}
              title="Confirm & pay"
              subtitle={termsDone ? 'Ready to place order' : 'Agree to terms to continue'}
              active={activeSection === 2}
              done={termsDone && step === 'pay'}
              onOpen={() => setActiveSection(2)}
            >
              <button
                type="button"
                className={`checkout-terms w-full text-left ${form.agreed ? 'checkout-terms--on' : ''}`}
                onClick={() => set('agreed')(!form.agreed)}
              >
                <span className="checkout-terms__box">
                  {form.agreed ? <CheckIcon className="h-3 w-3" /> : null}
                </span>
                <span className="text-[0.82rem] leading-snug" style={{ color: MUTED }}>
                  I have read and agree to the{' '}
                  <span className="font-semibold" style={{ color: INK }}>
                    Terms and Conditions
                  </span>
                  .
                </span>
              </button>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 m-0 rounded-xl border px-3 py-2 text-[0.82rem] font-medium"
                  style={{ color: '#a32020', borderColor: 'rgba(163,32,32,0.2)', backgroundColor: 'rgba(163,32,32,0.06)' }}
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={!termsDone}
                className="mt-4 w-full cursor-pointer border-0 py-3.5 text-[0.92rem] font-bold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40 lg:hidden"
                style={{ borderRadius: 14, backgroundColor: GOLD, color: INK }}
                whileHover={{ scale: termsDone ? 1.01 : 1 }}
                whileTap={{ scale: termsDone ? 0.98 : 1 }}
              >
                Continue to payment · ₹{total}
              </motion.button>
            </CheckoutSectionCard>
          </form>

          <AnimatePresence>
            {step === 'pay' && (
              <motion.div
                className="mt-4 checkout-aside-card p-5 lg:hidden"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <PaymentChooser
                  payment={payment}
                  onSelect={setPayment}
                  onConfirm={confirmPayment}
                  total={total}
                  busy={placing}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Desktop order summary */}
        <motion.aside
          className="hidden lg:block lg:sticky lg:top-8 lg:self-start"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="checkout-aside-card p-5 sm:p-6">
            <OrderSummaryContent
              items={items}
              itemCount={itemCount}
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
              appliedCoupon={appliedCoupon}
              couponInput={couponInput}
              couponError={couponError}
              couponBusy={couponBusy}
              onCouponInput={setCouponInput}
              onApplyCoupon={() => void applyCoupon()}
              onRemoveCoupon={removeCoupon}
              step={step}
              placing={placing}
              payment={payment}
              onSelectPayment={setPayment}
              onConfirmPayment={confirmPayment}
            />
          </div>
        </motion.aside>
      </main>

      {/* Mobile sticky pay bar */}
      {step === 'form' && (
        <div className="checkout-sticky-bar">
          <div>
            <p className="m-0 text-[0.68rem] uppercase tracking-wide" style={{ color: MUTED }}>
              Total
            </p>
            <motion.p
              key={total}
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              className="m-0 text-[1.1rem] font-bold"
              style={{ color: GOLD }}
            >
              ₹{total}
            </motion.p>
          </div>
          <button
            type="submit"
            form="checkout-form"
            className="checkout-sticky-bar__btn"
            disabled={!termsDone}
          >
            Pay now
          </button>
        </div>
      )}
    </CheckoutFlowShell>
  )
}

function OrderSuccessScreen({
  orderId,
  invoiceNo,
  invoiceReady,
  paidVia,
  orderTotal,
  user,
}: {
  orderId: string
  invoiceNo: string
  invoiceReady: boolean
  paidVia: PaymentMethod | null
  orderTotal: number
  user: AuthUser | null
}) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${6 + ((i * 17) % 88)}%`,
        top: `${4 + ((i * 23) % 36)}%`,
        color: i % 3 === 0 ? GOLD : i % 3 === 1 ? INK : '#1b7a3e',
        delay: i * 0.06,
        rot: (i * 41) % 360,
      })),
    [],
  )

  const paymentLabel =
    paidVia === 'cod' ? 'Cash on Delivery' : paidVia === 'razorpay' ? 'Paid · Razorpay' : 'Confirmed'

  return (
    <div className="order-success-wrap">
      <div
        className="order-success-glow"
        style={{ width: 280, height: 280, top: '8%', left: '10%', background: 'rgba(184,134,11,0.22)' }}
      />
      <div
        className="order-success-glow"
        style={{ width: 220, height: 220, bottom: '12%', right: '8%', background: 'rgba(10,46,34,0.12)' }}
      />

      {confetti.map((c) => (
        <motion.span
          key={c.id}
          className="order-success-confetti"
          style={{ left: c.left, top: c.top, backgroundColor: c.color }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.6], y: [0, 12, 28, 48], rotate: c.rot }}
          transition={{ duration: 2.4, delay: c.delay, ease: 'easeOut' }}
        />
      ))}

      <motion.div
        className="order-success-card"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="order-success-card__hero">
          <motion.div
            className="order-success-check"
            initial={{ scale: 0.5, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.15 }}
          >
            <span className="order-success-check__ring" aria-hidden />
            <CheckIcon className="relative z-[1] h-7 w-7" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-4 m-0 text-[0.68rem] font-bold tracking-[0.2em] uppercase"
            style={{ color: GOLD }}
          >
            Thank you
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mt-1 m-0 text-[1.85rem] font-bold tracking-tight sm:text-[2.1rem]"
            style={{ color: INK }}
          >
            Order placed successfully
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 m-0 mx-auto max-w-md text-[0.9rem] leading-relaxed"
            style={{ color: MUTED }}
          >
            {paidVia === 'cod'
              ? 'Your Cash on Delivery order is confirmed. We will notify you when it ships.'
              : 'Payment received. Your Tasneem Mukhwas order is being prepared with care.'}
          </motion.p>
        </div>

        <motion.div
          className="order-success-timeline"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          {[
            { label: 'Confirmed', active: true },
            { label: 'Processing', active: paidVia === 'razorpay' },
            { label: 'Shipping', active: false },
          ].map((s) => (
            <div key={s.label} className={`order-success-step ${s.active ? 'order-success-step--active' : ''}`}>
              <span className="order-success-step__dot" style={{ opacity: s.active ? 1 : 0.35 }} />
              <span className="order-success-step__label">{s.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="order-success-details"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {orderId ? (
            <div className="order-success-detail">
              <span className="order-success-detail__label">Order ID</span>
              <span className="order-success-detail__value">{orderId}</span>
            </div>
          ) : null}
          {invoiceNo ? (
            <div className="order-success-detail">
              <span className="order-success-detail__label">Invoice</span>
              <span className="order-success-detail__value">{invoiceNo}</span>
            </div>
          ) : null}
          <div className="order-success-detail">
            <span className="order-success-detail__label">Payment</span>
            <span className="order-success-detail__value">{paymentLabel}</span>
          </div>
          {orderTotal > 0 ? (
            <div className="order-success-detail">
              <span className="order-success-detail__label">Total paid</span>
              <span className="order-success-detail__value" style={{ color: GOLD }}>
                ₹{orderTotal}
              </span>
            </div>
          ) : null}
        </motion.div>

        <motion.div
          className="order-success-actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58 }}
        >
          <button
            type="button"
            onClick={() => navigateApp(APP_ROUTES.myOrders)}
            className="order-success-btn order-success-btn--gold order-success-actions__primary"
          >
            Track my order
          </button>
          {invoiceReady && orderId ? (
            user ? (
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
                Download invoice
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigateApp(APP_ROUTES.login)}
                className="order-success-btn order-success-btn--ink"
              >
                Sign in for invoice
              </button>
            )
          ) : null}
          <button
            type="button"
            onClick={() => navigateApp(APP_ROUTES.shop)}
            className="order-success-btn order-success-btn--ghost"
          >
            Continue shopping
          </button>
          <button
            type="button"
            onClick={() => navigateApp(APP_ROUTES.home)}
            className="order-success-btn order-success-btn--ghost"
          >
            Back to home
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

function OrderSummaryContent({
  items,
  itemCount,
  subtotal,
  shipping,
  discount,
  total,
  appliedCoupon,
  couponInput,
  couponError,
  couponBusy,
  onCouponInput,
  onApplyCoupon,
  onRemoveCoupon,
  compact = false,
  step = 'form',
  placing = false,
  payment = null,
  onSelectPayment,
  onConfirmPayment,
}: {
  items: CartResolvedItem[]
  itemCount: number
  subtotal: number
  shipping: number
  discount: number
  total: number
  appliedCoupon: { code: string; discountAmount: number; label: string } | null
  couponInput: string
  couponError: string
  couponBusy: boolean
  onCouponInput: (v: string) => void
  onApplyCoupon: () => void
  onRemoveCoupon: () => void
  compact?: boolean
  step?: PayStep
  placing?: boolean
  payment?: PaymentMethod | null
  onSelectPayment?: (m: PaymentMethod) => void
  onConfirmPayment?: (m: PaymentMethod) => void
}) {
  return (
    <>
      <h2 className="m-0 text-[1.1rem] font-bold" style={{ color: INK }}>
        {compact ? 'Your items' : 'Order summary'}
      </h2>
      <p className="mt-1 m-0 text-[0.78rem]" style={{ color: MUTED }}>
        {itemCount} item{itemCount === 1 ? '' : 's'}
      </p>

      <ul className={`${compact ? 'mt-3' : 'mt-5'} space-y-3`}>
        {items.map((item) => (
          <motion.li
            key={`${item.productId}-${item.variantId}`}
            layout
            className="flex gap-3 rounded-xl border p-2.5"
            style={{ borderColor: LINE, backgroundColor: 'rgba(248,249,250,0.6)' }}
            whileHover={{ scale: 1.01 }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg"
              style={{ backgroundColor: PANEL }}
            >
              <img src={item.variant.image} alt="" className="h-[78%] w-auto object-contain" draggable={false} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-[0.85rem] font-semibold" style={{ color: INK }}>
                {item.product.name}
              </p>
              <p className="mt-0.5 m-0 text-[0.72rem]" style={{ color: MUTED }}>
                {item.qty}× · {item.variant.label}
              </p>
            </div>
            <p className="m-0 shrink-0 text-[0.85rem] font-bold" style={{ color: INK }}>
              ₹{item.lineTotal}
            </p>
          </motion.li>
        ))}
      </ul>

      <dl className="mt-5 space-y-2 border-t pt-4" style={{ borderColor: LINE }}>
        <div className="flex justify-between text-[0.85rem]">
          <dt style={{ color: MUTED }}>Subtotal</dt>
          <dd className="m-0 font-medium" style={{ color: INK }}>
            ₹{subtotal}
          </dd>
        </div>
        {discount > 0 && appliedCoupon ? (
          <div className="flex justify-between text-[0.85rem]">
            <dt style={{ color: MUTED }}>
              Discount{' '}
              <span className="font-mono text-[0.68rem]" style={{ color: GOLD }}>
                {appliedCoupon.code}
              </span>
            </dt>
            <dd className="m-0 font-medium" style={{ color: '#1b7a3e' }}>
              −₹{discount}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between text-[0.85rem]">
          <dt style={{ color: MUTED }}>Shipping</dt>
          <dd className="m-0 font-medium" style={{ color: INK }}>
            ₹{shipping}
          </dd>
        </div>
        <div className="flex justify-between pt-1 text-[1.05rem]">
          <dt className="font-bold" style={{ color: INK }}>
            Total
          </dt>
          <motion.dd
            key={total}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="m-0 font-bold"
            style={{ color: GOLD }}
          >
            ₹{total}
          </motion.dd>
        </div>
      </dl>

      {!compact && (
        <div className="mt-4 border-t pt-4" style={{ borderColor: LINE }}>
          <p className="m-0 text-[0.68rem] font-semibold tracking-[0.12em] uppercase" style={{ color: GOLD }}>
            Have a code?
          </p>
          {appliedCoupon ? (
            <div
              className="mt-2 flex items-center justify-between gap-2 rounded-xl border px-3 py-2"
              style={{ borderColor: LINE, backgroundColor: 'rgba(27,122,62,0.08)' }}
            >
              <div>
                <p className="m-0 text-[0.82rem] font-semibold" style={{ color: INK }}>
                  {appliedCoupon.label}
                </p>
                <p className="m-0 font-mono text-[0.72rem]" style={{ color: MUTED }}>
                  {appliedCoupon.code}
                </p>
              </div>
              <button type="button" onClick={onRemoveCoupon} className="cursor-pointer border-0 bg-transparent text-[0.75rem] font-semibold" style={{ color: '#a32020' }}>
                Remove
              </button>
            </div>
          ) : (
            <div className="mt-2 flex gap-2">
              <input
                className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-[0.82rem] uppercase outline-none focus:border-[rgba(184,134,11,0.6)]"
                style={{ borderColor: LINE, color: INK }}
                placeholder="6-char code"
                value={couponInput}
                maxLength={12}
                onChange={(e) => onCouponInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    onApplyCoupon()
                  }
                }}
              />
              <button
                type="button"
                disabled={couponBusy}
                onClick={onApplyCoupon}
                className="shrink-0 cursor-pointer rounded-xl border px-3 py-2 text-[0.75rem] font-semibold disabled:opacity-40"
                style={{ borderColor: LINE, color: INK, backgroundColor: '#fff' }}
              >
                {couponBusy ? '…' : 'Apply'}
              </button>
            </div>
          )}
          {couponError ? (
            <p className="mt-1.5 m-0 text-[0.72rem]" style={{ color: '#a32020' }}>
              {couponError}
            </p>
          ) : null}
        </div>
      )}

      {!compact && (
        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div key="pay-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button
                type="submit"
                form="checkout-form"
                className="mt-5 w-full cursor-pointer border-0 py-3.5 text-[0.92rem] font-bold tracking-wide transition hover:brightness-110"
                style={{ borderRadius: 14, backgroundColor: GOLD, color: INK }}
              >
                Continue to payment
              </button>
            </motion.div>
          ) : onSelectPayment && onConfirmPayment ? (
            <motion.div key="pay-choose" className="mt-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <PaymentChooser
                payment={payment ?? null}
                onSelect={onSelectPayment}
                onConfirm={onConfirmPayment}
                total={total}
                busy={placing}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}

      {!compact && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border px-3 py-2.5" style={{ borderColor: LINE, backgroundColor: 'rgba(10,46,34,0.03)' }}>
          <LockIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="m-0 text-[0.72rem] leading-relaxed" style={{ color: MUTED }}>
            <span className="font-semibold" style={{ color: INK }}>
              Secure checkout
            </span>{' '}
            — COD or Razorpay. Card details never stored.
          </p>
        </div>
      )}
    </>
  )
}

function PaymentChooser({
  payment,
  onSelect,
  onConfirm,
  total,
  busy = false,
}: {
  payment: PaymentMethod | null
  onSelect: (m: PaymentMethod) => void
  onConfirm: (m: PaymentMethod) => void
  total: number
  busy?: boolean
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
            { id: 'razorpay' as const, title: 'Razorpay · Online', hint: 'UPI, cards & netbanking' },
          ] as const
        ).map((opt) => {
          const on = payment === opt.id
          return (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`checkout-pay-option flex cursor-pointer items-center gap-3 px-3.5 py-3.5 text-left ${on ? 'checkout-pay-option--on' : ''}`}
              aria-pressed={on}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                style={{ borderColor: on ? GOLD : LINE }}
              >
                {on && <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: GOLD }} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9rem] font-semibold" style={{ color: INK }}>
                  {opt.title}
                </span>
                <span className="mt-0.5 block text-[0.72rem]" style={{ color: MUTED }}>
                  {opt.hint}
                </span>
              </span>
            </motion.button>
          )
        })}
      </div>

      <motion.button
        type="button"
        disabled={!payment || busy}
        onClick={() => payment && onConfirm(payment)}
        className="mt-4 w-full cursor-pointer border-0 py-3.5 text-[0.9rem] font-bold transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ borderRadius: 14, backgroundColor: GOLD, color: INK }}
        whileHover={{ scale: payment && !busy ? 1.01 : 1 }}
        whileTap={{ scale: payment && !busy ? 0.98 : 1 }}
      >
        {busy ? 'Processing…' : `Confirm · ${payment === 'cod' ? 'COD' : payment === 'razorpay' ? 'Razorpay' : 'Select method'}`}
      </motion.button>
    </div>
  )
}
