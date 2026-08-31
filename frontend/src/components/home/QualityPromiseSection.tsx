import type { ReactNode } from 'react'
import {
  BRAND_DISPLAY,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
} from '../../lib/brand'

const PROMISE_IMAGE = encodeURI('/Mukhwas_pack_on_marble_countertop_202608312343.jpeg')

type QualityBadge = {
  id: string
  ringTop: string
  ringBottom: string
  icon: ReactNode
}

function BadgeIconFlask() {
  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8 sm:h-9 sm:w-9" fill="none" stroke="currentColor" strokeWidth="1.85" aria-hidden>
      <path d="M22 8h4v8l6 14a6 6 0 0 1-5.5 8.5H15.5A6 6 0 0 1 10 30l6-14V8" strokeLinejoin="round" />
      <path d="M18 8h12" strokeLinecap="round" />
      <circle cx="30" cy="18" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="27" cy="22" r="0.9" fill="currentColor" stroke="none" />
      <path d="M10 38 L38 10" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  )
}

function BadgeIconNut() {
  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8 sm:h-9 sm:w-9" fill="none" stroke="currentColor" strokeWidth="1.85" aria-hidden>
      <path d="M24 10c7 0 12 5.5 12 12.5 0 9-7 16.5-12 16.5S12 32 12 22.5C12 15.5 17 10 24 10Z" strokeLinejoin="round" />
      <path d="M30 14c2.5 2 4 5 4 8.5" strokeLinecap="round" />
      <path d="M18 28c2-1.5 4-2 6-2s4 .5 6 2" strokeLinecap="round" />
    </svg>
  )
}

function BadgeIconLeaf() {
  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8 sm:h-9 sm:w-9" fill="none" stroke="currentColor" strokeWidth="1.85" aria-hidden>
      <path d="M24 38V24" strokeLinecap="round" />
      <path d="M24 24C24 14 34 10 38 14c-2 9-9 14-14 16" strokeLinejoin="round" />
      <path d="M24 24C24 14 14 10 10 14c2 9 9 14 14 16" strokeLinejoin="round" />
      <path d="M24 30c-3.5 1.5-7 1.5-10.5 0M24 30c3.5 1.5 7 1.5 10.5 0" strokeLinecap="round" />
    </svg>
  )
}

const BADGES: QualityBadge[] = [
  {
    id: 'natural',
    ringTop: 'NO ARTIFICIAL COLOURS',
    ringBottom: 'NO PRESERVATIVES',
    icon: <BadgeIconFlask />,
  },
  {
    id: 'supari-free',
    ringTop: 'SUPARI-FREE',
    ringBottom: 'SUPARI-FREE',
    icon: <BadgeIconNut />,
  },
  {
    id: 'quality',
    ringTop: 'CRAFTED WITH',
    ringBottom: 'HIGH-QUALITY INGREDIENTS',
    icon: <BadgeIconLeaf />,
  },
]

const BADGE_RING = '#5c4033'

function QualityBadgeRing({ badge }: { badge: QualityBadge }) {
  const cx = 70
  const cy = 70
  const textR = 57

  return (
    <figure className="quality-badge m-0 flex flex-col items-center">
      <div className="quality-badge__ring" aria-hidden>
        <svg viewBox="0 0 140 140" className="quality-badge__svg">
          <defs>
            <path
              id={`${badge.id}-top`}
              d={`M ${cx - textR} ${cy} A ${textR} ${textR} 0 0 1 ${cx + textR} ${cy}`}
              fill="none"
            />
            <path
              id={`${badge.id}-bottom`}
              d={`M ${cx + textR} ${cy} A ${textR} ${textR} 0 0 1 ${cx - textR} ${cy}`}
              fill="none"
            />
          </defs>
          {/* Thick outer ring */}
          <circle cx={cx} cy={cy} r="68" fill={BADGE_RING} />
          <circle cx={cx} cy={cy} r="46" fill="#FFFEF2" />
          <text
            fill="#FFFEF2"
            fontFamily="Montserrat, system-ui, sans-serif"
            fontSize="7.8"
            fontWeight="700"
            letterSpacing="0.1em"
          >
            <textPath href={`#${badge.id}-top`} startOffset="50%" textAnchor="middle">
              {badge.ringTop}
            </textPath>
          </text>
          <text
            fill="#FFFEF2"
            fontFamily="Montserrat, system-ui, sans-serif"
            fontSize="7.8"
            fontWeight="700"
            letterSpacing="0.1em"
          >
            <textPath href={`#${badge.id}-bottom`} startOffset="50%" textAnchor="middle">
              {badge.ringBottom}
            </textPath>
          </text>
        </svg>
        <div className="quality-badge__icon">{badge.icon}</div>
      </div>
      <figcaption className="sr-only">
        {badge.ringTop} {badge.ringBottom}
      </figcaption>
    </figure>
  )
}

export default function QualityPromiseSection() {
  return (
    <section
      id="quality-promise"
      className="quality-promise relative w-full"
      aria-label="Our quality promise"
    >
      <div className="quality-promise__card">
        <div className="quality-promise__split">
          <div className="quality-promise__visual">
            <div className="quality-promise__visual-frame">
              <img
                src={PROMISE_IMAGE}
                alt="Tasneem mukhwas pack on a marble countertop with a bowl of seeds"
                loading="lazy"
                decoding="async"
                draggable={false}
                className="quality-promise__photo"
              />
            </div>
          </div>

          <div className="quality-promise__divider" aria-hidden />

          <div className="quality-promise__panel">
            <div className="quality-promise__panel-inner">
              <p className="quality-promise__eyebrow m-0 uppercase">Our promise</p>
              <h2
                className="quality-promise__title m-0 uppercase"
                style={{ fontFamily: BRAND_DISPLAY, color: BRAND_INK }}
              >
                Pure Today,
                <br />
                Trusted Always!
              </h2>

              <p
                className="quality-promise__copy mt-4"
                style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
              >
                Every Tasneem Mukhwas pack is made with carefully selected ingredients — clean
                formulation, hygienic processing, and the authentic taste Gujarat has loved for
                generations.
              </p>

              <div className="quality-promise__badges mt-6 sm:mt-8">
                {BADGES.map((badge) => (
                  <QualityBadgeRing key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
