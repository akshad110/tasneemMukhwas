import {
  motion,
  useSpring,
  type PanInfo,
} from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { CAROUSEL_PRODUCTS } from '../../lib/carouselProducts'
import { APP_ROUTES, navigateApp, shopProductPath } from '../../lib/appRoutes'
import {
  BRAND_DISPLAY,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
  HOME_SECTION_A,
} from '../../lib/brand'

const TOTAL = CAROUSEL_PRODUCTS.length
const AUTO_MS = 4500

const SLIDE_TRANSITION = {
  type: 'tween' as const,
  duration: 0.72,
  ease: [0.22, 1, 0.36, 1] as const,
}

function wrapIndex(index: number) {
  return ((index % TOTAL) + TOTAL) % TOTAL
}

function shortestOffset(index: number, active: number) {
  let diff = index - active
  if (diff > TOTAL / 2) diff -= TOTAL
  if (diff < -TOTAL / 2) diff += TOTAL
  return diff
}

function useSlideGap() {
  const [gap, setGap] = useState(300)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 400) setGap(132)
      else if (w < 640) setGap(152)
      else if (w < 768) setGap(180)
      else if (w < 1024) setGap(270)
      else setGap(300)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return gap
}

type CarouselCardProps = {
  product: (typeof CAROUSEL_PRODUCTS)[number]
  offset: number
  isActive: boolean
  slideGap: number
}

const HOVER_EASE = [0.16, 1, 0.3, 1] as const

function hoverProductTransition(active: boolean) {
  return {
    type: 'tween' as const,
    duration: active ? 1.28 : 0.88,
    delay: active ? 0.32 : 0,
    ease: HOVER_EASE,
  }
}

function hoverContentTransition(active: boolean) {
  return {
    type: 'tween' as const,
    duration: active ? 1.05 : 0.78,
    delay: active ? 0.3 : 0,
    ease: HOVER_EASE,
  }
}

