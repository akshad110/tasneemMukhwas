import type { MouseEvent } from 'react'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import {
  BRAND_CREAM,
  BRAND_DISPLAY,
  BRAND_INK,
  BRAND_SANS,
} from '../../lib/brand'
import ProductAccordion from './ProductAccordion'

const INK = BRAND_INK

/**
 * Popular Products — expandable pouch showcase (name → image → description).
 * Five panels with pouch-matched brand fills; same open/collapse pattern as Framer Team Showcase.
 */
export default function PopularProducts() {
  const goShop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    navigateApp(APP_ROUTES.shop)
  }

  return (
    <section
      id="products"
      className="relative w-full overflow-x-clip px-4 pb-12 pt-10 md:px-8 md:pb-16 md:pt-12 lg:px-10"
      style={{ backgroundColor: BRAND_CREAM }}
      aria-label="Popular products"
    >
      <div className="relative z-10 mx-auto mb-6 max-w-7xl text-center md:mb-8">
        <h2
          className="m-0 uppercase"
          style={{
            color: INK,
            fontFamily: BRAND_DISPLAY,
            fontSize: 'clamp(1.5rem, 3.8vw, 2.65rem)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            lineHeight: 1.05,
          }}
        >
          Popular Products
        </h2>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[calc(72rem-16px)] max-lg:overflow-visible overflow-hidden">
        <ProductAccordion />
      </div>

      <div className="relative z-10 mx-auto mt-6 flex justify-center md:mt-8">
        <a
          href="/shop"
          onClick={goShop}
          className="cursor-pointer rounded-full border px-7 py-2.5 text-[0.78rem] font-semibold tracking-[0.14em] uppercase no-underline transition-colors hover:bg-[#0a2e22] hover:text-[#FFFEF2]"
          style={{
            fontFamily: BRAND_SANS,
            color: INK,
            borderColor: 'rgba(184,134,11,0.45)',
            backgroundColor: 'transparent',
          }}
        >
          Show All
        </a>
      </div>
    </section>
  )
}
