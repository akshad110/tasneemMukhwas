import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { motion, animate, useInView } from 'framer-motion'
import Navbar from '../components/nav/Navbar'
import BrandLogo from '../components/shared/BrandLogo'
import SiteFooter from '../components/shared/SiteFooter'
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from '../lib/contact'
import {
  BRAND_CREAM,
  BRAND_INK,
  BRAND_LOGO_SRC,
  BRAND_SERIF,
  BRAND_TEXTURE,
} from '../lib/brand'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'
import { scrollAppToTop } from '../lib/scrollControl'

const INK = BRAND_INK
const CREAM = BRAND_CREAM
const MUTED = 'rgba(10,46,34,0.62)'
const MUTED_LIGHT = 'rgba(242,244,245,0.68)'
const EYEBROW_LIGHT = 'rgba(242,244,245,0.55)'
const EYEBROW_DARK = 'rgba(10,46,34,0.48)'
const ACCENT_ON_DARK = 'rgba(242,244,245,0.72)'
const ACCENT_ON_LIGHT = 'rgba(10,46,34,0.55)'
const EASE = [0.22, 1, 0.36, 1] as const

const INGREDIENTS_BG = encodeURI('/Mukhwas_ingredients_arranged_on_…_202608182142.jpeg')
const DISPLAY = 'Anton, Impact, sans-serif'
const SANS = 'Inter, system-ui, sans-serif'

const STATS = [
  { kind: 'count' as const, to: 12, suffix: '+', label: 'Years crafting mukhwas' },
  { kind: 'count' as const, to: 3, suffix: '', label: 'National certifications' },
  { kind: 'text' as const, value: 'WHO', label: 'GMP aligned facility' },
  { kind: 'count' as const, to: 100, suffix: '%', label: 'Sealed retail packs' },
] as const

const PILLARS = [
  {
    eyebrow: 'When this started',
    title: 'A family craft, rooted in Banaskantha',
    body: 'What began as a regional mukhwas practice grew into a structured manufacturing house — Tasneem Mukhwas — serving homes, hotels, and wholesale partners across Gujarat and export markets. Over twelve years, recipes were refined, lines modernized, and quality systems strengthened without losing the taste people grew up with.',
    accent: '2016',
    accentLabel: 'MSME registered',
  },
  {
    eyebrow: 'How we work',
    title: 'From sourcing to sealed packs',
    body: 'Seeds and spices are sourced from trusted farms, cleaned and sorted in stages, blended to time-honored formulas, then packed in FSSAI-aligned facilities. Certified hygiene discipline means retailers and families can rely on consistency in every pinch.',
    accent: 'FSSAI',
    accentLabel: 'Aligned packing',
  },
] as const

const PROCESS = [
  { step: '01', title: 'Source', detail: 'Farm-picked seeds & spices from trusted growers across Gujarat.' },
  { step: '02', title: 'Clean & sort', detail: 'Multi-stage cleaning, grading, and quality checks at Chhapi.' },
  { step: '03', title: 'Blend', detail: 'Time-honoured recipes balanced for aroma, crunch, and freshness.' },
  { step: '04', title: 'Seal & ship', detail: 'Hygienic packing and dispatch for retail, HORECA, and export.' },
] as const

const CERTIFICATIONS = [
  {
    src: encodeURI('/FINAL-FRUT GRUH(WHO GMP)_page-0001.jpg'),
    eyebrow: 'WHO-GMP',
    title: 'Certificate of Compliance',
    body: 'Tasneem Mukhwas is certified for Good Manufacturing Practice as laid down by the World Health Organization — covering manufacturing, processing, roasting, flavouring, packing, and supply of mukhwas, mouth fresheners, and related products from our Chhapi facility.',
  },
  {
    src: encodeURI('/FURAT IEC CERTIFICATE_page-0001.jpg'),
    eyebrow: 'DGFT · India',
    title: 'Importer-Exporter Code',
    body: 'Issued by the Directorate General of Foreign Trade to Tasneem Mukhwas (IEC AAEFF9922C). Signatory Patel Abidali Yarbhai — enabling lawful export and import of our food craft from Banaskantha, Gujarat.',
  },
  {
    src: encodeURI('/FURAT MSME CERTI_page-0001.jpg'),
    eyebrow: 'MSME · Udyam',
    title: 'Udyam Registration',
    body: 'Registered as a Micro manufacturing enterprise (UDYAM-GJ-04-0047609) under the Ministry of MSME. In business since 2016 — formal recognition of Tasneem Mukhwas as a government-registered food manufacturer.',
  },
] as const

