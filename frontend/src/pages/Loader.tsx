import { useEffect } from 'react'
import SVXObxb6u from '../components/framer/SVXObxb6u.js'
import '../components/framer/framer-overrides.css'
import BrandReveal from '../components/loader/BrandReveal'
import LayoutIsland from '../utils/LayoutIsland'

type LoaderProps = {
  onComplete: () => void
}

const BRAND = 'Tasneem®'
const COUNTER_DURATION = 3
const TEXT_COLOR = 'rgb(255, 255, 255)'
const BACKGROUND = 'rgb(10, 46, 34)'

// Framer timeline: Variant 2 → Variant 3 at 3100ms, exit tween 0.6s
const COMPLETE_MS = 3100 + 600 + 120

/**
 * Framer Animation loader (SVXObxb6u) as a full-screen site preloader.
 * Brand text is a native overlay — Framer RichText character effect is broken (#10).
 */
export default function Loader({ onComplete }: LoaderProps) {
  useEffect(() => {
    const id = window.setTimeout(onComplete, COMPLETE_MS)
    return () => window.clearTimeout(id)
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden"
      aria-busy
      aria-live="polite"
      style={{ background: BACKGROUND }}
    >
      <LayoutIsland>
        <div className="h-full min-h-screen w-full">
          <SVXObxb6u
            pTKA8u9E2={BRAND}
            D1JQgffy4={COUNTER_DURATION}
            LdrNIZY6I={TEXT_COLOR}
            TaBhYJdTR={BACKGROUND}
            AR4P0Spr8={{
              delay: 0,
              duration: COUNTER_DURATION,
              ease: [0.12, 0.23, 0.5, 1],
              type: 'tween',
            }}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '100vh',
            }}
          />
        </div>
      </LayoutIsland>

      {/* #10 — hide off-screen RichText glyphs; show correct brand reveal */}
      <div
        className="pointer-events-none absolute left-3 top-3 z-[10000]"
        aria-hidden
      >
        <BrandReveal text={BRAND} color={TEXT_COLOR} />
      </div>

      <style>{`
        .framer-uHW7v .framer-vglqp {
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `}</style>
    </div>
  )
}
