import { useEffect, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/nav/Navbar'
import BackToHomeButton from '../components/shared/BackToHomeButton'
import SiteFooter from '../components/shared/SiteFooter'
import FloatingActions from '../components/shared/FloatingActions'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  WHATSAPP_BULK_URL,
} from '../lib/contact'
import { scrollAppToTop } from '../lib/scrollControl'
import {
  DEALERSHIP_INTRO,
  DEALERSHIP_STATS,
  FEATURE_GRID,
  GROW_SECTION,
  PARTNER_BENEFITS,
  SOLUTION_CARDS,
  WHY_CHOOSE,
} from '../lib/wholesaleContent'
import {
  BRAND_CREAM,
  BRAND_CREAM_DEEP,
  BRAND_CREAM_LIGHT,
  BRAND_GOLD,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
} from '../lib/brand'

const INK = BRAND_INK
const CREAM = BRAND_CREAM
const CREAM_LIGHT = BRAND_CREAM_LIGHT
const CREAM_DEEP = BRAND_CREAM_DEEP
const GOLD = BRAND_GOLD
const MUTED = BRAND_MUTED
const EASE = [0.22, 1, 0.36, 1] as const

const HERO_IMG = '/Mukhwas_pouches_on_wooden_table_202608251659.jpeg'
const GROW_IMG = encodeURI('/Tasneem_Mukhwas_pouches_on_shelf_202609010137.jpeg')
const COLLAB_IMG = encodeURI('/Corporate_gift_hamper_on_desk_202609010134.jpeg')

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="section-header-split">
      <h2
        className="m-0 text-[clamp(1.85rem,4.5vw,3rem)] leading-[1.08] tracking-[-0.02em]"
        style={{ fontFamily: BRAND_SERIF, color: INK }}
      >
        {title}
      </h2>
      {description ? (
        <p className="section-header-split__desc m-0 max-w-none text-[0.95rem] leading-[1.75] lg:max-w-md" style={{ color: MUTED, fontFamily: BRAND_SANS }}>
          {description}
        </p>
      ) : null}
    </div>
  )
}

function PrimaryBtn({
  children,
  href,
  external = false,
  dark = true,
}: {
  children: ReactNode
  href: string
  external?: boolean
  dark?: boolean
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex w-full items-center justify-center px-7 py-3.5 text-[0.78rem] font-semibold tracking-[0.12em] uppercase no-underline transition hover:brightness-110 sm:w-auto"
      style={{
        backgroundColor: dark ? INK : CREAM_LIGHT,
        color: dark ? CREAM_LIGHT : INK,
        fontFamily: BRAND_SANS,
        border: dark ? 'none' : `1px solid rgba(10,46,34,0.18)`,
      }}
    >
      {children}
    </a>
  )
}

function ArrowItem({ children }: { children: string }) {
  return (
    <li className="flex gap-3 text-[0.92rem] leading-[1.75]" style={{ color: MUTED, fontFamily: BRAND_SANS }}>
      <span className="mt-0.5 shrink-0 font-bold" style={{ color: GOLD }} aria-hidden>
        →
      </span>
      {children}
    </li>
  )
}

