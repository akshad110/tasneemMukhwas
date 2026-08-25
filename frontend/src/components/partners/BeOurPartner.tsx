import {
  BRAND_CREAM,
  BRAND_CREAM_LIGHT,
  BRAND_INK,
  BRAND_GOLD,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
  BRAND_DISPLAY,
} from '../../lib/brand'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, WHATSAPP_URL } from '../../lib/contact'

const INK = BRAND_INK
const MUTED = BRAND_MUTED
const GOLD = BRAND_GOLD

const BENEFITS = [
  'Retail-ready packs with consistent quality and dispatch support.',
  'Flexible MOQs for distributors, counters, and hospitality partners.',
  'Marketing assets, label guidance, and exhibition-ready branding.',
  'Direct coordination with our Chhapi production team.',
] as const

export default function BeOurPartner() {
  return (
    <section
      id="be-our-partner"
      className="relative w-full overflow-hidden px-4 py-12 md:px-8 md:py-16 lg:px-10"
      style={{ backgroundColor: BRAND_CREAM_LIGHT }}
      aria-label="Be our partner"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p
          className="m-0 text-[0.68rem] font-semibold tracking-[0.18em] uppercase"
          style={{ color: GOLD, fontFamily: BRAND_SANS }}
        >
          Grow with Tasneem
        </p>
        <h2
          className="mt-2 m-0 uppercase"
          style={{
            color: INK,
            fontFamily: BRAND_DISPLAY,
            fontSize: 'clamp(1.5rem, 3.8vw, 2.65rem)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            lineHeight: 1.05,
          }}
        >
          Be Our Partner
        </h2>

        <p
          className="mt-4 m-0 max-w-2xl text-sm leading-relaxed md:text-base"
          style={{ color: MUTED, fontFamily: BRAND_SANS }}
        >
          Join our network of distributors, retailers, and hospitality partners across Gujarat and
          beyond. We supply sealed mukhwas blends with dependable fulfilment and brand support.
        </p>

        <ul className="mt-6 m-0 flex w-full max-w-xl list-none flex-col gap-3 p-0 text-left">
          {BENEFITS.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-relaxed md:text-[0.92rem]"
              style={{ color: INK, fontFamily: BRAND_SANS }}
            >
              <span
                className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: GOLD }}
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 w-full max-w-xl">
          <h3
            className="m-0 text-lg"
            style={{ color: INK, fontFamily: BRAND_SERIF }}
          >
            Start a partnership enquiry
          </h3>
          <p
            className="mt-2 m-0 text-sm leading-relaxed"
            style={{ color: MUTED, fontFamily: BRAND_SANS }}
          >
            Share your city, business type, and monthly volume. Our team will respond with pricing,
            catalogue options, and onboarding steps.
          </p>
          <div
            className="mt-5 flex flex-col items-center gap-2.5 text-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <p className="m-0" style={{ color: INK }}>
              <span className="font-semibold">Phone:</span> {CONTACT_PHONE_DISPLAY}
            </p>
            <p className="m-0" style={{ color: INK }}>
              <span className="font-semibold">Email:</span> {CONTACT_EMAIL}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigateApp(APP_ROUTES.wholesale)}
              className="cursor-pointer rounded-full border-0 px-5 py-2.5 text-[0.78rem] font-semibold tracking-[0.12em] uppercase transition hover:brightness-110"
              style={{ backgroundColor: INK, color: BRAND_CREAM, fontFamily: BRAND_SANS }}
            >
              Wholesale enquiry
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border px-5 py-2.5 text-[0.78rem] font-semibold tracking-[0.12em] uppercase no-underline transition-colors hover:bg-[#0a2e22] hover:text-white"
              style={{
                color: INK,
                borderColor: 'rgba(10,46,34,0.28)',
                fontFamily: BRAND_SANS,
              }}
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
