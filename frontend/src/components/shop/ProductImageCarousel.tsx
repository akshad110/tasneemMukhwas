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
  index?: number
  onIndexChange?: (index: number) => void
  /** Shop cards: first image contained on cream; gallery slides fill edge-to-edge. */
  variant?: 'default' | 'shop-card'
}

function slideImageClass(index: number, variant: 'default' | 'shop-card', imageClassName?: string) {
  if (imageClassName) return `absolute inset-0 z-[1] ${imageClassName}`

  if (variant === 'shop-card' && index > 0) {
    return 'absolute inset-0 z-[1] h-full w-full object-cover object-top'
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
  index: controlledIndex,
  onIndexChange,
  variant = 'default',
}: ProductImageCarouselProps) {
  const slides = images.filter(Boolean)
  const [internalIndex, setInternalIndex] = useState(0)
  const isControlled = controlledIndex !== undefined
  const index = isControlled ? controlledIndex : internalIndex
  const isPrimarySlide = index === 0

  const setIndex = (next: number | ((prev: number) => number)) => {
    const resolved = typeof next === 'function' ? next(index) : next
    if (!isControlled) setInternalIndex(resolved)
    onIndexChange?.(resolved)
  }

  useEffect(() => {
    setIndex(0)
  }, [slides.join('|')])

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, SLIDE_MS)
    return () => window.clearInterval(timer)
  }, [autoPlay, slides.length, index, isControlled])

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
  const hoverScale = hovered && !dimmed && isPrimarySlide ? 1.06 : hovered && !dimmed ? 1.02 : 1

  return (
    <div
      className={`absolute inset-0 z-[1] overflow-hidden ${className}`}
      style={{ backgroundColor: panelBg }}
    >
      <div
        className="absolute inset-0 overflow-hidden"
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
    </div>
  )
}
