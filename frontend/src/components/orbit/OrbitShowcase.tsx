import OrbitProject from '../framer/OrbitProject.js'
import LayoutIsland from '../../utils/LayoutIsland'
import { ORBIT_ITEMS, SECTION_TEXTURE } from '../../lib/products'

const CREAM = '#f2f4f5'
const SECTION_FALLBACK = '#0a2e22'

/**
 * Scroll-driven Orbit Projects gallery — sits below the hero.
 * Desktop: sticky 3D orbit → grid flatten. Compact: static responsive grid.
 */
export default function OrbitShowcase() {
  return (
    <section
      className="relative w-full overflow-x-clip"
      style={{ backgroundColor: SECTION_FALLBACK }}
      aria-label="Our signature range"
    >
      {/* Sticky patterned plate — soft green wash keeps cream type readable */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="sticky top-0 h-svh w-full overflow-hidden bg-[#0a2e22]">
          <img
            src={SECTION_TEXTURE}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: 0.12 }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(rgba(10,46,34,0.1), rgba(10,46,34,0.16)), radial-gradient(ellipse 55% 50% at 50% 58%, rgba(8,16,12,0.03) 0%, rgba(6,12,10,0.1) 55%, rgba(4,10,8,0.18) 100%)',
            }}
          />
        </div>
      </div>

      <div className="relative z-10">
        <LayoutIsland>
          <OrbitProject
            items={ORBIT_ITEMS}
            background="transparent"
            style={{ width: '100%', backgroundColor: 'transparent' }}
            content={{
            showCopy: true,
            textColor: CREAM,
            compactTextColor: CREAM,
            leftTitle: 'Our',
            rightTitle: 'Range',
            titleCenterGap: 120,
            centerText:
              'Signature mukhwas blends — crafted for freshness, tradition, and everyday delight.',
            centerTextWidth: 200,
            compactTextGap: 24,
            desktopTitleFont: {
              fontFamily: 'Kavoon, serif',
              fontSize: 110,
              fontWeight: 400,
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              textAlign: 'left',
            },
            compactTitleFont: {
              fontFamily: 'Kavoon, serif',
              fontSize: 48,
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textAlign: 'left',
            },
            desktopCenterFont: {
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              fontWeight: 500,
              lineHeight: 1.35,
              letterSpacing: '-0.02em',
              textAlign: 'center',
            },
            tabletCenterFont: {
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.4,
              letterSpacing: '-0.02em',
              textAlign: 'left',
            },
            mobileCenterFont: {
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.4,
              letterSpacing: '-0.02em',
              textAlign: 'left',
            },
          }}
          cards={{
            background: 'transparent',
            radius: 0,
            aspect: 0.78,
            imageFit: 'contain',
            depthOpacity: 28,
            depthScale: 78,
            renderQuality: 1,
            labelColor: 'rgba(247, 241, 228, 0.55)',
            labelFont: {
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.2,
              letterSpacing: '0em',
              textAlign: 'center',
            },
          }}
          motion={{
            scrollLength: 250,
            startOffset: 45,
            smoothness: 34,
            perspective: 1200,
            curveWidth: 520,
            curveHeight: 180,
            depth: 420,
            rotation: 310,
            cardWidth: 340,
            offsetY: -24,
          }}
          grid={{
            columns: 3,
            gap: 28,
            maxWidth: 680,
            positionY: 58,
          }}
          responsive={{
            desktopBreakpoint: 1024,
            mobileBreakpoint: 640,
            tabletColumns: 2,
            mobileColumns: 1,
            tabletPadding: '80px 28px 96px',
            mobilePadding: '64px 20px 80px',
            gap: 16,
            headerGap: 40,
          }}
        />
        </LayoutIsland>
      </div>
    </section>
  )
}
