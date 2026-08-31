import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { PRODUCT_CARD_PANEL_BG } from '../../lib/shopCatalog'

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const
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

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ backgroundColor: panelBg }}>
      <AnimatePresence initial={false}>
        <motion.img
          key={active}
          src={active}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 z-[1] ${imageClassName}`}
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{
            opacity: dimmed ? 0.45 : 1,
            scale: hovered && !dimmed ? 1.05 : 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: REVEAL_EASE }}
        />
      </AnimatePresence>

      {slides.length > 1 ? (
        <div
          className="absolute inset-x-0 bottom-1.5 z-[2] flex justify-center gap-1"
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
              className="h-1.5 cursor-pointer rounded-full border-0 p-0 transition-all touch-manipulation"
              style={{
                width: i === index ? '1.1rem' : '0.35rem',
                backgroundColor: i === index ? 'rgba(184,134,11,0.95)' : 'rgba(10,46,34,0.18)',
              }}
              aria-label={`Show image ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
