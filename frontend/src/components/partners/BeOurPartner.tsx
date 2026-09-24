import { motion } from 'framer-motion'
import {
  BRAND_CREAM,
  BRAND_INK,
  BRAND_GOLD,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
  BRAND_DISPLAY,
  HOME_SECTION_A,
} from '../../lib/brand'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, WHATSAPP_URL } from '../../lib/contact'

const EASE = [0.22, 1, 0.36, 1] as const
const PARTNER_IMAGE = '/Professionals_shaking_hands_2K_202608312346.jpeg'

const BENEFITS = [
  {
    id: 'packs',
    title: 'Retail-ready packs',
    body: 'Consistent quality, sealed freshness, and dependable dispatch support.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" strokeLinejoin="round" />
        <path d="M12 12v8M4 8.5 12 12l8-3.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'moq',
    title: 'Flexible MOQs',
    body: 'Scalable volumes for distributors, counters, and hospitality partners.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M4 18h16M6 18V8l6-4 6 4v10" strokeLinejoin="round" />
        <path d="M10 12h4M10 15h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'brand',
    title: 'Marketing assets',
    body: 'Label guidance, catalogue support, and exhibition-ready branding.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M8 9h8M8 12h5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'team',
    title: 'Direct coordination',
    body: 'Work hand-in-hand with our Chhapi production and sales team.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path d="M3 20a5 5 0 0 1 10 0M14 20a4 4 0 0 1 8 0" strokeLinecap="round" />
      </svg>
    ),
  },
] as const

export default function BeOurPartner() {
  return (
    <section
      id="be-our-partner"
      className="be-partner relative w-full overflow-hidden py-14 sm:py-16 lg:py-20"
      style={{ backgroundColor: HOME_SECTION_A }}
      aria-labelledby="be-partner-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 55% 45% at 12% 18%, rgba(184,134,11,0.14) 0%, transparent 55%), radial-gradient(circle at 88% 78%, rgba(10,46,34,0.07) 0%, transparent 42%)',
        }}
      />

      <div className="relative mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-8">
        <motion.header
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p
            className="m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase"
            style={{ color: BRAND_GOLD, fontFamily: BRAND_SANS }}
          >
            Grow with Tasneem
          </p>
          <h2
            id="be-partner-title"
            className="mt-2 m-0 uppercase"
            style={{
              color: BRAND_INK,
              fontFamily: BRAND_DISPLAY,
              fontSize: 'clamp(1.85rem, 4.5vw, 2.85rem)',
              fontWeight: 400,
              letterSpacing: '0.05em',
              lineHeight: 1.08,
            }}
          >
            Be Our Partner
          </h2>
          <p
            className="mt-4 m-0 text-[0.92rem] leading-relaxed sm:text-[0.98rem]"
            style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
          >
            Join our network of distributors, retailers, and hospitality partners across Gujarat and
            beyond. We supply sealed mukhwas blends with dependable fulfilment and brand support.
          </p>
        </motion.header>

        <div className="mt-10 grid items-stretch gap-6 lg:mt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <motion.div
            className="be-partner__benefits-grid grid gap-3 sm:grid-cols-2 sm:gap-4"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.06, ease: EASE }}
          >
            {BENEFITS.map((item, i) => (
              <motion.article
                key={item.id}
                className="be-partner__benefit-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.06, ease: EASE }}
              >
                <span className="be-partner__benefit-icon" aria-hidden>
                  {item.icon}
                </span>
                <h3
                  className="m-0 text-[0.92rem] font-semibold leading-snug sm:text-[0.96rem]"
                  style={{ color: BRAND_INK, fontFamily: BRAND_SERIF }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-1.5 m-0 text-[0.78rem] leading-relaxed sm:text-[0.82rem]"
                  style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
                >
                  {item.body}
                </p>
              </motion.article>
            ))}
          </motion.div>

          <motion.aside
            className="be-partner__enquiry"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
          >
            <div className="be-partner__enquiry-image-wrap section-image-hover">
              <img
                src={PARTNER_IMAGE}
                alt="Business partners shaking hands at a Tasneem Mukhwas retail store"
                loading="lazy"
                decoding="async"
                className="be-partner__enquiry-image section-image-hover__img"
              />
              <div className="be-partner__enquiry-image-overlay" aria-hidden />
            </div>

            <div className="be-partner__enquiry-body">
              <p
                className="m-0 text-[0.62rem] font-semibold tracking-[0.18em] uppercase"
                style={{ color: BRAND_GOLD, fontFamily: BRAND_SANS }}
              >
                Partnership enquiry
              </p>
              <h3
                className="mt-2 m-0 text-[clamp(1.25rem,2.8vw,1.55rem)] leading-tight"
                style={{ color: BRAND_CREAM, fontFamily: BRAND_SERIF }}
              >
                Start a partnership enquiry
              </h3>
              <p
                className="mt-2.5 m-0 text-[0.82rem] leading-relaxed"
                style={{ color: 'rgba(255,254,242,0.82)', fontFamily: BRAND_SANS }}
              >
                Share your city, business type, and monthly volume. Our team will respond with
                pricing, catalogue options, and onboarding steps.
              </p>

              <div className="be-partner__contact-list">
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="be-partner__contact-row"
                  style={{ fontFamily: BRAND_SANS }}
                >
                  <span className="be-partner__contact-label">Phone</span>
                  <span className="be-partner__contact-value">{CONTACT_PHONE_DISPLAY}</span>
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="be-partner__contact-row"
                  style={{ fontFamily: BRAND_SANS }}
                >
                  <span className="be-partner__contact-label">Email</span>
                  <span className="be-partner__contact-value">{CONTACT_EMAIL}</span>
                </a>
              </div>

              <div className="be-partner__actions">
                <button
                  type="button"
                  onClick={() => navigateApp(APP_ROUTES.wholesale)}
                  className="be-partner__btn be-partner__btn--primary"
                  style={{ fontFamily: BRAND_SANS }}
                >
                  Wholesale enquiry
                </button>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="be-partner__btn be-partner__btn--ghost"
                  style={{ fontFamily: BRAND_SANS }}
                >
                  WhatsApp us
                </a>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
