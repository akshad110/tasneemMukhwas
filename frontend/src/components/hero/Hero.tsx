import { useCallback, useEffect, useState } from 'react'
import {
  BRAND_CREAM,
  BRAND_DISPLAY,
  BRAND_GOLD,
  BRAND_SANS,
} from '../../lib/brand'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'

const HERO_SLIDE_ITEMS = [
  {
    image: '/Mukhwas_pouches_on_wooden_table_202608251659.jpeg',
    title: 'A Touch of Bliss',
    body: 'Premium mukhwas blends crafted for freshness, tradition, and everyday delight.',
  },
  {
    image: '/Mukhwas_pouches_on_wooden_table_202608251630.jpeg',
    title: 'Crafted with Care',
    body: 'Time-honoured recipes, hygienically packed — from our Chhapi kitchen to your home.',
  },
  {
    image: '/Red_pouch_and_mukhwas_bowl_202608251659.jpeg',
    title: 'Find Your Favorite',
    body: 'Explore Shahi, Paan, Mango Slice, and more — pick the blend that suits your mood.',
  },
] as const

const HERO_SLIDES = HERO_SLIDE_ITEMS.map((slide) => slide.image)

const SLIDE_MS = 6200
const FADE_MS = 2200
const EASE = 'cubic-bezier(0.45, 0.05, 0.25, 1)'

function preloadHeroSlides() {
  HERO_SLIDES.forEach((src) => {
    const img = new Image()
    img.decoding = 'async'
    img.src = src
  })
}

function MobileHeroDots({
  count,
  activeIndex,
  onSelect,
}: {
  count: number
  activeIndex: number
  onSelect: (index: number) => void
}) {
  return (
    <div
      className="flex items-center justify-center gap-2 border-t border-[#0a2e22]/8 px-4 py-3"
      style={{ backgroundColor: BRAND_CREAM }}
      role="tablist"
      aria-label="Hero slides"
    >
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={index === activeIndex}
          aria-label={`Slide ${index + 1}`}
          onClick={() => onSelect(index)}
          className="cursor-pointer border-0 p-0 transition-transform hover:scale-110"
          style={{
            width: index === activeIndex ? '1.35rem' : '0.55rem',
            height: '0.55rem',
            borderRadius: 999,
            backgroundColor: index === activeIndex ? BRAND_GOLD : 'rgba(10,46,34,0.22)',
          }}
        />
      ))}
    </div>
  )
}

function MobileHero({
  activeIndex,
  onSelect,
}: {
  activeIndex: number
  onSelect: (index: number) => void
}) {
  const openShop = () => {
    navigateApp(APP_ROUTES.shop)
  }

  return (
    <section
      className="relative w-full overflow-hidden md:hidden"
      aria-label="Hero"
    >
      <div className="hero-mobile-shell">
        <div className="hero-mobile-banner">
          <div className="hero-mobile-banner__media" aria-hidden>
            {HERO_SLIDE_ITEMS.map((item, index) => {
              const isActive = index === activeIndex
              return (
                <img
                  key={item.image}
                  src={item.image}
                  alt=""
                  decoding={index === 0 ? 'sync' : 'async'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  loading="eager"
                  draggable={false}
                  className="hero-mobile-banner__slide"
                  style={{
                    opacity: isActive ? 1 : 0,
                    zIndex: isActive ? 2 : 1,
                    transform: isActive ? 'scale(1)' : 'scale(1.05)',
                    transition: `opacity ${FADE_MS}ms ${EASE}, transform ${FADE_MS + 600}ms ${EASE}`,
                  }}
                />
              )
            })}
          </div>

          <div className="hero-mobile-banner__overlay" aria-hidden />

          <button
            type="button"
            onClick={openShop}
            className="hero-mobile-banner__cta"
            style={{ fontFamily: BRAND_SANS }}
          >
            Shop Now
          </button>
        </div>

        <MobileHeroDots
          count={HERO_SLIDE_ITEMS.length}
          activeIndex={activeIndex}
          onSelect={onSelect}
        />
      </div>
    </section>
  )
}

function DesktopHero({ activeIndex }: { activeIndex: number }) {
  const openShop = () => {
    navigateApp(APP_ROUTES.shop)
  }

  return (
    <section
      className="relative m-0 hidden h-[calc(100svh-3.25rem-env(safe-area-inset-top,0px))] w-full overflow-hidden p-0 md:block md:h-[calc(100svh-4rem-env(safe-area-inset-top,0px))] lg:h-[calc(100svh-5.25rem-env(safe-area-inset-top,0px))]"
      aria-label="Hero"
    >
      <div className="absolute inset-0 w-full bg-[#0a2e22]">
        {HERO_SLIDES.map((src, index) => {
          const isActive = index === activeIndex
          return (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden={!isActive}
              decoding={index === 0 ? 'sync' : 'async'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover object-center will-change-[opacity,transform]"
              style={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 2 : 1,
                transform: isActive ? 'scale(1)' : 'scale(1.04)',
                transition: `opacity ${FADE_MS}ms ${EASE}, transform ${FADE_MS + 600}ms ${EASE}`,
              }}
            />
          )
        })}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            'linear-gradient(90deg, rgba(6,14,11,0.28) 0%, rgba(6,14,11,0.08) 32%, transparent 58%), linear-gradient(180deg, transparent 70%, rgba(6,14,11,0.14) 100%)',
        }}
      />

      <button
        type="button"
        onClick={openShop}
        className="absolute inset-0 z-10 cursor-pointer border-0 bg-transparent p-0"
        aria-label="Browse mukhwas in shop"
      >
        <span className="hero-mukhwas-hotspot group">
          <span
            className="hero-mukhwas-popup"
            style={{ fontFamily: BRAND_DISPLAY, letterSpacing: '0.08em' }}
          >
            Find your favorite
          </span>
        </span>
      </button>
    </section>
  )
}

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    preloadHeroSlides()
  }, [])

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % HERO_SLIDE_ITEMS.length)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(goNext, SLIDE_MS)
    return () => window.clearInterval(timer)
  }, [goNext])

  return (
    <div id="home">
      <MobileHero activeIndex={activeIndex} onSelect={setActiveIndex} />
      <DesktopHero activeIndex={activeIndex} />
    </div>
  )
}

export { HERO_SLIDES }
