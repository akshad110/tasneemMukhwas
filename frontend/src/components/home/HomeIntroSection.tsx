import { motion } from 'framer-motion'
import {
  BRAND_CREAM,
  BRAND_CREAM_LIGHT,
  BRAND_GOLD,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
} from '../../lib/brand'
import { BROCHURE_DOWNLOAD_NAME, BROCHURE_PDF_URL } from '../../lib/brochure'
import SectionImageFrame from '../shared/SectionImageFrame'

const EASE = [0.22, 1, 0.36, 1] as const

const INTRO_IMAGE = encodeURI('/WhatsApp Image 2026-09-10 at 12.15.39 AM.jpeg')

export default function HomeIntroSection() {
  return (
    <section
      id="intro"
      className="relative w-full overflow-hidden py-12 sm:py-16 lg:py-20"
      style={{ backgroundColor: BRAND_CREAM }}
      aria-labelledby="home-intro-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 22%, rgba(184,134,11,0.12) 0%, transparent 44%), radial-gradient(circle at 86% 78%, rgba(10,46,34,0.05) 0%, transparent 42%)',
        }}
      />

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[0.44fr_0.56fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
          >
            <SectionImageFrame
              src={INTRO_IMAGE}
              alt="Tasneem Mukhwas — premium mukhwas pouches and Jet Imli bottle on wooden blocks with fresh mint"
              objectFit="contain"
              aspectClass="aspect-[1291/816]"
            />
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
              Welcome
            </p>
            <h2
              id="home-intro-title"
              className="mt-2 m-0 text-[clamp(1.85rem,4vw,2.65rem)] leading-tight tracking-tight"
              style={{ fontFamily: BRAND_SERIF, color: BRAND_INK }}
            >
              Welcome to Tasneem Mukhwas
            </h2>

            <div
              className="mt-5 space-y-4 text-[0.92rem] leading-relaxed sm:text-[0.98rem]"
              style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
            >
              <p className="m-0">
                At <strong style={{ color: BRAND_INK }}>Tasneem Mukhwas</strong>, we believe that a meal
                is best completed with the perfect touch of flavour. We are a dedicated manufacturer of
                quality <strong style={{ color: BRAND_INK }}>mukhwas</strong>, offering a wide range of
                traditional and delicious mouth-freshening products crafted with carefully selected
                ingredients.
              </p>
              <p className="m-0">
                Our focus is on{' '}
                <strong style={{ color: BRAND_INK }}>
                  quality, hygiene, authentic taste, and consistent production
                </strong>
                . From traditional favourites to innovative flavour combinations, every Tasneem Mukhwas
                product is prepared with care to deliver a refreshing and enjoyable experience after every
                meal.
              </p>
              <p className="m-0">
                With our own production capabilities and commitment to quality, we aim to bring the
                authentic taste of Indian mukhwas to customers across India and global markets.
              </p>
              <p className="m-0 font-semibold" style={{ color: BRAND_INK, fontFamily: BRAND_SERIF }}>
                Tasneem Mukhwas — Tradition in Every Bite, Quality in Every Pack.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          id="brochure"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
          className="home-intro-brochure mx-auto mt-12 max-w-xl text-center sm:mt-14"
        >
          <p
            className="m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase"
            style={{ color: BRAND_GOLD, fontFamily: BRAND_SANS }}
          >
            Discover our range
          </p>
          <h3
            className="mt-2 m-0 text-[clamp(1.35rem,3vw,1.85rem)] leading-tight"
            style={{ fontFamily: BRAND_SERIF, color: BRAND_INK }}
          >
            Our Brochure
          </h3>
          <p
            className="mx-auto mt-3 m-0 max-w-md text-[0.86rem] leading-relaxed sm:text-[0.92rem]"
            style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
          >
            Browse our full product catalogue — flavours, pack formats, and export-ready offerings from
            Tasneem Mukhwas.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href={BROCHURE_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="home-intro-brochure__btn home-intro-brochure__btn--view inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full border-2 px-6 py-2.5 text-[0.72rem] font-bold tracking-[0.12em] uppercase no-underline transition hover:brightness-105"
              style={{
                borderColor: BRAND_GOLD,
                color: BRAND_INK,
                fontFamily: BRAND_SANS,
                backgroundColor: 'transparent',
              }}
            >
              View Brochure
            </a>
            <a
              href={BROCHURE_PDF_URL}
              download={BROCHURE_DOWNLOAD_NAME}
              className="home-intro-brochure__btn home-intro-brochure__btn--download inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full border-0 px-6 py-2.5 text-[0.72rem] font-bold tracking-[0.12em] uppercase no-underline transition hover:brightness-105"
              style={{
                backgroundColor: BRAND_INK,
                color: BRAND_CREAM_LIGHT,
                fontFamily: BRAND_SANS,
                boxShadow: '0 14px 28px -16px rgba(10,46,34,0.55)',
              }}
            >
              Download Brochure
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
