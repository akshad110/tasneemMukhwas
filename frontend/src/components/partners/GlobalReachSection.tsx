import { motion } from 'framer-motion'
import {
  BRAND_DISPLAY,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
  HOME_SECTION_A,
} from '../../lib/brand'

/** Matches the infographic canvas so the map blends into the section. */
const MAP_SECTION_BG = HOME_SECTION_A
const WORLD_MAP_SRC = encodeURI('/Corporate_world_map_infographic_…_202608260257.jpeg')
const EASE = [0.22, 1, 0.36, 1] as const

export default function GlobalReachSection() {
  return (
    <section
      className="relative w-full overflow-hidden pt-10 pb-0 sm:pt-14 md:pt-16 lg:pt-20"
      style={{ backgroundColor: MAP_SECTION_BG }}
      aria-label="Global reach"
    >
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-8">
        <motion.header
          className="mx-auto mb-6 max-w-3xl text-center sm:mb-8 md:mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p
            className="m-0 text-[0.58rem] font-semibold tracking-[0.18em] uppercase sm:text-[0.62rem] sm:tracking-[0.2em]"
            style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
          >
            From Chhapi to the world
          </p>
          <h2
            className="mt-2.5 m-0 text-[clamp(1.45rem,5.5vw,2.85rem)] leading-[1.14] tracking-[-0.02em] sm:mt-3 sm:leading-[1.12]"
            style={{ color: BRAND_INK, fontFamily: BRAND_SERIF }}
          >
            Crafted in India.
            <br />
            <span style={{ fontFamily: BRAND_DISPLAY, letterSpacing: '0.04em', fontWeight: 400 }}>
              Cherished worldwide.
            </span>
          </h2>
          <p
            className="mx-auto mt-3 max-w-xl px-1 text-[0.84rem] leading-relaxed sm:mt-4 sm:px-0 sm:text-[0.94rem]"
            style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
          >
            Tasneem Mukhwas reaches homes and retail partners across India — and growing export
            corridors worldwide.
          </p>
        </motion.header>
      </div>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, delay: 0.06, ease: EASE }}
      >
        <img
          src={WORLD_MAP_SRC}
          alt="World map showing Tasneem Mukhwas retail partners and export reach from India"
          loading="lazy"
          decoding="async"
          className="block h-auto w-full max-w-none select-none"
          style={{ backgroundColor: MAP_SECTION_BG }}
          draggable={false}
        />
      </motion.div>
    </section>
  )
}
