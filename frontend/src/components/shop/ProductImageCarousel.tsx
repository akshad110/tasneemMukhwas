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
}

export default function ProductImageCarousel({
  images,
  alt,
  panelBg = PRODUCT_CARD_PANEL_BG,
  className = '',
  imageClassName = 'h-full w-full object-contain object-center px-1.5 pt-1',
  autoPlay = true,
  dimmed = false,
  hovered = false,
}: ProductImageCarouselProps) {
  const slides = images.filter(Boolean)
  const [index, setIndex] = useState(0)

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

  return (
    <div
      className={`absolute inset-0 flex flex-col overflow-hidden ${className}`}
      style={{ backgroundColor: panelBg }}
    >
      <div
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{
          transform: hovered && !dimmed ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={active}
            src={active}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 z-[1] ${imageClassName}`}
            draggable={false}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{
              opacity: dimmed ? 0.45 : 1,
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 1.015 }}
            transition={{ duration: 0.58, ease: CROSSFADE_EASE }}
          />
        </AnimatePresence>
      </div>

      {hasDots ? (
        <div
          className="product-image-carousel__dots flex shrink-0 items-center justify-center gap-1.5 px-2 py-1.5"
          aria-hidden
        >
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
