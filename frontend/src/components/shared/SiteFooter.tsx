import { motion } from 'framer-motion'
import type { MouseEvent, ReactNode } from 'react'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from '../../lib/contact'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import BrandLogo from './BrandLogo'
import {
  BRAND_CREAM,
  BRAND_CREAM_DEEP,
  BRAND_CREAM_LIGHT,
  BRAND_GOLD,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
} from '../../lib/brand'

const INK = BRAND_INK
const CREAM = BRAND_CREAM
const CREAM_LIGHT = BRAND_CREAM_LIGHT
const CREAM_DEEP = BRAND_CREAM_DEEP
const GOLD = BRAND_GOLD
const MUTED = BRAND_MUTED
const LINE = 'rgba(10,46,34,0.12)'

const ease = [0.22, 1, 0.36, 1] as const

type FooterLink = {
  label: string
  href: string
  external?: boolean
}

const COMPANY_LINKS: FooterLink[] = [
  { label: 'About Us', href: APP_ROUTES.knowMore },
  { label: 'Terms & Conditions', href: '#terms' },
  { label: 'Privacy', href: APP_ROUTES.privacy },
  { label: 'Shipping Policy', href: APP_ROUTES.shippingPolicy },
]

const CONNECT_LINKS: FooterLink[] = [
  { label: 'Become Distributor', href: APP_ROUTES.wholesale },
  { label: 'Exhibition', href: '#exhibition' },
  { label: 'Print Label', href: '#print-label' },
  { label: 'Our Brochure', href: '#brochure' },
]

const TICKER_TEXT = 'Powered by Haidarali , Phone: 8780929056'
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
            className="text-[1rem] tracking-[0.04em] opacity-70 sm:text-[1.15rem]"
            style={{ color: INK, fontFamily: 'Anton, Impact, sans-serif' }}
          >
            {item}
          </span>
          <span
            className="inline-block h-1.5 w-1.5 rotate-45 opacity-50"
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
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M13 3h4a1 1 0 0 1 1 1v3h-3.5a1 1 0 0 0-1 1v2.5H18v3h-3.5V21h-4v-6.5H7v-3h3.5V8a4.5 4.5 0 0 1 4.5-4.5z" />
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
            stroke={i % 3 === 0 ? 'rgba(184,134,11,0.14)' : 'rgba(10,46,34,0.07)'}
            strokeWidth={0.16}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 30% 35%, rgba(184,134,11,0.06) 0%, transparent 55%), linear-gradient(180deg, rgba(255,254,242,0.35) 0%, transparent 42%, rgba(230,216,195,0.45) 100%)',
        }}
      />
    </div>
  )
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h3
      className="m-0 text-[0.72rem] font-bold tracking-[0.14em] uppercase"
      style={{ color: INK, fontFamily: BRAND_SANS }}
    >
      {children}
    </h3>
  )
}

function FooterLinkList({
  links,
  onNav,
}: {
  links: FooterLink[]
  onNav: (e: MouseEvent<HTMLAnchorElement>, href: string) => void
}) {
  return (
    <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            onClick={(e) => onNav(e, link.href)}
            className="footer-link cursor-pointer text-[0.88rem] transition-colors duration-300 hover:text-[#0a2e22]"
            style={{ color: MUTED, fontFamily: BRAND_SANS }}
            {...(link.external || link.href.startsWith('http')
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

function ContactLine({
  icon,
  children,
  href,
}: {
  icon: ReactNode
  children: ReactNode
  href?: string
}) {
  const className =
    'mt-3 flex items-center gap-2.5 text-[0.84rem] no-underline transition-colors duration-300 hover:text-[#0a2e22]'
  const style = { color: MUTED, fontFamily: BRAND_SANS }

  const iconWrap = (
    <span
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
      style={{ color: GOLD, backgroundColor: CREAM_LIGHT, borderColor: LINE }}
    >
      {icon}
    </span>
  )

  if (href) {
    return (
      <a href={href} className={className} style={style}>
        {iconWrap}
        <span className="footer-link">{children}</span>
      </a>
    )
  }

  return (
    <div className={className} style={style}>
      {iconWrap}
      {children}
    </div>
  )
}

export default function SiteFooter() {
  const onFooterNav = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('http') || href.startsWith('#')) return
    e.preventDefault()
    navigateApp(href)
  }

  return (
    <footer
      className="relative w-full overflow-hidden border-t"
      style={{ backgroundColor: CREAM, borderColor: LINE }}
      aria-label="Site footer"
    >
      <WireMesh />

      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <motion.div
          className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12 xl:gap-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55, ease }}
        >
          <div className="flex shrink-0 items-start justify-center lg:justify-start">
            <BrandLogo
              className="h-[clamp(7rem,16vw,10.5rem)] w-auto max-w-[min(100%,14rem)] object-contain"
              alt="Tasneem Mukhwas"
            />
          </div>

          <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:max-w-3xl lg:gap-10 xl:max-w-none">
            <div>
              <SectionTitle>Company</SectionTitle>
              <FooterLinkList links={COMPANY_LINKS} onNav={onFooterNav} />
            </div>

            <div>
              <SectionTitle>Connect</SectionTitle>
              <FooterLinkList links={CONNECT_LINKS} onNav={onFooterNav} />
            </div>

            <div>
              <SectionTitle>Socials</SectionTitle>
              <div className="mt-4 flex items-center gap-2.5">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border no-underline transition hover:border-[rgba(184,134,11,0.55)]"
                    style={{
                      color: INK,
                      backgroundColor: CREAM_LIGHT,
                      borderColor: LINE,
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <ContactLine
                href={`tel:${CONTACT_PHONE_TEL}`}
                icon={
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5L17.5 12 21 13.5V17a2 2 0 0 1-2 2A16 16 0 0 1 3 6.5 2 2 0 0 1 5 4.5z" strokeLinecap="round" />
                  </svg>
                }
              >
                {CONTACT_PHONE_DISPLAY}
              </ContactLine>
              <ContactLine
                href={`mailto:${CONTACT_EMAIL}`}
                icon={
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M4 6h16v12H4z" />
                    <path d="m4 7 8 6 8-6" strokeLinecap="round" />
                  </svg>
                }
              >
                {CONTACT_EMAIL}
              </ContactLine>
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
            className="m-0 text-[0.72rem] tracking-wide"
            style={{ color: MUTED, fontFamily: BRAND_SANS }}
          >
            © {new Date().getFullYear()} Tasneem Mukhwas. All rights reserved.
          </p>
        </motion.div>
      </div>

      <div
        className="relative z-10 overflow-x-clip overflow-y-hidden border-t"
        style={{ backgroundColor: CREAM_DEEP, borderColor: LINE }}
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
          opacity: 0.75;
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
