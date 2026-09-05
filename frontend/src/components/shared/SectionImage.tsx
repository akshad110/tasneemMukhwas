import type { ImgHTMLAttributes } from 'react'

type SectionImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string
}

/** Section photo with smooth expand-on-hover — not for shop product tiles. */
export default function SectionImage({
  wrapperClassName = '',
  className = '',
  ...props
}: SectionImageProps) {
  return (
    <div className={`section-image-hover ${wrapperClassName}`.trim()}>
      <img {...props} className={`section-image-hover__img ${className}`.trim()} />
    </div>
  )
}
