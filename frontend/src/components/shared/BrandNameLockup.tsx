import { BRAND_GOLD_GRADIENT, BRAND_GOLD_GRADIENT_BRIGHT, BRAND_SERIF } from '../../lib/brand'

type BrandNameLockupProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  wrap?: boolean
  /** Two-line: Tasneem / Mukhwas */
  layout?: 'single' | 'stacked'
  /** Stacked sizing preset */
  stackedPreset?: 'hero' | 'nav'
  /** Brighter gold on dark backgrounds (hero navbar overlay) */
  tone?: 'default' | 'bright'
}

const SIZE = {
  xs: { fontSize: '0.72rem', tracking: '0.05em' },
  sm: { fontSize: '1.02rem', tracking: '0.07em' },
  md: { fontSize: '1.28rem', tracking: '0.08em' },
  lg: { fontSize: '1.88rem', tracking: '0.09em' },
  xl: { fontSize: '2.15rem', tracking: '0.1em' },
} as const

const STACKED = {
  hero: { top: '2.2rem', bottom: '1.08rem', topTrack: '0.1em', bottomTrack: '0.14em', gap: '0.4rem' },
  nav: { top: '1.02rem', bottom: '0.58rem', topTrack: '0.08em', bottomTrack: '0.12em', gap: '0.125rem' },
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

const goldTextStyleBright = {
  backgroundImage: BRAND_GOLD_GRADIENT_BRIGHT,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextStroke: '0.45px rgba(255, 228, 150, 0.55)',
  paintOrder: 'stroke fill',
  filter:
    'drop-shadow(0 0 14px rgba(255, 210, 90, 0.42)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.28)) drop-shadow(0 1px 0 rgba(255, 235, 180, 0.35))',
} as const

/** Gold serif brand — single line or stacked Tasneem / Mukhwas */
export default function BrandNameLockup({
  size = 'md',
  className = '',
  wrap = false,
  layout = 'single',
  stackedPreset = 'hero',
  tone = 'default',
}: BrandNameLockupProps) {
  const s = SIZE[size]
  const stack = STACKED[stackedPreset]
  const textStyle = tone === 'bright' ? goldTextStyleBright : goldTextStyle

  if (layout === 'stacked') {
    return (
      <span className={`inline-flex flex-col items-center leading-none ${className}`}>
        <span
          className="font-bold"
          style={{
            fontFamily: BRAND_SERIF,
            fontSize: stack.top,
            letterSpacing: stack.topTrack,
            ...textStyle,
          }}
        >
          Tasneem
        </span>
        <span
          className="font-bold"
          style={{
            fontFamily: BRAND_SERIF,
            fontSize: stack.bottom,
            letterSpacing: stack.bottomTrack,
            marginTop: stack.gap,
            ...textStyle,
            opacity: tone === 'bright' ? 1 : 0.92,
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
        ...textStyle,
      }}
    >
      Tasneem Mukhwas
    </span>
  )
}
