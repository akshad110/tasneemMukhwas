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
import { MANUFACTURING_PROCESS_INTRO, MANUFACTURING_PROCESS_STEPS } from '../../lib/manufacturingProcessContent'

const EASE = [0.22, 1, 0.36, 1] as const

type ManufacturingProcessSectionProps = {
  background?: 'cream' | 'cream-light' | 'cream-deep'
}

export default function ManufacturingProcessSection({
  background = 'cream-light',
}: ManufacturingProcessSectionProps) {
  const bg =
    background === 'cream'
      ? BRAND_CREAM
      : background === 'cream-deep'
        ? BRAND_CREAM_DEEP
        : BRAND_CREAM_LIGHT

  return (
    <section
      className="relative w-full py-14 sm:py-16 lg:py-20"
      style={{ backgroundColor: bg }}
      aria-labelledby="manufacturing-process-title"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: EASE }}
          className="max-w-2xl"
        >
          <p
            className="m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase"
            style={{ color: BRAND_GOLD, fontFamily: BRAND_SANS }}
          >
            {MANUFACTURING_PROCESS_INTRO.eyebrow}
          </p>
          <h2
            id="manufacturing-process-title"
            className="mt-2 m-0 text-[clamp(1.85rem,4vw,2.75rem)] leading-tight tracking-tight"
            style={{ fontFamily: BRAND_SERIF, color: BRAND_INK }}
          >
            {MANUFACTURING_PROCESS_INTRO.title}
          </h2>
          <p
            className="mt-4 m-0 text-[0.92rem] leading-relaxed sm:text-[0.98rem]"
            style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
          >
            {MANUFACTURING_PROCESS_INTRO.description}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MANUFACTURING_PROCESS_STEPS.map((step, index) => (
            <motion.figure
              key={step.number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, ease: EASE, delay: index * 0.04 }}
              className="m-0 overflow-hidden rounded-xl border shadow-[0_18px_40px_-28px_rgba(10,46,34,0.35)]"
              style={{
                borderColor: 'rgba(184,134,11,0.22)',
                backgroundColor: BRAND_CREAM,
              }}
            >
              <div className="manufacturing-process__media">
                <img
                  src={step.image}
                  alt={step.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="manufacturing-process__img"
                />
              </div>
              <figcaption className="sr-only">
                {step.number}. {step.title} — {step.body}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
