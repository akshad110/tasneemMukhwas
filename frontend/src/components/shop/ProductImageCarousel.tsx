import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { PRODUCT_CARD_PANEL_BG } from '../../lib/shopCatalog'

const CROSSFADE_EASE = [0.4, 0, 0.2, 1] as const
const SLIDE_MS = 4200

type ProductImageCarouselProps = {
  images: string[]
  alt: string
  panelBg?: string
  className?: string
  imageClassName?: string
  autoPlay?: boolean
  dimmed?: boolean
  hovered?: boolean
  /** Shop cards: first image contained on cream; gallery slides fill edge-to-edge. */
  variant?: 'default' | 'shop-card'
}

function slideImageClass(index: number, variant: 'default' | 'shop-card', imageClassName?: string) {
  if (imageClassName) return `absolute inset-0 z-[1] ${imageClassName}`

  if (variant === 'shop-card' && index > 0) {
    return 'absolute inset-0 z-[1] h-full w-full object-cover object-center'
  }

  if (variant === 'shop-card') {
    return 'absolute inset-0 z-[1] h-full w-full object-contain object-center px-1.5 py-1'
  }

  return 'absolute inset-0 z-[1] h-full w-full object-contain object-center px-1.5 pt-1'
}

export default function ProductImageCarousel({
  images,
  alt,
  panelBg = PRODUCT_CARD_PANEL_BG,
  className = '',
  imageClassName,
  autoPlay = true,
  dimmed = false,
  hovered = false,
  variant = 'default',
}: ProductImageCarouselProps) {
  const slides = images.filter(Boolean)
  const [index, setIndex] = useState(0)
  const isShopCard = variant === 'shop-card'
  const isPrimarySlide = index === 0

  useEffect(() => {
    setIndex(0)
  }, [slides.join('|')])

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, SLIDE_MS)
    return () => window.clearInterval(timer)
  }, [autoPlay, slides.length])

  if (!slides.length) {
    return (
      <div
        className={`absolute inset-0 animate-pulse ${className}`}
        style={{ backgroundColor: panelBg }}
        aria-hidden
      />
    )
  }

  const active = slides[Math.min(index, slides.length - 1)]
  const hasDots = slides.length > 1
  const hoverScale = hovered && !dimmed && isPrimarySlide ? 1.06 : hovered && !dimmed ? 1.02 : 1

  return (
    <div
      className={`absolute inset-0 z-[1] overflow-hidden ${isShopCard ? 'flex flex-col' : ''} ${className}`}
      style={{ backgroundColor: panelBg }}
    >
      <div
        className={`overflow-hidden ${isShopCard ? 'relative min-h-0 flex-1' : 'absolute inset-0'}`}
        style={{
          transform: `scale(${hoverScale})`,
          transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={active}
            src={active}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={slideImageClass(index, variant, imageClassName)}
            draggable={false}
            initial={{ opacity: 0, scale: isPrimarySlide ? 0.985 : 1 }}
            animate={{
              opacity: dimmed ? 0.45 : 1,
              scale: 1,
            }}
            exit={{ opacity: 0, scale: isPrimarySlide ? 1.015 : 1 }}
            transition={{ duration: 0.58, ease: CROSSFADE_EASE }}
          />
        </AnimatePresence>
      </div>

      {hasDots ? (
        <div className="product-image-carousel__dots flex shrink-0 items-center justify-center gap-1.5 px-2 py-1.5" aria-hidden>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIndex(i)
              }}
              className="h-1.5 cursor-pointer rounded-full border-0 p-0 transition-all duration-300 touch-manipulation"
              style={{
                width: i === index ? '1.15rem' : '0.38rem',
                backgroundColor: i === index ? 'rgba(184,134,11,0.95)' : 'rgba(10,46,34,0.2)',
              }}
              aria-label={`Show image ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
