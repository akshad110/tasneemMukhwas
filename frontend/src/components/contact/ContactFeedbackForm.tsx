import { type FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BRAND_CREAM,
  BRAND_CREAM_LIGHT,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
} from '../../lib/brand'
import { buildFeedbackWhatsAppUrl } from '../../lib/contact'

const INK = BRAND_INK
const CREAM = BRAND_CREAM
const CREAM_LIGHT = BRAND_CREAM_LIGHT
const MUTED = BRAND_MUTED
const BORDER = '#E6D8C3'
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
      className={`relative w-full min-w-0 max-w-full overflow-hidden border-2 ${className}`}
      style={{
        borderColor: BORDER,
        backgroundColor: CREAM_LIGHT,
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: EASE }}
      aria-label="Share feedback"
    >
      <div
        className={`grid min-w-0 gap-8 ${compact ? 'p-5 sm:p-8' : 'p-5 sm:p-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:p-12'}`}
      >
        <div className={compact ? 'max-w-xl' : undefined}>
          <p
            className="m-0 text-[0.62rem] font-semibold tracking-[0.18em] uppercase"
            style={{ color: MUTED, fontFamily: BRAND_SANS }}
          >
            Your voice matters
          </p>
          <h2
            className={`m-0 mt-3 leading-[1.08] tracking-[-0.02em] ${compact ? 'text-[clamp(1.65rem,4vw,2.2rem)]' : 'text-[clamp(1.85rem,4vw,2.65rem)]'}`}
            style={{ color: INK, fontFamily: BRAND_SERIF }}
          >
            Share your feedback
          </h2>
          <p
            className="m-0 mt-4 max-w-md text-[0.94rem] leading-[1.75]"
            style={{ color: MUTED, fontFamily: BRAND_SANS }}
          >
            Loved our mukhwas? Have a suggestion? Tell us — we read every message and reply on WhatsApp.
          </p>

          {!compact ? (
            <ul className="mt-8 m-0 list-none space-y-3 p-0">
              {['Quick reply on WhatsApp', 'No account needed', 'Orders, taste & service feedback welcome'].map(
                (item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-[0.88rem]"
                    style={{ color: MUTED, fontFamily: BRAND_SANS }}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center border text-[0.62rem] font-bold"
                      style={{ borderColor: BORDER, backgroundColor: CREAM, color: INK }}
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
          className="min-w-0 border-2 p-5 sm:p-6"
          style={{
            borderColor: BORDER,
            backgroundColor: CREAM,
          }}
          noValidate
        >
          <label className="block">
            <span
              className="mb-2 block text-[0.62rem] font-semibold tracking-[0.14em] uppercase"
              style={{ color: MUTED, fontFamily: BRAND_SANS }}
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
              className="w-full border-2 px-4 py-3 text-[0.92rem] outline-none transition focus:border-[#0a2e22]"
              style={{
                borderColor: BORDER,
                backgroundColor: CREAM_LIGHT,
                color: INK,
                fontFamily: BRAND_SANS,
              }}
            />
          </label>

          <label className="mt-5 block">
            <span
              className="mb-2 block text-[0.62rem] font-semibold tracking-[0.14em] uppercase"
              style={{ color: MUTED, fontFamily: BRAND_SANS }}
            >
              Your message
            </span>
            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your experience, product feedback, or any question…"
              rows={compact ? 4 : 5}
              className="w-full resize-y border-2 px-4 py-3 text-[0.92rem] leading-relaxed outline-none transition focus:border-[#0a2e22]"
              style={{
                borderColor: BORDER,
                backgroundColor: CREAM_LIGHT,
                color: INK,
                fontFamily: BRAND_SANS,
                minHeight: compact ? '7.5rem' : '9rem',
              }}
            />
          </label>

          {error ? (
            <p className="mt-4 m-0 text-[0.82rem] font-medium text-[#a32020]" role="alert" style={{ fontFamily: BRAND_SANS }}>
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2.5 border-0 px-6 py-3.5 text-[0.74rem] font-semibold tracking-[0.1em] uppercase transition hover:brightness-110"
            style={{
              backgroundColor: INK,
              color: CREAM_LIGHT,
              fontFamily: BRAND_SANS,
            }}
          >
            <WhatsAppIcon className="h-4 w-4" />
            Send on WhatsApp
          </button>

          <p className="mt-3 m-0 text-center text-[0.76rem] leading-relaxed" style={{ color: MUTED, fontFamily: BRAND_SANS }}>
            Opens WhatsApp with your message pre-filled — just tap send.
          </p>
        </form>
      </div>
    </motion.section>
  )
}
