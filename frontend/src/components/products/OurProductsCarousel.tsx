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

const INK = '#0a2e22'
const MUTED = '#5a7268'
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

type CarouselCardProps = {
  product: (typeof CAROUSEL_PRODUCTS)[number]
  offset: number
  isActive: boolean
}

function CarouselCard({ product, offset, isActive }: CarouselCardProps) {
  const rotateX = useSpring(0, { stiffness: 220, damping: 24 })
  const rotateY = useSpring(0, { stiffness: 220, damping: 24 })
  const abs = Math.abs(offset)

  const onMove = (e: ReactMouseEvent<HTMLElement>) => {
    if (!isActive) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * 18)
    rotateX.set(-py * 14)
  }

  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  const baseRotateY = offset * -32
  const translateX = offset * 300
  const translateZ = -abs * 160
  const scale = isActive ? 1 : Math.max(0.78, 1 - abs * 0.1)
  const opacity = abs > 2 ? 0 : 1 - abs * 0.22
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
        className={`our-products-card__inner${isActive ? ' our-products-card__inner--active' : ''}`}
        style={{
          rotateX: isActive ? rotateX : 0,
          rotateY: isActive ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {isActive ? <span className="our-products-card__ring" aria-hidden /> : null}
        <div className="our-products-card__content">
          <div className="our-products-card__media">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="our-products-card__image"
            />
          </div>
          <div className="our-products-card__body">
            <p className="our-products-card__label">Ingredients</p>
            <h3 className="our-products-card__name">{product.name}</h3>
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
      className="relative w-full overflow-hidden bg-white px-4 py-12 md:px-8 md:py-16 lg:px-10"
      aria-label="Our products"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center md:mb-10">
          <h2
            className="m-0 uppercase"
            style={{
              color: INK,
              fontFamily: 'Anton, Impact, sans-serif',
              fontSize: 'clamp(1.5rem, 3.8vw, 2.65rem)',
              fontWeight: 400,
              letterSpacing: '0.06em',
              lineHeight: 1.05,
            }}
          >
            Our Products
          </h2>
          <p
            className="mx-auto mt-3 max-w-xl text-sm md:text-base"
            style={{ color: MUTED, fontFamily: 'Inter, sans-serif' }}
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
              />
            ))}
          </motion.div>
        </div>

        <div className="mt-8 flex justify-center md:mt-10">
          <a
            href="/shop"
            onClick={(e) => {
              e.preventDefault()
              navigateApp(APP_ROUTES.shop)
            }}
            className="cursor-pointer rounded-full border px-7 py-2.5 text-[0.78rem] font-semibold tracking-[0.14em] uppercase no-underline transition-colors hover:bg-[#0a2e22] hover:text-white"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: INK,
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
