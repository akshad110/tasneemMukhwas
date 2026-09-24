import { BRAND_GOLD, BRAND_INK, BRAND_SANS } from '../../lib/brand'

const MESSAGES = [
  'Tradition in every bite',
  'Quality in every pack',
  'Authentic Indian mukhwas',
  'Hygienically packed',
  'Crafted in Chhapi, Gujarat',
  'Freshness after every meal',
] as const

const LOOP = [...MESSAGES, ...MESSAGES]

export default function HeroPromoStrip() {
  return (
    <div
      className="hero-promo-strip"
      role="region"
      aria-label="Tasneem Mukhwas highlights"
      style={{ backgroundColor: BRAND_INK, color: '#FFFBF4', fontFamily: BRAND_SANS }}
    >
      <ul className="hero-promo-strip__track">
        {LOOP.map((text, index) => (
          <li
            key={`${text}-${index}`}
            className="hero-promo-strip__item"
            aria-hidden={index >= MESSAGES.length}
          >
            <span className="hero-promo-strip__mark" style={{ color: BRAND_GOLD }} aria-hidden>
              ◆
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
