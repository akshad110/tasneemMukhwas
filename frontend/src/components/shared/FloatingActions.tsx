import { AnimatePresence, motion } from 'framer-motion'
import {
  useEffect,
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { CONTACT_PHONE_DISPLAY, CONTACT_WHATSAPP } from '../../lib/contact'

const INK = '#0a2e22'
const CREAM = '#f3e6c8'
const GOLD = '#b8860b'
const WA_NUMBER = CONTACT_WHATSAPP
const TEXTURE = '/image.png_2K_202608092240.jpeg'

type Intent = 'inquiry' | 'bulk' | null
type Step = 'idle' | 'choose' | 'form'

type FormState = {
  name: string
  phone: string
  city: string
  company: string
  product: string
  quantity: string
  message: string
}

const EMPTY_FORM: FormState = {
  name: '',
  phone: '',
  city: '',
  company: '',
  product: '',
  quantity: '',
  message: '',
}

const ease = [0.22, 1, 0.36, 1] as const

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.5 3.5A11 11 0 0 0 3.1 17.4L2 22l4.7-1.2A11 11 0 1 0 20.5 3.5Zm-8.6 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-2.8.7.7-2.7-.2-.3a9.1 9.1 0 1 1 7.2 3.8Zm5-6.8c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.2l-.8 1c-.1.2-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.5-.6c.1-.2.2-.3.3-.5s0-.4 0-.5l-.9-2.1c-.2-.6-.5-.5-.6-.5h-.5c-.2 0-.5.1-.7.3s-1 1-1 2.4 1 2.8 1.2 3a10.5 10.5 0 0 0 4 3.4c1.5.6 1.8.5 2.2.5s1.2-.5 1.3-1 .2-.9.1-1-.2-.2-.5-.3Z" />
    </svg>
  )
}

function ArrowUpIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

function CloseIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function buildWhatsAppUrl(intent: Exclude<Intent, null>, form: FormState) {
  const lines =
    intent === 'inquiry'
      ? [
          'Hi Tasneem Mukhwas — Product Inquiry',
          '',
          `Name: ${form.name.trim()}`,
          `Phone: ${form.phone.trim()}`,
          `City: ${form.city.trim()}`,
          `Product interest: ${form.product.trim()}`,
          form.message.trim() ? `Message: ${form.message.trim()}` : '',
        ]
      : [
          'Hi Tasneem Mukhwas — Bulk / Wholesale Order',
          '',
          `Name: ${form.name.trim()}`,
          `Business: ${form.company.trim()}`,
          `Phone: ${form.phone.trim()}`,
          `City: ${form.city.trim()}`,
          `Product interest: ${form.product.trim()}`,
          `Approx quantity: ${form.quantity.trim()}`,
          form.message.trim() ? `Notes: ${form.message.trim()}` : '',
        ]

  const text = lines.filter(Boolean).join('\n')
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
}

const fieldClass =
  'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-[0.9rem] outline-none transition focus:border-[#b8860b]/70 focus:bg-white/8'

/**
 * Fixed WhatsApp + back-to-top.
 * WhatsApp opens Inquiry / Bulk choice, then an in-place form that redirects to WhatsApp.
 */
