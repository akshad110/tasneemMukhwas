import type { MouseEvent } from 'react'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import ProductAccordion from './ProductAccordion'

const CREAM = '#f3e6c8'
const INK = '#0a2e22'
const SECTION_TEXTURE = '/image.png_2K_202608092240.jpeg'

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
      className="relative w-full overflow-x-clip px-4 pb-16 pt-12 md:px-8 md:pb-24 md:pt-16 lg:px-10"
      style={{ backgroundColor: INK }}
      aria-label="Popular products"
    >
      {/* Textured green plate + hero-style fade */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src={SECTION_TEXTURE}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover brightness-[0.88] saturate-[0.92]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 50% at 50% 58%, rgba(8,16,12,0.05) 0%, rgba(6,12,10,0.22) 55%, rgba(4,10,8,0.32) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto mb-10 max-w-7xl text-center md:mb-14">
        <h2
          className="m-0 uppercase"
          style={{
            color: CREAM,
            fontFamily: 'Anton, Impact, sans-serif',
            fontSize: 'clamp(2.75rem, 9vw, 7rem)',
            fontWeight: 400,
            letterSpacing: '0.04em',
            lineHeight: 0.95,
          }}
        >
          Popular Products
        </h2>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[calc(72rem-16px)] overflow-hidden rounded-sm">
        <ProductAccordion />
      </div>

      <div className="relative z-10 mx-auto mt-8 flex justify-center md:mt-10">
        <a
          href="/shop"
          onClick={goShop}
          className="cursor-pointer rounded-full border px-7 py-2.5 text-[0.78rem] font-semibold tracking-[0.14em] uppercase no-underline transition-colors hover:bg-[#f3e6c8] hover:text-[#0a2e22]"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: CREAM,
            borderColor: 'rgba(243,230,200,0.45)',
            backgroundColor: 'transparent',
          }}
        >
          Show All
        </a>
      </div>
    </section>
  )
}
