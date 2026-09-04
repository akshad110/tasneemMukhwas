import { motion } from 'framer-motion'
import type { MouseEvent } from 'react'
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from '../../lib/contact'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { DEFAULT_CATEGORIES } from '../../lib/shopCatalog'
import BrandLogo from './BrandLogo'
import {
  BRAND_CREAM_DARK,
  BRAND_CREAM_LIGHT,
  BRAND_FOOTER_HEADING,
  BRAND_FOOTER_TEXT,
  BRAND_GOLD,
  BRAND_SANS,
} from '../../lib/brand'

const FOOTER_BG = BRAND_CREAM_DARK
const FOOTER_TEXT = BRAND_FOOTER_TEXT
const FOOTER_HEADING = BRAND_FOOTER_HEADING
const FOOTER_ICON_BG = BRAND_CREAM_LIGHT
const FOOTER_ICON_COLOR = FOOTER_HEADING
const FOOTER_ICON_BORDER = 'rgba(61,52,40,0.28)'
const LINE = 'rgba(61,52,40,0.22)'
const POWERED_BY_URL = 'https://example.com'

const ease = [0.22, 1, 0.36, 1] as const

type FooterLink = {
  label: string
  href: string
  external?: boolean
}

const COMPANY_LINKS: FooterLink[] = [
  { label: 'About Us', href: APP_ROUTES.knowMore },
  { label: 'Our Company', href: APP_ROUTES.ourCompany },
  { label: 'Terms & Conditions', href: APP_ROUTES.terms },
  { label: 'Privacy Policy', href: APP_ROUTES.privacy },
  { label: 'Shipping Policy', href: APP_ROUTES.shippingPolicy },
  { label: 'Bulk Orders', href: APP_ROUTES.wholesale },
]

const CONNECT_LINKS: FooterLink[] = [
  { label: 'Become A Distributor', href: APP_ROUTES.dealership },
  { label: 'Contact Us', href: APP_ROUTES.contact },
  { label: 'My Account', href: APP_ROUTES.profile },
  { label: 'Track Order', href: APP_ROUTES.myOrders },
  { label: 'Exhibition', href: '#exhibition' },
  { label: 'Our Brochure', href: '#brochure' },
]

const PRODUCT_LINKS: FooterLink[] = DEFAULT_CATEGORIES.map((category) => ({
  label: category,
  href: APP_ROUTES.shop,
}))

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M13 3h4a1 1 0 0 1 1 1v3h-3.5a1 1 0 0 0-1 1v2.5H18v3h-3.5V21h-4v-6.5H7v-3h3.5V8a4.5 4.5 0 0 1 4.5-4.5z" />
      </svg>
    ),
  },
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
    label: 'X',
    href: 'https://x.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M17.6 3H20l-6.4 7.3L21 21h-6.2l-4.9-6.4L4.2 21H2l6.8-7.8L3 3h6.3l4.4 5.8L17.6 3zm-1.1 16.2h1.7L8.5 4.7H6.7l9.8 14.5z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M6.5 8.5h3v10h-3v-10zm1.5-4.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zM10 8.5h2.9v1.4h.04c.4-.75 1.38-1.55 2.84-1.55 3.04 0 3.6 2 3.6 4.6v5.55h-3v-4.92c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.89 1.28-1.89 2.6v4.99h-3V8.5z" />
      </svg>
    ),
  },
] as const

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="footer-section-title">
      <h3
        className="m-0 text-[0.78rem] font-bold tracking-[0.16em] uppercase sm:text-[0.82rem]"
        style={{ color: BRAND_GOLD, fontFamily: BRAND_SANS }}
      >
        {children}
      </h3>
      <span className="footer-section-title__line" aria-hidden />
    </div>
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
    <ul className="footer-link-list m-0 mt-4 flex list-none flex-col gap-2.5 p-0 sm:gap-3">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            onClick={(e) => onNav(e, link.href)}
            className="footer-link cursor-pointer text-[0.84rem] leading-snug transition-colors duration-300 sm:text-[0.88rem]"
            style={{ color: FOOTER_TEXT, fontFamily: BRAND_SANS }}
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