export default function FloatingActions() {
  const formId = useId()
  const [showTop, setShowTop] = useState(false)
  const [step, setStep] = useState<Step>('idle')
  const [intent, setIntent] = useState<Intent>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (step === 'idle') {
      document.body.style.removeProperty('overflow')
      return
    }
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.removeProperty('overflow')
      window.removeEventListener('keydown', onKey)
    }
  }, [step])

  const closeAll = () => {
    setStep('idle')
    setIntent(null)
    setForm(EMPTY_FORM)
  }

  const openChoose = () => {
    setStep('choose')
    setIntent(null)
  }

  const pickIntent = (next: Exclude<Intent, null>) => {
    setIntent(next)
    setStep('form')
  }

  const update =
    (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!intent) return
    const url = buildWhatsAppUrl(intent, form)
    window.open(url, '_blank', 'noopener,noreferrer')
    closeAll()
  }

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isBulk = intent === 'bulk'
  const title = isBulk ? 'Bulk / Wholesale Order' : 'Product Inquiry'
  const subtitle = isBulk
    ? 'Share your business details — we will open WhatsApp with your order note.'
    : 'Tell us what you need — we will open WhatsApp with your inquiry.'

  return (
    <>
      <div className="pointer-events-none fixed right-3 bottom-4 z-[60] flex flex-col items-end gap-3 sm:right-5 sm:bottom-6">
        <button
          type="button"
          onClick={goTop}
          className="pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all duration-300 sm:h-12 sm:w-12"
          style={{
            backgroundColor: CREAM,
            color: INK,
            opacity: showTop ? 1 : 0,
            transform: showTop ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
            pointerEvents: showTop ? 'auto' : 'none',
          }}
          aria-label="Go to top"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => (step === 'idle' ? openChoose() : closeAll())}
          className="pointer-events-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
          style={{ backgroundColor: '#25D366', color: '#fff' }}
          aria-label={step === 'idle' ? 'Chat on WhatsApp' : 'Close WhatsApp form'}
          aria-expanded={step !== 'idle'}
        >
          {step === 'idle' ? <WhatsAppIcon className="h-6 w-6" /> : <CloseIcon className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {step !== 'idle' && (
          <motion.div
            className="fixed inset-0 z-[55] flex items-end justify-center p-4 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Faded backdrop */}
            <motion.button
              type="button"
              aria-label="Close"
              className="absolute inset-0 cursor-default border-0"
              style={{
                backgroundColor: 'rgba(4, 18, 12, 0.72)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
              onClick={closeAll}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${formId}-title`}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/12 shadow-[0_28px_80px_-24px_rgba(0,0,0,0.65)]"
              style={{ backgroundColor: INK }}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: 0.35, ease }}
            >
              <div className="pointer-events-none absolute inset-0">
                <img
                  src={TEXTURE}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover opacity-40 brightness-[0.85]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(165deg, rgba(10,46,34,0.88) 0%, rgba(8,32,24,0.94) 55%, rgba(6,22,16,0.97) 100%)',
                  }}
                />
              </div>

              <div className="relative z-10 p-5 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p
                      className="m-0 text-[0.62rem] font-semibold tracking-[0.18em] uppercase opacity-55"
                      style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                    >
                      WhatsApp · {CONTACT_PHONE_DISPLAY}
                    </p>
                    <h2
                      id={`${formId}-title`}
                      className="mt-1.5 m-0 text-[1.35rem] leading-tight tracking-tight"
                      style={{ color: CREAM, fontFamily: 'Anton, Impact, sans-serif' }}
                    >
                      {step === 'choose' ? 'How can we help?' : title}
                    </h2>
                    {step === 'form' && (
                      <p
                        className="mt-1.5 m-0 text-[0.82rem] leading-relaxed opacity-65"
                        style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                      >
                        {subtitle}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={closeAll}
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5"
                    style={{ color: CREAM }}
                    aria-label="Close"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {step === 'choose' && (
                    <motion.div
                      key="choose"
                      className="grid gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease }}
                    >
                      <button
                        type="button"
                        onClick={() => pickIntent('inquiry')}
                        className="group cursor-pointer rounded-xl border border-white/12 bg-white/5 px-4 py-4 text-left transition hover:border-[#b8860b]/45 hover:bg-white/10"
                      >
                        <span
                          className="block text-[0.95rem] font-semibold tracking-wide"
                          style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                        >
                          Inquiry
                        </span>
                        <span
                          className="mt-1 block text-[0.78rem] leading-snug opacity-55"
                          style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                        >
                          Product questions, samples, or general enquiries
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => pickIntent('bulk')}
                        className="group cursor-pointer rounded-xl border border-white/12 bg-white/5 px-4 py-4 text-left transition hover:border-[#b8860b]/45 hover:bg-white/10"
                      >
                        <span
                          className="block text-[0.95rem] font-semibold tracking-wide"
                          style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                        >
                          Bulk Order
                        </span>
                        <span
                          className="mt-1 block text-[0.78rem] leading-snug opacity-55"
                          style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                        >
                          Wholesale, retail, HORECA, or export quantities
                        </span>
                      </button>
                    </motion.div>
                  )}

                  {step === 'form' && intent && (
                    <motion.form
                      key={intent}
                      onSubmit={onSubmit}
                      className="grid gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease }}
                    >
                      <label className="grid gap-1.5">
                        <span
                          className="text-[0.68rem] tracking-[0.12em] uppercase opacity-55"
                          style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                        >
                          Full name *
                        </span>
                        <input
                          required
                          name="name"
                          autoComplete="name"
                          value={form.name}
                          onChange={update('name')}
                          className={fieldClass}
                          style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                          placeholder="Your name"
                        />
                      </label>

                      {isBulk && (
                        <label className="grid gap-1.5">
                          <span
                            className="text-[0.68rem] tracking-[0.12em] uppercase opacity-55"
                            style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                          >
                            Business / shop name *
                          </span>
                          <input
                            required
                            name="company"
                            value={form.company}
                            onChange={update('company')}
                            className={fieldClass}
                            style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                            placeholder="Company or shop"
                          />
                        </label>
                      )}

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="grid gap-1.5">
                          <span
                            className="text-[0.68rem] tracking-[0.12em] uppercase opacity-55"
                            style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                          >
                            Phone *
                          </span>
                          <input
                            required
                            type="tel"
                            name="phone"
                            autoComplete="tel"
                            value={form.phone}
                            onChange={update('phone')}
                            className={fieldClass}
                            style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                            placeholder="+91 …"
                          />
                        </label>
                        <label className="grid gap-1.5">
                          <span
                            className="text-[0.68rem] tracking-[0.12em] uppercase opacity-55"
                            style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                          >
                            City *
                          </span>
                          <input
                            required
                            name="city"
                            value={form.city}
                            onChange={update('city')}
                            className={fieldClass}
                            style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                            placeholder="Your city"
                          />
                        </label>
                      </div>

                      <label className="grid gap-1.5">
                        <span
                          className="text-[0.68rem] tracking-[0.12em] uppercase opacity-55"
                          style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                        >
                          Product interest *
                        </span>
                        <input
                          required
                          name="product"
                          value={form.product}
                          onChange={update('product')}
                          className={fieldClass}
                          style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                          placeholder={isBulk ? 'e.g. Saunf, Mix Mukhwas' : 'Which blend / pack?'}
                        />
                      </label>

                      {isBulk && (
                        <label className="grid gap-1.5">
                          <span
                            className="text-[0.68rem] tracking-[0.12em] uppercase opacity-55"
                            style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                          >
                            Approx quantity *
                          </span>
                          <input
                            required
                            name="quantity"
                            value={form.quantity}
                            onChange={update('quantity')}
                            className={fieldClass}
                            style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                            placeholder="e.g. 50 kg / 200 packs"
                          />
                        </label>
                      )}

                      <label className="grid gap-1.5">
                        <span
                          className="text-[0.68rem] tracking-[0.12em] uppercase opacity-55"
                          style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                        >
                          {isBulk ? 'Additional notes' : 'Message'}
                        </span>
                        <textarea
                          name="message"
                          rows={3}
                          value={form.message}
                          onChange={update('message')}
                          className={`${fieldClass} resize-none`}
                          style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                          placeholder={isBulk ? 'Delivery timeline, packaging…' : 'Any details for us…'}
                        />
                      </label>

                      <div className="mt-1 flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-[0.88rem] font-semibold tracking-wide transition hover:brightness-110"
                          style={{
                            backgroundColor: '#25D366',
                            color: '#fff',
                            fontFamily: 'Inter, sans-serif',
                            boxShadow: `0 10px 28px -12px ${GOLD}`,
                          }}
                        >
                          <WhatsAppIcon className="h-4 w-4" />
                          Continue on WhatsApp
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
