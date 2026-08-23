import { motion } from 'framer-motion'

const CREAM = '#f2f4f5'
const WHITE = '#ffffff'

const ease = [0.22, 1, 0.36, 1] as const

function SplashMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 36"
      className="mx-auto mb-1 h-7 w-10 text-white md:h-8 md:w-12"
      fill="currentColor"
    >
      <ellipse cx="24" cy="10" rx="5" ry="9" transform="rotate(-8 24 10)" />
      <ellipse cx="14" cy="16" rx="3.5" ry="7" transform="rotate(-28 14 16)" />
      <ellipse cx="34" cy="16" rx="3.5" ry="7" transform="rotate(28 34 16)" />
    </svg>
  )
}

type HeroHeadingProps = {
  active: boolean
}

/** Curved Permanent Marker heading — creamy + white like the reference. */
export default function HeroHeading({ active }: HeroHeadingProps) {
  return (
    <h1 className="permanent-marker-regular relative mx-auto w-full max-w-4xl px-2">
      <span className="sr-only">The True Taste of Tradition.</span>

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.72 }}
        animate={
          active
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 12, scale: 0.72 }
        }
        transition={{ duration: 0.55, ease, delay: active ? 0.08 : 0 }}
      >
        <SplashMark />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
        transition={{ duration: 0.9, ease, delay: active ? 0.22 : 0 }}
      >
        <svg
          viewBox="0 0 900 160"
          className="mx-auto h-auto w-full max-w-[52rem]"
          role="presentation"
          aria-hidden
        >
          <defs>
            <path id="hero-arc" d="M 40 118 Q 450 18 860 118" fill="none" />
          </defs>
          <text
            fontFamily='"Permanent Marker", cursive'
            fontSize="52"
            letterSpacing="1"
          >
            <textPath href="#hero-arc" startOffset="50%" textAnchor="middle">
              <tspan fill={CREAM}>the </tspan>
              <tspan fill={WHITE}>True Taste </tspan>
              <tspan fill={CREAM}>of Tradition.</tspan>
            </textPath>
          </text>
        </svg>
      </motion.div>
    </h1>
  )
}
