import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Factory, Globe, Package, ShieldCheck, Truck } from 'lucide-react'
import ManufacturingProcessSection from '../components/home/ManufacturingProcessSection'
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

const HERO_IMG = encodeURI('/Tasneem_Mukhwas_pouch_on_surface_202609010124.jpeg')
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
    image: encodeURI('/Ceramic_bowl_with_mukhwas_blend_202609010113.jpeg'),
    href: APP_ROUTES.shop,
  },
  {
    label: 'Paan Specials',
    title: 'Master Paan & paan shots',
    image: encodeURI('/Paan_display_and_shots_2K_202609010113.jpeg'),
    href: APP_ROUTES.shop,
  },
  {
    label: 'Export & IEC',
    title: 'International dispatch',
    image: encodeURI('/Shipping_boxes_loaded_on_pallet_202609010113.jpeg'),
    href: APP_ROUTES.wholesale,
  },
  {
    label: 'HORECA supply',
    title: 'Hotels & hospitality',
    image: encodeURI('/Mouth_fresheners_in_serving_bowl_202609010115.jpeg'),
    href: APP_ROUTES.wholesale,
  },
] as const

const WHY_CHOOSE_ITEMS = [
  {
    title: 'Quality Assured',
    body: 'Strict quality checks in every batch.',
    icon: ShieldCheck,
  },
  {
    title: 'Own Manufacturing',
    body: 'Reliable production for bulk orders.',
    icon: Factory,
  },
  {
    title: 'Private Label',
    body: 'Custom branding and packaging support.',
    icon: Package,
  },
  {
    title: 'Bulk Orders',
    body: 'Designed for distributors and wholesalers.',
    icon: Truck,
  },
  {
    title: 'Export Ready',
    body: 'Prepared for international supply.',
    icon: Globe,
  },
  {
    title: 'Consistent Taste',
    body: 'Traditional flavours with reliable quality.',
    icon: Award,
  },
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
    rotate: -90,
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
    <div className="grid section-header-split">
      <h2
        className="m-0 text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.02em]"
        style={{ color: light ? CREAM_LIGHT : INK, fontFamily: BRAND_SERIF }}
      >
        {title}
      </h2>
      <p
        className="section-header-split__desc m-0 max-w-none text-[0.95rem] leading-[1.75] lg:max-w-md"
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
      className="w-full cursor-pointer border-0 px-7 py-3.5 text-[0.78rem] font-semibold tracking-[0.14em] uppercase transition hover:brightness-110 sm:w-auto"
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

export default function KnowMorePage() {
  useEffect(() => {
    scrollAppToTop(true)
    const id = window.requestAnimationFrame(() => scrollAppToTop(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  return (
    <div className="page-shell min-h-screen" style={{ backgroundColor: CREAM, fontFamily: BRAND_SANS, color: INK }}>
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
                <div className="overflow-hidden rounded-xl lg:rounded-2xl" style={{ backgroundColor: CREAM_LIGHT }}>
                  <img src={HERO_IMG} alt="Tasneem Mukhwas pouches" className="block aspect-[5/4] w-full object-cover" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Leadership — directly below intro */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(240px,300px)_1fr] lg:px-10 lg:py-20">
            <Reveal className="mx-auto w-full max-w-[300px] lg:mx-0">
              <img
                src={FOUNDER_PORTRAIT}
                alt="A Y Patel"
                className="block aspect-[4/5] w-full object-cover object-top"
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

        <ManufacturingProcessSection background="cream-deep" />

        {/* Why Choose Us */}
        <section style={{ backgroundColor: CREAM_LIGHT }}>
          <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <Reveal>
              <h2
                className="m-0 text-center text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.02em]"
                style={{ color: INK, fontFamily: BRAND_SERIF }}
              >
                Why Choose Us
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
              {WHY_CHOOSE_ITEMS.map((item, i) => {
                const Icon = item.icon
                return (
                  <Reveal key={item.title} delay={i * 0.05}>
                    <article
                      className="flex h-full flex-col items-center rounded-2xl border px-5 py-7 text-center sm:px-6 sm:py-8"
                      style={{
                        borderColor: 'rgba(10,46,34,0.1)',
                        backgroundColor: 'rgba(255,255,255,0.72)',
                      }}
                    >
                      <span
                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ backgroundColor: 'rgba(10,46,34,0.06)', color: INK }}
                        aria-hidden
                      >
                        <Icon className="h-6 w-6" strokeWidth={1.75} />
                      </span>
                      <h3
                        className="m-0 text-[1.05rem] font-bold leading-snug sm:text-[1.12rem]"
                        style={{ color: INK, fontFamily: BRAND_SANS }}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-2.5 m-0 max-w-[18rem] text-[0.88rem] leading-[1.65]" style={{ color: MUTED }}>
                        {item.body}
                      </p>
                    </article>
                  </Reveal>
                )
              })}
            </div>
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  <div className="flex aspect-[3/4] w-[210px] items-center justify-center overflow-hidden sm:w-[230px]">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain"
                      style={'rotate' in item && item.rotate ? { transform: `rotate(${item.rotate}deg)` } : undefined}
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
            <div className="w-full sm:w-auto">
              <PrimaryButton onClick={() => navigateApp(APP_ROUTES.shop)}>Shop mukhwas</PrimaryButton>
            </div>
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