export default function SiteFooter() {
  const year = new Date().getFullYear()

  const onFooterNav = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('http') || href.startsWith('#')) return
    e.preventDefault()
    navigateApp(href)
  }

  return (
    <footer
      className="site-footer w-full border-t"
      style={{ backgroundColor: FOOTER_BG, borderColor: LINE }}
      aria-label="Site footer"
    >
      <div className="site-footer__inner mx-auto w-full max-w-[1320px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
        <motion.div
          className="site-footer__brand mb-8 flex justify-center sm:mb-10 lg:justify-start"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.45, ease }}
        >
          <a
            href={APP_ROUTES.home}
            onClick={(e) => onFooterNav(e, APP_ROUTES.home)}
            className="inline-flex shrink-0 no-underline"
            aria-label="Tasneem Mukhwas home"
          >
            <BrandLogo
              className="h-[clamp(5.5rem,14vw,8.5rem)] w-auto max-w-[min(100%,12rem)] object-contain"
              alt="Tasneem Mukhwas"
            />
          </a>
        </motion.div>

        <motion.div
          className="site-footer__columns grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4 lg:gap-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.55, ease }}
        >
          <div className="site-footer__column">
            <SectionTitle>Company</SectionTitle>
            <FooterLinkList links={COMPANY_LINKS} onNav={onFooterNav} />
          </div>

          <div className="site-footer__column">
            <SectionTitle>Connect</SectionTitle>
            <FooterLinkList links={CONNECT_LINKS} onNav={onFooterNav} />
          </div>

          <div className="site-footer__column">
            <SectionTitle>Products</SectionTitle>
            <FooterLinkList links={PRODUCT_LINKS} onNav={onFooterNav} />
          </div>

          <div className="site-footer__column">
            <SectionTitle>Address</SectionTitle>
            <div className="mt-4 space-y-3">
              <p
                className="m-0 text-[0.84rem] leading-relaxed sm:text-[0.88rem]"
                style={{ color: FOOTER_TEXT, fontFamily: BRAND_SANS }}
              >
                <span className="font-semibold" style={{ color: FOOTER_HEADING }}>
                  Corporate Office:
                </span>{' '}
                Tasneem Mukhwas, {CONTACT_ADDRESS}
              </p>
              <a
                href={`tel:${CONTACT_PHONE_TEL}`}
                className="footer-link inline-flex items-center gap-2.5 text-[0.84rem] no-underline transition-colors duration-300 sm:text-[0.88rem]"
                style={{ color: FOOTER_TEXT, fontFamily: BRAND_SANS }}
              >
                <span
                  className="footer-contact-icon inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                  style={{
                    color: FOOTER_ICON_COLOR,
                    backgroundColor: FOOTER_ICON_BG,
                    borderColor: FOOTER_ICON_BORDER,
                  }}
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5L17.5 12 21 13.5V17a2 2 0 0 1-2 2A16 16 0 0 1 3 6.5 2 2 0 0 1 5 4.5z" strokeLinecap="round" />
                  </svg>
                </span>
                {CONTACT_PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="footer-link inline-flex items-center gap-2.5 text-[0.84rem] no-underline transition-colors duration-300 sm:text-[0.88rem]"
                style={{ color: FOOTER_TEXT, fontFamily: BRAND_SANS }}
              >
                <span
                  className="footer-contact-icon inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                  style={{
                    color: FOOTER_ICON_COLOR,
                    backgroundColor: FOOTER_ICON_BG,
                    borderColor: FOOTER_ICON_BORDER,
                  }}
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M4 6h16v12H4z" />
                    <path d="m4 7 8 6 8-6" strokeLinecap="round" />
                  </svg>
                </span>
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="site-footer__bottom mt-10 border-t pt-6 sm:mt-12"
          style={{ borderColor: LINE }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.45, ease }}
        >
          <div className="site-footer__bottom-row flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="site-footer__socials flex flex-wrap items-center gap-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="footer-social-icon inline-flex h-10 w-10 items-center justify-center rounded-full border no-underline transition"
                  style={{
                    color: FOOTER_ICON_COLOR,
                    backgroundColor: FOOTER_ICON_BG,
                    borderColor: FOOTER_ICON_BORDER,
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div
              className="site-footer__copyright-pill inline-flex w-fit max-w-full items-center rounded-full border px-4 py-2.5 text-[0.62rem] font-semibold tracking-[0.08em] uppercase sm:px-5 sm:text-[0.68rem]"
              style={{
                color: FOOTER_TEXT,
                borderColor: LINE,
                backgroundColor: 'rgba(255,254,242,0.55)',
                fontFamily: BRAND_SANS,
              }}
            >
              Copyright © {year - 1} – {year}.{' '}
              <span className="ml-1 font-bold" style={{ color: BRAND_GOLD }}>
                Tasneem Mukhwas
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <div
        className="site-footer__powered border-t py-4 text-center sm:py-4.5"
        style={{ borderColor: LINE, backgroundColor: FOOTER_BG }}
      >
        <a
          href={POWERED_BY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer__powered-link inline-flex items-center justify-center rounded-full border px-4 py-2 text-[0.84rem] font-semibold tracking-[0.04em] no-underline transition-all duration-300 sm:px-5 sm:text-[0.92rem]"
          style={{
            color: FOOTER_HEADING,
            borderColor: 'rgba(184,134,11,0.35)',
            backgroundColor: 'rgba(255,254,242,0.72)',
            fontFamily: BRAND_SANS,
            boxShadow: '0 8px 20px -14px rgba(10,46,34,0.35)',
          }}
        >
          powered by{' '}
          <span className="ml-1 font-bold" style={{ color: BRAND_GOLD }}>
            haider ali
          </span>
        </a>
      </div>
    </footer>
  )
}
