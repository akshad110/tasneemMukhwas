import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/nav/Navbar'
import BackToHomeButton from '../components/shared/BackToHomeButton'
import SiteFooter from '../components/shared/SiteFooter'
import FloatingActions from '../components/shared/FloatingActions'
import BrandLogo from '../components/shared/BrandLogo'
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
import { scrollAppToTop } from '../lib/scrollControl'

const EASE = [0.22, 1, 0.36, 1] as const
const BORDER = 'rgba(184,134,11,0.22)'

const JOURNEY_CARDS = [
  {
    title: 'Tradition Meets Modern Manufacturing',
    body: 'Our approach combines traditional mukhwas flavours with modern food manufacturing practices. From ingredient selection to blending, production and packaging, we focus on maintaining consistency, quality and authentic taste.',
  },
  {
    title: 'Building the Tasneem Collection',
    body: 'Under the Tasneem brand, we are developing a diverse range of Salted Mukhwas, Sweet Mukhwas and Mukhwas Shots, created to suit different tastes and preferences.',
  },
  {
    title: 'Growing With Trust',
    body: 'With the support and manufacturing foundation of Furat Gruh Udyog, Tasneem Mukhwas is growing as a dedicated brand with a clear vision — to become a trusted name in the Indian mukhwas industry and expand into international markets.',
  },
] as const

const VISION_POINTS = [
  'Authentic taste',
  'Consistent quality',
  'Hygienic manufacturing',
  'Premium presentation',
] as const