const LICENCES = [
  {
    src: encodeURI('/WhatsApp Image 2026-08-15 at 12.02.16 PM.jpeg'),
    title: 'Trade Fair 2026',
    caption: 'Maktabah Jafariyah Trade Fair 2026 — Stall No. 45 & 46, Chappi.',
  },
  {
    src: encodeURI('/WhatsApp Image 2026-08-15 at 12.02.17 PM (1).jpeg'),
    title: 'Award of Excellence 2025',
    caption: 'Khadhya Khurak 2025 — International Exhibition on Food Processing, Gandhinagar.',
  },
  {
    src: encodeURI('/WhatsApp Image 2026-08-15 at 12.02.17 PM.jpeg'),
    title: 'AHOA Centenary Honour',
    caption: 'Ahmedabad Hotel Owner\'s Association — shaping Ahmedabad\'s food heritage.',
  },
  {
    src: encodeURI('/WhatsApp Image 2026-08-15 at 12.02.18 PM.jpeg'),
    title: 'Trade Fair 2016',
    caption: 'Early exhibition milestone — Tasneem Mukhwas, Pirojpura at Trade Fair 2016.',
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

function HeadingAccent({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span style={{ color: light ? ACCENT_ON_DARK : ACCENT_ON_LIGHT, fontWeight: 400 }}>
      {children}
    </span>
  )
}

function Reveal({
  children,
  className = '',
  delay = 0,
  y = 28,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function TextReveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'span',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3'
}) {
  const MotionTag = motion[Tag] as typeof motion.span
  return (
    <span className={`block overflow-hidden ${className}`}>
      <MotionTag
        className="block"
        initial={{ y: '108%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, delay, ease: EASE }}
      >
        {children}
      </MotionTag>
    </span>
  )
}

function CountUpStat({
  to,
  suffix = '',
  delay = 0,
}: {
  to: number
  suffix?: string
  delay?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.45 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.65,
      delay,
      ease: EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, delay])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}

function StatCard({
  stat,
  index,
}: {
  stat: (typeof STATS)[number]
  index: number
}) {
  return (
    <motion.div
      className="rounded-2xl border border-white/10 px-4 py-4 backdrop-blur-md sm:px-5 sm:py-5"
      style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
      initial={{ opacity: 0, y: 22, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.55 + index * 0.1, ease: EASE }}
    >
      <p
        className="m-0 text-[1.65rem] leading-none sm:text-[1.85rem]"
        style={{ color: '#ffffff', fontFamily: DISPLAY }}
      >
        {stat.kind === 'count' ? (
          <CountUpStat to={stat.to} suffix={stat.suffix} delay={0.55 + index * 0.1} />
        ) : (
          stat.value
        )}
      </p>
      <motion.p
        className="mt-2 m-0 text-[0.68rem] leading-snug tracking-wide"
        style={{ color: 'rgba(242,244,245,0.62)', fontFamily: SANS }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.72 + index * 0.1, ease: EASE }}
      >
        {stat.label}
      </motion.p>
    </motion.div>
  )
}

function Eyebrow({ children, light = false }: { children: string; light?: boolean }) {
  const tone = light ? EYEBROW_LIGHT : EYEBROW_DARK
  return (
    <p
      className="m-0 flex items-center gap-2.5 text-[0.68rem] font-semibold tracking-[0.22em] uppercase"
      style={{ color: tone, fontFamily: SANS }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rotate-45"
        style={{ backgroundColor: tone }}
        aria-hidden
      />
      {children}
    </p>
  )
}

/** Brand ink plate — textured green surface used on dark sections */
function InkTextureBackground({ soft = false }: { soft?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <img
        src={BRAND_TEXTURE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover brightness-[0.88] saturate-[0.92]"
      />
      <div
        className="absolute inset-0"
        style={{
          background: soft
            ? 'linear-gradient(180deg, rgba(10,46,34,0.48) 0%, rgba(10,46,34,0.32) 45%, rgba(10,46,34,0.52) 100%)'
            : 'linear-gradient(180deg, rgba(10,46,34,0.62) 0%, rgba(10,46,34,0.42) 28%, rgba(10,46,34,0.58) 62%, rgba(6,28,20,0.9) 100%)',
        }}
      />
    </div>
  )
}

function KnowMoreHero() {
  return (
    <section
      className="relative flex min-h-[92vh] flex-col overflow-hidden"
      style={{ backgroundColor: INK }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src={INGREDIENTS_BG}
          alt=""
          className="absolute inset-0 h-[115%] w-full object-cover"
        />
        <img
          src={BRAND_TEXTURE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover brightness-[0.88] saturate-[0.92] opacity-95"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,46,34,0.52) 0%, rgba(10,46,34,0.35) 38%, rgba(6,28,20,0.82) 72%, rgba(6,28,20,0.94) 100%)',
          }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(242,244,245,0.08) 0%, transparent 42%), radial-gradient(circle at 80% 60%, rgba(242,244,245,0.06) 0%, transparent 38%)',
        }}
      />

      <div
        className="relative z-10 mx-auto flex w-full max-w-[1320px] flex-1 flex-col px-5 pb-14 sm:px-8 sm:pb-16 lg:px-10"
        style={{ paddingTop: 'calc(4.15rem + env(safe-area-inset-top, 0px))' }}
      >
        <motion.button
          type="button"
          onClick={() => navigateApp(APP_ROUTES.home)}
          className="group inline-flex shrink-0 cursor-pointer items-center gap-3 border-0 bg-transparent px-0 py-0"
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/8 backdrop-blur-sm transition group-hover:border-white/40"
            style={{ color: CREAM }}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="flex flex-col items-start gap-0.5 text-left">
            <span className="text-[0.62rem] font-semibold tracking-[0.16em] uppercase" style={{ color: EYEBROW_LIGHT }}>
              Return
            </span>
            <span className="text-[0.88rem] font-semibold" style={{ color: CREAM, fontFamily: SANS }}>
              Back to home
            </span>
          </span>
        </motion.button>

        <div className="mt-auto flex flex-col gap-8 pt-10 lg:flex-row lg:items-end lg:justify-between lg:pt-12">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
              className="mb-6 flex items-center gap-4"
            >
              <BrandLogo className="h-14 w-11 object-contain sm:h-16 sm:w-12" alt="" />
              <TextReveal delay={0.22}>
                <span
                  className="text-[0.72rem] font-semibold tracking-[0.24em] uppercase"
                  style={{ color: 'rgba(242,244,245,0.55)', fontFamily: SANS }}
                >
                  Chhapi · Banaskantha · Gujarat
                </span>
              </TextReveal>
            </motion.div>

            <h1
              className="m-0 text-[clamp(3rem,9vw,5.5rem)] leading-[0.92] tracking-tight uppercase"
              style={{ color: CREAM, fontFamily: DISPLAY }}
            >
              <TextReveal delay={0.28}>About</TextReveal>
              <TextReveal delay={0.38}>Our Story</TextReveal>
            </h1>

            <TextReveal delay={0.48} as="p" className="mt-6 max-w-xl text-[1.05rem] leading-[1.75] sm:text-[1.15rem]">
              <span style={{ color: MUTED_LIGHT, fontFamily: BRAND_SERIF }}>
                Tasneem Mukhwas is a Chhapi-born mouth-freshener brand — blending Gujarati tradition
                with certified manufacturing so every pack carries freshness, aroma, and trust from farm
                to counter.
              </span>
            </TextReveal>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:max-w-[340px]">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>

        <motion.div
          className="mt-10 flex flex-col items-center gap-2 sm:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          aria-hidden
        >
          <span className="text-[0.62rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(242,244,245,0.4)' }}>
            Scroll
          </span>
          <motion.span
            className="block h-8 w-[1px]"
            style={{ backgroundColor: 'rgba(242,244,245,0.35)' }}
            animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}

function PillarCard({ pillar, index }: { pillar: (typeof PILLARS)[number]; index: number }) {
  return (
    <Reveal delay={index * 0.1}>
      <article
        className="group relative h-full overflow-hidden rounded-3xl border p-7 sm:p-9"
        style={{
          borderColor: 'rgba(10,46,34,0.1)',
          backgroundColor: '#ffffff',
          boxShadow: '0 28px 60px -36px rgba(10,46,34,0.35)',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(circle, rgba(10,46,34,0.06) 0%, transparent 70%)' }}
        />
        <div className="flex items-start justify-between gap-4">
          <Eyebrow>{pillar.eyebrow}</Eyebrow>
          <div
            className="shrink-0 rounded-xl border px-3 py-2 text-center"
            style={{ borderColor: 'rgba(10,46,34,0.12)', backgroundColor: 'rgba(10,46,34,0.04)' }}
          >
            <p className="m-0 text-[1rem] font-bold leading-none" style={{ color: INK, fontFamily: DISPLAY }}>
              {pillar.accent}
            </p>
            <p className="mt-1 m-0 text-[0.58rem] tracking-wide uppercase" style={{ color: MUTED, fontFamily: SANS }}>
              {pillar.accentLabel}
            </p>
          </div>
        </div>
        <h2
          className="mt-5 m-0 text-[1.55rem] leading-tight sm:text-[1.75rem]"
          style={{ color: INK, fontFamily: BRAND_SERIF }}
        >
          {pillar.title}
        </h2>
        <p
          className="mt-4 m-0 text-[0.95rem] leading-[1.8]"
          style={{ color: MUTED, fontFamily: BRAND_SERIF }}
        >
          {pillar.body}
        </p>
      </article>
    </Reveal>
  )
}

function ProcessStrip() {
  return (
    <section
      className="relative overflow-hidden py-14 sm:py-16"
      style={{ backgroundColor: INK }}
    >
      <InkTextureBackground soft />
      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10">
        <Reveal className="text-center">
          <Eyebrow light>Our process</Eyebrow>
          <h2
            className="mt-4 m-0 text-[clamp(1.8rem,4vw,2.6rem)] uppercase leading-tight"
            style={{ color: CREAM, fontFamily: DISPLAY }}
          >
            Farm to <HeadingAccent light>Fresh Pack</HeadingAccent>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.08}>
              <div
                className="relative h-full rounded-2xl border border-white/10 p-6 backdrop-blur-sm transition hover:border-white/25"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <span
                  className="text-[2.4rem] leading-none opacity-20"
                  style={{ color: CREAM, fontFamily: DISPLAY }}
                  aria-hidden
                >
                  {step.step}
                </span>
                <h3
                  className="mt-2 m-0 text-[1.05rem] font-semibold tracking-wide uppercase"
                  style={{ color: CREAM, fontFamily: SANS }}
                >
                  {step.title}
                </h3>
                <p
                  className="mt-3 m-0 text-[0.88rem] leading-relaxed"
                  style={{ color: MUTED_LIGHT, fontFamily: BRAND_SERIF }}
                >
                  {step.detail}
                </p>
                {i < PROCESS.length - 1 && (
                  <span
                    className="pointer-events-none absolute -right-2 top-1/2 hidden h-[1px] w-4 lg:block"
                    style={{ backgroundColor: 'rgba(242,244,245,0.25)' }}
                    aria-hidden
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CertCard({ cert, index }: { cert: (typeof CERTIFICATIONS)[number]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Reveal delay={index * 0.12}>
      <motion.article
        className="group flex h-full flex-col overflow-hidden rounded-3xl border"
        style={{
          borderColor: 'rgba(10,46,34,0.1)',
          backgroundColor: '#fff',
          boxShadow: '0 24px 50px -32px rgba(10,46,34,0.3)',
        }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <div
          className="relative flex items-center justify-center overflow-hidden px-6 py-8 sm:py-10"
          style={{
            background:
              'linear-gradient(165deg, rgba(232,240,234,0.9) 0%, rgba(248,249,250,1) 45%, rgba(243,235,224,0.85) 100%)',
          }}
        >
          <motion.img
            src={cert.src}
            alt={cert.title}
            className="relative z-[1] max-h-[220px] w-auto max-w-full object-contain drop-shadow-lg sm:max-h-[260px]"
            loading="lazy"
            animate={{ scale: hovered ? 1.06 : 1, y: hovered ? -8 : 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(10,46,34,0.06) 0%, transparent 70%)',
            }}
          />
        </div>
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <Eyebrow>{cert.eyebrow}</Eyebrow>
          <h3
            className="mt-3 m-0 text-[1.25rem] leading-snug sm:text-[1.35rem]"
            style={{ color: INK, fontFamily: BRAND_SERIF }}
          >
            {cert.title}
          </h3>
          <p
            className="mt-3 m-0 flex-1 text-[0.9rem] leading-[1.75]"
            style={{ color: MUTED, fontFamily: BRAND_SERIF }}
          >
            {cert.body}
          </p>
        </div>
      </motion.article>
    </Reveal>
  )
}

function LicenceCard({ item }: { item: (typeof LICENCES)[number] }) {
  return (
    <figure className="know-licence-card shrink-0 snap-center transition-transform duration-300 ease-out hover:-translate-y-2">
      <div
        className="overflow-hidden rounded-2xl border p-2"
        style={{
          borderColor: 'rgba(242,244,245,0.18)',
          backgroundColor: 'rgba(255,255,255,0.04)',
          boxShadow: '0 20px 40px -24px rgba(0,0,0,0.5)',
        }}
      >
        <div className="overflow-hidden rounded-xl" style={{ backgroundColor: CREAM }}>
          <img
            src={item.src}
            alt={item.title}
            className="block aspect-[3/4] w-[220px] object-cover object-top sm:w-[240px]"
            loading="lazy"
          />
        </div>
      </div>
      <figcaption className="mt-4 max-w-[240px]">
        <h3
          className="m-0 text-[1rem] leading-snug"
          style={{ color: CREAM, fontFamily: BRAND_SERIF }}
        >
          {item.title}
        </h3>
        <p
          className="mt-2 m-0 text-[0.82rem] leading-relaxed"
          style={{ color: MUTED_LIGHT, fontFamily: BRAND_SERIF }}
        >
          {item.caption}
        </p>
      </figcaption>
    </figure>
  )
}

export default function KnowMorePage() {
  useEffect(() => {
    scrollAppToTop(true)
    const id = window.requestAnimationFrame(() => scrollAppToTop(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM, fontFamily: SANS }}>
      <Navbar />

      <motion.main
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
      <KnowMoreHero />

      <div>
      {/* Pillars */}
      <section className="relative py-16 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,240,234,0.9) 0%, transparent 60%)',
          }}
        />
        <div className="relative mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10">
          <Reveal className="mb-10 max-w-2xl">
            <Eyebrow>Our roots</Eyebrow>
            <h2
              className="mt-4 m-0 text-[clamp(2rem,5vw,3rem)] leading-tight uppercase"
              style={{ color: INK, fontFamily: DISPLAY }}
            >
              Crafted with <HeadingAccent>Purpose</HeadingAccent>
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {PILLARS.map((p, i) => (
              <PillarCard key={p.title} pillar={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <ProcessStrip />

      {/* Certifications */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>Certifications</Eyebrow>
            <h2
              className="mt-4 m-0 text-[clamp(2rem,5vw,3rem)] uppercase leading-tight"
              style={{ color: INK, fontFamily: DISPLAY }}
            >
              Official <HeadingAccent>Credentials</HeadingAccent>
            </h2>
            <p
              className="mt-4 m-0 text-[1rem] leading-[1.75]"
              style={{ color: MUTED, fontFamily: BRAND_SERIF }}
            >
              WHO-GMP, Importer-Exporter Code, and MSME registration that stand behind every Tasneem
              Mukhwas pack.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {CERTIFICATIONS.map((cert, i) => (
              <CertCard key={cert.title} cert={cert} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Recognition — horizontal gallery on dark band */}
      <section
        className="relative isolate overflow-hidden py-16 sm:py-20"
        style={{ backgroundColor: INK }}
      >
        <InkTextureBackground />
        <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10">
          <Reveal>
            <Eyebrow light>Recognition</Eyebrow>
            <h2
              className="mt-4 m-0 text-[clamp(2rem,5vw,3rem)] uppercase leading-tight"
              style={{ color: CREAM, fontFamily: DISPLAY }}
            >
              Licences & <HeadingAccent light>Excellence</HeadingAccent>
            </h2>
            <p
              className="mt-4 m-0 max-w-2xl text-[1rem] leading-[1.75]"
              style={{ color: MUTED_LIGHT, fontFamily: BRAND_SERIF }}
            >
              Exhibition certificates and industry honours from our journey as a trusted food brand.
            </p>

            <div className="know-licence-scroll mt-12 flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory">
              {LICENCES.map((item) => (
                <LicenceCard key={item.title} item={item} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Company */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10">
          <div
            className="overflow-hidden rounded-[2rem] border"
            style={{
              borderColor: 'rgba(10,46,34,0.12)',
              backgroundColor: '#fff',
              boxShadow: '0 32px 70px -40px rgba(10,46,34,0.35)',
            }}
          >
            <div className="grid min-w-0 lg:grid-cols-[1fr_1.1fr]">
              <div className="relative min-h-[280px] lg:min-h-[420px]">
                <img
                  src={INGREDIENTS_BG}
                  alt="Mukhwas ingredients"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <img
                  src={BRAND_TEXTURE}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover brightness-[0.88] saturate-[0.92]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(10,46,34,0.78) 0%, rgba(10,46,34,0.48) 55%, rgba(10,46,34,0.28) 100%)',
                  }}
                />
                <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-10">
                  <img
                    src={BRAND_LOGO_SRC}
                    alt="Tasneem Mukhwas"
                    className="h-16 w-auto object-contain sm:h-20"
                  />
                  <p
                    className="mt-4 m-0 text-[0.72rem] font-semibold tracking-[0.2em] uppercase"
                    style={{ color: EYEBROW_LIGHT }}
                  >
                    Chhapi facility
                  </p>
                </div>
              </div>

              <div className="min-w-0 p-8 sm:p-10 lg:p-12">
                <Reveal>
                  <Eyebrow>Our company</Eyebrow>
                  <h2
                    className="mt-4 m-0 text-[clamp(1.8rem,4vw,2.5rem)] uppercase leading-tight"
                    style={{ color: INK, fontFamily: DISPLAY }}
                  >
                    Tasneem Mukhwas
                  </h2>
                  <p
                    className="mt-5 m-0 text-[0.98rem] leading-[1.8]"
                    style={{ color: MUTED, fontFamily: BRAND_SERIF }}
                  >
                    Tasneem Mukhwas is the manufacturing house behind our signature lines such as
                    Master Paan and Patel Mukhwas. From our Chhapi facility we handle sourcing,
                    blending, hygienic packing, and bulk dispatch for retail and HORECA partners.
                  </p>
                </Reveal>

                <div className="mt-8 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: 'Address', value: CONTACT_ADDRESS },
                    { label: 'Phone', value: CONTACT_PHONE_DISPLAY },
                    { label: 'Email', value: CONTACT_EMAIL },
                  ].map((row, i) => (
                    <Reveal key={row.label} delay={i * 0.08} className="min-w-0">
                      <div
                        className="h-full min-w-0 overflow-hidden rounded-xl border p-4"
                        style={{
                          borderColor: 'rgba(10,46,34,0.1)',
                          backgroundColor: 'rgba(248,249,250,0.85)',
                        }}
                      >
                        <p
                          className="m-0 text-[0.62rem] font-semibold tracking-[0.14em] uppercase"
                          style={{ color: EYEBROW_DARK }}
                        >
                          {row.label}
                        </p>
                        <p
                          className="mt-2 m-0 break-words text-[0.85rem] leading-relaxed [overflow-wrap:anywhere]"
                          style={{ color: MUTED, fontFamily: BRAND_SERIF }}
                        >
                          {row.value}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exhibition */}
      <section
        className="relative py-16 sm:py-20"
        style={{ backgroundColor: 'rgba(232,240,234,0.45)' }}
      >
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10">
          <Reveal className="max-w-2xl">
            <Eyebrow>Our exhibition</Eyebrow>
            <h2
              className="mt-4 m-0 text-[clamp(2rem,5vw,3rem)] uppercase leading-tight"
              style={{ color: INK, fontFamily: DISPLAY }}
            >
              Moments on the <HeadingAccent>Floor</HeadingAccent>
            </h2>
            <p
              className="mt-4 m-0 text-[1rem] leading-[1.75]"
              style={{ color: MUTED, fontFamily: BRAND_SERIF }}
            >
              Trade-fair and hospitality showcases connecting our craft with buyers nationwide.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {EXHIBITION.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <article
                  className="group overflow-hidden rounded-2xl border transition hover:-translate-y-1"
                  style={{
                    borderColor: 'rgba(10,46,34,0.1)',
                    backgroundColor: '#fff',
                    boxShadow: '0 20px 44px -30px rgba(10,46,34,0.28)',
                  }}
                >
                  <div className="overflow-hidden" style={{ backgroundColor: CREAM }}>
                    <img
                      src={item.src}
                      alt={item.title}
                      className="block aspect-[4/3] w-full object-contain p-6 transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3
                      className="m-0 text-[1.15rem] leading-snug"
                      style={{ color: INK, fontFamily: BRAND_SERIF }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mt-3 m-0 text-[0.9rem] leading-[1.75]"
                      style={{ color: MUTED, fontFamily: BRAND_SERIF }}
                    >
                      {item.blurb}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ backgroundColor: INK }}>
        <InkTextureBackground />
        <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-[340px_1fr] lg:gap-16">
            <Reveal y={20}>
              <div className="relative mx-auto max-w-[300px] lg:mx-0">
                <div
                  aria-hidden
                  className="absolute -inset-3 rounded-3xl opacity-40"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(242,244,245,0.12) 0%, rgba(242,244,245,0.04) 50%, rgba(242,244,245,0.1) 100%)',
                  }}
                />
                <div
                  className="relative overflow-hidden rounded-2xl border p-1.5"
                  style={{ borderColor: 'rgba(242,244,245,0.28)', backgroundColor: 'rgba(255,255,255,0.06)' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80"
                    alt="A Y Patel — founder portrait"
                    className="block aspect-[4/5] w-full rounded-xl object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <Eyebrow light>Leadership</Eyebrow>
              <h2
                className="mt-4 m-0 text-[clamp(2rem,5vw,3rem)] uppercase leading-tight"
                style={{ color: CREAM, fontFamily: DISPLAY }}
              >
                Meet the <HeadingAccent light>Founder</HeadingAccent>
              </h2>
              <p
                className="mt-2 m-0 text-[0.72rem] font-semibold tracking-[0.18em] uppercase"
                style={{ color: EYEBROW_LIGHT }}
              >
                Abidali Yarbhai Patel
              </p>
              <h3
                className="mt-3 m-0 text-[2rem] leading-tight sm:text-[2.4rem]"
                style={{ color: CREAM, fontFamily: BRAND_SERIF }}
              >
                A Y Patel
              </h3>
              <p
                className="mt-5 m-0 max-w-2xl text-[1rem] leading-[1.85]"
                style={{ color: MUTED_LIGHT, fontFamily: BRAND_SERIF }}
              >
                Abidali Yarbhai Patel founded the Tasneem Mukhwas vision to bring hygienic,
                traditional mukhwas to modern shelves. Under his guidance the Chhapi unit grew into a
                multi-brand house — balancing family recipes with certified manufacturing, wholesale
                reach, and a lasting commitment to purity in every pack.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <Reveal className="mx-auto max-w-[1320px] px-5 text-center sm:px-8 lg:px-10">
          <h2
            className="m-0 text-[clamp(2rem,5vw,3.2rem)] uppercase leading-tight"
            style={{ color: INK, fontFamily: DISPLAY }}
          >
            Taste the <HeadingAccent>Tradition</HeadingAccent>
          </h2>
          <p
            className="mx-auto mt-4 max-w-lg text-[1rem] leading-relaxed"
            style={{ color: MUTED, fontFamily: BRAND_SERIF }}
          >
            Explore our full range of mukhwas, paan blends, and seed mixes — sealed fresh from
            Chhapi.
          </p>
          <motion.button
            type="button"
            onClick={() => navigateApp(APP_ROUTES.shop)}
            className="mt-8 cursor-pointer rounded-full border-0 px-10 py-4 text-[0.82rem] font-bold tracking-[0.12em] uppercase transition hover:brightness-110"
            style={{
              backgroundColor: INK,
              color: CREAM,
              fontFamily: SANS,
              boxShadow: '0 16px 40px -14px rgba(10,46,34,0.45)',
            }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore our products
          </motion.button>
        </Reveal>
      </section>

      </div>

      <SiteFooter />

      <style>{`
        .know-licence-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(242,244,245,0.35) rgba(255,255,255,0.06);
        }
        .know-licence-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .know-licence-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
        }
        .know-licence-scroll::-webkit-scrollbar-thumb {
          background: rgba(242,244,245,0.35);
          border-radius: 999px;
        }
      `}</style>
      </motion.main>
    </div>
  )
}
