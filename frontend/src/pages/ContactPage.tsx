import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import ContactGlobe from '../components/contact/ContactGlobe'
import ContactFeedbackForm from '../components/contact/ContactFeedbackForm'
import Navbar from '../components/nav/Navbar'
import BackToHomeButton from '../components/shared/BackToHomeButton'
import SiteFooter from '../components/shared/SiteFooter'
import FloatingActions from '../components/shared/FloatingActions'
import { BRAND_BRANCHES } from '../lib/brandBranches'
import {
  BRAND_CREAM,
  BRAND_CREAM_DEEP,
  BRAND_CREAM_LIGHT,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
} from '../lib/brand'
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
const CREAM_LIGHT = BRAND_CREAM_LIGHT
const CREAM_DEEP = BRAND_CREAM_DEEP
const MUTED = BRAND_MUTED
const BORDER = '#E6D8C3'
const EASE = [0.22, 1, 0.36, 1] as const

const HOURS = [
  { day: 'Mon – Sat', time: '9:00 AM – 7:00 PM IST' },
  { day: 'Sunday', time: 'Enquiries via WhatsApp' },
] as const

const CARD =
  'rounded-none border-2 bg-[#FFFEF2] p-5 sm:p-6'

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
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function Eyebrow({ children }: { children: string }) {
  return (
    <p
      className="m-0 text-[0.62rem] font-semibold tracking-[0.18em] uppercase"
      style={{ color: MUTED, fontFamily: BRAND_SANS }}
    >
      {children}
    </p>
  )
}

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="section-header-split">
      <h2
        className="m-0 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.08] tracking-[-0.02em]"
        style={{ color: INK, fontFamily: BRAND_SERIF }}
      >
        {title}
      </h2>
      <p
        className="section-header-split__desc m-0 max-w-none text-[0.94rem] leading-[1.75] lg:max-w-md"
        style={{ color: MUTED, fontFamily: BRAND_SANS }}
      >
        {description}
      </p>
    </div>
  )
}

function ContactDetail({
  label,
  children,
  href,
}: {
  label: string
  children: ReactNode
  href?: string
}) {
  const inner = (
    <>
      <Eyebrow>{label}</Eyebrow>
      <p className="mt-2 m-0 text-[0.92rem] font-medium leading-relaxed" style={{ color: INK, fontFamily: BRAND_SANS }}>
        {children}
      </p>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={`${CARD} block no-underline transition hover:bg-[#F8F3E7]`}
        style={{ borderColor: BORDER }}
      >
        {inner}
      </a>
    )
  }

  return (
    <div className={CARD} style={{ borderColor: BORDER }}>
      {inner}
    </div>
  )
}

