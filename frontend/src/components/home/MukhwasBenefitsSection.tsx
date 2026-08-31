import { motion } from 'framer-motion'
import {
  BRAND_CREAM_DEEP,
  BRAND_CREAM_LIGHT,
  BRAND_GOLD,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
} from '../../lib/brand'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { MUKHWAS_BENEFITS_HOME } from '../../lib/mukhwasBenefitsContent'

const EASE = [0.22, 1, 0.36, 1] as const

export default function MukhwasBenefitsSection() {
  const { eyebrow, title, intro, points, image, imageAlt } = MUKHWAS_BENEFITS_HOME

  return (
    <section
      id="mukhwas-benefits"
      className="relative w-full overflow-hidden py-14 sm:py-16 lg:py-20"
      style={{ backgroundColor: BRAND_CREAM_LIGHT }}
      aria-labelledby="mukhwas-benefits-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 50% at 90% 20%, rgba(184,134,11,0.12) 0%, transparent 55%), radial-gradient(circle at 8% 90%, rgba(10,46,34,0.05) 0%, transparent 45%)',
        }}
      />

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <p
            className="m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase"
            style={{ color: BRAND_GOLD, fontFamily: BRAND_SANS }}
          >
            {eyebrow}
          </p>
          <h2
            id="mukhwas-benefits-title"
            className="mt-2 m-0 text-[clamp(1.85rem,4vw,2.65rem)] leading-tight tracking-tight"
            style={{ fontFamily: BRAND_SERIF, color: BRAND_INK }}
          >
            {title}
          </h2>
          <p
            className="mt-4 m-0 text-[0.92rem] leading-relaxed sm:text-[0.98rem]"
            style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
          >
            {intro}
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="grid gap-3 sm:grid-cols-2"
          >
            {points.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, ease: EASE, delay: 0.06 + i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border p-4 sm:p-5"
                style={{
                  borderColor: 'rgba(184,134,11,0.24)',
                  backgroundColor: 'rgba(255,254,242,0.88)',
                }}
              >
                <div
                  className="absolute -right-4 -top-4 h-14 w-14 rounded-full opacity-40 transition group-hover:opacity-60"
                  style={{ backgroundColor: 'rgba(184,134,11,0.15)' }}
                  aria-hidden
                />
                <span
                  className="relative inline-flex h-8 w-8 items-center justify-center rounded-full text-[0.75rem] font-bold"
                  style={{ backgroundColor: BRAND_INK, color: BRAND_CREAM_LIGHT, fontFamily: BRAND_SANS }}
                >
                  {i + 1}
                </span>
                <h3
                  className="relative mt-3 m-0 text-[0.92rem] font-semibold leading-snug"
                  style={{ fontFamily: BRAND_SERIF, color: BRAND_INK }}
                >
                  {point.title}
                </h3>
                <p
                  className="relative mt-2 m-0 text-[0.8rem] leading-relaxed"
                  style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
                >
                  {point.body}
                </p>
              </motion.div>
            ))}

            <div className="col-span-full flex justify-center pt-2 lg:justify-start">
              <button
                type="button"
                onClick={() => navigateApp(APP_ROUTES.mukhwasBenefits)}
                className="cursor-pointer rounded-full border-2 px-7 py-3 text-[0.72rem] font-bold tracking-[0.14em] uppercase transition hover:brightness-105"
                style={{
                  borderColor: BRAND_GOLD,
                  backgroundColor: 'transparent',
                  color: BRAND_INK,
                  fontFamily: BRAND_SANS,
                }}
              >
                See more
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
            className="relative mx-auto w-full max-w-sm lg:max-w-none lg:self-start"
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
              <img
                src={image}
                alt={imageAlt}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="relative z-[1] block aspect-[16/10] max-h-[200px] w-full rounded-[1rem] object-cover object-center sm:max-h-[220px] lg:max-h-[240px]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
