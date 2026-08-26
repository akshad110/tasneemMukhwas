import AboutStoryVideo from './AboutStoryVideo'
import { BRAND_CREAM_LIGHT } from '../../lib/brand'

/** Our Story — heading, boxed brand video, and short copy (no scroll-zoom). */
export default function AboutZoom() {
  return (
    <div style={{ backgroundColor: BRAND_CREAM_LIGHT }}>
      <AboutStoryVideo />
    </div>
  )
}
