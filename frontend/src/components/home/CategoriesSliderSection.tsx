import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import {
  BRAND_GOLD,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
  HOME_SECTION_A,
} from '../../lib/brand'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { useCatalog } from '../../context/CatalogContext'
import { buildCategorySliderItems, getCategoryCardTheme } from '../../lib/categorySliderContent'
import { DEFAULT_CATEGORIES } from '../../lib/shopCatalog'
import { refreshScrollLayout } from '../../lib/scrollControl'

gsap.registerPlugin(ScrollTrigger)

export default function CategoriesSliderSection() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()
  const { products, categories, ensureLoaded } = useCatalog()

  const items = useMemo(
    () =>
      buildCategorySliderItems(
        categories.length ? categories : DEFAULT_CATEGORIES,
        products,
      ),
    [categories, products],
  )

  useEffect(() => {
    ensureLoaded()
  }, [ensureLoaded])

  useEffect(() => {
    const root = wrapperRef.current
    if (!root || !items.length) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let ctx: gsap.Context | undefined

    const onLenisScroll = () => ScrollTrigger.update()

    const teardown = () => {
      lenis?.off('scroll', onLenisScroll)
      ctx?.revert()
      ctx = undefined
    }

    const setupScroll = () => {
      teardown()

      if (reducedMotion) {
        ScrollTrigger.refresh()
        refreshScrollLayout()
        return
      }

      const isMobile = window.matchMedia('(max-width: 767px)').matches
      const header = document.querySelector('header')
      const navHeight = header?.getBoundingClientRect().height ?? (isMobile ? 56 : 88)
      const pinGap = isMobile ? 18 : 36
      const tabPeek = isMobile ? 34 : 42

      lenis?.on('scroll', onLenisScroll)

      ctx = gsap.context(() => {
        const wrappers = gsap.utils.toArray<HTMLElement>('.categories-slider__card-wrapper', root)
        const shells = gsap.utils.toArray<HTMLElement>('.categories-slider__card-shell', root)
        const count = shells.length
        const pinEnd = isMobile ? 'bottom 420' : 'bottom bottom'

        wrappers.forEach((wrapper, i) => {
          const shell = shells[i]
          if (!shell) return

          const isLast = i === count - 1
          const scale = isLast ? 1 : isMobile ? 0.94 + 0.012 * i : 0.9 + 0.025 * i
          const rotation = isLast || isMobile ? 0 : -10
          const pinStart = Math.round(navHeight + pinGap + tabPeek * i)

          gsap.to(shell, {
            scale,
            rotationX: rotation,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: `top ${pinStart}`,
              end: pinEnd,
              endTrigger: root,
              scrub: true,
              pin: wrapper,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              ...(isMobile ? { pinType: 'transform' } : {}),
            },
          })
        })
      }, root)

      ScrollTrigger.refresh()
      refreshScrollLayout()
    }

    setupScroll()
    window.addEventListener('resize', setupScroll)

    return () => {
      window.removeEventListener('resize', setupScroll)
      teardown()
    }
  }, [lenis, items])

  return (
    <section
      id="categories"
      className="categories-slider"
      style={{
        backgroundColor: HOME_SECTION_A,
        ['--category-count' as string]: items.length,
      }}
      aria-labelledby="categories-slider-title"
    >
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <clipPath id="category-blob-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.05,0.26 C0.08,0.10 0.28,0.03 0.48,0.05 C0.66,0.07 0.82,0.02 0.96,0.10 C0.99,0.22 0.98,0.42 0.95,0.60 C0.88,0.82 0.68,0.97 0.42,0.98 C0.20,0.96 0.04,0.84 0.02,0.62 C0.01,0.46 0.02,0.34 0.05,0.26 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="categories-slider__intro">
        <p
          className="m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase"
          style={{ color: BRAND_GOLD, fontFamily: BRAND_SANS }}
        >
          Explore our range
        </p>
        <h2
          id="categories-slider-title"
          className="mt-2 m-0 text-[clamp(2rem,5vw,3rem)] leading-tight tracking-tight"
          style={{ fontFamily: BRAND_SERIF, color: BRAND_INK }}
        >
          Categories
        </h2>
        <p
          className="mx-auto mt-3 max-w-xl text-[0.92rem] leading-relaxed"
          style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
        >
          Scroll to discover every Tasneem mukhwas family — each with its own flavour story.
        </p>
      </div>

      <div ref={wrapperRef} className="categories-slider__wrapper">
        <div className="categories-slider__cards">
          {items.map((item, index) => {
            const theme = getCategoryCardTheme(item.accent)

            return (
              <div key={item.id} className="categories-slider__card-wrapper" style={{ zIndex: index + 1 }}>
                <div className="categories-slider__card-shell">
                  <article
                    className="categories-slider__card"
                    style={{
                      ['--category-bg' as string]: theme.cardBg,
                      ['--category-bg-deep' as string]: theme.cardBgDeep,
                      ['--category-text' as string]: theme.text,
                      ['--category-text-muted' as string]: theme.textMuted,
                      ['--category-tab-bg' as string]: theme.tabBg,
                      ['--category-tab-border' as string]: theme.tabBorder,
                      ['--category-tab-text' as string]: theme.tabText,
                      ['--category-button-bg' as string]: theme.buttonBg,
                      ['--category-button-border' as string]: theme.buttonBorder,
                      ['--category-button-text' as string]: theme.buttonText,
                      ['--category-blob-glow' as string]: theme.blobGlow,
                    }}
                  >
                    <div className="categories-slider__folder-tab">
                      <span>{item.tabLabel}</span>
                    </div>

                    <div className="categories-slider__card-body">
                      <div className="categories-slider__card-copy">
                        <p className="categories-slider__eyebrow m-0">
                          {String(index + 1).padStart(2, '0')} · {item.sampleProductName}
                        </p>
                        <h3
                          className="categories-slider__headline m-0"
                          style={{ fontFamily: BRAND_SERIF }}
                        >
                          {item.headline}
                        </h3>
                        <p className="categories-slider__desc m-0">{item.description}</p>
                        <button
                          type="button"
                          onClick={() => navigateApp(APP_ROUTES.shop)}
                          className="categories-slider__cta"
                          style={{ fontFamily: BRAND_SANS }}
                        >
                          <span className="categories-slider__cta-arrow" aria-hidden>
                            →
                          </span>
                          <span className="categories-slider__cta-divider" aria-hidden>
                            |
                          </span>
                          <span>See all products</span>
                        </button>
                      </div>

                      <div className="categories-slider__visual">
                        <div className="categories-slider__blob">
                          <div className="section-image-hover flex h-full w-full items-center justify-center">
                            <img
                              src={item.promoImage}
                              alt={item.sampleProductName}
                              loading="lazy"
                              decoding="async"
                              draggable={false}
                              className="categories-slider__promo-image section-image-hover__img"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            )
          })}
        </div>
        <div className="categories-slider__scroll-tail" aria-hidden />
      </div>
      <div className="categories-slider__flow-spacer" aria-hidden />
    </section>
  )
}
