import { motion } from 'framer-motion'
import { BRAND_GOLD, BRAND_INK, BRAND_MUTED } from '../../lib/brand'
import type { PackType } from '../../lib/shopCatalog'

type ProductPackToggleProps = {
  value: PackType
  onChange: (pack: PackType) => void
  packetEnabled?: boolean
  bottleEnabled?: boolean
  compact?: boolean
}

export default function ProductPackToggle({
  value,
  onChange,
  packetEnabled = true,
  bottleEnabled = false,
  compact = false,
}: ProductPackToggleProps) {
  const showToggle = packetEnabled && bottleEnabled
  if (!showToggle) return null

  const isPacket = value === 'packet'

  return (
    <div
      className={`relative flex items-center justify-center ${compact ? 'mb-2 px-1' : 'mb-3 px-2'}`}
      data-card-action
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
        style={{
          background:
            'linear-gradient(90deg, transparent 4%, rgba(184,134,11,0.28) 18%, rgba(184,134,11,0.55) 50%, rgba(184,134,11,0.28) 82%, transparent 96%)',
        }}
        aria-hidden
      />

      <div
        className="relative z-[1] w-full max-w-[13.5rem] rounded-full border p-[3px] shadow-[inset_0_1px_2px_rgba(10,46,34,0.06)] min-[480px]:max-w-[14.5rem]"
        style={{
          borderColor: 'rgba(184,134,11,0.38)',
          background: 'linear-gradient(180deg, #FFFEF2 0%, #F8F3E7 100%)',
        }}
        role="tablist"
        aria-label="Pack type"
      >
        <div className="relative grid grid-cols-2">
          <motion.span
            layout
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="absolute inset-y-0 rounded-full"
            style={{
              width: '50%',
              left: isPacket ? '0%' : '50%',
              background: 'linear-gradient(180deg, #e8c97a 0%, #d4b56a 42%, #b8860b 100%)',
              boxShadow: '0 2px 8px rgba(184,134,11,0.35), inset 0 1px 0 rgba(255,255,255,0.45)',
            }}
            aria-hidden
          />

          <button
            type="button"
            role="tab"
            aria-selected={isPacket}
            onClick={() => onChange('packet')}
            className="relative z-[1] cursor-pointer rounded-full border-0 px-2 py-1 text-[0.42rem] font-bold tracking-[0.1em] uppercase transition min-[480px]:px-2.5 min-[480px]:py-1.5 min-[480px]:text-[0.46rem] touch-manipulation"
            style={{
              color: isPacket ? BRAND_INK : BRAND_MUTED,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Packet
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isPacket}
            onClick={() => onChange('bottle')}
            className="relative z-[1] cursor-pointer rounded-full border-0 px-2 py-1 text-[0.42rem] font-bold tracking-[0.1em] uppercase transition min-[480px]:px-2.5 min-[480px]:py-1.5 min-[480px]:text-[0.46rem] touch-manipulation"
            style={{
              color: !isPacket ? BRAND_INK : BRAND_MUTED,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Bottle
          </button>
        </div>
      </div>

      <span
        className="pointer-events-none absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[0.38rem] font-semibold tracking-[0.14em] uppercase opacity-0 min-[480px]:opacity-100"
        style={{ color: BRAND_GOLD }}
        aria-hidden
      >
        {isPacket ? 'Packet view' : 'Bottle view'}
      </span>
    </div>
  )
}
