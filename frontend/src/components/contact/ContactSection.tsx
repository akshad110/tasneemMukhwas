import { useState } from 'react'
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from '../../lib/contact'
import { BRAND_BRANCHES } from '../../lib/brandBranches'
import ContactGlobe from './ContactGlobe'

const PAGE = '#f2f4f5'
const INK = '#0a2e22'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.68)'
const SECTION_TEXTURE = '/image.png_2K_202608092240.jpeg'

/**
 * Contact — OrbitDot Globe + parent company / sister brand panel.
 */
export default function ContactSection() {
  const [activeId, setActiveId] = useState(BRAND_BRANCHES[0].id)
  const active = BRAND_BRANCHES.find((b) => b.id === activeId) ?? BRAND_BRANCHES[0]

  return (
    <section
      id="contact"
      className="relative w-full overflow-x-clip px-4 py-14 sm:px-8 md:py-20 lg:px-10"
      style={{ backgroundColor: PAGE }}
      aria-label="Contact"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src={SECTION_TEXTURE}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            filter: 'brightness(1.55) saturate(0.35) contrast(0.88)',
            opacity: 0.42,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, rgba(242,244,245,0.82) 0%, rgba(242,244,245,0.55) 45%, rgba(242,244,245,0.88) 100%),
              radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,252,245,0.5) 0%, transparent 70%)
            `,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto mb-10 max-w-7xl text-center md:mb-14">
        <h2
          className="m-0 uppercase"
          style={{
            color: INK,
            fontFamily: 'Anton, Impact, sans-serif',
            fontSize: 'clamp(2.75rem, 9vw, 7rem)',
            fontWeight: 400,
            letterSpacing: '0.04em',
            lineHeight: 0.95,
          }}
        >
          Contact
        </h2>
        <p
          className="mx-auto mt-3 max-w-lg text-[0.85rem] leading-relaxed"
          style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
        >
          Reach Tasneem Mukhwas and our sister brands from one Chhapi address.
        </p>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
        <ContactGlobe />

        <div className="flex flex-col gap-4">
          <p
            className="m-0 text-[0.62rem] font-semibold tracking-[0.16em] uppercase"
            style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
          >
            Our parent company and branches
          </p>

          <div className="flex flex-wrap gap-2">
            {BRAND_BRANCHES.map((brand) => {
              const selected = brand.id === activeId
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => setActiveId(brand.id)}
                  className="cursor-pointer rounded-full px-3 py-1.5 text-[0.65rem] font-semibold tracking-wide uppercase transition-colors sm:text-[0.7rem]"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: selected ? GOLD : 'transparent',
                    color: selected ? INK : INK,
                    border: `1px solid ${selected ? GOLD : 'rgba(10,46,34,0.22)'}`,
                    opacity: selected ? 1 : 0.78,
                  }}
                >
                  {brand.name}
                </button>
              )
            })}
          </div>

          <article
            className="rounded-2xl px-5 py-5 sm:px-6 sm:py-6"
            style={{
              backgroundColor: 'rgba(248,249,250,0.72)',
              border: '1px solid rgba(10,46,34,0.1)',
              backdropFilter: 'blur(6px)',
              boxShadow: '0 12px 40px -28px rgba(10,46,34,0.35)',
            }}
          >
            <p
              className="m-0 text-[0.62rem] font-semibold tracking-[0.16em] uppercase"
              style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
            >
              Brand
            </p>
            <h3
              className="m-0 mt-1.5 text-[1.15rem] font-bold leading-tight tracking-wide uppercase sm:text-[1.35rem]"
              style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
            >
              {active.name}
            </h3>
            <p
              className="m-0 mt-2 text-[0.8rem] leading-relaxed"
              style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
            >
              {CONTACT_ADDRESS}
            </p>
            <p
              className="m-0 mt-3 text-[0.88rem] leading-relaxed"
              style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
            >
              {active.description}
            </p>
            <p
              className="m-0 mt-2.5 text-[0.8rem] leading-relaxed"
              style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
            >
              {active.about}
            </p>

            <dl
              className="mt-5 grid gap-3 border-t pt-4 text-[0.8rem] sm:grid-cols-2"
              style={{ borderColor: 'rgba(10,46,34,0.12)' }}
            >
              <div>
                <dt
                  className="m-0 text-[0.62rem] font-semibold tracking-[0.12em] uppercase"
                  style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
                >
                  Phone
                </dt>
                <dd className="m-0 mt-1" style={{ color: INK, fontFamily: 'Inter, sans-serif' }}>
                  <a href={`tel:${CONTACT_PHONE_TEL}`} className="cursor-pointer hover:underline">
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </dd>
              </div>
              <div>
                <dt
                  className="m-0 text-[0.62rem] font-semibold tracking-[0.12em] uppercase"
                  style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
                >
                  Email
                </dt>
                <dd className="m-0 mt-1" style={{ color: INK, fontFamily: 'Inter, sans-serif' }}>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="cursor-pointer break-all hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  )
}
