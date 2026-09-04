import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../nav/Navbar'
import BackToHomeButton from '../shared/BackToHomeButton'
import SiteFooter from '../shared/SiteFooter'
import FloatingActions from '../shared/FloatingActions'
import {
  BRAND_CREAM,
  BRAND_CREAM_LIGHT,
  BRAND_GOLD,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
} from '../../lib/brand'
import { scrollAppToTop } from '../../lib/scrollControl'
import { useEffect } from 'react'

const BORDER = '#E6D8C3'
const EASE = [0.22, 1, 0.36, 1] as const

export type PolicyBlock = {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  footer?: ReactNode
}

type PolicyPageLayoutProps = {
  title: string
  effectiveDate: string
  intro: string[]
  sections: PolicyBlock[]
  contact?: ReactNode
}

function PolicySection({ block, index }: { block: PolicyBlock; index: number }) {
  return (
    <motion.section
      className="border-t pt-6 sm:pt-7"
      style={{ borderColor: BORDER }}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.03, ease: EASE }}
    >
      <h2
        className="m-0 text-[1.02rem] font-bold sm:text-[1.08rem]"
        style={{ color: BRAND_INK, fontFamily: BRAND_SANS }}
      >
        {block.heading}
      </h2>
      {block.paragraphs?.map((p) => (
        <p
          key={p.slice(0, 40)}
          className="mt-3 m-0 text-[0.88rem] leading-[1.72] sm:text-[0.92rem]"
          style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
        >
          {p}
        </p>
      ))}
      {block.bullets?.length ? (
        <ul
          className="mt-3 m-0 list-disc space-y-2 pl-5 text-[0.88rem] leading-[1.65] sm:text-[0.92rem]"
          style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
        >
          {block.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {block.footer ? <div className="mt-3">{block.footer}</div> : null}
    </motion.section>
  )
}

export default function PolicyPageLayout({
  title,
  effectiveDate,
  intro,
  sections,
  contact,
}: PolicyPageLayoutProps) {
  useEffect(() => {
    scrollAppToTop(true)
  }, [])

  return (
    <main className="min-h-screen overflow-x-clip" style={{ backgroundColor: BRAND_CREAM }}>
      <Navbar />

      <div className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <BackToHomeButton className="mb-8 sm:mb-10" />

        <motion.header
          className="max-w-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p
            className="m-0 text-[0.62rem] font-semibold tracking-[0.18em] uppercase"
            style={{ color: BRAND_GOLD, fontFamily: BRAND_SANS }}
          >
            Legal
          </p>
          <h1
            className="mt-2 m-0 text-[clamp(1.75rem,5vw,2.65rem)] leading-[1.1]"
            style={{ color: BRAND_INK, fontFamily: BRAND_SERIF }}
          >
            {title}
          </h1>
          <p
            className="mt-3 m-0 text-[0.82rem] font-semibold sm:text-[0.88rem]"
            style={{ color: BRAND_INK, fontFamily: BRAND_SANS }}
          >
            Effective Date: {effectiveDate}
          </p>
        </motion.header>

        <motion.article
          className="mt-8 rounded-none border-2 p-5 sm:mt-10 sm:p-7 lg:p-8"
          style={{ backgroundColor: BRAND_CREAM_LIGHT, borderColor: BORDER }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
        >
          <div className="mx-auto max-w-3xl space-y-5">
            {intro.map((p) => (
              <p
                key={p.slice(0, 48)}
                className="m-0 text-[0.9rem] leading-[1.72] sm:text-[0.94rem]"
                style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
              >
                {p}
              </p>
            ))}

            <div className="space-y-6 sm:space-y-7">
              {sections.map((block, index) => (
                <PolicySection key={block.heading} block={block} index={index} />
              ))}
            </div>

            {contact ? (
              <div
                className="mt-8 border-t pt-6 sm:mt-10 sm:pt-7"
                style={{ borderColor: BORDER }}
              >
                {contact}
              </div>
            ) : null}
          </div>
        </motion.article>
      </div>

      <SiteFooter />
      <FloatingActions />
    </main>
  )
}
