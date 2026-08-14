import { motion } from 'framer-motion'
import { WHATSAPP_BULK_URL } from '../../lib/contact'

const INK = '#0a2e22'
const CREAM = '#f3e6c8'
const GOLD = '#b8860b'
const TEXTURE = '/image.png_2K_202608092240.jpeg'
const WHATSAPP_BULK = WHATSAPP_BULK_URL

const ease = [0.22, 1, 0.36, 1] as const

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

/** Prominent B2B / wholesale CTA under trust badges */
export default function B2BBanner() {
  return (
    <section
      id="wholesale"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: INK }}
      aria-label="Bulk and wholesale orders"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src={TEXTURE}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover brightness-[0.88] saturate-[0.92]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 50% at 50% 45%, rgba(8,16,12,0.08) 0%, rgba(6,12,10,0.28) 55%, rgba(4,10,8,0.4) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-center sm:flex-row sm:gap-6 sm:px-8 sm:py-6 sm:text-left lg:px-10">
        <motion.div
          className="max-w-2xl"
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.45 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.p
            variants={reveal}
            transition={{ duration: 0.5, ease }}
            className="m-0 text-[0.7rem] font-semibold tracking-[0.18em] uppercase"
            style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
          >
            B2B · Bulk · Export
          </motion.p>
          <motion.h2
            variants={reveal}
            transition={{ duration: 0.55, ease }}
            className="mt-1.5 m-0 text-[clamp(1.15rem,3.5vw,1.75rem)] leading-snug"
            style={{
              color: CREAM,
              fontFamily: '"Permanent Marker", cursive',
              fontWeight: 400,
            }}
          >
            Looking for Bulk or Wholesale Orders? Click Here
          </motion.h2>
          <motion.p
            variants={reveal}
            transition={{ duration: 0.55, ease }}
            className="mt-1.5 m-0 text-[0.85rem] leading-relaxed opacity-85 sm:text-[0.92rem]"
            style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
          >
            Partner with Tasneem Mukhwas for retail, HORECA, and export — demo enquiry via WhatsApp.
          </motion.p>
        </motion.div>

        <motion.a
          href={WHATSAPP_BULK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-full px-6 py-3 text-[0.88rem] font-semibold tracking-wide no-underline sm:px-7"
          style={{
            backgroundColor: CREAM,
            color: INK,
            fontFamily: 'Inter, sans-serif',
          }}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.55, ease, delay: 0.12 }}
          whileHover={{ scale: 1.03 }}
        >
          Enquire on WhatsApp
        </motion.a>
      </div>
    </section>
  )
}
