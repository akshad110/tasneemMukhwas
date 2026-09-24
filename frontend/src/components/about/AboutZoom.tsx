import AboutStoryVideo from './AboutStoryVideo'
import { HOME_SECTION_B } from '../../lib/brand'

/** Our Story — heading, boxed brand video, and short copy (no scroll-zoom). */
export default function AboutZoom() {
  return (
    <div style={{ backgroundColor: HOME_SECTION_B }}>
      <AboutStoryVideo />
    </div>
  )
}
