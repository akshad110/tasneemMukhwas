import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { motion, animate, useInView } from 'framer-motion'
import Navbar from '../components/nav/Navbar'
import BackToHomeButton from '../components/shared/BackToHomeButton'
import SiteFooter from '../components/shared/SiteFooter'
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from '../lib/contact'
import {
  BRAND_CREAM,
  BRAND_CREAM_DEEP,
  BRAND_CREAM_LIGHT,
  BRAND_GOLD,
  BRAND_INK,
  BRAND_LOGO_SRC,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
} from '../lib/brand'
import { APP_ROUTES, navigateApp } from '../lib/appRoutes'
import { scrollAppToTop } from '../lib/scrollControl'

const INK = BRAND_INK
const CREAM = BRAND_CREAM
const CREAM_LIGHT = BRAND_CREAM_LIGHT
const CREAM_DEEP = BRAND_CREAM_DEEP
const MUTED = BRAND_MUTED
const GOLD = BRAND_GOLD
const EASE = [0.22, 1, 0.36, 1] as const

const HERO_IMG = '/Mukhwas_pouches_on_wooden_table_202608251659.jpeg'
const INGREDIENTS_IMG = encodeURI('/Mukhwas_ingredients_arranged_on_…_202608182142.jpeg')
const FOUNDER_PORTRAIT = encodeURI('/ChatGPT Image Aug 21, 2026 at 02_51_39 PM.png')

const OUR_SERVICES = [
  {
    tag: 'Retail',
    title: 'Retail-ready packs',
    body: 'Shelf-stable mukhwas pouches for kirana counters, modern trade, and quick-commerce listings across India.',
    icon: '◆',
  },
  {
    tag: 'Wholesale',
    title: 'Bulk & distribution',
    body: 'Flexible MOQs, carton dispatch, and dependable fulfilment for distributors, hotels, and catering partners.',
    icon: '◇',
  },
  {
    tag: 'Branding',
    title: 'Private label support',
    body: 'Guidance on pouch weights, outer cartons, sticker branding, and exhibition-ready presentation.',
    icon: '✦',
  },
] as const

const SERVICE_GRID = [
  {
    label: 'Classic Mukhwas',
    title: 'Everyday mouth fresheners',
    image: '/Mukhwas_pouches_on_wooden_table_202608251630.jpeg',
    href: APP_ROUTES.shop,
  },
  {
    label: 'Paan Specials',
    title: 'Master Paan & paan shots',
    image: '/Red_pouch_and_mukhwas_bowl_202608251659.jpeg',
    href: APP_ROUTES.shop,
  },
  {
    label: 'Export & IEC',
    title: 'International dispatch',
    image: '/Tasneem_pouch_on_glass_surface_202608251649.jpeg',
    href: APP_ROUTES.wholesale,
  },
  {
    label: 'HORECA supply',
    title: 'Hotels & hospitality',
    image: '/Mango_snack_on_counter_2K_202608251649.jpeg',
    href: APP_ROUTES.wholesale,
  },
] as const

const WHY_STATS = [
  { kind: 'count' as const, to: 12, suffix: '+', label: 'Years of craft' },
  { kind: 'text' as const, value: '100%', label: 'Natural ingredients' },
  { kind: 'count' as const, to: 40, suffix: '+', label: 'Product SKUs' },
  { kind: 'count' as const, to: 500, suffix: '+', label: 'Trade partners' },
] as const

const WHY_POINTS = [
  'WHO-GMP aligned manufacturing from our Chhapi, Banaskantha facility.',
  'Farm-to-pack traceability with multi-stage cleaning and sealed retail packs.',
  'Trusted by retailers, hospitality partners, and export buyers since 2016.',
] as const

const CERTIFICATIONS = [
  {
    src: encodeURI('/FINAL-FRUT GRUH(WHO GMP)_page-0001.jpg'),
    eyebrow: 'WHO-GMP',
    title: 'Certificate of Compliance',
    body: 'Certified for Good Manufacturing Practice — covering manufacturing, roasting, flavouring, packing, and supply of mukhwas from our Chhapi facility.',
  },
  {
    src: encodeURI('/FURAT IEC CERTIFICATE_page-0001.jpg'),
    eyebrow: 'DGFT · India',
    title: 'Importer-Exporter Code',
    body: 'IEC AAEFF9922C issued by DGFT — enabling lawful export and import from Banaskantha, Gujarat.',
  },
  {
    src: encodeURI('/FURAT MSME CERTI_page-0001.jpg'),
    eyebrow: 'MSME · Udyam',
    title: 'Udyam Registration',
    body: 'Registered micro manufacturing enterprise (UDYAM-GJ-04-0047609) — in business since 2016.',
  },
] as const

