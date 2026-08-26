import ScrollZoomReveal from '../framer/ScrollZoomReveal.js'
import LayoutIsland from '../../utils/LayoutIsland'
import { BRAND_CREAM, BRAND_CREAM_LIGHT, BRAND_INK } from '../../lib/brand'

const ABOUT_VIDEO_SRC = '/videos/about-brand.mp4'

/**
 * About Us — scroll-zoom opens into the brand story video panel.
 * Page scroll (Lenis) scrubs zoom + video area — no nested overflow scroller.
 */
export default function AboutZoom() {
  return (
    <section
      id="about"
      className="relative w-full overflow-x-clip overflow-y-visible"
      style={{ backgroundColor: BRAND_CREAM_LIGHT }}
      aria-label="About us"
    >
      <div className="relative z-10">
        <LayoutIsland>
          <ScrollZoomReveal
            videoUrl={ABOUT_VIDEO_SRC}
            autoPlay={false}
            loop={false}
            leftText="About"
            rightText="Us"
            buttonText=""
            buttonLink="#about"
            textColor={BRAND_INK}
            buttonTextColor={BRAND_INK}
            buttonBgColor={BRAND_CREAM}
            iconType="none"
            animationStiffness={260}
            animationDamping={28}
            animationMass={0.28}
            leftFont={{
              fontFamily: 'Anton, Impact, sans-serif',
              fontWeight: 400,
              letterSpacing: '0.02em',
            }}
            rightFont={{
              fontFamily: 'Anton, Impact, sans-serif',
              fontWeight: 400,
              letterSpacing: '0.02em',
            }}
            buttonFont={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
            style={{ width: '100%', backgroundColor: BRAND_CREAM_LIGHT }}
          />
        </LayoutIsland>
      </div>
    </section>
  )
}
