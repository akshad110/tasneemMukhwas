import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { PRODUCT_CARD_PANEL_BG, PRODUCT_MAX_GALLERY_IMAGES } from '../../lib/shopCatalog'

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const
const GOLD = '#b8860b'

type ProductDetailGalleryProps = {
  images: string[]
  alt: string
  panelBg?: string
  loading?: boolean
  dimmed?: boolean
}

export default function ProductDetailGallery({
  images,
  alt,
  panelBg = PRODUCT_CARD_PANEL_BG,
  loading = false,
  dimmed = false,
}: ProductDetailGalleryProps) {
  const slides = images.filter(Boolean).slice(0, PRODUCT_MAX_GALLERY_IMAGES)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [slides.join('|')])

  useEffect(() => {
    if (index >= slides.length) {
      setIndex(Math.max(0, slides.length - 1))
    }
  }, [index, slides.length])

  const active = slides[Math.min(index, Math.max(0, slides.length - 1))]

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div
        className="relative min-h-[180px] flex-1 overflow-hidden rounded-2xl border sm:min-h-[220px]"
        style={{
          backgroundColor: panelBg,
          borderColor: 'rgba(184,134,11,0.22)',
          maxHeight: 'min(42vh, 340px)',
        }}
      >
        {loading && !slides.length ? (
          <div
            className="absolute inset-0 animate-pulse"
            style={{ backgroundColor: panelBg }}
            aria-label="Loading product image"
          />
        ) : active ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={active}
              src={active}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain object-center p-2.5 sm:p-3"
              draggable={false}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: dimmed ? 0.5 : 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.32, ease: REVEAL_EASE }}
            />
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: panelBg }} aria-hidden />
        )}
      </div>

      {slides.length > 1 ? (
        <div
          className="flex shrink-0 items-center justify-center gap-1.5 pb-0.5"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {slides.map((src, i) => {
            const selected = i === index
            return (
              <button
                key={`${src}-${i}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`View image ${i + 1}`}
                onClick={() => setIndex(i)}
                className="h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-md border p-0 transition hover:opacity-95 sm:h-11 sm:w-11 touch-manipulation"
                style={{
                  borderColor: selected ? GOLD : 'rgba(184,134,11,0.24)',
                  backgroundColor: panelBg,
                  boxShadow: selected ? '0 2px 8px -4px rgba(184,134,11,0.5)' : 'none',
                }}
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-contain object-center p-0.5"
                  draggable={false}
                />
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