export default function ContactPage() {
  const [activeBranchId, setActiveBranchId] = useState(BRAND_BRANCHES[0].id)
  const activeBranch = BRAND_BRANCHES.find((b) => b.id === activeBranchId) ?? BRAND_BRANCHES[0]

  useEffect(() => {
    scrollAppToTop(true)
  }, [])

  return (
    <div className="page-shell min-h-svh overflow-x-clip" style={{ backgroundColor: CREAM, color: INK, fontFamily: BRAND_SANS }}>
      <Navbar />

      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, ease: EASE }}>
        {/* Hero */}
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
                <Eyebrow>Chhapi · Gujarat · India</Eyebrow>
                <h1
                  className="mt-3 m-0 text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-[-0.02em]"
                  style={{ fontFamily: BRAND_SERIF, color: INK }}
                >
                  Contact us
                </h1>
                <p
                  className="mt-5 m-0 max-w-xl text-[0.98rem] leading-[1.85]"
                  style={{ color: MUTED, fontFamily: BRAND_SANS }}
                >
                  Reach Tasneem Mukhwas for retail orders, bulk enquiries, and partnerships. Call, email, or
                  message us on WhatsApp — our team replies from our Chhapi facility.
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="border-2 p-5 sm:p-6" style={{ borderColor: BORDER, backgroundColor: CREAM_LIGHT }}>
                  <Eyebrow>Head office</Eyebrow>
                  <p className="mt-3 m-0 text-[0.92rem] leading-[1.75]" style={{ color: INK }}>
                    {CONTACT_ADDRESS}
                  </p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center justify-center px-6 py-3 text-[0.72rem] font-semibold tracking-[0.12em] uppercase no-underline transition hover:brightness-110"
                    style={{ backgroundColor: INK, color: CREAM_LIGHT, fontFamily: BRAND_SANS }}
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Globe + contact details */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <Reveal className="mb-10 lg:mb-14">
              <SectionIntro
                title="Find us in Gujarat"
                description="Our manufacturing and dispatch hub sits on the Chhapi highway in Banaskantha — the heart of our mukhwas craft."
              />
            </Reveal>

            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
              <Reveal>
                <div
                  className="flex min-h-[280px] items-center justify-center border-2 p-6 sm:min-h-[340px] sm:p-8"
                  style={{ borderColor: BORDER, backgroundColor: CREAM_LIGHT }}
                >
                  <ContactGlobe />
                </div>
                <p className="mt-3 text-center text-[0.78rem]" style={{ color: MUTED }}>
                  Chhapi · Banaskantha · Gujarat
                </p>
              </Reveal>

              <Reveal delay={0.06} className="grid gap-4 sm:grid-cols-2">
                <ContactDetail label="Phone" href={`tel:${CONTACT_PHONE_TEL}`}>
                  {CONTACT_PHONE_DISPLAY}
                </ContactDetail>
                <ContactDetail label="Email" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </ContactDetail>

                <div className={`${CARD} sm:col-span-2`} style={{ borderColor: BORDER }}>
                  <Eyebrow>Business hours</Eyebrow>
                  <ul className="mt-3 m-0 list-none space-y-2.5 p-0">
                    {HOURS.map((row) => (
                      <li
                        key={row.day}
                        className="flex flex-col gap-0.5 text-[0.88rem] sm:flex-row sm:justify-between sm:gap-4"
                        style={{ fontFamily: BRAND_SANS }}
                      >
                        <span className="font-medium" style={{ color: INK }}>
                          {row.day}
                        </span>
                        <span style={{ color: MUTED }}>{row.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Sister brands */}
        <section style={{ backgroundColor: CREAM_LIGHT }}>
          <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <Reveal className="mb-8 lg:mb-10">
              <SectionIntro
                title="Our network"
                description="Tasneem Mukhwas sits at the centre of a family of brands — each with its own identity, sharing the same Chhapi-born standards."
              />
            </Reveal>

            <Reveal delay={0.05}>
              <div className="flex flex-wrap gap-2">
                {BRAND_BRANCHES.map((branch) => {
                  const selected = branch.id === activeBranchId
                  return (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => setActiveBranchId(branch.id)}
                      className="cursor-pointer border-2 px-3.5 py-2 text-[0.68rem] font-semibold tracking-[0.08em] uppercase transition"
                      style={{
                        fontFamily: BRAND_SANS,
                        borderColor: selected ? INK : BORDER,
                        backgroundColor: selected ? INK : 'transparent',
                        color: selected ? CREAM_LIGHT : INK,
                      }}
                    >
                      {branch.short}
                    </button>
                  )
                })}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-6">
              <article className="border-2 p-6 sm:p-8" style={{ borderColor: BORDER, backgroundColor: CREAM }}>
                <Eyebrow>Sister brand</Eyebrow>
                <h3
                  className="mt-2 m-0 text-[clamp(1.25rem,3vw,1.65rem)] leading-tight"
                  style={{ color: INK, fontFamily: BRAND_SERIF }}
                >
                  {activeBranch.name}
                </h3>
                <p className="mt-4 m-0 text-[0.94rem] leading-[1.75]" style={{ color: INK }}>
                  {activeBranch.description}
                </p>
                <p className="mt-3 m-0 text-[0.9rem] leading-[1.75]" style={{ color: MUTED }}>
                  {activeBranch.about}
                </p>
                <p className="mt-5 m-0 text-[0.88rem] leading-[1.7]" style={{ color: MUTED }}>
                  <span className="font-semibold" style={{ color: INK }}>
                    Location ·{' '}
                  </span>
                  {activeBranch.location}
                </p>
              </article>
            </Reveal>
          </div>
        </section>

        {/* Feedback */}
        <section style={{ backgroundColor: CREAM }}>
          <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <ContactFeedbackForm />
          </div>
        </section>
      </motion.main>

      <SiteFooter />
      <FloatingActions />
    </div>
  )
}
