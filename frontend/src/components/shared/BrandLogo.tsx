import { BRAND_LOGO_SRC } from '../../lib/brand'

type BrandLogoProps = {
  className?: string
  alt?: string
}

/** Official Tasneem Mukhwas badge logo. */
export default function BrandLogo({ className = 'h-full w-full object-contain', alt = '' }: BrandLogoProps) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt={alt}
      className={className}
      draggable={false}
      decoding="async"
    />
  )
}