export default function OurCompanyPage() {
  useEffect(() => {
    scrollAppToTop(true)
  }, [])

  return (
    <div
      className="page-shell min-h-screen overflow-x-clip"
      style={{ backgroundColor: BRAND_CREAM, color: BRAND_INK, fontFamily: BRAND_SANS }}
    >
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
            <p className="m-0 text-[0.62rem] font-bold tracking-[0.2em] uppercase" style={{ color: BRAND_GOLD }}>
              Our Company
            </p>
            <h1
              className="mt-2 m-0 max-w-3xl text-[clamp(2rem,5vw,3rem)] leading-[1.08] tracking-tight"
              style={{ fontFamily: BRAND_SERIF }}
            >
              Our Company Journey
            </h1>
            <p className="mt-2 m-0 text-[0.88rem] font-semibold sm:text-[0.95rem]" style={{ color: BRAND_INK }}>
              From Furat Gruh Udyog to Tasneem Mukhwas
            </p>
            <p className="mt-5 m-0 max-w-3xl text-[0.98rem] leading-[1.85]" style={{ color: BRAND_MUTED }}>
              Tasneem Mukhwas is a proudly developed food brand under our parent company, Furat Gruh Udyog. Built on a
              foundation of traditional values, quality ingredients and food manufacturing expertise, Tasneem was
              created with a vision to give authentic Indian mukhwas a modern, premium identity.
            </p>
          </div>
        </section>

        <section style={{ backgroundColor: BRAND_CREAM_LIGHT }}>
          <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:gap-14 lg:px-10 lg:py-20">
            <div>
              <p className="m-0 text-[0.62rem] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(10,46,34,0.45)' }}>
                The Foundation
              </p>
              <h2
                className="mt-2 m-0 text-[clamp(1.5rem,3vw,2.1rem)] leading-tight"
                style={{ fontFamily: BRAND_SERIF }}
              >
                The Foundation Behind Tasneem
              </h2>
              <p className="mt-4 m-0 text-[0.95rem] leading-[1.85]" style={{ color: BRAND_MUTED }}>
                <strong style={{ color: BRAND_INK }}>Furat Gruh Udyog</strong> is the parent company behind Tasneem
                Mukhwas. With a focus on quality food manufacturing and consistent production, the company laid the
                foundation for developing a dedicated mukhwas brand that could serve both Indian and international
                markets.
              </p>
            </div>
            <div
              className="flex items-center justify-center rounded-2xl border px-8 py-10 sm:px-10"
              style={{
                borderColor: BORDER,
                backgroundColor: 'rgba(255,254,242,0.9)',
                boxShadow: '0 24px 50px -30px rgba(10,46,34,0.35)',
              }}
            >
              <BrandLogo
                className="h-[clamp(5rem,18vw,7.5rem)] w-auto max-w-full object-contain"
                alt="Tasneem Mukhwas"
              />
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: BRAND_CREAM }}>
          <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
            <p className="m-0 text-[0.62rem] font-bold tracking-[0.2em] uppercase" style={{ color: BRAND_GOLD }}>
              Our Story
            </p>
            <h2
              className="mt-2 m-0 max-w-2xl text-[clamp(1.5rem,3vw,2.1rem)] leading-tight"
              style={{ fontFamily: BRAND_SERIF }}
            >
              The Birth of Tasneem Mukhwas
            </h2>
            <p className="mt-4 m-0 max-w-3xl text-[0.95rem] leading-[1.85]" style={{ color: BRAND_MUTED }}>
              Tasneem Mukhwas was introduced with a simple vision:{' '}
              <strong style={{ color: BRAND_INK }}>
                to preserve the traditional taste and character of mukhwas while presenting it through modern
                manufacturing, hygienic production and premium packaging.
              </strong>
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {JOURNEY_CARDS.map((card, index) => (
                <motion.article
                  key={card.title}
                  className="rounded-xl border p-5 sm:p-6"
                  style={{
                    borderColor: BORDER,
                    backgroundColor: 'rgba(255,254,242,0.88)',
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
                >
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[0.72rem] font-bold"
                    style={{ backgroundColor: BRAND_GOLD, color: BRAND_INK }}
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <h3
                    className="mt-3 m-0 text-[1.05rem] font-semibold leading-snug sm:text-[1.1rem]"
                    style={{ fontFamily: BRAND_SERIF }}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-2 m-0 text-[0.88rem] leading-[1.75]" style={{ color: BRAND_MUTED }}>
                    {card.body}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: BRAND_CREAM_DEEP }}>
          <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
            <p className="m-0 text-[0.62rem] font-bold tracking-[0.2em] uppercase" style={{ color: BRAND_GOLD }}>
              Looking Ahead
            </p>
            <h2
              className="mt-2 m-0 text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight"
              style={{ fontFamily: BRAND_SERIF }}
            >
              2026 & Beyond – Our Vision
            </h2>
            <p className="mt-4 m-0 max-w-2xl text-[0.98rem] leading-[1.85] font-medium" style={{ color: BRAND_INK }}>
              From our roots in Gujarat to markets around the world, our journey is only beginning.
            </p>
            <p className="mt-4 m-0 max-w-3xl text-[0.95rem] leading-[1.85]" style={{ color: BRAND_MUTED }}>
              Our vision is to build Tasneem Mukhwas into a recognised Indian food brand known for authentic taste,
              consistent quality, hygienic manufacturing and premium presentation.
            </p>

            <ul className="mt-8 m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
              {VISION_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2.5 rounded-lg border px-4 py-3 text-[0.88rem] font-medium"
                  style={{
                    borderColor: BORDER,
                    backgroundColor: 'rgba(255,254,242,0.75)',
                    color: BRAND_INK,
                  }}
                >
                  <span style={{ color: BRAND_GOLD }} aria-hidden>
                    ✦
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <blockquote
              className="mt-10 m-0 rounded-xl border-l-4 px-5 py-4 text-[0.95rem] leading-[1.85] italic sm:px-6"
              style={{
                borderColor: BRAND_GOLD,
                backgroundColor: 'rgba(184,134,11,0.08)',
                color: BRAND_INK,
                fontFamily: BRAND_SERIF,
              }}
            >
              We believe in carrying the tradition of Indian mukhwas forward — while creating a brand ready for the
              modern world.
            </blockquote>
          </div>
        </section>

        <section style={{ backgroundColor: BRAND_CREAM_LIGHT }}>
          <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
            <div
              className="rounded-2xl border px-6 py-8 text-center sm:px-10 sm:py-10"
              style={{
                borderColor: BORDER,
                backgroundColor: 'rgba(255,254,242,0.92)',
                boxShadow: '0 20px 45px -28px rgba(10,46,34,0.35)',
              }}
            >
              <p className="m-0 text-[0.72rem] font-bold tracking-[0.18em] uppercase" style={{ color: BRAND_GOLD }}>
                Furat Gruh Udyog — The Foundation.
              </p>
              <p className="mt-2 m-0 text-[0.72rem] font-bold tracking-[0.18em] uppercase" style={{ color: BRAND_GOLD }}>
                Tasneem Mukhwas — The Brand.
              </p>
              <p
                className="mt-5 m-0 text-[clamp(1.15rem,2.5vw,1.45rem)] leading-snug"
                style={{ fontFamily: BRAND_SERIF, color: BRAND_INK }}
              >
                Tradition in Every Blend. Quality in Every Bite.
              </p>
            </div>
          </div>
        </section>
      </motion.main>

      <SiteFooter />
      <FloatingActions />
    </div>
  )
}