function CarouselCard({ product, offset, isActive, slideGap }: CarouselCardProps) {
  const [hovered, setHovered] = useState(false)
  const rotateX = useSpring(0, { stiffness: 180, damping: 26 })
  const rotateY = useSpring(0, { stiffness: 180, damping: 26 })
  const abs = Math.abs(offset)

  useEffect(() => {
    if (!isActive) {
      setHovered(false)
      rotateX.set(0)
      rotateY.set(0)
    }
  }, [isActive, rotateX, rotateY])

  const onMove = (e: ReactMouseEvent<HTMLElement>) => {
    if (!isActive || hovered) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * 12)
    rotateX.set(-py * 10)
  }

  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    setHovered(false)
  }

  const showHoverFx = isActive && hovered
  const hoverTransition = hoverContentTransition(showHoverFx)
  const productTransition = hoverProductTransition(showHoverFx)

  const openProduct = (e: ReactMouseEvent) => {
    e.stopPropagation()
    navigateApp(shopProductPath(product.id))
  }

  const baseRotateY = offset * -32
  const translateX = offset * slideGap
  const translateZ = -abs * Math.min(160, slideGap * 0.55)
  const scale = isActive ? 1 : Math.max(0.78, 1 - abs * 0.1)
  const opacity = abs > 2 ? 0 : 1
  const pointerEvents = abs > 1 ? 'none' : 'auto'

  return (
    <motion.article
      className="our-products-card"
      animate={{
        x: `calc(-50% + ${translateX}px)`,
        y: '-50%',
        z: translateZ,
        rotateY: baseRotateY,
        scale,
        opacity,
      }}
      transition={SLIDE_TRANSITION}
      style={{
        left: '50%',
        top: '50%',
        zIndex: 20 - abs,
        pointerEvents,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className={`our-products-card__inner${isActive ? ' our-products-card__inner--active' : ''}${showHoverFx ? ' our-products-card__inner--content-hover' : ''}`}
        style={{
          rotateX: isActive && !hovered ? rotateX : 0,
          rotateY: isActive && !hovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={onMove}
        onMouseEnter={() => isActive && setHovered(true)}
        onMouseLeave={onLeave}
      >
        {isActive ? <span className="our-products-card__ring" aria-hidden /> : null}
        <div className="our-products-card__content">
          <div className="our-products-card__media">
            <span className="our-products-card__media-glow" aria-hidden />
            <motion.div
              className="our-products-card__image-wrap"
              animate={{
                scale: showHoverFx ? 1.24 : 1,
              }}
              transition={productTransition}
            >
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
                draggable={false}
                className={`our-products-card__image${showHoverFx ? ' our-products-card__image--lifted' : ''}`}
              />
            </motion.div>
          </div>
          <div className="our-products-card__body">
            <span className="our-products-card__body-rule" aria-hidden />
            <p className="our-products-card__label">Ingredients</p>
            <motion.h3
              className="our-products-card__name"
              animate={{
                scale: showHoverFx ? 1.02 : 1,
              }}
              transition={hoverTransition}
              style={{ transformOrigin: 'left center' }}
            >
              {product.name}
            </motion.h3>
            <motion.p
              className="our-products-card__ingredients"
              animate={{
                opacity: showHoverFx ? 0.72 : 1,
              }}
              transition={hoverTransition}
            >
              {product.ingredients}
            </motion.p>
            <motion.div
              className="our-products-card__explore-wrap"
              initial={false}
              animate={{
                opacity: showHoverFx ? 1 : 0,
                maxHeight: showHoverFx ? 52 : 0,
                marginTop: showHoverFx ? 8 : 0,
                pointerEvents: showHoverFx ? 'auto' : 'none',
              }}
              transition={hoverTransition}
            >
              <button
                type="button"
                className="our-products-card__explore-btn"
                onClick={openProduct}
              >
                Explore More
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
}

export default function OurProductsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)
  const didDragRef = useRef(false)
  const sectionRef = useRef<HTMLElement>(null)
  const resumeTimerRef = useRef<number | null>(null)
  const slideGap = useSlideGap()

  const goNext = useCallback(() => {
    setActiveIndex((prev) => wrapIndex(prev + 1))
  }, [])

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => wrapIndex(prev - 1))
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (paused || reduceMotion || !inView) return
    const timer = window.setInterval(goNext, AUTO_MS)
    return () => window.clearInterval(timer)
  }, [paused, reduceMotion, inView, goNext])

  const pauseAuto = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }
    setPaused(true)
  }, [])

  const scheduleResumeAuto = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current)
    }
    resumeTimerRef.current = window.setTimeout(() => {
      setPaused(false)
      resumeTimerRef.current = null
    }, 400)
  }, [])

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current)
      }
    }
  }, [])

  const onDragStart = () => {
    didDragRef.current = false
  }

  const onDrag = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 8) didDragRef.current = true
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const delta = info.offset.x + info.velocity.x * 0.12
    if (delta < -80) goNext()
    else if (delta > 80) goPrev()
  }

  const openShop = () => {
    if (didDragRef.current) return
    navigateApp(APP_ROUTES.shop)
  }

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative w-full overflow-x-clip pt-7 sm:pt-14 lg:pt-20"
      style={{ backgroundColor: HOME_SECTION_A }}
      aria-label="Our products"
    >
      <div className="mx-auto max-w-[1760px] px-4 pb-7 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
        <header className="mb-4 text-center sm:mb-8 md:mb-10">
          <h2
            className="m-0 uppercase"
            style={{
              color: BRAND_INK,
              fontFamily: BRAND_DISPLAY,
              fontSize: 'clamp(1.5rem, 3.8vw, 2.65rem)',
              fontWeight: 400,
              letterSpacing: '0.06em',
              lineHeight: 1.05,
            }}
          >
            Our Products
          </h2>
          <p
            className="mx-auto mt-3 max-w-xl text-[0.88rem] leading-relaxed sm:text-[0.94rem]"
            style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
          >
            Signature mukhwas blends — crafted for freshness, tradition, and everyday delight.
          </p>
        </header>

        <div
          className="our-products-carousel-shell relative w-full"
          onMouseEnter={pauseAuto}
          onMouseLeave={scheduleResumeAuto}
          onFocusCapture={pauseAuto}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              scheduleResumeAuto()
            }
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="our-products-arrow our-products-arrow--left"
            aria-label="Previous product"
          >
            <ChevronLeft size={22} strokeWidth={2.2} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="our-products-arrow our-products-arrow--right"
            aria-label="Next product"
          >
            <ChevronRight size={22} strokeWidth={2.2} />
          </button>

          <div className="our-products-carousel relative mx-auto">
            <motion.div
              className="our-products-stage cursor-pointer select-none"
              onClick={openShop}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.08}
              onDragStart={onDragStart}
              onDrag={onDrag}
              onDragEnd={onDragEnd}
              aria-label="Browse products in shop"
            >
              {CAROUSEL_PRODUCTS.map((product, index) => (
                <CarouselCard
                  key={product.id}
                  product={product}
                  offset={shortestOffset(index, activeIndex)}
                  isActive={index === activeIndex}
                  slideGap={slideGap}
                />
              ))}
            </motion.div>
          </div>
        </div>

        <div className="mt-4 flex justify-center sm:mt-8 md:mt-10">
          <a
            href="/shop"
            onClick={(e) => {
              e.preventDefault()
              navigateApp(APP_ROUTES.shop)
            }}
            className="cursor-pointer rounded-full border px-6 py-2.5 text-[0.72rem] font-semibold tracking-[0.14em] uppercase no-underline transition-colors hover:bg-[#0a2e22] hover:text-white sm:px-7 sm:text-[0.78rem]"
            style={{
              fontFamily: BRAND_SANS,
              color: BRAND_INK,
              borderColor: 'rgba(10,46,34,0.28)',
              backgroundColor: 'transparent',
            }}
          >
            See more
          </a>
        </div>
      </div>
      <div className="products-scallop" aria-hidden />
    </section>
  )
}
