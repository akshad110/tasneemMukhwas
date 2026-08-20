import { memo } from 'react'
import { CONTACT_COORDINATES } from '../../lib/contact'
import OrbitDotGlobe from '../framer/OrbitDotGlobe.js'

const GOLD_SHINE = '#f5d76e'
const GLOBE_OCEAN = '#0a100e'
const GLOBE_LAND = '#e2c878'

const GLOBE_LOCATIONS = [
  {
    name: 'Chhapi',
    coordinates: CONTACT_COORDINATES,
    color: GOLD_SHINE,
    pulse: true,
    showLabel: true,
    action: 'none' as const,
  },
]

const ContactGlobe = memo(function ContactGlobe({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative mx-auto aspect-square w-full max-w-[min(100%,17.5rem)] overflow-hidden sm:max-w-[20rem] lg:max-w-none ${className}`}
      style={{ minHeight: 'clamp(13.5rem, 52vw, 17.5rem)' }}
    >
      <OrbitDotGlobe
        oceanColor={GLOBE_OCEAN}
        landColor={GLOBE_LAND}
        dotSize={1.9}
        dotDensity={3}
        autoRotate
        labelStyle="auto"
        showQuickStart={false}
        locations={GLOBE_LOCATIONS}
        style={{ width: '100%', height: '100%', touchAction: 'pan-y', overflow: 'hidden' }}
      />
    </div>
  )
})

export default ContactGlobe
