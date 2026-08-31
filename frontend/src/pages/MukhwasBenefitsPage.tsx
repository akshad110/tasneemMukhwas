import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/nav/Navbar'
import BackToHomeButton from '../components/shared/BackToHomeButton'
import SiteFooter from '../components/shared/SiteFooter'
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
import {
  BENEFIT_CATEGORIES,
  type BenefitCategoryId,
} from '../lib/mukhwasBenefitsContent'
import { scrollAppToTop } from '../lib/scrollControl'

const EASE = [0.22, 1, 0.36, 1] as const

export default function MukhwasBenefitsPage() {
  const [activeId, setActiveId] = useState<BenefitCategoryId>('mukhwas')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const active = BENEFIT_CATEGORIES.find((c) => c.id === activeId) ?? BENEFIT_CATEGORIES[0]

  useEffect(() => {
    document.title = 'Benefits of Mukhwas · Tasneem Mukhwas'
    scrollAppToTop(true)
    return () => {
      document.title = 'Tasneem Mukhwas'
    }
  }, [])

  useEffect(() => {
    setOpenFaq(null)
  }, [activeId])

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_CREAM, color: BRAND_INK, fontFamily: BRAND_SANS }}>
      <Navbar />

      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, ease: EASE }}>
        <section
          style={{
            backgroundColor: BRAND_CREAM_DEEP,
            paddingTop: 'calc(4.75rem + env(safe-area-inset-top, 0px))',
          }}
        >
          <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
            <BackToHomeButton className="mb-8" />
            <p
              className="m-0 text-[0.62rem] font-bold tracking-[0.2em] uppercase"
              style={{ color: BRAND_GOLD }}
            >
              Nutrition & tradition
            </p>
            <h1
              className="mt-2 m-0 max-w-3xl text-[clamp(2rem,5vw,3rem)] leading-[1.08] tracking-tight"
              style={{ fontFamily: BRAND_SERIF }}
            >
              Benefits of Mukhwas & Seeds
            </h1>
            <p className="mt-4 m-0 max-w-2xl text-[0.95rem] leading-[1.85]" style={{ color: BRAND_MUTED }}>
              Explore why Indians love mukhwas — and the traditional seeds that make every blend special.
            </p>

            <div
              className="mt-8 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Benefit categories"
            >
              {BENEFIT_CATEGORIES.map((cat) => {
                const selected = cat.id === activeId
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveId(cat.id)}
                    className="shrink-0 cursor-pointer rounded-full border-2 px-5 py-2.5 text-[0.78rem] font-bold tracking-[0.06em] transition sm:px-6 sm:text-[0.82rem]"
                    style={{
                      borderColor: selected ? BRAND_INK : 'rgba(184,134,11,0.35)',
                      backgroundColor: selected ? BRAND_INK : BRAND_CREAM_LIGHT,
                      color: selected ? BRAND_CREAM_LIGHT : BRAND_INK,
                      fontFamily: BRAND_SANS,
                      boxShadow: selected ? '0 10px 24px -12px rgba(10,46,34,0.45)' : 'none',
                    }}
                  >
                    {cat.tabLabel === 'Mukhwas' ? 'Benefits of Mukhwas' : `Benefits of ${cat.tabLabel}`}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <AnimatePresence mode="wait">
          <motion.section
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ backgroundColor: BRAND_CREAM_LIGHT }}
          >
            <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
              <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
                <div className="flex flex-col gap-3">
                  <div
                    className="overflow-hidden rounded-2xl border shadow-[0_20px_40px_-28px_rgba(10,46,34,0.35)]"
                    style={{ borderColor: 'rgba(184,134,11,0.28)' }}
                  >
                    <img
                      src={active.heroImage}
                      alt={active.heroImageAlt}
                      className="block aspect-[16/10] max-h-[160px] w-full object-cover sm:max-h-[180px]"
                      loading="lazy"
                    />
                  </div>
                  <div
                    className="overflow-hidden rounded-xl border"
                    style={{ borderColor: 'rgba(184,134,11,0.2)' }}
                  >
                    <img
                      src={active.secondaryImage}
                      alt={active.secondaryImageAlt}
                      className="block aspect-[16/10] max-h-[160px] w-full object-cover sm:max-h-[180px]"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div>
                  <h2
                    className="m-0 text-[clamp(1.6rem,3.5vw,2.25rem)] leading-tight"
                    style={{ fontFamily: BRAND_SERIF }}
                  >
                    {active.title}
                  </h2>
                  <p className="mt-4 m-0 text-[0.95rem] leading-[1.85]" style={{ color: BRAND_MUTED }}>
                    {active.intro}
                  </p>

                  <ul className="mt-8 m-0 list-none space-y-3 p-0">
                    {active.benefits.map((benefit, i) => (
                      <motion.li
                        key={benefit.title}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.32, ease: EASE, delay: i * 0.04 }}
                        className="flex gap-3.5 rounded-xl border p-4"
                        style={{
                          borderColor: 'rgba(184,134,11,0.2)',
                          backgroundColor: 'rgba(255,254,242,0.9)',
                        }}
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-bold"
                          style={{ backgroundColor: BRAND_GOLD, color: BRAND_INK }}
                          aria-hidden
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p
                            className="m-0 text-[0.9rem] font-semibold leading-snug"
                            style={{ fontFamily: BRAND_SERIF }}
                          >
                            {benefit.title}
                          </p>
                          <p className="mt-1 m-0 text-[0.84rem] leading-relaxed" style={{ color: BRAND_MUTED }}>
                            {benefit.body}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              <blockquote
                className="mt-12 m-0 rounded-2xl border-l-4 px-5 py-4 text-[0.92rem] leading-[1.85] sm:px-6"
                style={{
                  borderColor: BRAND_GOLD,
                  backgroundColor: 'rgba(184,134,11,0.08)',
                  color: BRAND_INK,
                  fontFamily: BRAND_SERIF,
                }}
              >
                {active.closing}
              </blockquote>
            </div>
          </motion.section>
        </AnimatePresence>

        <section style={{ backgroundColor: BRAND_CREAM }}>
          <div className="mx-auto max-w-[720px] px-5 py-12 sm:px-8 lg:px-10 lg:py-14">
            <h3
              className="m-0 text-center text-[clamp(1.25rem,2.5vw,1.6rem)]"
              style={{ fontFamily: BRAND_SERIF }}
            >
              Common questions
            </h3>
            <ul className="mt-6 m-0 list-none space-y-2 p-0">
              {active.faqs.map((faq, i) => {
                const open = openFaq === i
                return (
                  <li
                    key={faq.q}
                    className="overflow-hidden rounded-xl border"
                    style={{
                      borderColor: 'rgba(184,134,11,0.22)',
                      backgroundColor: BRAND_CREAM_LIGHT,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-4 py-3.5 text-left"
                      aria-expanded={open}
                    >
                      <span
                        className="text-[0.88rem] font-semibold leading-snug"
                        style={{ fontFamily: BRAND_SERIF, color: BRAND_INK }}
                      >
                        {faq.q}
                      </span>
                      <span
                        className="shrink-0 text-lg leading-none transition-transform duration-200"
                        style={{ color: BRAND_GOLD, transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
                        aria-hidden
                      >
                        +
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p
                            className="m-0 border-t px-4 py-3 text-[0.84rem] leading-relaxed"
                            style={{ borderColor: 'rgba(184,134,11,0.15)', color: BRAND_MUTED }}
                          >
                            {faq.a}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </motion.main>

      <SiteFooter />
    </div>
  )
}
