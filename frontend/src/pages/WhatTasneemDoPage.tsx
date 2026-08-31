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
import { INGREDIENT_TABLE, WHAT_TASNEEM_DO_PAGE } from '../lib/tasneemDoContent'
import { scrollAppToTop } from '../lib/scrollControl'

const EASE = [0.22, 1, 0.36, 1] as const

export default function WhatTasneemDoPage() {
  const {
    heroTitle,
    heroSubtitle,
    heroIntro,
    ingredientsTitle,
    ingredientsIntro,
    ingredients,
    ingredientImage,
    selectionTitle,
    selectionIntro,
    selectionPoints,
    approachTitle,
    approachIntro,
    approachPoints,
    closingThought,
    faqTitle,
    faqs,
    hygiene,
  } = WHAT_TASNEEM_DO_PAGE

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    document.title = 'What Tasneem Do · Tasneem Mukhwas'
    scrollAppToTop(true)
    return () => {
      document.title = 'Tasneem Mukhwas'
    }
  }, [])

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
          <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
            <BackToHomeButton className="mb-8" />
            <p
              className="m-0 text-[0.62rem] font-bold tracking-[0.2em] uppercase"
              style={{ color: BRAND_GOLD }}
            >
              {heroSubtitle}
            </p>
            <h1
              className="mt-2 m-0 max-w-3xl text-[clamp(2rem,5vw,3rem)] leading-[1.08] tracking-tight"
              style={{ fontFamily: BRAND_SERIF }}
            >
              {heroTitle}
            </h1>
            <p className="mt-5 m-0 max-w-2xl text-[0.98rem] leading-[1.85]" style={{ color: BRAND_MUTED }}>
              {heroIntro}
            </p>
          </div>
        </section>

        <section style={{ backgroundColor: BRAND_CREAM_LIGHT }}>
          <div className="mx-auto grid max-w-[1180px] items-start gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14 lg:px-10 lg:py-20">
            <div>
              <p
                className="m-0 text-[0.62rem] font-bold tracking-[0.2em] uppercase"
                style={{ color: 'rgba(10,46,34,0.45)' }}
              >
                {ingredientsTitle}
              </p>
              <p className="mt-3 m-0 max-w-xl text-[0.95rem] leading-[1.8]" style={{ color: BRAND_MUTED }}>
                {ingredientsIntro}
              </p>
              <ul className="mt-8 m-0 list-none space-y-5 p-0">
                {ingredients.map((item, i) => (
                  <li
                    key={item.title}
                    className="rounded-xl border p-4 sm:p-5"
                    style={{
                      borderColor: 'rgba(184,134,11,0.22)',
                      backgroundColor: 'rgba(255,254,242,0.85)',
                    }}
                  >
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.68rem] font-bold"
                      style={{ backgroundColor: BRAND_GOLD, color: BRAND_INK }}
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <h2
                      className="mt-2 m-0 text-[1.05rem] font-semibold leading-snug sm:text-[1.12rem]"
                      style={{ fontFamily: BRAND_SERIF }}
                    >
                      {item.title}
                    </h2>
                    <p
                      className="mt-1 m-0 text-[0.78rem] font-semibold tracking-[0.04em]"
                      style={{ color: BRAND_GOLD }}
                    >
                      {item.subtitle}
                    </p>
                    <p className="mt-2 m-0 text-[0.88rem] leading-relaxed" style={{ color: BRAND_MUTED }}>
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="overflow-hidden rounded-2xl border shadow-[0_24px_50px_-30px_rgba(10,46,34,0.35)] lg:sticky lg:top-28 lg:max-w-md lg:justify-self-end"
              style={{ borderColor: 'rgba(184,134,11,0.28)' }}
            >
              <img
                src={ingredientImage}
                alt="Tasneem mukhwas pouches on wooden table"
                className="block aspect-[16/10] max-h-[200px] w-full object-cover sm:max-h-[220px] lg:max-h-[240px]"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: BRAND_CREAM }}>
          <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
            <h2
              className="m-0 text-[clamp(1.5rem,3vw,2rem)] leading-tight"
              style={{ fontFamily: BRAND_SERIF }}
            >
              How Different Ingredients Create Different Experiences
            </h2>
            <div className="mt-8 overflow-x-auto rounded-xl border" style={{ borderColor: 'rgba(184,134,11,0.25)' }}>
              <table className="w-full min-w-[520px] border-collapse text-left text-[0.86rem]">
                <thead>
                  <tr style={{ backgroundColor: BRAND_CREAM_DEEP }}>
                    <th className="px-4 py-3 font-semibold sm:px-5" style={{ fontFamily: BRAND_SERIF }}>
                      Ingredient
                    </th>
                    <th className="px-4 py-3 font-semibold sm:px-5" style={{ fontFamily: BRAND_SERIF }}>
                      Character
                    </th>
                    <th className="px-4 py-3 font-semibold sm:px-5" style={{ fontFamily: BRAND_SERIF }}>
                      Common Role in Mukhwas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {INGREDIENT_TABLE.map((row, i) => (
                    <tr
                      key={row.name}
                      style={{
                        backgroundColor: i % 2 === 0 ? 'rgba(255,254,242,0.9)' : 'rgba(248,243,231,0.95)',
                      }}
                    >
                      <td className="px-4 py-3 font-medium sm:px-5" style={{ color: BRAND_INK }}>
                        {row.name}
                      </td>
                      <td className="px-4 py-3 sm:px-5" style={{ color: BRAND_MUTED }}>
                        {row.character}
                      </td>
                      <td className="px-4 py-3 sm:px-5" style={{ color: BRAND_MUTED }}>
                        {row.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: BRAND_CREAM_LIGHT }}>
          <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-16">
            <div>
              <h2
                className="m-0 text-[clamp(1.5rem,3vw,2rem)] leading-tight"
                style={{ fontFamily: BRAND_SERIF }}
              >
                {selectionTitle}
              </h2>
              <p className="mt-4 m-0 text-[0.95rem] leading-[1.85]" style={{ color: BRAND_MUTED }}>
                {selectionIntro}
              </p>
              <ul className="mt-6 m-0 list-none space-y-2.5 p-0">
                {selectionPoints.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2.5 text-[0.88rem] leading-relaxed"
                    style={{ color: BRAND_MUTED }}
                  >
                    <span style={{ color: BRAND_GOLD }} aria-hidden>
                      ✦
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2
                className="m-0 text-[clamp(1.5rem,3vw,2rem)] leading-tight"
                style={{ fontFamily: BRAND_SERIF }}
              >
                {approachTitle}
              </h2>
              <p className="mt-4 m-0 text-[0.95rem] leading-[1.85]" style={{ color: BRAND_MUTED }}>
                {approachIntro}
              </p>
              <ul className="mt-6 m-0 list-none space-y-3 p-0">
                {approachPoints.map((point) => (
                  <li
                    key={point.title}
                    className="rounded-lg border px-4 py-3"
                    style={{
                      borderColor: 'rgba(184,134,11,0.2)',
                      backgroundColor: 'rgba(255,254,242,0.85)',
                    }}
                  >
                    <p className="m-0 text-[0.9rem] font-semibold" style={{ fontFamily: BRAND_SERIF }}>
                      {point.title}
                    </p>
                    <p className="mt-1 m-0 text-[0.84rem] leading-relaxed" style={{ color: BRAND_MUTED }}>
                      {point.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mx-auto max-w-[1180px] px-5 pb-14 sm:px-8 lg:px-10 lg:pb-16">
            <blockquote
              className="m-0 rounded-xl border-l-4 px-5 py-4 text-[0.95rem] leading-[1.85] italic sm:px-6"
              style={{
                borderColor: BRAND_GOLD,
                backgroundColor: 'rgba(184,134,11,0.08)',
                color: BRAND_INK,
                fontFamily: BRAND_SERIF,
              }}
            >
              {closingThought}
            </blockquote>
          </div>
        </section>

        <section style={{ backgroundColor: BRAND_CREAM }}>
          <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <p
              className="m-0 text-[0.62rem] font-bold tracking-[0.2em] uppercase"
              style={{ color: BRAND_GOLD }}
            >
              {hygiene.eyebrow}
            </p>
            <h2
              className="mt-2 m-0 text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight"
              style={{ fontFamily: BRAND_SERIF }}
            >
              {hygiene.title}
            </h2>
            <p className="mt-4 m-0 max-w-2xl text-[0.95rem] leading-[1.85]" style={{ color: BRAND_MUTED }}>
              {hygiene.intro}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {hygiene.images.map((img) => (
                <figure
                  key={img.caption}
                  className="overflow-hidden rounded-xl border"
                  style={{ borderColor: 'rgba(184,134,11,0.22)', backgroundColor: BRAND_CREAM_LIGHT }}
                >
                  <img src={img.src} alt={img.alt} className="block aspect-[16/10] max-h-[140px] w-full object-cover sm:max-h-[160px]" loading="lazy" />
                  <figcaption
                    className="px-3 py-2.5 text-[0.72rem] font-semibold tracking-[0.06em] uppercase"
                    style={{ color: BRAND_INK, fontFamily: BRAND_SANS }}
                  >
                    {img.caption}
                  </figcaption>
                </figure>
              ))}
            </div>

            <ul className="mt-10 m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
              {hygiene.points.map((point) => (
                <li
                  key={point.title}
                  className="rounded-xl border p-4 sm:p-5"
                  style={{
                    borderColor: 'rgba(184,134,11,0.2)',
                    backgroundColor: 'rgba(255,254,242,0.85)',
                  }}
                >
                  <h3
                    className="m-0 text-[1rem] font-semibold leading-snug"
                    style={{ fontFamily: BRAND_SERIF }}
                  >
                    {point.title}
                  </h3>
                  <p className="mt-2 m-0 text-[0.86rem] leading-relaxed" style={{ color: BRAND_MUTED }}>
                    {point.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section style={{ backgroundColor: BRAND_CREAM_DEEP }}>
          <div className="mx-auto max-w-[820px] px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
            <h2
              className="m-0 text-center text-[clamp(1.5rem,3vw,2rem)] leading-tight"
              style={{ fontFamily: BRAND_SERIF }}
            >
              {faqTitle}
            </h2>
            <ul className="mt-8 m-0 list-none space-y-2 p-0">
              {faqs.map((faq, i) => {
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
                      className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-4 py-3.5 text-left sm:px-5"
                      aria-expanded={open}
                    >
                      <span
                        className="text-[0.9rem] font-semibold leading-snug"
                        style={{ fontFamily: BRAND_SERIF, color: BRAND_INK }}
                      >
                        {faq.q}
                      </span>
                      <span
                        className="shrink-0 text-lg leading-none transition-transform duration-200"
                        style={{
                          color: BRAND_GOLD,
                          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                        }}
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
                            className="m-0 border-t px-4 py-3 text-[0.86rem] leading-relaxed sm:px-5"
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
