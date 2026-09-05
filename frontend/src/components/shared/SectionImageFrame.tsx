import {
  BRAND_CREAM_DEEP,
  BRAND_CREAM_LIGHT,
} from '../../lib/brand'

type SectionImageFrameProps = {
  src: string
  alt: string
  /** Framed card (default) or compact inset for split panels */
  variant?: 'framed' | 'inset'
  imgClassName?: string
  objectFit?: 'cover' | 'contain'
  aspectClass?: string
}

export default function SectionImageFrame({
  src,
  alt,
  variant = 'framed',
  imgClassName = '',
  objectFit = 'cover',
  aspectClass = 'aspect-[4/3] sm:aspect-[5/4]',
}: SectionImageFrameProps) {
  if (variant === 'inset') {
    return (
      <div className="section-image-hover section-image-hover--inset">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={`section-image-hover__img ${imgClassName}`.trim()}
          style={{ objectFit }}
        />
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden rounded-[1.35rem] border p-2 shadow-[0_28px_60px_-32px_rgba(10,46,34,0.35)] sm:p-3"
      style={{
        borderColor: 'rgba(184,134,11,0.38)',
        backgroundColor: BRAND_CREAM_LIGHT,
      }}
    >
      <div
        className="absolute -right-3 -top-3 h-14 w-14 rounded-full border-2 sm:h-16 sm:w-16"
        style={{ borderColor: 'rgba(184,134,11,0.45)', backgroundColor: 'rgba(184,134,11,0.12)' }}
        aria-hidden
      />
      <div
        className="absolute -bottom-3 -left-3 h-10 w-10 rotate-45 sm:h-12 sm:w-12"
        style={{ backgroundColor: BRAND_CREAM_DEEP, border: '1px solid rgba(184,134,11,0.25)' }}
        aria-hidden
      />
      <div className={`section-image-hover relative z-[1] overflow-hidden rounded-[1rem] ${aspectClass}`}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={`section-image-hover__img h-full w-full ${imgClassName}`.trim()}
          style={{ objectFit }}
        />
      </div>
    </div>
  )
}
