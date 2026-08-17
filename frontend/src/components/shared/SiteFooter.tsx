import { motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import type { MouseEvent } from 'react'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  WHATSAPP_URL,
} from '../../lib/contact'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { scrollToSection, type SectionId } from '../../lib/sectionNav'
import BrandLogo from './BrandLogo'

const INK = '#0a2e22'
const CREAM = '#f3e6c8'
const GOLD = '#b8860b'
const TEXTURE = '/image.png_2K_202608092240.jpeg'

const ease = [0.22, 1, 0.36, 1] as const

type FooterLink =
  | { label: string; href: string; section?: undefined }
  | { label: string; href: string; section: SectionId }

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '/', section: 'home' },
      { label: 'Our Range', href: '/products', section: 'products' },
      { label: 'About Us', href: APP_ROUTES.knowMore },
      { label: 'Journey', href: '/about', section: 'about' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Wholesale', href: '/wholesale', section: 'wholesale' },
      { label: 'Sister Brands', href: '/about', section: 'about' },
      { label: 'Quality', href: '/about', section: 'about' },
      { label: 'Contact', href: '/contact', section: 'contact' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'Popular Products', href: '/products', section: 'products' },
      { label: 'Bulk Orders', href: '/wholesale', section: 'wholesale' },
      { label: 'Gift Hampers', href: '/products', section: 'products' },
      { label: 'WhatsApp Order', href: WHATSAPP_URL },
    ],
  },
  {
    title: 'Info',
    links: [
      { label: 'FSSAI Approved', href: '/about', section: 'about' },
      { label: 'Hygiene Pack', href: '/about', section: 'about' },
      { label: 'Privacy', href: '/' },
      { label: 'Terms', href: '/' },
    ],
  },
]

const TICKER = [
  'Farm Fresh Seeds',
  'FSSAI Aligned',
  'Hygienically Packed',
  'Tradition in Every Pinch',
  'Bulk & Export Ready',
  'Tasneem Mukhwas',
]

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: WHATSAPP_URL,
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
        <path d="M20 3.9A10 10 0 0 0 3.3 17.6L2 22l4.5-1.2A10 10 0 1 0 20 3.9zm-8 16.1a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-2.4.6.6-2.3-.2-.3a8.1 8.1 0 1 1 6.4 3.3zm4.5-5.9c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.6 6.6 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.5l.4-.4.2-.4c.1-.1 0-.3 0-.4s-.5-1.3-.7-1.7-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a2 2 0 0 0-.6 1.5 3.5 3.5 0 0 0 .7 1.8c.1.2 1.3 2.1 3.3 2.9a11 11 0 0 0 1.3.5 3.1 3.1 0 0 0 1.4.1 2.6 2.6 0 0 0 1.7-1.2c.2-.4.2-.7.1-.8z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
        <path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5 31.5 31.5 0 0 0 1 12a31.5 31.5 0 0 0 .1 4.5 3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 23 12a31.5 31.5 0 0 0 0-4.5zM10 15.5v-7l6 3.5-6 3.5z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
        <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
      </svg>
    ),
  },
] as const

/** Full-bleed topographic wire mesh (Sci-Fi Glass style). */
function WireMesh() {
  const rows = 42
  const paths = Array.from({ length: rows }, (_, i) => {
    const y = 2 + i * (96 / (rows - 1))
    const amp = 2.4 + (i % 7) * 0.45
    const p1 = (i * 11) % 17
    const p2 = (i * 7) % 13
    return [
      `M -8 ${y}`,
      `Q ${8 + p1} ${y - amp} ${22} ${y + amp * 0.35}`,
      `T ${38} ${y - amp * 0.55}`,
      `T ${54} ${y + amp * 0.4}`,
      `T ${70} ${y - amp * 0.3}`,
      `T ${86 + p2 * 0.2} ${y + amp * 0.25}`,
      `T ${108} ${y}`,
    ].join(' ')
  })

  return (
    <div className="footer-wire pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      <svg
        className="footer-wire-svg absolute inset-0 h-[115%] w-[115%] -translate-x-[7%] -translate-y-[6%]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={i % 3 === 0 ? 'rgba(184,134,11,0.13)' : 'rgba(243,230,200,0.11)'}
            strokeWidth={0.16}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 30% 35%, rgba(184,134,11,0.07) 0%, transparent 55%), linear-gradient(180deg, rgba(10,46,34,0.2) 0%, transparent 42%, rgba(6,28,20,0.58) 100%)',
        }}
      />
    </div>
  )
}

