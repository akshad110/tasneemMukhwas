import { type FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { BRAND_TEXTURE } from '../../lib/brand'
import { buildFeedbackWhatsAppUrl } from '../../lib/contact'

const INK = '#0a2e22'
const CREAM = '#f2f4f5'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.62)'
const EASE = [0.22, 1, 0.36, 1] as const

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

type ContactFeedbackFormProps = {
  className?: string
  compact?: boolean
}

export default function ContactFeedbackForm({ className = '', compact = false }: ContactFeedbackFormProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName) {
      setError('Please enter your name.')
      return
    }
    if (!trimmedMessage) {
      setError('Please write your feedback or message.')
      return
    }

    setError('')
    const url = buildFeedbackWhatsAppUrl(trimmedName, trimmedMessage)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.section
      className={`relative w-full min-w-0 max-w-full overflow-hidden rounded-2xl border sm:rounded-3xl ${className}`}
      style={{
        borderColor: 'rgba(10,46,34,0.1)',
        boxShadow: '0 28px 64px -36px rgba(10,46,34,0.35)',
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: EASE }}
      aria-label="Share feedback"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src={BRAND_TEXTURE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.14]"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, rgba(10,46,34,0.96) 0%, rgba(10,46,34,0.88) 42%, rgba(10,46,34,0.94) 100%),
              radial-gradient(ellipse 50% 80% at 100% 0%, rgba(184,134,11,0.16) 0%, transparent 55%)
            `,
          }}
        />
      </div>

      <div
        className={`relative grid min-w-0 gap-6 ${compact ? 'p-4 sm:p-8' : 'p-4 sm:p-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:p-12'}`}
      >
        <div className={compact ? 'max-w-xl' : undefined}>
          <p
            className="m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase"
            style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
          >
            Your voice matters
          </p>
          <h2
            className={`m-0 mt-3 font-normal uppercase leading-[0.95] ${compact ? 'text-[clamp(1.75rem,5vw,2.35rem)]' : 'text-[clamp(2rem,5vw,2.85rem)]'}`}
            style={{ color: CREAM, fontFamily: 'Anton, Impact, sans-serif' }}
          >
            Share your
            <br />
            feedback
          </h2>
          <p
            className="m-0 mt-4 max-w-md text-[0.92rem] leading-relaxed"
            style={{ color: 'rgba(242,244,245,0.72)', fontFamily: 'Inter, sans-serif' }}
          >
            Loved our mukhwas? Have a suggestion? Tell us — we read every message and reply on WhatsApp.
          </p>

          {!compact ? (
            <ul className="mt-8 m-0 list-none space-y-3 p-0">
              {['Quick reply on WhatsApp', 'No account needed', 'Orders, taste & service feedback welcome'].map(
                (item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-[0.84rem]"
                    style={{ color: 'rgba(242,244,245,0.78)', fontFamily: 'Inter, sans-serif' }}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold"
                      style={{ backgroundColor: 'rgba(184,134,11,0.22)', color: GOLD }}
                      aria-hidden
                    >
                      ✓
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>
          ) : null}
        </div>

        <form
          onSubmit={onSubmit}
          className="min-w-0 rounded-2xl border p-4 sm:p-6"
          style={{
            borderColor: 'rgba(242,244,245,0.12)',
            backgroundColor: 'rgba(248,249,250,0.97)',
            backdropFilter: 'blur(8px)',
          }}
          noValidate
        >
          <label className="block">
            <span
              className="mb-2 block text-[0.68rem] font-semibold tracking-[0.12em] uppercase"
              style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
            >
              Your name
            </span>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Shah"
              autoComplete="name"
              className="w-full rounded-xl border px-4 py-3 text-[0.92rem] outline-none transition focus:border-[rgba(184,134,11,0.65)] focus:ring-2 focus:ring-[rgba(184,134,11,0.18)]"
              style={{
                borderColor: 'rgba(10,46,34,0.12)',
                backgroundColor: '#fff',
                color: INK,
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </label>

          <label className="mt-5 block">
            <span
              className="mb-2 block text-[0.68rem] font-semibold tracking-[0.12em] uppercase"
              style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
            >
              Your message
            </span>
            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your experience, product feedback, or any question…"
              rows={compact ? 4 : 5}
              className="w-full resize-y rounded-xl border px-4 py-3 text-[0.92rem] leading-relaxed outline-none transition focus:border-[rgba(184,134,11,0.65)] focus:ring-2 focus:ring-[rgba(184,134,11,0.18)]"
              style={{
                borderColor: 'rgba(10,46,34,0.12)',
                backgroundColor: '#fff',
                color: INK,
                fontFamily: 'Inter, sans-serif',
                minHeight: compact ? '7.5rem' : '9rem',
              }}
            />
          </label>

          {error ? (
            <p
              className="mt-4 m-0 text-[0.82rem] font-medium"
              style={{ color: '#b91c1c', fontFamily: 'Inter, sans-serif' }}
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border-0 py-3.5 text-[0.78rem] font-bold tracking-[0.08em] uppercase transition hover:brightness-110"
            style={{
              backgroundColor: GOLD,
              color: INK,
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 14px 32px -18px rgba(184,134,11,0.85)',
            }}
          >
            <WhatsAppIcon className="h-4 w-4" />
            Send on WhatsApp
          </button>

          <p
            className="mt-3 m-0 text-center text-[0.75rem] leading-relaxed"
            style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
          >
            Opens WhatsApp with your message pre-filled — just tap send.
          </p>
        </form>
      </div>
    </motion.section>
  )
}
