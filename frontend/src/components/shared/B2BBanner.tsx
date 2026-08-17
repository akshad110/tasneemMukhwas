import { motion } from 'framer-motion'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, WHATSAPP_BULK_URL } from '../../lib/contact'

const INK = '#0a2e22'
const CREAM = '#f3e6c8'
const GOLD = '#b8860b'
const TEXTURE = '/image.png_2K_202608092240.jpeg'
const MUTED = 'rgba(243,230,200,0.72)'
const LINE = 'rgba(243,230,200,0.22)'

const ease = [0.22, 1, 0.36, 1] as const

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

const STATS = [
  { value: 'IEC', label: 'AAEFF9922C', hint: 'Importer-Exporter Code' },
  { value: '25+', label: 'Countries', hint: 'Export & trade reach' },
  { value: '500+', label: 'Distributors', hint: 'Wholesale partners' },
  { value: '40+', label: 'SKUs', hint: 'Bulk-ready catalogue' },
] as const

const CHANNELS = [
  {
    title: 'Retail & Kirana',
    body: 'Sealed pouches and display packs sized for counters, gift corners, and everyday mouth-freshener demand.',
  },
  {
    title: 'HORECA',
    body: 'Consistent blends for hotels, restaurants, and catering — hygiene-led packing for high-volume service.',
  },
  {
    title: 'Export',
    body: 'IEC-backed dispatch from Chhapi with documentation support for overseas buyers and private label talks.',
  },
  {
    title: 'Private Label',
    body: 'OEM / white-label mukhwas and seed mixes under your brand — MOQ and artwork discussed on enquiry.',
  },
] as const

const STEPS = [
  { n: '01', title: 'Share requirement', body: 'Volume, SKUs, packing, and destination.' },
  { n: '02', title: 'Quote & samples', body: 'Pricing, lead time, and taste samples if needed.' },
  { n: '03', title: 'Confirm & pack', body: 'PO locked — hygienic packing at Furat Gruh.' },
  { n: '04', title: 'Dispatch', body: 'Domestic courier or export documentation.' },
] as const

const IMPORT_EXPORT = [
  { label: 'Parent unit', value: 'Furat Gruh Udhyog · Chhapi, Gujarat' },
  { label: 'IEC', value: 'AAEFF9922C (DGFT)' },
  { label: 'MSME', value: 'UDYAM-GJ-04-0047609 · Micro manufacturing' },
  { label: 'WHO-GMP', value: 'Certified manufacturing & packing' },
  { label: 'Typical MOQ', value: 'From 50 kg / mixed SKU cartons (demo)' },
  { label: 'Lead time', value: '7–14 working days after confirmation' },
] as const