/**
 * Sci-Fi Glass–style footer adapted for Tasneem Mukhwas.
 * Full-bleed wire mesh + full-width HUD; brand green texture background.
 */
export default function SiteFooter() {
  const lenis = useLenis()

  const onFooterNav = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string,
    section?: SectionId,
  ) => {
    if (href.startsWith('http')) return
    e.preventDefault()
    if (href === APP_ROUTES.knowMore) {
      navigateApp(APP_ROUTES.knowMore)
      return
    }
    if (section) scrollToSection(section, lenis)
  }

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: INK }}
      aria-label="Site footer"
    >
      {/* Brand texture plate */}
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
              'linear-gradient(180deg, rgba(10,46,34,0.62) 0%, rgba(10,46,34,0.42) 28%, rgba(10,46,34,0.58) 62%, rgba(6,28,20,0.9) 100%)',
          }}
        />
      </div>

      {/* Full-screen wire animation */}
      <WireMesh />

      {/* Full-bleed HUD status bar */}
      <motion.div
        className="relative z-10 w-full border-b border-white/10 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-3.5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full shadow-[0_0_10px_rgba(184,134,11,0.7)]"
              style={{ backgroundColor: GOLD }}
            >
              <span className="block h-full w-full animate-pulse rounded-full bg-[#f0d060]" />
            </span>
            <span
              className="text-[0.62rem] font-semibold tracking-[0.18em] uppercase"
              style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
            >
              Fresh Batch Online
            </span>
          </div>
          <div
            className="hidden items-center gap-3 text-[0.62rem] tracking-[0.16em] uppercase opacity-55 md:flex"
            style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
          >
            <span>India · Est. Legacy</span>
            <span className="h-2.5 w-px bg-white/20" />
            <span>FSSAI Aligned</span>
          </div>
          <span
            className="text-[0.62rem] tracking-[0.16em] uppercase opacity-55"
            style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
          >
            Dispatch Ready
          </span>
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-[1120px] px-5 sm:px-8 lg:px-10">
        {/* Brand + glass link panel */}
        <div className="py-10 sm:py-12">
          <motion.div
            className="mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="mb-4 flex items-center gap-3">
              <BrandLogo className="h-14 w-11 object-contain drop-shadow-md" alt="Tasneem Mukhwas" />
              <p
                className="m-0 text-[0.62rem] font-semibold tracking-[0.18em] uppercase opacity-60"
                style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
              >
                Tasneem Mukhwas — Est. Tradition
              </p>
            </div>
            <h2
              className="mt-3 m-0 text-[clamp(3.4rem,12vw,7.5rem)] leading-[0.82] tracking-tight uppercase"
              style={{
                fontFamily: 'Anton, Impact, sans-serif',
                backgroundImage:
                  'linear-gradient(96deg, #f3e6c8 0%, #d4b56a 22%, #f7f0dc 48%, #b8860b 72%, #f3e6c8 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              TASNEEM
            </h2>
            <p
              className="mt-4 m-0 max-w-xl text-[0.9rem] leading-relaxed opacity-70"
              style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
            >
              Signature mukhwas blends crafted for freshness, tradition, and everyday delight —
              from farm-picked seeds to hygienic packing.
            </p>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-[18px] border border-white/10 p-5 sm:p-7"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 60px -28px rgba(0,0,0,0.55)',
            }}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.55, ease, delay: 0.06 }}
          >
            {/* Corner ticks */}
            <span className="pointer-events-none absolute top-3 left-3 h-3 w-3 border-t border-l border-white/25" />
            <span className="pointer-events-none absolute top-3 right-3 h-3 w-3 border-t border-r border-white/25" />
            <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-white/25" />
            <span className="pointer-events-none absolute right-3 bottom-3 h-3 w-3 border-r border-b border-white/25" />

            <div className="grid grid-cols-2 gap-7 md:grid-cols-4 md:gap-6">
              {COLUMNS.map((col) => (
                <div key={col.title}>
                  <p
                    className="m-0 text-[0.68rem] font-semibold tracking-[0.16em] uppercase opacity-45"
                    style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                  >
                    {col.title}
                  </p>
                  <ul className="mt-4 m-0 flex list-none flex-col gap-2.5 p-0">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <motion.a
                          href={link.href}
                          onClick={(e) => onFooterNav(e, link.href, link.section)}
                          className="inline-block cursor-pointer text-[0.88rem] no-underline opacity-70 transition-opacity hover:opacity-100"
                          style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
                          whileHover={{ x: 3, scale: 1.03 }}
                          transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                          {...(link.href.startsWith('http')
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                        >
                          {link.label}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom meta + social */}
        <motion.div
          className="flex flex-col gap-5 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.45, ease }}
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <p
                className="m-0 text-[0.7rem] tracking-wide opacity-50"
                style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
              >
                © {new Date().getFullYear()} Tasneem Mukhwas. All rights reserved.
              </p>
              <span
                className="rounded-md border border-white/10 px-2.5 py-1 text-[0.62rem] tracking-[0.14em] uppercase opacity-55"
                style={{
                  color: CREAM,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                EN / India
              </span>
            </div>
            <div
              className="flex flex-col gap-1 text-[0.72rem] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1"
              style={{ color: CREAM, fontFamily: 'Inter, sans-serif' }}
            >
              <a
                href={`tel:${CONTACT_PHONE_TEL}`}
                className="cursor-pointer no-underline opacity-70 transition-opacity hover:opacity-100"
                style={{ color: CREAM }}
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="cursor-pointer break-all no-underline opacity-70 transition-opacity hover:opacity-100"
                style={{ color: CREAM }}
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {SOCIALS.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] border border-white/10 no-underline"
                style={{
                  color: CREAM,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                }}
                whileHover={{
                  y: -2,
                  scale: 1.08,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom ticker — same sensing feel as Framer component */}
      <div
        className="relative z-10 overflow-hidden border-t border-white/10"
        style={{ backgroundColor: 'rgba(4,20,14,0.72)' }}
      >
        <div className="footer-ticker flex w-max items-center gap-10 py-3.5 whitespace-nowrap">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-10">
              <span
                className="text-[1.15rem] tracking-[0.08em] uppercase opacity-40 sm:text-[1.35rem]"
                style={{ color: CREAM, fontFamily: 'Anton, Impact, sans-serif' }}
              >
                {item}
              </span>
              <span
                className="inline-block h-1.5 w-1.5 rotate-45 opacity-35"
                style={{ backgroundColor: GOLD }}
              />
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .footer-ticker {
          animation: footer-ticker-x 28s linear infinite;
        }
        @keyframes footer-ticker-x {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        .footer-wire-svg {
          opacity: 0.85;
          animation: footer-wire-drift 18s ease-in-out infinite alternate;
        }
        .footer-wire-svg path {
          stroke-dasharray: 4 6;
          animation: footer-wire-dash 22s linear infinite;
        }
        .footer-wire-svg path:nth-child(odd) {
          animation-duration: 28s;
          animation-direction: reverse;
          stroke: rgba(184,134,11,0.12);
        }
        @keyframes footer-wire-drift {
          from { transform: translate3d(-1.5%, 0, 0) scaleY(1.02); }
          to { transform: translate3d(1.5%, 0, 0) scaleY(0.98); }
        }
        @keyframes footer-wire-dash {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -120; }
        }
        @media (prefers-reduced-motion: reduce) {
          .footer-ticker,
          .footer-wire-svg,
          .footer-wire-svg path { animation: none; }
        }
      `}</style>
    </footer>
  )
}
