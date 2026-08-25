import { useEffect, useState } from 'react'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'

const HERO_SLIDES = [
  '/Mukhwas_pouches_on_wooden_table_202608251659.jpeg',
  '/Mukhwas_pouches_on_wooden_table_202608251630.jpeg',
  '/Red_pouch_and_mukhwas_bowl_202608251659.jpeg',
] as const

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

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    preloadHeroSlides()
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    }, SLIDE_MS)
    return () => window.clearInterval(timer)
  }, [])

  const openShop = () => {
    navigateApp(APP_ROUTES.shop)
  }

  return (
    <section
      id="home"
      className="relative m-0 h-[calc(100svh-3.25rem-env(safe-area-inset-top,0px))] w-full overflow-hidden p-0 lg:h-[calc(100svh-5.25rem-env(safe-area-inset-top,0px))]"
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

      {/* Full hero click → shop; pill popup on hover over product area (right) */}
      <button
        type="button"
        onClick={openShop}
        className="absolute inset-0 z-10 cursor-pointer border-0 bg-transparent p-0"
        aria-label="Browse mukhwas in shop"
      >
        <span className="hero-mukhwas-hotspot group">
          <span className="hero-mukhwas-popup">Find your favorite</span>
        </span>
      </button>
    </section>
  )
}

export { HERO_SLIDES }
