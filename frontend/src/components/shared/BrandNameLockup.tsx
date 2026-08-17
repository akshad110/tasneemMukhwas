import { BRAND_GOLD_GRADIENT, BRAND_SERIF } from '../../lib/brand'

type BrandNameLockupProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const SIZE = {
  sm: { fontSize: '1.02rem', tracking: '0.07em' },
  md: { fontSize: '1.28rem', tracking: '0.08em' },
  lg: { fontSize: '1.88rem', tracking: '0.09em' },
  xl: { fontSize: '2.15rem', tracking: '0.1em' },
} as const

/** Single-line shiny gold serif — TASNEEM MUKHWAS (readable on cream backgrounds) */
export default function BrandNameLockup({ size = 'md', className = '' }: BrandNameLockupProps) {
  const s = SIZE[size]

  return (
    <span
      className={`inline-block whitespace-nowrap font-bold uppercase leading-none ${className}`}
      style={{
        fontFamily: BRAND_SERIF,
        fontSize: s.fontSize,
        letterSpacing: s.tracking,
        backgroundImage: BRAND_GOLD_GRADIENT,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        WebkitTextStroke: '0.35px rgba(74, 58, 28, 0.45)',
        paintOrder: 'stroke fill',
        filter: 'drop-shadow(0 1px 0 rgba(92, 74, 40, 0.35))',
      }}
    >
      Tasneem Mukhwas
    </span>
  )
}
