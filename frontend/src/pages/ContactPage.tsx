import { useEffect, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import ContactGlobe from '../components/contact/ContactGlobe'
import Navbar from '../components/nav/Navbar'
import BackToHomeButton from '../components/shared/BackToHomeButton'
import SiteFooter from '../components/shared/SiteFooter'
import FloatingActions from '../components/shared/FloatingActions'
import { BRAND_BRANCHES } from '../lib/brandBranches'
import { BRAND_INK, BRAND_CREAM, BRAND_TEXTURE } from '../lib/brand'
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  WHATSAPP_URL,
} from '../lib/contact'
import { scrollAppToTop } from '../lib/scrollControl'

const INK = BRAND_INK
const CREAM = BRAND_CREAM
const GOLD = '#b8860b'
const PAGE = '#f2f4f5'
const MUTED = 'rgba(10,46,34,0.62)'
const EASE = [0.22, 1, 0.36, 1] as const

const HOURS = [
  { day: 'Mon – Sat', time: '9:00 AM – 7:00 PM IST' },
  { day: 'Sunday', time: 'Enquiries via WhatsApp' },
] as const

function noopVisit(e: MouseEvent<HTMLButtonElement>) {
  e.preventDefault()
}

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact · Tasneem Mukhwas'
    scrollAppToTop(true)
    return () => {
      document.title = 'Tasneem Mukhwas'
    }
  }, [])

  return (
    <div className="min-h-svh" style={{ backgroundColor: PAGE }}>
      <Navbar />

      {/* Header band */}
      <section className="relative overflow-hidden border-b border-[rgba(10,46,34,0.1)] py-14 sm:py-16">
        <img src={BRAND_TEXTURE} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(242,244,245,0.92) 0%, rgba(242,244,245,0.75) 100%)' }} />
        <div className="relative mx-auto max-w-[1100px] px-5 text-center sm:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="m-0 text-[clamp(2.5rem,7vw,4rem)] uppercase leading-none"
            style={{ color: INK, fontFamily: 'Anton, Impact, sans-serif' }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="mx-auto mt-4 max-w-xl text-[1rem] leading-relaxed"
            style={{ color: MUTED }}
          >
            Reach Tasneem Mukhwas and our sister brands from one Chhapi address — call, email, or WhatsApp
            our team for orders, bulk enquiries, and partnerships.
          </motion.p>
        </div>
      </section>

      <main className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16">
        <BackToHomeButton className="mb-10" />

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="rounded-3xl border p-6 sm:p-8" style={{ borderColor: 'rgba(10,46,34,0.1)', backgroundColor: '#fff' }}>
            <ContactGlobe />
            <p className="mt-4 text-center text-[0.78rem]" style={{ color: MUTED }}>
              Chhapi · Banaskantha · Gujarat
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border p-5" style={{ borderColor: 'rgba(10,46,34,0.1)', backgroundColor: '#fff' }}>
              <p className="m-0 text-[0.65rem] font-semibold tracking-[0.14em] uppercase" style={{ color: GOLD }}>
                Headquarters
              </p>
              <p className="mt-2 m-0 text-[0.92rem] leading-relaxed" style={{ color: INK }}>
                {CONTACT_ADDRESS}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={`tel:${CONTACT_PHONE_TEL}`}
                className="rounded-2xl border p-5 no-underline transition hover:-translate-y-0.5"
                style={{ borderColor: 'rgba(10,46,34,0.1)', backgroundColor: '#fff' }}
              >
                <p className="m-0 text-[0.65rem] font-semibold tracking-[0.14em] uppercase" style={{ color: GOLD }}>Phone</p>
                <p className="mt-2 m-0 text-[0.95rem] font-semibold" style={{ color: INK }}>{CONTACT_PHONE_DISPLAY}</p>
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-2xl border p-5 no-underline transition hover:-translate-y-0.5"
                style={{ borderColor: 'rgba(10,46,34,0.1)', backgroundColor: '#fff' }}
              >
                <p className="m-0 text-[0.65rem] font-semibold tracking-[0.14em] uppercase" style={{ color: GOLD }}>Email</p>
                <p className="mt-2 m-0 break-words text-[0.88rem] font-semibold [overflow-wrap:anywhere]" style={{ color: INK }}>
                  {CONTACT_EMAIL}
                </p>
              </a>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full py-3.5 text-[0.8rem] font-bold tracking-wide uppercase no-underline"
              style={{ backgroundColor: INK, color: CREAM }}
            >
              Chat on WhatsApp
            </a>

            <div className="rounded-2xl border p-5" style={{ borderColor: 'rgba(10,46,34,0.1)', backgroundColor: 'rgba(248,249,250,0.9)' }}>
              <p className="m-0 text-[0.65rem] font-semibold tracking-[0.14em] uppercase" style={{ color: GOLD }}>
                Business hours
              </p>
              <ul className="mt-3 m-0 list-none space-y-2 p-0">
                {HOURS.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4 text-[0.88rem]" style={{ color: INK }}>
                    <span>{h.day}</span>
                    <span style={{ color: MUTED }}>{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sister branches */}
        <section className="mt-16">
          <p className="m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            Our network
          </p>
          <h2 className="mt-2 m-0 text-[1.75rem] font-bold uppercase" style={{ color: INK, fontFamily: 'Anton, Impact, sans-serif' }}>
            Sister branches
          </h2>
          <p className="mt-3 m-0 max-w-2xl text-[0.95rem] leading-relaxed" style={{ color: MUTED }}>
            Tasneem Mukhwas sits at the centre of a family of brands — each with its own identity, sharing
            the same commitment to hygiene, tradition, and Chhapi-born craft.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {BRAND_BRANCHES.map((branch, i) => (
              <motion.article
                key={branch.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="flex h-full flex-col rounded-3xl border p-6"
                style={{
                  borderColor: 'rgba(10,46,34,0.1)',
                  backgroundColor: '#fff',
                  boxShadow: '0 20px 44px -32px rgba(10,46,34,0.22)',
                }}
              >
                <p className="m-0 text-[0.62rem] font-semibold tracking-[0.16em] uppercase" style={{ color: GOLD }}>
                  Sister branch
                </p>
                <h3 className="mt-2 m-0 text-[1.15rem] font-bold tracking-wide uppercase" style={{ color: INK }}>
                  {branch.name}
                </h3>
                <p className="mt-3 m-0 text-[0.9rem] leading-relaxed" style={{ color: INK }}>
                  {branch.description}
                </p>
                <p className="mt-2 m-0 text-[0.84rem] leading-relaxed" style={{ color: MUTED }}>
                  {branch.about}
                </p>
                <p className="mt-4 m-0 text-[0.8rem] leading-relaxed" style={{ color: MUTED }}>
                  <span className="font-semibold" style={{ color: INK }}>Location · </span>
                  {branch.location}
                </p>
                <button
                  type="button"
                  onClick={noopVisit}
                  className="mt-auto inline-flex cursor-pointer items-center gap-1.5 self-start border-0 bg-transparent pt-5 text-[0.78rem] font-semibold tracking-wide uppercase"
                  style={{ color: GOLD }}
                  aria-disabled="true"
                >
                  {branch.websiteLabel}
                  <span aria-hidden>→</span>
                </button>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
      <FloatingActions />
    </div>
  )
}
