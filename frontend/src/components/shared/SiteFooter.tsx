import { motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import type { MouseEvent, ReactNode } from 'react'
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  WHATSAPP_URL,
} from '../../lib/contact'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { scrollToSection, type SectionId } from '../../lib/sectionNav'
import BrandLogo from './BrandLogo'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.62)'
const LINE = 'rgba(10,46,34,0.1)'

const ease = [0.22, 1, 0.36, 1] as const

type FooterLink =
  | { label: string; href: string; section?: undefined }
  | { label: string; href: string; section: SectionId }

const NAV_LINKS: FooterLink[] = [
  { label: 'Home Gateway', href: '/', section: 'home' },
  { label: 'About Us', href: APP_ROUTES.knowMore },
  { label: 'Our Shop', href: APP_ROUTES.shop },
  { label: 'Wholesale', href: '/wholesale', section: 'wholesale' },
  { label: 'Contact', href: '/contact', section: 'contact' },
]

const SHOP_LINKS: FooterLink[] = [
  { label: 'Popular Mukhwas', href: '/products', section: 'products' },
  { label: 'Bulk Orders', href: '/wholesale', section: 'wholesale' },
  { label: 'Gift Packs', href: '/products', section: 'products' },
  { label: 'WhatsApp Order', href: WHATSAPP_URL },
]

const TICKER_TEXT = 'Powered by Haidarali , Phone: 8780929056'
/** Per-segment repeats — enough to fill wide viewports without speeding up the crawl */
const TICKER_ITEMS = Array.from({ length: 8 }, () => TICKER_TEXT)
const TICKER_DURATION_S = 120

function TickerSegment({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      className="footer-ticker-segment flex shrink-0 items-center gap-10 py-3.5 whitespace-nowrap"
      aria-hidden={ariaHidden || undefined}
    >
      {TICKER_ITEMS.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center gap-10">
          <span
            className="text-[1rem] tracking-[0.04em] opacity-50 sm:text-[1.15rem]"
            style={{ color: INK, fontFamily: 'Anton, Impact, sans-serif' }}
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
  )
}

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: WHATSAPP_URL,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M20 3.9A10 10 0 0 0 3.3 17.6L2 22l4.5-1.2A10 10 0 1 0 20 3.9zm-8 16.1a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-2.4.6.6-2.3-.2-.3a8.1 8.1 0 1 1 6.4 3.3zm4.5-5.9c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.6 6.6 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.5l.4-.4.2-.4c.1-.1 0-.3 0-.4s-.5-1.3-.7-1.7-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a2 2 0 0 0-.6 1.5 3.5 3.5 0 0 0 .7 1.8c.1.2 1.3 2.1 3.3 2.9a11 11 0 0 0 1.3.5 3.1 3.1 0 0 0 1.4.1 2.6 2.6 0 0 0 1.7-1.2c.2-.4.2-.7.1-.8z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5 31.5 31.5 0 0 0 1 12a31.5 31.5 0 0 0 .1 4.5 3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 23 12a31.5 31.5 0 0 0 0-4.5zM10 15.5v-7l6 3.5-6 3.5z" />
      </svg>
    ),
  },
] as const

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
            stroke={i % 3 === 0 ? 'rgba(184,134,11,0.16)' : 'rgba(10,46,34,0.08)'}
            strokeWidth={0.16}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 30% 35%, rgba(184,134,11,0.06) 0%, transparent 55%), linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(248,249,250,0.85) 100%)',
        }}
      />
    </div>
  )
}

function SectionTitle({ children, className = '' }: { children: string; className?: string }) {
  return (
    <div className={className}>
      <h3
        className="m-0 text-[0.72rem] font-bold tracking-[0.14em] uppercase"
        style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
      >
        {children}
      </h3>
      <span className="mt-2.5 block h-[2px] w-9 rounded-full" style={{ backgroundColor: GOLD }} />
    </div>
  )
}

