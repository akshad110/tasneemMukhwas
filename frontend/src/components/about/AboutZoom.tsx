import ScrollZoomReveal from '../framer/ScrollZoomReveal.js'
import LayoutIsland from '../../utils/LayoutIsland'
import AboutStoryInside from './AboutStoryInside'

const INK = '#0a2e22'
const WHITE = '#ffffff'
const BLACK = '#000000'
const ABOUT_TEXTURE = '/image.png_2K_202608092240.jpeg'

/** Transparent pixel — box fill comes from white CSS background */
const WHITE_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

/**
 * About Us — story content lives INSIDE the scroll-zoom white panel.
 * Page scroll (Lenis) scrubs the story — no nested overflow scroller.
 */
export default function AboutZoom() {
  return (
    <section
      className="relative w-full overflow-x-clip overflow-y-visible"
      style={{ backgroundColor: INK }}
      aria-label="About us"
    >
      {/* Sticky textured green plate + hero-style fade */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="sticky top-0 h-svh w-full overflow-hidden bg-[#0a2e22]">
          <img
            src={ABOUT_TEXTURE}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover brightness-[0.88] saturate-[0.92]"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 50% at 50% 58%, rgba(8,16,12,0.05) 0%, rgba(6,12,10,0.22) 55%, rgba(4,10,8,0.32) 100%)',
            }}
          />
        </div>
      </div>

      <div className="relative z-10">
        <LayoutIsland>
          <ScrollZoomReveal
            videoUrl=""
            image={{
              src: WHITE_PIXEL,
              alt: '',
            }}
            leftText=""
            rightText=""
            buttonText=""
            buttonLink="#about-story"
            textColor={BLACK}
            buttonTextColor={BLACK}
            buttonBgColor={WHITE}
            iconType="none"
            animationStiffness={180}
            animationDamping={34}
            animationMass={0.38}
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