const LICENCES = [
  {
    src: encodeURI('/WhatsApp Image 2026-08-15 at 12.02.16 PM.jpeg'),
    title: 'Trade Fair 2026',
    caption: 'Maktabah Jafariyah Trade Fair — Stall 45 & 46, Chappi.',
  },
  {
    src: encodeURI('/WhatsApp Image 2026-08-15 at 12.02.17 PM (1).jpeg'),
    title: 'Award of Excellence 2025',
    caption: 'Khadhya Khurak 2025 — Gandhinagar food expo.',
  },
  {
    src: encodeURI('/WhatsApp Image 2026-08-15 at 12.02.17 PM.jpeg'),
    title: 'AHOA Centenary Honour',
    caption: "Ahmedabad Hotel Owner's Association recognition.",
  },
  {
    src: encodeURI('/WhatsApp Image 2026-08-15 at 12.02.18 PM.jpeg'),
    title: 'Trade Fair 2016',
    caption: 'Early exhibition milestone — Tasneem Mukhwas, Pirojpura.',
  },
] as const

function Reveal({
  children,
  className = '',
  delay = 0,
  y = 22,
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
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({
  title,
  description,
  light = false,
}: {
  title: string
  description: string
  light?: boolean
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-12">
      <h2
        className="m-0 text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.02em]"
        style={{ color: light ? CREAM_LIGHT : INK, fontFamily: BRAND_SERIF }}
      >
        {title}
      </h2>
      <p
        className="m-0 max-w-md text-[0.95rem] leading-[1.75] lg:justify-self-end"
        style={{ color: light ? 'rgba(255,254,242,0.78)' : MUTED, fontFamily: BRAND_SANS }}
      >
        {description}
      </p>
    </div>
  )
}

function PrimaryButton({
  children,
  onClick,
  dark = true,
}: {
  children: ReactNode
  onClick: () => void
  dark?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer border-0 px-7 py-3.5 text-[0.78rem] font-semibold tracking-[0.14em] uppercase transition hover:brightness-110"
      style={{
        backgroundColor: dark ? INK : CREAM_LIGHT,
        color: dark ? CREAM_LIGHT : INK,
        fontFamily: BRAND_SANS,
        borderRadius: 0,
      }}
    >
      {children}
    </button>
  )
}

function CountUpStat({ to, suffix = '', delay = 0 }: { to: number; suffix?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.45 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.6,
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

export default function KnowMorePage() {
  useEffect(() => {
    scrollAppToTop(true)
    const id = window.requestAnimationFrame(() => scrollAppToTop(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM, fontFamily: BRAND_SANS, color: INK }}>
      <Navbar />

      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: EASE }}>
        {/* Hero intro */}
        <section
          style={{
            backgroundColor: CREAM_DEEP,
            paddingTop: 'calc(4.75rem + env(safe-area-inset-top, 0px))',
          }}
        >
          <div className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
            <BackToHomeButton className="mb-8" />

            <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <Reveal>
                <h1
                  className="m-0 text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-[-0.02em]"
                  style={{ fontFamily: BRAND_SERIF, color: INK }}
                >
                  Welcome to Tasneem Mukhwas
                </h1>
                <div
                  className="mt-6 max-w-xl space-y-5 text-[0.98rem] leading-[1.85] sm:text-[1rem]"
                  style={{ color: MUTED, fontFamily: BRAND_SANS }}
                >
                  <p className="m-0">
                    At <strong style={{ color: INK, fontWeight: 600 }}>Tasneem Mukhwas</strong>, we believe
                    that a meal is best completed with the perfect touch of flavour. We are a dedicated
                    manufacturer of quality <strong style={{ color: INK, fontWeight: 600 }}>mukhwas</strong>,
                    offering a wide range of traditional and delicious mouth-freshening products crafted with
                    carefully selected ingredients.
                  </p>
                  <p className="m-0">
                    Our focus is on{' '}
                    <strong style={{ color: INK, fontWeight: 600 }}>
                      quality, hygiene, authentic taste, and consistent production
                    </strong>
                    . From traditional favourites to innovative flavour combinations, every Tasneem Mukhwas
                    product is prepared with care to deliver a refreshing and enjoyable experience after
                    every meal.
                  </p>
                  <p className="m-0">
                    With our own production capabilities and commitment to quality, we aim to bring the
                    authentic taste of Indian mukhwas to customers across India and global markets.
                  </p>
                  <p className="m-0 font-semibold" style={{ color: INK, fontFamily: BRAND_SERIF }}>
                    Tasneem Mukhwas — Tradition in Every Bite, Quality in Every Pack.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <PrimaryButton onClick={() => navigateApp(APP_ROUTES.shop)}>Explore products</PrimaryButton>
                  <PrimaryButton dark={false} onClick={() => navigateApp(APP_ROUTES.wholesale)}>
                    Partner with us
                  </PrimaryButton>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="overflow-hidden" style={{ backgroundColor: CREAM_LIGHT }}>
                  <img src={HERO_IMG} alt="Tasneem Mukhwas pouches" className="block aspect-[5/4] w-full object-cover" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Leadership — directly below intro */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(240px,300px)_1fr] lg:px-10 lg:py-20">
            <Reveal>
              <img
                src={FOUNDER_PORTRAIT}
                alt="A Y Patel"
                className="block aspect-[4/5] w-full max-w-[300px] object-cover object-top"
                style={{ backgroundColor: CREAM_LIGHT }}
                loading="lazy"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="m-0 text-[0.62rem] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(10,46,34,0.45)' }}>
                Leadership
              </p>
              <h2
                className="mt-3 m-0 text-[clamp(1.85rem,3.8vw,2.65rem)] leading-tight"
                style={{ fontFamily: BRAND_SERIF, color: INK }}
              >
                A Y Patel
              </h2>
              <p className="mt-2 m-0 text-[0.72rem] font-semibold tracking-[0.14em] uppercase" style={{ color: 'rgba(10,46,34,0.45)' }}>
                Abidali Yarbhai Patel · Founder
              </p>
              <p className="mt-5 m-0 max-w-2xl text-[0.95rem] leading-[1.85]" style={{ color: MUTED, fontFamily: BRAND_SANS }}>
                Abidali Yarbhai Patel founded Tasneem Mukhwas to bring hygienic, traditional mouth fresheners
                to modern shelves — balancing family recipes with certified manufacturing and wholesale reach.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Our Services — 3 column cards */}
        <section style={{ backgroundColor: CREAM_LIGHT }}>
          <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <Reveal className="mb-12">
              <SectionHeader
                title="Our services"
                description="End-to-end mukhwas supply — from sealed retail packs to bulk dispatch, private-label guidance, and export-ready fulfilment from Chhapi."
              />
            </Reveal>

            <div className="grid gap-6 md:grid-cols-3">
              {OUR_SERVICES.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.08}>
                  <article
                    className="h-full p-7 sm:p-8"
                    style={{ backgroundColor: CREAM }}
                  >
                    <span className="text-[1.1rem]" style={{ color: GOLD }} aria-hidden>
                      {item.icon}
                    </span>
                    <p
                      className="mt-4 m-0 text-[0.62rem] font-bold tracking-[0.2em] uppercase"
                      style={{ color: 'rgba(10,46,34,0.45)' }}
                    >
                      {item.tag}
                    </p>
                    <h3
                      className="mt-2 m-0 text-[1.35rem] leading-snug"
                      style={{ fontFamily: BRAND_SERIF, color: INK }}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-3 m-0 text-[0.9rem] leading-[1.75]" style={{ color: MUTED }}>
                      {item.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Service grid 2×2 with images */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="mx-auto max-w-[1320px] px-5 pb-14 sm:px-8 lg:px-10 lg:pb-20">
            <div className="grid gap-5 sm:grid-cols-2">
              {SERVICE_GRID.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06}>
                  <button
                    type="button"
                    onClick={() => navigateApp(item.href)}
                    className="group w-full cursor-pointer overflow-hidden border-0 p-0 text-left"
                    style={{ backgroundColor: CREAM_LIGHT }}
                  >
                    <div className="overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="block aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6 sm:p-7">
                      <p
                        className="m-0 text-[0.62rem] font-bold tracking-[0.2em] uppercase"
                        style={{ color: 'rgba(10,46,34,0.45)' }}
                      >
                        {item.label}
                      </p>
                      <h3
                        className="mt-2 m-0 text-[1.25rem] leading-snug"
                        style={{ fontFamily: BRAND_SERIF, color: INK }}
                      >
                        {item.title}
                      </h3>
                      <span
                        className="mt-4 inline-block text-[0.72rem] font-semibold tracking-[0.12em] uppercase underline-offset-4 group-hover:underline"
                        style={{ color: INK }}
                      >
                        Learn more →
                      </span>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us — stats over image */}
        <section className="relative overflow-hidden" style={{ backgroundColor: CREAM_DEEP }}>
          <div className="relative min-h-[420px] sm:min-h-[480px]">
            <img
              src={INGREDIENTS_IMG}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(230,216,195,0.55) 0%, rgba(10,46,34,0.72) 100%)' }}
              aria-hidden
            />

            <div className="relative z-10 mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
              <Reveal>
                <SectionHeader
                  light
                  title="Why choose us"
                  description="A family craft scaled with certified hygiene, consistent recipes, and partners who rely on us for everyday freshness."
                />
              </Reveal>

              <div className="mt-14 grid grid-cols-2 gap-8 border-t border-white/20 pt-10 md:grid-cols-4">
                {WHY_STATS.map((stat, i) => (
                  <Reveal key={stat.label} delay={i * 0.07}>
                    <p
                      className="m-0 text-[clamp(2rem,5vw,3rem)] leading-none"
                      style={{ color: CREAM_LIGHT, fontFamily: BRAND_SERIF }}
                    >
                      {stat.kind === 'count' ? (
                        <CountUpStat to={stat.to} suffix={stat.suffix} delay={0.15 + i * 0.08} />
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p
                      className="mt-2 m-0 text-[0.72rem] leading-snug tracking-wide"
                      style={{ color: 'rgba(255,254,242,0.72)' }}
                    >
                      {stat.label}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why choose us — split feature */}
        <section style={{ backgroundColor: CREAM_LIGHT }}>
          <div className="mx-auto grid max-w-[1320px] lg:grid-cols-2">
            <Reveal>
              <img
                src="/Mukhwas_pouches_on_wooden_table_202608251630.jpeg"
                alt="Mukhwas production"
                className="block h-full min-h-[320px] w-full object-cover"
                loading="lazy"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14" style={{ backgroundColor: CREAM_DEEP }}>
              <h3
                className="m-0 text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight"
                style={{ fontFamily: BRAND_SERIF, color: INK }}
              >
                Quality you can taste in every pinch
              </h3>
              <ul className="mt-6 m-0 flex list-none flex-col gap-4 p-0">
                {WHY_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-[0.92rem] leading-[1.75]"
                    style={{ color: MUTED }}
                  >
                    <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rotate-45" style={{ backgroundColor: GOLD }} aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <PrimaryButton onClick={() => navigateApp(APP_ROUTES.wholesale)}>Become a partner</PrimaryButton>
              </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Certifications */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <Reveal className="mb-12">
              <SectionHeader
                title="Official credentials"
                description="WHO-GMP, Importer-Exporter Code, and MSME registration standing behind every Tasneem Mukhwas pack."
              />
            </Reveal>

            <div className="grid gap-6 lg:grid-cols-3">
              {CERTIFICATIONS.map((cert, i) => (
                <Reveal key={cert.title} delay={i * 0.08} className="h-full">
                  <article className="flex h-full flex-col" style={{ backgroundColor: CREAM_LIGHT }}>
                    <div
                      className="flex h-[280px] shrink-0 items-center justify-center px-5 py-8"
                      style={{ backgroundColor: CREAM_DEEP }}
                    >
                      <img
                        src={cert.src}
                        alt={cert.title}
                        className="max-h-[220px] w-auto max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="m-0 text-[0.62rem] font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(10,46,34,0.45)' }}>
                        {cert.eyebrow}
                      </p>
                      <h3 className="mt-2 m-0 text-[1.15rem]" style={{ fontFamily: BRAND_SERIF, color: INK }}>
                        {cert.title}
                      </h3>
                      <p className="mt-3 m-0 flex-1 text-[0.88rem] leading-[1.75]" style={{ color: MUTED }}>
                        {cert.body}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Licences scroll */}
        <section style={{ backgroundColor: CREAM_DEEP }}>
          <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <Reveal className="mb-10">
              <SectionHeader
                title="Licences & excellence"
                description="Exhibition certificates and industry honours from trade fairs and hospitality circles across Gujarat."
              />
            </Reveal>

            <div className="know-licence-scroll flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
              {LICENCES.map((item) => (
                <figure key={item.title} className="shrink-0 snap-center">
                  <div className="overflow-hidden p-2" style={{ backgroundColor: CREAM_LIGHT }}>
                    <img
                      src={item.src}
                      alt={item.title}
                      className="block aspect-[3/4] w-[210px] object-cover object-top sm:w-[230px]"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-3 max-w-[230px]">
                    <h3 className="m-0 text-[1rem]" style={{ fontFamily: BRAND_SERIF, color: INK }}>
                      {item.title}
                    </h3>
                    <p className="mt-2 m-0 text-[0.82rem] leading-relaxed" style={{ color: MUTED }}>
                      {item.caption}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Company + contact */}
        <section style={{ backgroundColor: CREAM_LIGHT }}>
          <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <Reveal>
                <img src={BRAND_LOGO_SRC} alt="Tasneem Mukhwas" className="h-16 w-auto object-contain sm:h-20" />
                <h3
                  className="mt-6 m-0 text-[clamp(1.75rem,3vw,2.25rem)] leading-tight"
                  style={{ fontFamily: BRAND_SERIF, color: INK }}
                >
                  Tasneem Mukhwas
                </h3>
                <p className="mt-4 m-0 max-w-lg text-[0.95rem] leading-[1.8]" style={{ color: MUTED }}>
                  The manufacturing house behind Master Paan, Patel Mukhwas, and our signature retail lines.
                  Sourcing, blending, hygienic packing, and bulk dispatch from Chhapi.
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Address', value: CONTACT_ADDRESS },
                    { label: 'Phone', value: CONTACT_PHONE_DISPLAY },
                    { label: 'Email', value: CONTACT_EMAIL },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="p-5 sm:col-span-2 sm:last:col-span-1"
                      style={{ backgroundColor: CREAM }}
                    >
                      <p className="m-0 text-[0.62rem] font-bold tracking-[0.16em] uppercase" style={{ color: 'rgba(10,46,34,0.45)' }}>
                        {row.label}
                      </p>
                      <p className="mt-2 m-0 break-words text-[0.85rem] leading-relaxed [overflow-wrap:anywhere]" style={{ color: MUTED, fontFamily: BRAND_SERIF }}>
                        {row.value}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section style={{ backgroundColor: CREAM_DEEP }}>
          <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-6 px-5 py-12 sm:px-8 sm:flex-row sm:items-center lg:px-10 lg:py-14">
            <h2
              className="m-0 max-w-xl text-[clamp(1.75rem,4vw,2.75rem)] leading-tight"
              style={{ fontFamily: BRAND_SERIF, color: INK }}
            >
              Ready to taste the tradition?
            </h2>
            <PrimaryButton onClick={() => navigateApp(APP_ROUTES.shop)}>Shop mukhwas</PrimaryButton>
          </div>
        </section>
      </motion.main>

      <SiteFooter />

      <style>{`
        .know-licence-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(10,46,34,0.25) rgba(255,254,242,0.6);
        }
        .know-licence-scroll::-webkit-scrollbar { height: 6px; }
        .know-licence-scroll::-webkit-scrollbar-track {
          background: rgba(255,254,242,0.6);
          border-radius: 999px;
        }
        .know-licence-scroll::-webkit-scrollbar-thumb {
          background: rgba(10,46,34,0.25);
          border-radius: 999px;
        }
      `}</style>
    </div>
  )
}
