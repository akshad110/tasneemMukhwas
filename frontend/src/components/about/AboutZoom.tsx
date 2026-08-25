import ScrollZoomReveal from '../framer/ScrollZoomReveal.js'
import LayoutIsland from '../../utils/LayoutIsland'
import AboutStoryInside from './AboutStoryInside'
import { BRAND_CREAM, BRAND_CREAM_LIGHT, BRAND_INK } from '../../lib/brand'

const ABOUT_STORY_BG = encodeURI('/Mukhwas_ingredients_arranged_on_…_202608182142.jpeg')

/**
 * About Us — scroll-zoom hero opens into the full story panel (AboutStoryInside).
 * Page scroll (Lenis) scrubs zoom + story — no nested overflow scroller.
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
            videoUrl=""
            image={{
              src: ABOUT_STORY_BG,
              alt: 'Mukhwas ingredients arranged on a bright surface',
            }}
            leftText="About"
            rightText="Us"
            buttonText=""
            buttonLink="#about-story"
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
          >
            <AboutStoryInside />
          </ScrollZoomReveal>
        </LayoutIsland>
      </div>
    </section>
  )
}
