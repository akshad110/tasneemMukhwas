import { motion } from 'framer-motion'
import {
  BRAND_CREAM,
  BRAND_CREAM_DEEP,
  BRAND_CREAM_LIGHT,
  BRAND_GOLD,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
} from '../../lib/brand'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { WHAT_TASNEEM_DO_HOME } from '../../lib/tasneemDoContent'

const EASE = [0.22, 1, 0.36, 1] as const

export default function WhatTasneemDoSection() {
  const { eyebrow, title, intro, points, image, imageAlt } = WHAT_TASNEEM_DO_HOME

  return (
    <section
      id="what-tasneem-do"
      className="relative w-full overflow-hidden py-14 sm:py-16 lg:py-20"
      style={{ backgroundColor: BRAND_CREAM }}
      aria-labelledby="what-tasneem-do-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 18%, rgba(184,134,11,0.14) 0%, transparent 42%), radial-gradient(circle at 88% 82%, rgba(10,46,34,0.06) 0%, transparent 40%)',
        }}
      />

      <div className="relative mx-auto grid max-w-[1240px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.42fr_0.58fr] lg:gap-14 lg:px-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none lg:justify-self-center"
        >
          <div
            className="relative overflow-hidden rounded-[1.35rem] border p-2 shadow-[0_28px_60px_-32px_rgba(10,46,34,0.35)] sm:p-3"
            style={{
              borderColor: 'rgba(184,134,11,0.38)',
              backgroundColor: BRAND_CREAM_LIGHT,
            }}
          >
            <div
              className="absolute -right-3 -top-3 h-14 w-14 rounded-full border-2 sm:h-16 sm:w-16"
              style={{ borderColor: 'rgba(184,134,11,0.45)', backgroundColor: 'rgba(184,134,11,0.12)' }}
              aria-hidden
            />
            <div
              className="absolute -bottom-3 -left-3 h-10 w-10 rotate-45 sm:h-12 sm:w-12"
              style={{ backgroundColor: BRAND_CREAM_DEEP, border: '1px solid rgba(184,134,11,0.25)' }}
              aria-hidden
            />
            <div className="what-tasneem-do__media relative z-[1] overflow-hidden rounded-[1rem]">
              <img
                src={image}
                alt={imageAlt}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="what-tasneem-do__img"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.06 }}
        >
          <p
            className="m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase"
            style={{ color: BRAND_GOLD, fontFamily: BRAND_SANS }}
          >
            {eyebrow}
          </p>
          <h2
            id="what-tasneem-do-title"
            className="mt-2 m-0 text-[clamp(1.85rem,4vw,2.65rem)] leading-tight tracking-tight"
            style={{ fontFamily: BRAND_SERIF, color: BRAND_INK }}
          >
            {title}
          </h2>
          <p
            className="mt-4 m-0 max-w-xl text-[0.92rem] leading-relaxed sm:text-[0.98rem]"
            style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
          >
            {intro}
          </p>

          <ul className="mt-7 m-0 list-none space-y-3 p-0">
            {points.map((point, i) => (
              <motion.li
                key={point.title}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, ease: EASE, delay: 0.08 + i * 0.05 }}
                className="flex gap-3 rounded-xl border px-3.5 py-3 sm:gap-4 sm:px-4 sm:py-3.5"
                style={{
                  borderColor: 'rgba(184,134,11,0.22)',
                  backgroundColor: 'rgba(255,254,242,0.72)',
                }}
              >
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-bold"
                  style={{ backgroundColor: BRAND_GOLD, color: BRAND_INK, fontFamily: BRAND_SANS }}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p
                    className="m-0 text-[0.88rem] font-semibold leading-snug sm:text-[0.92rem]"
                    style={{ color: BRAND_INK, fontFamily: BRAND_SERIF }}
                  >
                    {point.title}
                  </p>
                  <p
                    className="mt-1 m-0 text-[0.78rem] leading-relaxed sm:text-[0.82rem]"
                    style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
                  >
                    {point.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => navigateApp(APP_ROUTES.whatTasneemDo)}
            className="mt-8 cursor-pointer rounded-full border-0 px-6 py-3 text-[0.72rem] font-bold tracking-[0.14em] uppercase transition hover:brightness-105"
            style={{
              backgroundColor: BRAND_INK,
              color: BRAND_CREAM_LIGHT,
              fontFamily: BRAND_SANS,
              boxShadow: '0 14px 28px -16px rgba(10,46,34,0.55)',
            }}
          >
            See more
          </button>
        </motion.div>
      </div>
    </section>
  )
}