/**
 * Expanded wholesale / B2B section — sharp edges, no glass, scroll reveals.
 */
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
              'radial-gradient(ellipse 55% 50% at 50% 30%, rgba(8,16,12,0.08) 0%, rgba(6,12,10,0.32) 55%, rgba(4,10,8,0.48) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-10">
        {/* Intro + CTA */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <motion.div
            className="max-w-2xl"
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.35 }}
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
              className="mt-2 m-0 text-[clamp(1.45rem,4vw,2.35rem)] leading-snug"
              style={{
                color: CREAM,
                fontFamily: '"Permanent Marker", cursive',
                fontWeight: 400,
              }}
            >
              Looking for Bulk or Wholesale Orders?
            </motion.h2>
            <motion.p
              variants={reveal}
              transition={{ duration: 0.55, ease }}
              className="mt-3 m-0 max-w-xl text-[0.92rem] leading-relaxed"
              style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
            >
              Partner with Tasneem Mukhwas for retail, HORECA, and export. Share volume and destination —
              we reply with pricing, packing options, and dispatch timelines from Chhapi.
            </motion.p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.55, ease, delay: 0.08 }}
          >
            <motion.a
              href={WHATSAPP_BULK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border-0 px-7 py-3.5 text-[0.82rem] font-semibold tracking-wide no-underline uppercase"
              style={{
                borderRadius: 0,
                backgroundColor: CREAM,
                color: INK,
                fontFamily: 'Inter, sans-serif',
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Enquire on WhatsApp
            </motion.a>
            <motion.a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Wholesale / Bulk enquiry')}`}
              className="inline-flex items-center justify-center border px-7 py-3.5 text-[0.82rem] font-semibold tracking-wide no-underline uppercase"
              style={{
                borderRadius: 0,
                borderColor: LINE,
                backgroundColor: 'transparent',
                color: CREAM,
                fontFamily: 'Inter, sans-serif',
              }}
              whileHover={{ y: -2, borderColor: GOLD }}
              whileTap={{ scale: 0.98 }}
            >
              Email enquiry
            </motion.a>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          className="mt-12 grid grid-cols-2 border sm:grid-cols-4"
          style={{ borderColor: LINE }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          transition={{ staggerChildren: 0.08 }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={reveal}
              transition={{ duration: 0.5, ease }}
              className="border-b px-4 py-5 sm:border-b-0 sm:px-5 sm:py-6"
              style={{
                borderColor: LINE,
                borderRight: i % 2 === 0 || i < 3 ? `1px solid ${LINE}` : undefined,
              }}
            >
              <p
                className="m-0 text-[clamp(1.35rem,3vw,1.85rem)] font-bold leading-none"
                style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
              >
                {stat.value}
              </p>
              <p
                className="mt-2 m-0 text-[0.78rem] font-semibold tracking-wide uppercase"
                style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
              >
                {stat.label}
              </p>
              <p className="mt-1 m-0 text-[0.72rem]" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
                {stat.hint}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Channels */}
        <div className="mt-14">
          <motion.p
            className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] uppercase"
            style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.45, ease }}
          >
            Who we supply
          </motion.p>
          <motion.h3
            className="mt-2 m-0 text-[1.35rem] font-bold tracking-tight sm:text-[1.55rem]"
            style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.5, ease, delay: 0.05 }}
          >
            Channels built for volume
          </motion.h3>

          <motion.div
            className="mt-6 grid gap-0 sm:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ staggerChildren: 0.08 }}
          >
            {CHANNELS.map((ch) => (
              <motion.article
                key={ch.title}
                variants={reveal}
                transition={{ duration: 0.5, ease }}
                className="border p-5 sm:p-6"
                style={{ borderColor: LINE, backgroundColor: 'transparent' }}
              >
                <h4
                  className="m-0 text-[1rem] font-semibold tracking-tight"
                  style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                >
                  {ch.title}
                </h4>
                <p
                  className="mt-2 m-0 text-[0.86rem] leading-relaxed"
                  style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
                >
                  {ch.body}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>

        {/* Import / trade data + process */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.55, ease }}
          >
            <p
              className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] uppercase"
              style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
            >
              Trade credentials
            </p>
            <h3
              className="mt-2 m-0 text-[1.35rem] font-bold tracking-tight"
              style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
            >
              Import & export ready
            </h3>
            <dl className="mt-6 m-0 border" style={{ borderColor: LINE }}>
              {IMPORT_EXPORT.map((row, i) => (
                <div
                  key={row.label}
                  className="grid gap-1 border-b px-4 py-3.5 last:border-b-0 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] sm:gap-4 sm:px-5"
                  style={{ borderColor: LINE, backgroundColor: i % 2 === 0 ? 'rgba(243,230,200,0.04)' : 'transparent' }}
                >
                  <dt
                    className="m-0 text-[0.72rem] font-semibold tracking-[0.1em] uppercase"
                    style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
                  >
                    {row.label}
                  </dt>
                  <dd
                    className="m-0 text-[0.88rem] leading-snug"
                    style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.55, ease }}
          >
            <p
              className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] uppercase"
              style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
            >
              How it works
            </p>
            <h3
              className="mt-2 m-0 text-[1.35rem] font-bold tracking-tight"
              style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
            >
              From enquiry to dispatch
            </h3>
            <ol className="mt-6 m-0 list-none space-y-0 p-0 border" style={{ borderColor: LINE }}>
              {STEPS.map((step, i) => (
                <motion.li
                  key={step.n}
                  className="flex gap-4 border-b px-4 py-4 last:border-b-0 sm:gap-5 sm:px-5 sm:py-5"
                  style={{ borderColor: LINE }}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 0.45, ease, delay: i * 0.06 }}
                >
                  <span
                    className="shrink-0 text-[1.35rem] font-bold leading-none"
                    style={{ color: GOLD, fontFamily: '"Permanent Marker", cursive' }}
                  >
                    {step.n}
                  </span>
                  <div>
                    <p
                      className="m-0 text-[0.95rem] font-semibold"
                      style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                    >
                      {step.title}
                    </p>
                    <p
                      className="mt-1 m-0 text-[0.84rem] leading-relaxed"
                      style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
                    >
                      {step.body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>

        {/* Bottom CTA bar */}
        <motion.div
          className="mt-14 flex flex-col items-start justify-between gap-5 border px-5 py-6 sm:flex-row sm:items-center sm:px-7 sm:py-7"
          style={{ borderColor: LINE, backgroundColor: 'rgba(243,230,200,0.05)' }}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.55, ease }}
        >
          <div>
            <p
              className="m-0 text-[0.65rem] font-semibold tracking-[0.16em] uppercase"
              style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
            >
              Ready to order
            </p>
            <p
              className="mt-1.5 m-0 text-[1.05rem] font-semibold sm:text-[1.15rem]"
              style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
            >
              Talk bulk today — {CONTACT_PHONE_DISPLAY}
            </p>
            <p className="mt-1 m-0 text-[0.82rem]" style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}>
              {CONTACT_EMAIL}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="inline-flex items-center justify-center border px-6 py-3 text-[0.78rem] font-semibold tracking-wide no-underline uppercase"
              style={{
                borderRadius: 0,
                borderColor: LINE,
                color: CREAM,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Call now
            </a>
            <a
              href={WHATSAPP_BULK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border-0 px-6 py-3 text-[0.78rem] font-semibold tracking-wide no-underline uppercase"
              style={{
                borderRadius: 0,
                backgroundColor: GOLD,
                color: INK,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              WhatsApp bulk desk
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
