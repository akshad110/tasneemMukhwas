import { BRAND_GOLD_GRADIENT, BRAND_SERIF } from '../../lib/brand'

type BrandNameLockupProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  wrap?: boolean
  /** Two-line: Tasneem / Mukhwas */
  layout?: 'single' | 'stacked'
  /** Stacked sizing preset */
  stackedPreset?: 'hero' | 'nav'
}

const SIZE = {
  xs: { fontSize: '0.72rem', tracking: '0.05em' },
  sm: { fontSize: '1.02rem', tracking: '0.07em' },
  md: { fontSize: '1.28rem', tracking: '0.08em' },
  lg: { fontSize: '1.88rem', tracking: '0.09em' },
  xl: { fontSize: '2.15rem', tracking: '0.1em' },
} as const

const STACKED = {
  hero: { top: '1.55rem', bottom: '0.78rem', topTrack: '0.1em', bottomTrack: '0.14em' },
  nav: { top: '1.02rem', bottom: '0.58rem', topTrack: '0.08em', bottomTrack: '0.12em' },
} as const

const goldTextStyle = {
  backgroundImage: BRAND_GOLD_GRADIENT,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextStroke: '0.35px rgba(74, 58, 28, 0.45)',
  paintOrder: 'stroke fill',
  filter: 'drop-shadow(0 1px 0 rgba(92, 74, 40, 0.35))',
} as const

/** Gold serif brand — single line or stacked Tasneem / Mukhwas */
export default function BrandNameLockup({
  size = 'md',
  className = '',
  wrap = false,
  layout = 'single',
  stackedPreset = 'hero',
}: BrandNameLockupProps) {
  const s = SIZE[size]
  const stack = STACKED[stackedPreset]

  if (layout === 'stacked') {
    return (
      <span className={`inline-flex flex-col items-center leading-none ${className}`}>
        <span
          className="font-bold"
          style={{
            fontFamily: BRAND_SERIF,
            fontSize: stack.top,
            letterSpacing: stack.topTrack,
            ...goldTextStyle,
          }}
        >
          Tasneem
        </span>
        <span
          className="mt-0.5 font-bold"
          style={{
            fontFamily: BRAND_SERIF,
            fontSize: stack.bottom,
            letterSpacing: stack.bottomTrack,
            ...goldTextStyle,
            opacity: 0.92,
          }}
        >
          Mukhwas
        </span>
      </span>
    )
  }

  return (
    <span
      className={`inline-block font-bold uppercase leading-none ${wrap ? '' : 'whitespace-nowrap'} ${className}`}
      style={{
        fontFamily: BRAND_SERIF,
        fontSize: s.fontSize,
        letterSpacing: s.tracking,
        ...goldTextStyle,
      }}
    >
      Tasneem Mukhwas
    </span>
  )
}
