import { type FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { buildReviewWhatsAppUrl } from '../../lib/contact'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { BRAND_SERIF } from '../../lib/brand'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.62)'
const EASE = [0.22, 1, 0.36, 1] as const

const RATING_LABELS = ['', 'Could be better', 'Okay', 'Good', 'Great', 'Loved it!']

function StarPicker({
  rating,
  hover,
  onPick,
  onHover,
}: {
  rating: number
  hover: number
  onPick: (n: number) => void
  onHover: (n: number) => void
}) {
  const active = hover || rating

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-0.5 sm:gap-1" role="radiogroup" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = active >= n
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n === 1 ? '' : 's'}`}
              onMouseEnter={() => onHover(n)}
              onMouseLeave={() => onHover(0)}
              onFocus={() => onHover(n)}
              onBlur={() => onHover(0)}
              onClick={() => onPick(n)}
              className="home-review-star cursor-pointer border-0 bg-transparent p-0.5 text-[1.35rem] leading-none transition-transform duration-150 hover:scale-110 sm:text-[1.55rem]"
              style={{ color: filled ? '#FFD966' : 'rgba(10,46,34,0.22)' }}
            >
              ★
            </button>
          )
        })}
      </div>
      <span
        className="min-h-[1rem] text-[0.62rem] font-medium tracking-wide"
        style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
        aria-live="polite"
      >
        {active > 0 ? RATING_LABELS[active] : 'Tap to rate'}
      </span>
    </div>
  )
}

/** Compact homepage review ribbon — distinct from contact / checkout forms. */
export default function HomeReviewStrip() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    const trimmedComment = comment.trim()

    if (rating < 1) {
      setError('Pick a star rating first.')
      return
    }
    if (!trimmedName) {
      setError('Your first name helps us say thank you.')
      return
    }
    if (trimmedComment.length < 8) {
      setError('A short line about taste or freshness (min. 8 characters).')
      return
    }

    setError('')
    const url = buildReviewWhatsAppUrl(trimmedName, rating, trimmedComment)
    window.open(url, '_blank', 'noopener,noreferrer')
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <motion.section
      className="home-review-strip relative w-full overflow-hidden bg-white px-3 py-8 sm:px-6 sm:py-10 md:px-8"
      aria-label="Leave a quick review"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-5 flex flex-col gap-1 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="m-0 text-[0.62rem] font-semibold tracking-[0.22em] uppercase"
              style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
            >
              30-second review
            </p>
            <h2
              className="m-0 mt-1 text-[clamp(1.35rem,3.2vw,1.85rem)] leading-tight"
              style={{ color: INK, fontFamily: BRAND_SERIF }}
            >
              How was your mukhwas?
            </h2>
          </div>
          {user ? (
            <button
              type="button"
              onClick={() => navigateApp(APP_ROUTES.myOrders)}
              className="mt-1 w-fit cursor-pointer border-0 bg-transparent p-0 text-[0.72rem] font-medium underline-offset-2 hover:underline sm:mt-0"
              style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
            >
              Review a past order →
            </button>
          ) : null}
        </div>

        <form
          onSubmit={onSubmit}
          className="home-review-form rounded-2xl border p-4 sm:p-5"
          style={{
            borderColor: 'rgba(10,46,34,0.12)',
            backgroundColor: 'rgba(248,249,250,0.92)',
          }}
          noValidate
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <StarPicker
              rating={rating}
              hover={hover}
              onPick={setRating}
              onHover={setHover}
            />

            <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <label className="home-review-field min-w-0">
                <span className="home-review-field__label">Name</span>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className="home-review-field__input"
                />
              </label>
              <label className="home-review-field min-w-0">
                <span className="home-review-field__label">In one line</span>
                <input
                  type="text"
                  name="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Fresh, crunchy, perfect after meals…"
                  maxLength={160}
                  className="home-review-field__input"
                />
              </label>
            </div>
          </div>

          <div className="mt-4 flex sm:mt-5 sm:justify-end">
            <button
              type="submit"
              className={`home-review-submit ${sent ? 'home-review-submit--sent' : ''}`}
              disabled={sent}
            >
              {sent ? (
                <>
                  <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                    <path d="M5 10l3.5 3.5L15 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Review sent
                </>
              ) : (
                <>
                  Share review
                  <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
                    <path d="M10.5 3.5 16 9l-5.5 5.5V11H4V7h6.5V3.5Z" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {error ? (
            <p className="home-review-error mt-3 m-0" role="alert">
              {error}
            </p>
          ) : null}

          <p className="home-review-note mt-3 m-0 sm:mt-4">
            Opens WhatsApp with your rating pre-filled — no login needed. We publish selected reviews after verification.
          </p>
        </form>
      </div>
    </motion.section>
  )
}
