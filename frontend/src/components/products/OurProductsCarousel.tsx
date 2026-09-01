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
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import {
  BRAND_CREAM,
  BRAND_DISPLAY,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
} from '../../lib/brand'

const TOTAL = CAROUSEL_PRODUCTS.length
const AUTO_MS = 4500

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
      if (w < 400) setGap(168)
      else if (w < 640) setGap(200)
      else if (w < 768) setGap(240)
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

function CarouselCard({ product, offset, isActive, slideGap }: CarouselCardProps) {
  const [imageHovered, setImageHovered] = useState(false)
  const [titleHovered, setTitleHovered] = useState(false)
  const hoverActive = imageHovered || titleHovered
  const rotateX = useSpring(0, { stiffness: 180, damping: 26 })
  const rotateY = useSpring(0, { stiffness: 180, damping: 26 })
  const abs = Math.abs(offset)

  const hoverTransition = {
    type: 'tween' as const,
    duration: 0.75,
    ease: [0.22, 1, 0.36, 1] as const,
  }

  const onMove = (e: ReactMouseEvent<HTMLElement>) => {
    if (!isActive || hoverActive) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * 12)
    rotateX.set(-py * 10)
  }

  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    setImageHovered(false)
    setTitleHovered(false)
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
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      style={{
        left: '50%',
        top: '50%',
        zIndex: 20 - abs,
        pointerEvents,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className={`our-products-card__inner${isActive ? ' our-products-card__inner--active' : ''}${hoverActive ? ' our-products-card__inner--content-hover' : ''}`}
        style={{
          rotateX: isActive && !hoverActive ? rotateX : 0,
          rotateY: isActive && !hoverActive ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {isActive ? <span className="our-products-card__ring" aria-hidden /> : null}
        <div className="our-products-card__content">
          <div
            className="our-products-card__media"
            onMouseEnter={() => isActive && setImageHovered(true)}
            onMouseLeave={() => setImageHovered(false)}
          >
            <motion.img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="our-products-card__image"
              animate={{
                scale: isActive && imageHovered ? 1.26 : 1,
                y: isActive && imageHovered ? -6 : 0,
              }}
              transition={hoverTransition}
            />
          </div>
          <div className="our-products-card__body">
            <p className="our-products-card__label">Ingredients</p>
            <motion.h3
              className="our-products-card__name"
              onMouseEnter={() => isActive && setTitleHovered(true)}
              onMouseLeave={() => setTitleHovered(false)}
              animate={{
                scale: isActive && titleHovered ? 1.045 : 1,
              }}
              transition={hoverTransition}
              style={{ transformOrigin: 'left center' }}
            >
              {product.name}
            </motion.h3>
            <p className="our-products-card__ingredients">{product.ingredients}</p>
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
}

export default function OurProductsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const didDragRef = useRef(false)
  const slideGap = useSlideGap()

  const goNext = useCallback(() => {
    setActiveIndex((prev) => wrapIndex(prev + 1))
  }, [])

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => wrapIndex(prev - 1))
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(goNext, AUTO_MS)
    return () => window.clearInterval(timer)
  }, [paused, goNext])

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
      id="products"
      className="relative w-full overflow-hidden px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-20"
      style={{ backgroundColor: BRAND_CREAM }}
      aria-label="Our products"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-[1320px]">
        <header className="mb-6 text-center sm:mb-8 md:mb-10">
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

        <div className="our-products-carousel relative mx-auto">
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

          <motion.div
            role="button"
            tabIndex={0}
            className="our-products-stage cursor-pointer"
            onClick={openShop}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openShop()
              }
            }}
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

        <div className="mt-6 flex justify-center sm:mt-8 md:mt-10">
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
    </section>
  )
}
