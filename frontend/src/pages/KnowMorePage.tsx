import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/nav/Navbar'
import SiteFooter from '../components/shared/SiteFooter'
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from '../lib/contact'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const PAGE_BG = '#f4f7f5'
const SOFT_GREEN = '#e8f0ea'
const MUTED = 'rgba(10,46,34,0.62)'

const SANS = 'Montserrat, system-ui, sans-serif'
const SERIF = '"Playfair Display", Georgia, serif'

const CERTIFICATIONS = [
  {
    src: encodeURI('/FINAL-FRUT GRUH(WHO GMP)_page-0001.jpg'),
    eyebrow: 'WHO-GMP',
    title: 'Certificate of Compliance',
    body: 'Furat Gruh Udhyog is certified for Good Manufacturing Practice as laid down by the World Health Organization — covering manufacturing, processing, roasting, flavouring, packing, and supply of mukhwas, mouth fresheners, and related products from our Chhapi facility.',
  },
  {
    src: encodeURI('/FURAT IEC CERTIFICATE_page-0001.jpg'),
    eyebrow: 'DGFT · India',
    title: 'Importer-Exporter Code',
    body: 'Issued by the Directorate General of Foreign Trade to Furat Gruh Udhyog (IEC AAEFF9922C). Signatory Patel Abidali Yarbhai — enabling lawful export and import of our food craft from Banaskantha, Gujarat.',
  },
  {
    src: encodeURI('/FURAT MSME CERTI_page-0001.jpg'),
    eyebrow: 'MSME · Udyam',
    title: 'Udyam Registration',
    body: 'Registered as a Micro manufacturing enterprise (UDYAM-GJ-04-0047609) under the Ministry of MSME. In business since 2016 — formal recognition of Furat Gruh Udhyog as a government-registered food manufacturer.',
  },
] as const

const LICENCES = [
  {
    src: encodeURI('/WhatsApp Image 2026-08-15 at 12.02.16 PM.jpeg'),
    title: 'Trade Fair 2026',
    caption:
      'Participation certificate for M/s. Furat Gruh Udyog — Chappi at Maktabah Jafariyah Trade Fair 2026 (Stall No. 45 & 46).',
  },
  {
    src: encodeURI('/WhatsApp Image 2026-08-15 at 12.02.17 PM (1).jpeg'),
    title: 'Award of Excellence 2025',
    caption:
      'Honoured at Khadhya Khurak 2025 — the International Exhibition on Food Processing & Hospitality in Gandhinagar, Gujarat.',
  },
  {
    src: encodeURI('/WhatsApp Image 2026-08-15 at 12.02.17 PM.jpeg'),
    title: 'AHOA Centenary Honour',
    caption:
      'Recognized by the Ahmedabad Hotel Owner’s Association for shaping Ahmedabad’s food heritage across decades of industry excellence.',
  },
  {
    src: encodeURI('/WhatsApp Image 2026-08-15 at 12.02.18 PM.jpeg'),
    title: 'Trade Fair 2016',
    caption:
      'Early exhibition milestone — participation certificate for M/s. Furat Gruh Udyog, Pirojpura at Trade Fair 2016.',
  },
] as const

const EXHIBITION = [
  {
    src: '/license-khadhya-khurak-2025.png',
    title: 'Gandhinagar Food Expo',
    blurb: 'Showcasing hygienic mukhwas and seed blends to national buyers and hospitality partners.',
  },
  {
    src: '/license-trade-fair-2026.png',
    title: 'Sidhpur Trade Fair',
    blurb: 'Connecting retailers and distributors across North Gujarat with sealed, retail-ready packs.',
  },
  {
    src: '/license-ahoa-centenary.png',
    title: 'Hospitality Circle',
    blurb: 'Trusted by hotel and catering partners for everyday freshness and consistent quality.',
  },
] as const

function FramedImage({
  src,
  alt,
  size = 'cert',
}: {
  src: string
  alt: string
  size?: 'cert' | 'plaque'
}) {
  const maxW = size === 'cert' ? 'max-w-[240px] sm:max-w-[280px]' : 'max-w-[200px] sm:max-w-[230px]'
  return (
    <div
      className={`mx-auto w-full shrink-0 ${maxW} border-2 border-black bg-transparent p-1.5 sm:p-2`}
    >
      <img
        src={src}
        alt={alt}
        className="block h-auto w-full object-contain"
        style={{ mixBlendMode: 'multiply' }}
        loading="lazy"
      />
    </div>
  )
}

