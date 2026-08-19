import { useEffect } from 'react'
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
  WHOLESALE_CHANNELS,
  WHOLESALE_EXTRAS,
  WHOLESALE_INTRO,
  WHOLESALE_STATS,
  WHOLESALE_STEPS,
  WHOLESALE_TRADE,
} from '../lib/wholesaleContent'
import { BRAND_TEXTURE, BRAND_CREAM, BRAND_INK } from '../lib/brand'

const INK = BRAND_INK
const CREAM = BRAND_CREAM
const GOLD = '#b8860b'
const PAGE = '#f2f4f5'
const MUTED = 'rgba(10,46,34,0.62)'
const EASE = [0.22, 1, 0.36, 1] as const
const BANNER = encodeURI('/Mukhwas_ingredients_arranged_on_…_202608182142.jpeg')

export default function WholesalePage() {
  useEffect(() => {
    document.title = 'Wholesale · Tasneem Mukhwas'
    scrollAppToTop(true)
    return () => {
      document.title = 'Tasneem Mukhwas'
    }
  }, [])

  return (
    <div className="min-h-svh" style={{ backgroundColor: PAGE }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[rgba(10,46,34,0.1)]">
        <div className="relative h-[14rem] sm:h-[17rem] lg:h-[19rem]">
          <img src={BANNER} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
          <img src={BRAND_TEXTURE} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(10,46,34,0.55) 0%, rgba(10,46,34,0.35) 50%, rgba(10,46,34,0.72) 100%)',
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="m-0 text-[0.68rem] font-semibold tracking-[0.22em] uppercase"
              style={{ color: 'rgba(242,244,245,0.62)' }}
            >
              {WHOLESALE_INTRO.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
              className="mt-3 m-0 max-w-3xl text-[clamp(1.85rem,5vw,3rem)] leading-tight uppercase"
              style={{ color: CREAM, fontFamily: 'Anton, Impact, sans-serif' }}
            >
              {WHOLESALE_INTRO.title}
            </motion.h1>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <BackToHomeButton className="mb-8" />

        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <p className="m-0 max-w-2xl text-[1.02rem] leading-[1.8]" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
            {WHOLESALE_INTRO.body}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href={WHATSAPP_BULK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[0.8rem] font-bold tracking-wide uppercase no-underline"
              style={{ backgroundColor: INK, color: CREAM }}
            >
              Enquire on WhatsApp
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Wholesale / Bulk enquiry')}`}
              className="inline-flex items-center justify-center rounded-full border px-7 py-3.5 text-[0.8rem] font-bold tracking-wide uppercase no-underline"
              style={{ borderColor: 'rgba(10,46,34,0.2)', color: INK }}
            >
              Email enquiry
            </a>
          </div>
        </div>

        {/* Stats — pill cards */}
        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {WHOLESALE_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
              className="rounded-2xl border p-5"
              style={{ borderColor: 'rgba(10,46,34,0.1)', backgroundColor: '#fff' }}
            >
              <p className="m-0 text-[1.5rem] font-bold leading-none" style={{ color: GOLD }}>
                {stat.value}
              </p>
              <p className="mt-2 m-0 text-[0.78rem] font-semibold uppercase tracking-wide" style={{ color: INK }}>
                {stat.label}
              </p>
              <p className="mt-1 m-0 text-[0.72rem] leading-snug" style={{ color: MUTED }}>
                {stat.hint}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Channels */}
        <section className="mt-16">
          <p className="m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            Who we supply
          </p>
          <h2 className="mt-2 m-0 text-[1.65rem] font-bold" style={{ color: INK }}>
            Channels built for volume
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {WHOLESALE_CHANNELS.map((ch, i) => (
              <motion.article
                key={ch.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="rounded-2xl border-l-4 p-6"
                style={{ borderColor: GOLD, backgroundColor: 'rgba(255,255,255,0.85)', boxShadow: '0 16px 40px -32px rgba(10,46,34,0.2)' }}
              >
                <h3 className="m-0 text-[1.05rem] font-bold" style={{ color: INK }}>{ch.title}</h3>
                <p className="mt-2 m-0 text-[0.9rem] leading-relaxed" style={{ color: MUTED }}>{ch.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Trade + steps */}
        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <section className="rounded-3xl border p-6 sm:p-8" style={{ borderColor: 'rgba(10,46,34,0.1)', backgroundColor: '#fff' }}>
            <p className="m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase" style={{ color: GOLD }}>
              Trade credentials
            </p>
            <h2 className="mt-2 m-0 text-[1.35rem] font-bold" style={{ color: INK }}>
              Import & export ready
            </h2>
            <dl className="mt-6 m-0 space-y-3">
              {WHOLESALE_TRADE.map((row) => (
                <div key={row.label} className="rounded-xl px-4 py-3" style={{ backgroundColor: 'rgba(248,249,250,0.9)' }}>
                  <dt className="m-0 text-[0.65rem] font-semibold tracking-[0.12em] uppercase" style={{ color: GOLD }}>
                    {row.label}
                  </dt>
                  <dd className="mt-1 m-0 text-[0.88rem] leading-snug" style={{ color: INK }}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <p className="m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase" style={{ color: GOLD }}>
              How it works
            </p>
            <h2 className="mt-2 m-0 text-[1.35rem] font-bold" style={{ color: INK }}>
              From enquiry to dispatch
            </h2>
            <ol className="mt-6 m-0 list-none space-y-4 p-0">
              {WHOLESALE_STEPS.map((step, i) => (
                <motion.li
                  key={step.n}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
                  className="flex gap-4 rounded-2xl border p-4"
                  style={{ borderColor: 'rgba(10,46,34,0.1)', backgroundColor: '#fff' }}
                >
                  <span className="shrink-0 text-[1.2rem] font-bold" style={{ color: GOLD }}>{step.n}</span>
                  <div>
                    <p className="m-0 font-semibold" style={{ color: INK }}>{step.title}</p>
                    <p className="mt-1 m-0 text-[0.86rem] leading-relaxed" style={{ color: MUTED }}>{step.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </section>
        </div>

        {/* Extras */}
        <section className="relative mt-16 overflow-hidden rounded-3xl p-6 sm:p-8" style={{ backgroundColor: INK }}>
          <img src={BRAND_TEXTURE} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" />
          <p className="relative m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase" style={{ color: 'rgba(242,244,245,0.55)' }}>
            Also included
          </p>
          <h2 className="relative mt-2 m-0 text-[1.45rem] font-bold uppercase" style={{ color: CREAM, fontFamily: 'Anton, Impact, sans-serif' }}>
            Partner support
          </h2>
          <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
            {WHOLESALE_EXTRAS.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 p-5" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <h3 className="m-0 text-[0.95rem] font-semibold" style={{ color: CREAM }}>{item.title}</h3>
                <p className="mt-2 m-0 text-[0.84rem] leading-relaxed" style={{ color: 'rgba(242,244,245,0.68)' }}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="mt-14 flex flex-col items-start justify-between gap-5 rounded-3xl border p-6 sm:flex-row sm:items-center sm:p-8"
          style={{ borderColor: 'rgba(10,46,34,0.12)', backgroundColor: '#fff' }}
        >
          <div>
            <p className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] uppercase" style={{ color: GOLD }}>
              Ready to order
            </p>
            <p className="mt-2 m-0 text-[1.1rem] font-bold" style={{ color: INK }}>
              Talk bulk today — {CONTACT_PHONE_DISPLAY}
            </p>
            <p className="mt-1 m-0 text-[0.85rem]" style={{ color: MUTED }}>{CONTACT_EMAIL}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-[0.78rem] font-semibold uppercase no-underline"
              style={{ borderColor: 'rgba(10,46,34,0.2)', color: INK }}
            >
              Call now
            </a>
            <a
              href={WHATSAPP_BULK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[0.78rem] font-semibold uppercase no-underline"
              style={{ backgroundColor: INK, color: CREAM }}
            >
              WhatsApp bulk desk
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
      <FloatingActions />
    </div>
  )
}
