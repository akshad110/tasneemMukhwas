import { BRAND_CREAM, BRAND_GOLD, BRAND_INK, BRAND_SANS } from '../../lib/brand'

const INK = BRAND_INK
const CREAM = BRAND_CREAM
const GOLD = BRAND_GOLD

const BADGES = [
  {
    label: '100% Natural',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M12 3c4 4 6 7.5 6 11a6 6 0 1 1-12 0c0-3.5 2-7 6-11Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 14v4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'FSSAI Approved',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M12 3 4 6v5c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-3Z" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Global Shipping',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Hygienically Packed',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M4 8h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" strokeLinejoin="round" />
        <path d="M8 8V6a4 4 0 0 1 8 0v2" strokeLinecap="round" />
      </svg>
    ),
  },
] as const

/** Slim trust strip directly under the sticky navbar */
export default function TrustBadges() {
  return (
    <div
      className="relative z-40 w-full border-b border-[#0a2e22]/10"
      style={{ backgroundColor: CREAM }}
      aria-label="Trust badges"
    >
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-3 py-2.5 sm:gap-x-10 sm:px-6 md:py-3">
        {BADGES.map((badge) => (
          <li
            key={badge.label}
            className="flex items-center gap-2 text-[0.72rem] font-semibold tracking-wide sm:text-[0.8rem]"
            style={{ color: INK, fontFamily: BRAND_SANS }}
          >
            <span style={{ color: GOLD }}>{badge.icon}</span>
            <span>{badge.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