function AlternatingRow({
  imageLeft,
  src,
  alt,
  size = 'cert',
  children,
}: {
  imageLeft: boolean
  src: string
  alt: string
  size?: 'cert' | 'plaque'
  children: ReactNode
}) {
  const imageFrom = imageLeft ? -36 : 36
  const textFrom = imageLeft ? 28 : -28

  return (
    <div
      className={`flex flex-col items-center gap-5 py-5 md:flex-row md:items-center md:gap-8 lg:gap-10 ${
        imageLeft ? '' : 'md:flex-row-reverse'
      }`}
    >
      <motion.div
        className="w-full md:w-[38%] lg:w-[34%]"
        initial={{ opacity: 0, x: imageFrom, y: 16 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <FramedImage src={src} alt={alt} size={size} />
      </motion.div>
      <motion.div
        className="w-full flex-1 text-center md:text-left"
        initial={{ opacity: 0, x: textFrom, y: 12 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default function KnowMorePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    const id = window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    })
    return () => window.cancelAnimationFrame(id)
  }, [])

  return (
    <main className="min-h-screen" style={{ backgroundColor: PAGE_BG, fontFamily: SANS }}>
      <Navbar />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 10% 0%, ${SOFT_GREEN} 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 90% 20%, rgba(184,134,11,0.06) 0%, transparent 50%),
            ${PAGE_BG}
          `,
        }}
      />

      <div className="mx-auto w-full max-w-[1400px] px-4 pb-20 pt-28 sm:px-6 lg:px-8 sm:pt-32">
        <motion.button
          type="button"
          onClick={() => navigateApp(APP_ROUTES.home)}
          className="group mb-8 inline-flex cursor-pointer items-center gap-3 border-0 bg-transparent px-0 py-1"
          style={{ fontFamily: SANS }}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        >
          <span
            className="flex h-8 w-8 items-center justify-center border transition group-hover:border-[rgba(184,134,11,0.9)]"
            style={{
              borderRadius: 0,
              borderColor: 'rgba(10,46,34,0.22)',
              backgroundColor: '#ffffff',
              color: INK,
            }}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="flex flex-col items-start gap-0.5 text-left">
            <span
              className="text-[0.62rem] font-semibold tracking-[0.16em] uppercase"
              style={{ color: GOLD }}
            >
              Return
            </span>
            <span className="text-[0.88rem] font-semibold" style={{ color: INK }}>
              Back to home
            </span>
          </span>
        </motion.button>

        <header className="max-w-3xl">
          <p className="m-0 text-[0.7rem] font-semibold tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            Tasneem Mukhwas
          </p>
          <h1
            className="mt-3 m-0 text-[clamp(2.4rem,6vw,3.75rem)] leading-[1.05] tracking-tight"
            style={{ color: INK, fontFamily: SERIF, fontWeight: 600 }}
          >
            About us
          </h1>
          <p
            className="mt-5 m-0 max-w-2xl text-[1.05rem] leading-[1.75] sm:text-[1.12rem]"
            style={{ color: MUTED, fontFamily: SERIF }}
          >
            Tasneem Mukhwas is a Chhapi-born mouth-freshener brand under Furat Gruh Udhyog — blending
            Gujarati tradition with certified manufacturing so every pack carries freshness, aroma,
            and trust from farm to counter.
          </p>
        </header>

        {/* When & how — keep light cards for intro only */}
        <section className="mt-14 grid gap-10 md:grid-cols-2 md:gap-14">
          <article>
            <p className="m-0 text-[0.65rem] font-semibold tracking-[0.18em] uppercase" style={{ color: GOLD }}>
              When this started
            </p>
            <h2 className="mt-2 m-0 text-[1.45rem] leading-snug" style={{ color: INK, fontFamily: SERIF }}>
              A family craft, rooted in Banaskantha
            </h2>
            <p className="mt-4 m-0 text-[0.95rem] leading-[1.75]" style={{ color: MUTED, fontFamily: SERIF }}>
              What began as a regional mukhwas practice grew into a structured manufacturing house —
              Furat Gruh Udhyog — serving homes, hotels, and wholesale partners across Gujarat and
              export markets. Over twelve years, recipes were refined, lines modernized, and quality
              systems strengthened without losing the taste people grew up with.
            </p>
          </article>
          <article>
            <p className="m-0 text-[0.65rem] font-semibold tracking-[0.18em] uppercase" style={{ color: GOLD }}>
              How we work
            </p>
            <h2 className="mt-2 m-0 text-[1.45rem] leading-snug" style={{ color: INK, fontFamily: SERIF }}>
              From sourcing to sealed packs
            </h2>
            <p className="mt-4 m-0 text-[0.95rem] leading-[1.75]" style={{ color: MUTED, fontFamily: SERIF }}>
              Seeds and spices are sourced from trusted farms, cleaned and sorted in stages, blended
              to time-honored formulas, then packed in FSSAI-aligned facilities. Certified hygiene
              discipline means retailers and families can rely on consistency in every pinch.
            </p>
          </article>
        </section>

        {/* Certifications — alternating, no cards */}
        <section className="mt-16 border-t pt-12" style={{ borderColor: 'rgba(10,46,34,0.1)' }}>
          <p className="m-0 text-[0.65rem] font-semibold tracking-[0.18em] uppercase" style={{ color: GOLD }}>
            Certifications
          </p>
          <h2 className="mt-2 m-0 text-[1.75rem]" style={{ color: INK, fontFamily: SERIF }}>
            Official credentials
          </h2>
          <p className="mt-3 m-0 max-w-2xl text-[0.95rem] leading-[1.7]" style={{ color: MUTED, fontFamily: SERIF }}>
            WHO-GMP, Importer-Exporter Code, and MSME registration that stand behind every Tasneem
            Mukhwas pack.
          </p>

          <div className="mt-4">
            {CERTIFICATIONS.map((item, i) => (
              <AlternatingRow
                key={item.title}
                imageLeft={i % 2 === 0}
                src={item.src}
                alt={item.title}
                size="cert"
              >
                <p className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] uppercase" style={{ color: GOLD }}>
                  {item.eyebrow}
                </p>
                <h3 className="mt-2 m-0 text-[1.35rem] leading-snug sm:text-[1.5rem]" style={{ color: INK, fontFamily: SERIF }}>
                  {item.title}
                </h3>
                <p className="mt-3 m-0 max-w-xl text-[0.95rem] leading-[1.75]" style={{ color: MUTED, fontFamily: SERIF }}>
                  {item.body}
                </p>
              </AlternatingRow>
            ))}
          </div>
        </section>

        {/* Licences & excellence */}
        <section className="mt-8 border-t pt-12" style={{ borderColor: 'rgba(10,46,34,0.1)' }}>
          <p className="m-0 text-[0.65rem] font-semibold tracking-[0.18em] uppercase" style={{ color: GOLD }}>
            Recognition
          </p>
          <h2 className="mt-2 m-0 text-[1.75rem]" style={{ color: INK, fontFamily: SERIF }}>
            Licences & excellence
          </h2>
          <p className="mt-3 m-0 max-w-2xl text-[0.95rem] leading-[1.7]" style={{ color: MUTED, fontFamily: SERIF }}>
            Exhibition certificates and industry honours from our journey as a trusted food brand.
          </p>

          <div className="mt-4">
            {LICENCES.map((item, i) => (
              <AlternatingRow
                key={item.title}
                imageLeft={i % 2 === 0}
                src={item.src}
                alt={item.title}
                size="plaque"
              >
                <h3 className="m-0 text-[1.25rem] leading-snug sm:text-[1.4rem]" style={{ color: INK, fontFamily: SERIF }}>
                  {item.title}
                </h3>
                <p className="mt-3 m-0 max-w-xl text-[0.95rem] leading-[1.75]" style={{ color: MUTED, fontFamily: SERIF }}>
                  {item.caption}
                </p>
              </AlternatingRow>
            ))}
          </div>
        </section>

        {/* Parent company */}
        <section className="mt-8 border-t py-12" style={{ borderColor: 'rgba(10,46,34,0.1)' }}>
          <p className="m-0 text-[0.65rem] font-semibold tracking-[0.18em] uppercase" style={{ color: GOLD }}>
            Parent company
          </p>
          <h2 className="mt-2 m-0 text-[1.85rem]" style={{ fontFamily: SERIF, color: INK }}>
            Furat Gruh Udhyog
          </h2>
          <p className="mt-4 m-0 max-w-3xl text-[1rem] leading-[1.75]" style={{ fontFamily: SERIF, color: MUTED }}>
            Furat Gruh Udhyog is the manufacturing house behind Tasneem Mukhwas and sister lines such
            as Master Paan and Patel Mukhwas. From our Chhapi facility we handle sourcing, blending,
            hygienic packing, and bulk dispatch for retail and HORECA partners.
          </p>
          <dl className="mt-8 grid gap-5 text-[0.88rem] sm:grid-cols-3" style={{ color: INK }}>
            <div>
              <dt className="m-0 text-[0.62rem] font-semibold tracking-[0.14em] uppercase" style={{ color: GOLD }}>
                Address
              </dt>
              <dd className="mt-1.5 m-0 leading-relaxed" style={{ color: MUTED }}>
                {CONTACT_ADDRESS}
              </dd>
            </div>
            <div>
              <dt className="m-0 text-[0.62rem] font-semibold tracking-[0.14em] uppercase" style={{ color: GOLD }}>
                Phone
              </dt>
              <dd className="mt-1.5 m-0" style={{ color: MUTED }}>
                {CONTACT_PHONE_DISPLAY}
              </dd>
            </div>
            <div>
              <dt className="m-0 text-[0.62rem] font-semibold tracking-[0.14em] uppercase" style={{ color: GOLD }}>
                Email
              </dt>
              <dd className="mt-1.5 m-0" style={{ color: MUTED }}>
                {CONTACT_EMAIL}
              </dd>
            </div>
          </dl>
        </section>

        {/* Exhibition */}
        <section className="mt-4 border-t pt-12" style={{ borderColor: 'rgba(10,46,34,0.1)' }}>
          <p className="m-0 text-[0.65rem] font-semibold tracking-[0.18em] uppercase" style={{ color: GOLD }}>
            Our exhibition & excellence
          </p>
          <h2 className="mt-2 m-0 text-[1.75rem]" style={{ color: INK, fontFamily: SERIF }}>
            Moments on the floor
          </h2>
          <p className="mt-3 m-0 max-w-2xl text-[0.95rem] leading-[1.7]" style={{ color: MUTED, fontFamily: SERIF }}>
            Trade-fair and hospitality showcases — demo gallery until event photography is added.
          </p>

          <div className="mt-4">
            {EXHIBITION.map((item, i) => (
              <AlternatingRow
                key={item.title}
                imageLeft={i % 2 === 0}
                src={item.src}
                alt={item.title}
                size="plaque"
              >
                <h3 className="m-0 text-[1.25rem] leading-snug sm:text-[1.4rem]" style={{ color: INK, fontFamily: SERIF }}>
                  {item.title}
                </h3>
                <p className="mt-3 m-0 max-w-xl text-[0.95rem] leading-[1.75]" style={{ color: MUTED, fontFamily: SERIF }}>
                  {item.blurb}
                </p>
              </AlternatingRow>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section className="mt-8 border-t pt-12" style={{ borderColor: 'rgba(10,46,34,0.1)' }}>
          <p className="m-0 text-[0.65rem] font-semibold tracking-[0.18em] uppercase" style={{ color: GOLD }}>
            Leadership
          </p>
          <h2 className="mt-2 m-0 text-[1.75rem]" style={{ color: INK, fontFamily: SERIF }}>
            Founder
          </h2>

          <div className="mt-10 flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-14">
            <div className="w-full max-w-[200px] shrink-0 border-2 border-black p-1.5 sm:max-w-[220px]">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80"
                alt="A Y Patel — founder portrait (demo)"
                className="block aspect-square w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] uppercase" style={{ color: GOLD }}>
                Founder
              </p>
              <h3 className="mt-2 m-0 text-[1.65rem] leading-tight" style={{ color: INK, fontFamily: SERIF }}>
                A Y Patel
              </h3>
              <p className="mt-1 m-0 text-[0.95rem] font-medium tracking-wide" style={{ color: MUTED }}>
                Abidali Yarbhai Patel
              </p>
              <p className="mt-4 m-0 max-w-2xl text-[0.95rem] leading-[1.75]" style={{ color: MUTED, fontFamily: SERIF }}>
                Demo bio: Abidali Yarbhai Patel founded the Furat Gruh vision to bring hygienic,
                traditional mukhwas to modern shelves. Under his guidance the Chhapi unit grew into a
                multi-brand house — balancing family recipes with certified manufacturing, wholesale
                reach, and a lasting commitment to purity in every pack.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={() => navigateApp(APP_ROUTES.shop)}
            className="cursor-pointer rounded-full border-0 px-8 py-3.5 text-[0.82rem] font-semibold tracking-[0.08em] uppercase transition hover:brightness-110"
            style={{ backgroundColor: INK, color: '#f3e6c8', fontFamily: SANS }}
          >
            Explore our products
          </button>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
