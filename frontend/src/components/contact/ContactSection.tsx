import { memo, useState } from 'react'
import {
  CONTACT_ADDRESS,
  CONTACT_COORDINATES,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from '../../lib/contact'
import OrbitDotGlobe from '../framer/OrbitDotGlobe.js'

const CREAM = '#f3e6c8'
const PAGE = '#f7f1e4'
const INK = '#0a2e22'
const GOLD = '#b8860b'
const GOLD_SHINE = '#f5d76e'
const MUTED = 'rgba(10,46,34,0.68)'
const SECTION_TEXTURE = '/image.png_2K_202608092240.jpeg'
const GLOBE_OCEAN = '#0a100e'
const GLOBE_LAND = '#e2c878'

type Brand = {
  id: string
  name: string
  short: string
  description: string
  about: string
}

const BRANDS: Brand[] = [
  {
    id: 'furat-gruh',
    name: 'FURAT GRUH UDHYOG',
    short: 'Furat Gruh',
    description: 'Our parent manufacturing house for mukhwas, seeds, and traditional mouth fresheners.',
    about:
      'Rooted in Chhapi, Banaskantha — the home unit behind Tasneem Mukhwas packing, quality checks, and bulk dispatch.',
  },
  {
    id: 'master-paan',
    name: 'MASTER PAAN',
    short: 'Master Paan',
    description: 'Sister brand for paan-inspired flavours and festive mouth-freshener mixes.',
    about:
      'Crafted under the same hygiene standards — ideal for retail counters, gift packs, and HORECA partners.',
  },
  {
    id: 'patel-mukhwas',
    name: 'PATEL MUKHWAS',
    short: 'Patel Mukhwas',
    description: 'Classic Patel-line mukhwas blends trusted across Gujarat and beyond.',
    about:
      'Everyday digestive mixes and traditional recipes from the same Chhapi facility network.',
  },
  {
    id: 'furat-agarbatti',
    name: 'FURAT AGARBATTI',
    short: 'Furat Agarbatti',
    description: 'Sister line for incense and fragrance products from the Furat family of brands.',
    about:
      'Complementary home fragrance range produced alongside our food craft legacy in Banaskantha.',
  },
]

/** Single Gujarat HQ marker — all brands share one address. */
const GLOBE_LOCATIONS = [
  {
    name: 'Chhapi',
    coordinates: CONTACT_COORDINATES,
    color: GOLD_SHINE,
    pulse: true,
    showLabel: true,
    action: 'none' as const,
  },
]

const ContactGlobe = memo(function ContactGlobe() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[480px] lg:max-w-none"
      style={{ minHeight: 280 }}
    >
      <OrbitDotGlobe
        oceanColor={GLOBE_OCEAN}
        landColor={GLOBE_LAND}
        dotSize={1.9}
        dotDensity={3}
        autoRotate
        labelStyle="auto"
        showQuickStart={false}
        locations={GLOBE_LOCATIONS}
        style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
      />
    </div>
  )
})

/**
 * Contact — OrbitDot Globe + parent company / sister brand panel.
 */
export default function ContactSection() {
  const [activeId, setActiveId] = useState(BRANDS[0].id)
  const active = BRANDS.find((b) => b.id === activeId) ?? BRANDS[0]

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
              linear-gradient(180deg, rgba(247,241,228,0.82) 0%, rgba(243,230,200,0.55) 45%, rgba(247,241,228,0.88) 100%),
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
            {BRANDS.map((brand) => {
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
              backgroundColor: 'rgba(255,252,247,0.72)',
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
