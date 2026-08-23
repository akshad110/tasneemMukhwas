import ScrollZoomReveal from '../framer/ScrollZoomReveal.js'
import LayoutIsland from '../../utils/LayoutIsland'
import AboutStoryInside from './AboutStoryInside'

const WHITE = '#ffffff'
const BLACK = '#000000'
const ABOUT_STORY_BG = encodeURI('/Mukhwas_ingredients_arranged_on_…_202608182142.jpeg')

/**
 * About Us — story content lives INSIDE the scroll-zoom white panel.
 * Page scroll (Lenis) scrubs the story — no nested overflow scroller.
 */
export default function AboutZoom() {
  return (
    <section
      className="relative w-full overflow-x-clip overflow-y-visible bg-white"
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
            leftText=""
            rightText=""
            buttonText=""
            buttonLink="#about-story"
            textColor={BLACK}
            buttonTextColor={BLACK}
            buttonBgColor={WHITE}
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
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
            style={{ width: '100%', backgroundColor: 'transparent' }}
          >
            <AboutStoryInside />
          </ScrollZoomReveal>
        </LayoutIsland>
      </div>
    </section>
  )
}
