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
  layout?: 'card' | 'page'
}

function ThumbnailButton({
  src,
  index,
  selected,
  panelBg,
  onSelect,
  className,
}: {
  src: string
  index: number
  selected: boolean
  panelBg: string
  onSelect: () => void
  className: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      aria-label={`View image ${index + 1}`}
      onClick={onSelect}
      className={`cursor-pointer overflow-hidden rounded-lg border p-0 transition hover:opacity-95 touch-manipulation ${className}`}
      style={{
        borderColor: selected ? GOLD : 'rgba(184,134,11,0.22)',
        backgroundColor: '#fffef2',
        boxShadow: selected ? '0 2px 8px -4px rgba(184,134,11,0.45)' : 'none',
      }}
    >
      <img
        src={src}
        alt=""
        className="h-full w-full object-contain object-center p-1"
        draggable={false}
      />
    </button>
  )
}

export default function ProductDetailGallery({
  images,
  alt,
  panelBg = PRODUCT_CARD_PANEL_BG,
  loading = false,
  dimmed = false,
  layout = 'card',
}: ProductDetailGalleryProps) {
  const isPage = layout === 'page'
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

  const mainImage = (
    <div
      className={`product-detail-gallery__main relative w-full overflow-hidden ${
        isPage
          ? 'aspect-[4/5] max-h-[min(68vh,560px)] min-h-[280px] w-full'
          : 'min-h-[180px] flex-1 rounded-2xl border sm:min-h-[220px]'
      }`}
      style={{
        backgroundColor: isPage ? 'transparent' : panelBg,
        borderColor: isPage ? undefined : 'rgba(184,134,11,0.22)',
        maxHeight: isPage ? undefined : 'min(42vh, 340px)',
      }}
    >
      {loading && !slides.length ? (
        <div
          className="absolute inset-0 animate-pulse rounded-lg"
          style={{ backgroundColor: 'rgba(184,134,11,0.06)' }}
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
            className={`absolute inset-0 h-full w-full object-contain object-center ${
              isPage ? 'p-1 sm:p-2' : 'p-2.5 sm:p-3'
            }`}
            draggable={false}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: dimmed ? 0.5 : 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.32, ease: REVEAL_EASE }}
          />
        </AnimatePresence>
      ) : (
        <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: 'rgba(184,134,11,0.06)' }} aria-hidden />
      )}
    </div>
  )

  if (isPage) {
    return (
      <div className="product-detail-gallery product-detail-gallery--page flex w-full flex-col items-stretch gap-4 lg:gap-5">
        {mainImage}
        {slides.length > 1 ? (
          <div
            className="product-detail-gallery__thumbs flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:justify-start"
            role="tablist"
            aria-label="Product image thumbnails"
          >
            {slides.map((src, i) => (
              <ThumbnailButton
                key={`${src}-${i}`}
                src={src}
                index={i}
                selected={i === index}
                panelBg={panelBg}
                onSelect={() => setIndex(i)}
                className="h-[4.25rem] w-[4.25rem] shrink-0 sm:h-[4.75rem] sm:w-[4.75rem]"
              />
            ))}
          </div>
        ) : null}
      </div>
    )
  }

  const thumbs = slides.length > 1 && (
    <div
      className="flex shrink-0 items-center justify-center gap-1.5 pb-0.5"
      role="tablist"
      aria-label="Product image thumbnails"
    >
      {slides.map((src, i) => (
        <ThumbnailButton
          key={`${src}-${i}`}
          src={src}
          index={i}
          selected={i === index}
          panelBg={panelBg}
          onSelect={() => setIndex(i)}
          className="h-10 w-10 shrink-0 sm:h-11 sm:w-11"
        />
      ))}
    </div>
  )

  return (
    <div className="product-detail-gallery flex min-h-0 flex-1 flex-col gap-2">
      {mainImage}
      {thumbs}
    </div>
  )
}
