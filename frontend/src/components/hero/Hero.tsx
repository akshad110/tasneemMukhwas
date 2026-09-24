import { useCallback, useEffect, useState } from 'react'
import {
  BRAND_CREAM,
  BRAND_DISPLAY,
  BRAND_GOLD,
  BRAND_SANS,
} from '../../lib/brand'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import {
  HERO_SLIDE_FIT,
  HERO_SLIDE_FOCUS,
  HERO_SLIDE_FOCUS_MOBILE,
  HERO_SLIDE_FOCUS_TABLET,
  HERO_SLIDE_IMAGES,
  preloadHeroSlideImages,
} from '../../lib/heroSlides'

const HERO_SLIDE_ITEMS = [
  {
    image: HERO_SLIDE_IMAGES[0],
    title: 'A Timeless Taste of Tradition',
    body: 'Bringing authentic Indian flavours to every bite.',
  },
  {
    image: HERO_SLIDE_IMAGES[1],
    title: 'A Celebration of Flavour',
    body: 'Crafted for a truly refreshing experience.',
  },
  {
    image: HERO_SLIDE_IMAGES[2],
    title: 'Fresh. Flavourful. Traditional.',
    body: 'Your perfect after-meal companion.',
  },
] as const

const HERO_SLIDES = HERO_SLIDE_IMAGES

const SLIDE_MS = 6200
const FADE_MS = 1600
const EASE = 'cubic-bezier(0.45, 0.05, 0.25, 1)'

function preloadHeroSlides() {
  preloadHeroSlideImages()
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
      className="hero-mobile-dots flex items-center justify-center gap-2.5 px-4 py-3.5"
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
            width: '0.55rem',
            height: '0.55rem',
            borderRadius: 999,
            backgroundColor: index === activeIndex ? BRAND_GOLD : 'rgba(10,46,34,0.18)',
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
                  alt={item.title}
                  decoding={index === 0 ? 'sync' : 'async'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  loading="eager"
                  draggable={false}
                  className="hero-mobile-banner__slide"
                  style={{
                    opacity: isActive ? 1 : 0,
                    zIndex: isActive ? 2 : 1,
                    ['--hero-fit' as string]: 'contain',
                    ['--hero-pos-mobile' as string]: 'center center',
                    ['--hero-pos-tablet' as string]: HERO_SLIDE_FOCUS_TABLET[index],
                    transition: `opacity ${FADE_MS}ms ${EASE}`,
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
      className="hero-desktop relative m-0 hidden w-full overflow-hidden p-0 md:block"
      aria-label="Hero"
    >
      <div className="hero-desktop__stage">
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
              className="hero-desktop__slide"
              style={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 2 : 1,
                ['--hero-fit' as string]: HERO_SLIDE_FIT[index],
                ['--hero-pos' as string]: HERO_SLIDE_FOCUS[index],
                ['--hero-pos-tablet' as string]: HERO_SLIDE_FOCUS_TABLET[index],
                transition: `opacity ${FADE_MS}ms ${EASE}`,
              }}
            />
          )
        })}
      </div>

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