function FooterLinkList({
  links,
  onNav,
}: {
  links: FooterLink[]
  onNav: (e: MouseEvent<HTMLAnchorElement>, href: string, section?: SectionId) => void
}) {
  return (
    <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            onClick={(e) => onNav(e, link.href, link.section)}
            className="cursor-pointer text-[0.88rem] no-underline transition-opacity hover:opacity-100"
            style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
            {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

function ContactRow({
  icon,
  title,
  children,
  href,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
  href?: string
}) {
  const body = (
    <>
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
        style={{ backgroundColor: 'rgba(10,46,34,0.04)', color: GOLD, borderColor: LINE }}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span
          className="block text-[0.72rem] font-bold tracking-wide uppercase"
          style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
        >
          {title}
        </span>
        <span
          className="mt-1 block text-[0.82rem] leading-snug"
          style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
        >
          {children}
        </span>
      </span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className="flex gap-3 no-underline transition-opacity hover:opacity-90"
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {body}
      </a>
    )
  }

  return <div className="flex gap-3">{body}</div>
}

export default function SiteFooter() {
  const lenis = useLenis()

  const onFooterNav = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string,
    section?: SectionId,
  ) => {
    if (href.startsWith('http')) return
    e.preventDefault()
    if (href === APP_ROUTES.knowMore || href === APP_ROUTES.shop || href === APP_ROUTES.wholesale || href === APP_ROUTES.contact) {
      navigateApp(href)
      return
    }
    if (section) scrollToSection(section, lenis)
  }

  return (
    <footer
      className="relative w-full overflow-hidden bg-white"
      aria-label="Site footer"
    >
      <WireMesh />

      <motion.div
        className="relative z-10 w-full border-b backdrop-blur-md"
        style={{ backgroundColor: 'rgba(248,249,250,0.95)', borderColor: LINE }}
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
            />
            <span
              className="text-[0.62rem] font-semibold tracking-[0.18em] uppercase"
              style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
            >
              Fresh Batch Online
            </span>
          </div>
          <span
            className="text-[0.62rem] tracking-[0.16em] uppercase opacity-55"
            style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
          >
            India · FSSAI Aligned · Dispatch Ready
          </span>
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        {/* Mobile / tablet — stacked columns */}
        <motion.div
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55, ease }}
        >
          <div className="sm:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <BrandLogo className="h-12 w-10 object-contain" alt="Tasneem Mukhwas" />
            </div>
            <h2
              className="m-0 text-[clamp(2.8rem,8vw,4.5rem)] leading-[0.9] tracking-tight uppercase"
              style={{
                fontFamily: 'Anton, Impact, sans-serif',
                backgroundImage:
                  'linear-gradient(96deg, #0a2e22 0%, #b8860b 42%, #0a2e22 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Tasneem
            </h2>
            <p
              className="mt-4 m-0 max-w-sm text-[0.88rem] leading-relaxed"
              style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
            >
              Signature mukhwas blends crafted for freshness, tradition, and everyday delight — from
              farm-picked seeds to hygienic packing at our Chhapi facility.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border no-underline transition hover:border-[rgba(184,134,11,0.45)]"
                  style={{
                    color: INK,
                    borderColor: LINE,
                    backgroundColor: 'rgba(10,46,34,0.04)',
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle className="mb-5">Navigation</SectionTitle>
            <FooterLinkList links={NAV_LINKS} onNav={onFooterNav} />
          </div>

          <div>
            <SectionTitle className="mb-5">Our Range</SectionTitle>
            <FooterLinkList links={SHOP_LINKS} onNav={onFooterNav} />
          </div>

          <div className="sm:col-span-2">
            <SectionTitle className="mb-5">Reach Us</SectionTitle>
            <div className="grid gap-5 sm:grid-cols-2">
              <ContactRow
                title="Communications"
                href={`mailto:${CONTACT_EMAIL}`}
                icon={
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M4 6h16v12H4z" />
                    <path d="m4 7 8 6 8-6" strokeLinecap="round" />
                  </svg>
                }
              >
                {CONTACT_EMAIL}
              </ContactRow>
              <ContactRow
                title="WhatsApp Gateway"
                href={WHATSAPP_URL}
                icon={
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d="M20 3.9A10 10 0 0 0 3.3 17.6L2 22l4.5-1.2A10 10 0 1 0 20 3.9z" />
                  </svg>
                }
              >
                {CONTACT_PHONE_DISPLAY}
              </ContactRow>
              <ContactRow
                title="Voice Line"
                href={`tel:${CONTACT_PHONE_TEL}`}
                icon={
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5L17.5 12 21 13.5V17a2 2 0 0 1-2 2A16 16 0 0 1 3 6.5 2 2 0 0 1 5 4.5z" strokeLinecap="round" />
                  </svg>
                }
              >
                {CONTACT_PHONE_DISPLAY}
              </ContactRow>
              <ContactRow
                title="Production Hub"
                icon={
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
                    <circle cx="12" cy="10" r="2.2" />
                  </svg>
                }
              >
                {CONTACT_ADDRESS}
              </ContactRow>
            </div>
          </div>
        </motion.div>

        {/* Desktop — 4×2 grid: headers on one row, content aligned below */}
        <motion.div
          className="hidden lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.82fr)_minmax(0,0.82fr)_minmax(0,1.15fr)] lg:gap-x-10 xl:gap-x-14 lg:gap-y-7 lg:items-start"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55, ease }}
        >
          <div className="flex min-w-0 items-start gap-3 self-start">
            <BrandLogo className="mt-1.5 h-11 w-9 shrink-0 object-contain" alt="Tasneem Mukhwas" />
            <h2
              className="m-0 min-w-0 text-[clamp(2.4rem,3.2vw,3.6rem)] leading-[0.92] tracking-tight uppercase"
              style={{
                fontFamily: 'Anton, Impact, sans-serif',
                backgroundImage:
                  'linear-gradient(96deg, #0a2e22 0%, #b8860b 42%, #0a2e22 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Tasneem
            </h2>
          </div>

          <SectionTitle className="self-start pt-1">Navigation</SectionTitle>
          <SectionTitle className="self-start pt-1">Our Range</SectionTitle>
          <SectionTitle className="self-start pt-1">Reach Us</SectionTitle>

          <div className="min-w-0">
            <p
              className="m-0 text-[0.88rem] leading-relaxed"
              style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
            >
              Signature mukhwas blends crafted for freshness, tradition, and everyday delight — from
              farm-picked seeds to hygienic packing at our Chhapi facility.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border no-underline transition hover:border-[rgba(184,134,11,0.45)]"
                  style={{
                    color: INK,
                    borderColor: LINE,
                    backgroundColor: 'rgba(10,46,34,0.04)',
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <FooterLinkList links={NAV_LINKS} onNav={onFooterNav} />
          </div>

          <div className="min-w-0">
            <FooterLinkList links={SHOP_LINKS} onNav={onFooterNav} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-col gap-5">
              <ContactRow
                title="Communications"
                href={`mailto:${CONTACT_EMAIL}`}
                icon={
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M4 6h16v12H4z" />
                    <path d="m4 7 8 6 8-6" strokeLinecap="round" />
                  </svg>
                }
              >
                {CONTACT_EMAIL}
              </ContactRow>
              <ContactRow
                title="WhatsApp Gateway"
                href={WHATSAPP_URL}
                icon={
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d="M20 3.9A10 10 0 0 0 3.3 17.6L2 22l4.5-1.2A10 10 0 1 0 20 3.9z" />
                  </svg>
                }
              >
                {CONTACT_PHONE_DISPLAY}
              </ContactRow>
              <ContactRow
                title="Voice Line"
                href={`tel:${CONTACT_PHONE_TEL}`}
                icon={
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5L17.5 12 21 13.5V17a2 2 0 0 1-2 2A16 16 0 0 1 3 6.5 2 2 0 0 1 5 4.5z" strokeLinecap="round" />
                  </svg>
                }
              >
                {CONTACT_PHONE_DISPLAY}
              </ContactRow>
              <ContactRow
                title="Production Hub"
                icon={
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
                    <circle cx="12" cy="10" r="2.2" />
                  </svg>
                }
              >
                {CONTACT_ADDRESS}
              </ContactRow>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 border-t pt-6"
          style={{ borderColor: LINE }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.45, ease }}
        >
          <p
            className="m-0 text-[0.72rem] tracking-wide opacity-50"
            style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
          >
            © {new Date().getFullYear()} Tasneem Mukhwas. All rights reserved.
          </p>
        </motion.div>
      </div>

      <div
        className="relative z-10 overflow-x-clip overflow-y-hidden border-t"
        style={{ backgroundColor: 'rgba(248,249,250,0.98)', borderColor: LINE }}
      >
        <div className="footer-ticker flex w-max">
          <TickerSegment />
          <TickerSegment ariaHidden />
        </div>
      </div>

      <style>{`
        .footer-ticker {
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
          animation: footer-ticker-x ${TICKER_DURATION_S}s linear infinite;
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