export default function WholesalePage() {
  useEffect(() => {
    document.title = 'Dealership · Tasneem Mukhwas'
    scrollAppToTop(true)
    return () => {
      document.title = 'Tasneem Mukhwas'
    }
  }, [])

  return (
    <div className="page-shell min-h-svh" style={{ backgroundColor: CREAM, fontFamily: BRAND_SANS, color: INK }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[22rem] sm:min-h-[26rem] lg:min-h-[30rem]">
          <img
            src={HERO_IMG}
            alt="Tasneem Mukhwas wholesale and dealership"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(10,46,34,0.28) 0%, rgba(10,46,34,0.18) 45%, rgba(10,46,34,0.32) 100%)',
            }}
            aria-hidden
          />
        </div>
      </section>

      <main>
        {/* Intro */}
        <section style={{ backgroundColor: CREAM_LIGHT }}>
          <div className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
            <BackToHomeButton className="mb-8" />
            <Reveal>
              <p className="m-0 max-w-3xl text-[1.02rem] leading-[1.85]" style={{ color: MUTED, fontFamily: BRAND_SANS }}>
                {DEALERSHIP_INTRO}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Stats */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="mx-auto max-w-[1320px] border-y px-5 py-12 sm:px-8 lg:px-10 lg:py-14" style={{ borderColor: 'rgba(10,46,34,0.1)' }}>
            <div className="stat-grid-responsive">
              {DEALERSHIP_STATS.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.06}>
                  <p className="m-0 text-[clamp(2rem,4vw,2.75rem)] leading-none" style={{ fontFamily: BRAND_SERIF, color: INK }}>
                    {stat.value}
                  </p>
                  <p className="mt-2 m-0 text-[0.82rem] font-semibold uppercase tracking-wide" style={{ color: INK }}>
                    {stat.label}
                  </p>
                  <p className="mt-2 m-0 text-[0.88rem] leading-relaxed" style={{ color: MUTED }}>
                    {stat.hint}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Why choose — bordered grid */}
        <section style={{ backgroundColor: CREAM_LIGHT }}>
          <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <Reveal className="mb-10">
              <SectionHeader
                title="Why companies choose Tasneem Mukhwas"
                description="Premium Indian mukhwas with branding, certification, and fulfilment built for B2B partners."
              />
            </Reveal>
            <Reveal>
              <div className="border p-6 sm:p-8 lg:p-10" style={{ borderColor: 'rgba(10,46,34,0.12)', backgroundColor: CREAM }}>
                <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:gap-5">
                  {WHY_CHOOSE.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[0.92rem] leading-[1.7]"
                      style={{ color: MUTED }}
                    >
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rotate-45" style={{ backgroundColor: GOLD }} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Feature 2×2 grid */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <div className="grid gap-px sm:grid-cols-2" style={{ backgroundColor: 'rgba(10,46,34,0.1)' }}>
              {FEATURE_GRID.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.05}>
                  <article className="h-full overflow-hidden" style={{ backgroundColor: CREAM_LIGHT }}>
                    <div className="section-image-hover overflow-hidden" style={{ backgroundColor: CREAM }}>
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="section-image-hover__img block aspect-[16/10] w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-7 sm:p-8">
                      <span className="text-lg" style={{ color: GOLD }} aria-hidden>
                        ◆
                      </span>
                      <h3 className="mt-3 m-0 text-[1.15rem]" style={{ fontFamily: BRAND_SERIF, color: INK }}>
                        {item.title}
                      </h3>
                      <p className="mt-2 m-0 text-[0.9rem] leading-[1.75]" style={{ color: MUTED }}>
                        {item.body}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Alternating — collaborate */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
            <div
              className="grid items-stretch overflow-hidden rounded-2xl lg:grid-cols-2 lg:rounded-3xl"
              style={{ backgroundColor: CREAM_DEEP }}
            >
              <Reveal>
                <div className="section-image-hover h-full min-h-[280px] overflow-hidden lg:min-h-[420px]">
                  <img
                    src={COLLAB_IMG}
                    alt="Corporate gift hamper with Tasneem Mukhwas"
                    className="section-image-hover__img block h-full min-h-[280px] w-full object-cover lg:min-h-[420px]"
                    loading="lazy"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.08} className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
                <p className="m-0 text-[0.62rem] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(10,46,34,0.45)' }}>
                  Collaborate
                </p>
                <h2 className="mt-3 m-0 text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight" style={{ fontFamily: BRAND_SERIF, color: INK }}>
                  Memorable gifts for every occasion
                </h2>
                <p className="mt-5 m-0 text-[0.95rem] leading-[1.85]" style={{ color: MUTED }}>
                  Collaborate with us to source wholesale mukhwas and create memorable gifts that will leave a
                  lasting impression on your clients and guests — from corporate hampers to event favours.
                </p>
                <a
                  href={WHATSAPP_BULK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block text-[0.78rem] font-semibold tracking-[0.1em] uppercase no-underline hover:underline"
                  style={{ color: INK }}
                >
                  Learn more →
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Grow with the crunch — alternating flip */}
        <section style={{ backgroundColor: CREAM_LIGHT }}>
          <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-20">
            <Reveal className="order-2 lg:order-1 lg:px-5">
              <p className="m-0 text-[0.62rem] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(10,46,34,0.45)' }}>
                {GROW_SECTION.eyebrow}
              </p>
              <h2 className="mt-3 m-0 text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight" style={{ fontFamily: BRAND_SERIF, color: INK }}>
                {GROW_SECTION.title}
              </h2>
              <p className="mt-5 m-0 text-[0.95rem] leading-[1.85]" style={{ color: MUTED }}>
                {GROW_SECTION.body}
              </p>
              <ul className="mt-8 m-0 flex list-none flex-col gap-3 p-0">
                {PARTNER_BENEFITS.map((item) => (
                  <ArrowItem key={item}>{item}</ArrowItem>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08} className="order-1 lg:order-2">
              <div className="section-image-hover overflow-hidden">
                <img
                  src={GROW_IMG}
                  alt="Tasneem Mukhwas products"
                  className="section-image-hover__img block aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Solution cards */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <Reveal className="mb-12">
              <SectionHeader
                title="Solutions built for your channel"
                description="Retail counters, hospitality trays, and corporate gifting — sealed fresh from Chhapi."
              />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SOLUTION_CARDS.map((card, i) => (
                <Reveal key={card.title} delay={i * 0.08}>
                  <article className="flex h-full flex-col" style={{ backgroundColor: CREAM_LIGHT }}>
                    <div className="section-image-hover overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="section-image-hover__img block aspect-[4/3] w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="m-0 text-[0.62rem] font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(10,46,34,0.45)' }}>
                        {card.tag}
                      </p>
                      <h3 className="mt-2 m-0 text-[1.2rem]" style={{ fontFamily: BRAND_SERIF, color: INK }}>
                        {card.title}
                      </h3>
                      <p className="mt-3 m-0 flex-1 text-[0.88rem] leading-[1.75]" style={{ color: MUTED }}>
                        {card.body}
                      </p>
                      <a
                        href={WHATSAPP_BULK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center justify-center px-5 py-3 text-[0.72rem] font-semibold tracking-[0.1em] uppercase no-underline transition hover:brightness-110"
                        style={{ backgroundColor: INK, color: CREAM_LIGHT }}
                      >
                        Learn more
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section style={{ backgroundColor: CREAM_DEEP }}>
          <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-6 px-5 py-12 sm:flex-row sm:items-center sm:px-8 lg:px-10 lg:py-14">
            <div>
              <h2 className="m-0 max-w-xl text-[clamp(1.65rem,3.5vw,2.5rem)] leading-tight" style={{ fontFamily: BRAND_SERIF, color: INK }}>
                Let&apos;s turn your partnership into momentum
              </h2>
              <p className="mt-3 m-0 text-[0.9rem]" style={{ color: MUTED }}>
                {CONTACT_PHONE_DISPLAY} · {CONTACT_EMAIL}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <PrimaryBtn href={`tel:${CONTACT_PHONE_TEL}`}>Call now</PrimaryBtn>
              <PrimaryBtn href={WHATSAPP_BULK_URL} external>
                WhatsApp desk
              </PrimaryBtn>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <FloatingActions />
    </div>
  )
}
