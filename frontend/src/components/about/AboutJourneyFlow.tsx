import { useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const TEXT = '#5a7066'
const TRACK = '#e0d2b8'
const STROKE = 6
const COUNT = 4

const STEPS = [
  {
    number: 1,
    title: 'Trade Fair 2016',
    text: 'Participation certificate for M/s. Furat Gruh Udyog — Pirojpura at the Maktabah Jafariyah Trade Fair (24 Nov – 31 Dec 2016).',
    image: '/license-trade-fair-2016.png',
    alt: 'Trade Fair 2016 participation certificate for Furat Gruh Udyog Pirojpura',
  },
  {
    number: 2,
    title: 'AHOA Centenary Honour',
    text: 'Recognized by the Ahmedabad Hotel Owner’s Association for shaping Ahmedabad’s food heritage across a century of industry excellence.',
    image: '/license-ahoa-centenary.png',
    alt: 'Ahmedabad Hotel Owner’s Association centenary recognition plaque',
  },
  {
    number: 3,
    title: 'Award of Excellence 2025',
    text: 'Honoured at Khadhya Khurak 2025 — the International Exhibition on Food Processing & Packaging in Gandhinagar, Gujarat.',
    image: '/license-khadhya-khurak-2025.png',
    alt: 'Award of Excellence plaque from Khadhya Khurak 2025 Gandhinagar',
  },
  {
    number: 4,
    title: 'Trade Fair 2026',
    text: 'Certificate of participation for M/s. Furat Gruh Udyog — Chappi at Maktabah Jafariyah Trade Fair 2026 (Stall No. 45 & 46).',
    image: '/license-trade-fair-2026.png',
    alt: 'Trade Fair 2026 participation certificate for Furat Gruh Udyog Chappi',
  },
] as const

const SPRING = { stiffness: 70, damping: 28, mass: 0.35 }

/**
 * One zigzag path. Soft Q-curve corners (straight runs + little round bends).
 * Always returns a valid `d` — defaults keep the line mounted before measure.
 */
function buildPipePath(w: number, h: number, count: number) {
  const width = Math.max(w, 320)
  const height = Math.max(h, 480)
  const inset = 20
  const left = inset
  const right = width - inset
  const top = inset
  const bottom = height - inset
  const band = (bottom - top) / count
  const r = Math.min(36, band * 0.22, (right - left) * 0.1)

  let d = `M ${left} ${top}`
  let x = left

  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1
    const yEnd = isLast ? bottom : top + (i + 1) * band
    const onLeft = i % 2 === 0
    const vertStop = isLast ? yEnd : yEnd - r

    d += ` L ${x} ${vertStop}`
    if (isLast) break

    const nextX = onLeft ? right : left
    if (onLeft) {
      d += ` Q ${x} ${yEnd} ${x + r} ${yEnd}`
      d += ` L ${nextX - r} ${yEnd}`
      d += ` Q ${nextX} ${yEnd} ${nextX} ${yEnd + r}`
    } else {
      d += ` Q ${x} ${yEnd} ${x - r} ${yEnd}`
      d += ` L ${nextX + r} ${yEnd}`
      d += ` Q ${nextX} ${yEnd} ${nextX} ${yEnd + r}`
    }
    x = nextX
  }

  return { d, width, height, left, right, top, bottom, endOnRight: count % 2 === 0 }
}

/**
 * Single continuous gold rod. Never unmounts. Scroll fills it further.
 */
function ContinuousGoldLine({
  hostRef,
}: {
  hostRef: RefObject<HTMLDivElement | null>
}) {
  const measurePathRef = useRef<SVGPathElement>(null)
  const [box, setBox] = useState({ w: 640, h: 900 })
  const [pathLen, setPathLen] = useState(0)

  useLayoutEffect(() => {
    const el = hostRef.current
    if (!el) return
    const measure = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      if (w > 0 && h > 0) setBox({ w, h })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    // Remeasure after layout/images settle — never unmount on miss
    const t1 = window.setTimeout(measure, 50)
    const t2 = window.setTimeout(measure, 300)
    return () => {
      ro.disconnect()
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [hostRef])

  const pipe = useMemo(
    () => buildPipePath(box.w, box.h, COUNT),
    [box.w, box.h],
  )

  useLayoutEffect(() => {
    const node = measurePathRef.current
    if (!node) return
    const len = node.getTotalLength()
    if (Number.isFinite(len) && len > 1) setPathLen(len)
  }, [pipe.d])

  const { scrollYProgress } = useScroll({
    target: hostRef,
    offset: ['start 0.9', 'end 0.55'],
  })
  const led = useTransform(scrollYProgress, [0, 0.88], [0, 1], { clamp: true })
  const smooth = useSpring(led, SPRING)
  const dashOffset = useTransform(smooth, (v) => {
    if (pathLen <= 0) return 0
    return pathLen * (1 - v)
  })

  const endX = pipe.endOnRight ? pipe.right : pipe.left

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
      width="100%"
      height="100%"
      viewBox={`0 0 ${pipe.width} ${pipe.height}`}
      preserveAspectRatio="none"
    >
      {/* Invisible measurer */}
      <path ref={measurePathRef} d={pipe.d} fill="none" stroke="none" />

      {/* Full continuous guide rod */}
      <path
        d={pipe.d}
        fill="none"
        stroke={TRACK}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* One gold fill — dashoffset (reliable on Q curves) */}
      <motion.path
        d={pipe.d}
        fill="none"
        stroke={GOLD}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLen > 0 ? pathLen : undefined}
        style={pathLen > 0 ? { strokeDashoffset: dashOffset } : undefined}
      />

      <circle cx={pipe.left} cy={pipe.top} r={5} fill={GOLD} />
      <motion.circle
        cx={endX}
        cy={pipe.bottom}
        r={5}
        fill={GOLD}
        style={{ opacity: smooth }}
      />
    </svg>
  )
}

function JourneyStep({
  step,
  index,
  total,
  progress,
}: {
  step: (typeof STEPS)[number]
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const imageOnLeft = index % 2 === 1
  const label = String(step.number).padStart(2, '0')

  const enter = (index + 0.18) / total
  const mid = (index + 0.38) / total

  const rawReveal = useTransform(progress, [enter, mid], [0, 1])
  const reveal = useSpring(rawReveal, SPRING)
  const rise = useTransform(reveal, [0, 1], [22, 0])

  const copy = (
    <motion.div
      className={`flex w-full max-w-[280px] flex-col justify-center ${
        imageOnLeft ? 'md:ml-auto' : 'md:mr-auto'
      }`}
      style={{ opacity: reveal, y: rise }}
    >
      <p
        className="m-0"
        style={{
          color: GOLD,
          fontFamily: '"Permanent Marker", cursive',
          fontSize: 'clamp(2.4rem, 5vw, 3.1rem)',
          lineHeight: 1,
        }}
      >
        {label}
      </p>
      <h4
        className="m-0 mt-3 text-[1.15rem] font-bold tracking-tight sm:text-[1.25rem]"
        style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
      >
        {step.title}
      </h4>
      <p
        className="m-0 mt-2 max-w-[240px] text-[0.84rem] leading-relaxed"
        style={{ color: TEXT, fontFamily: 'Inter, sans-serif' }}
      >
        {step.text}
      </p>
    </motion.div>
  )

  const media = (
    <motion.div
      className="w-full overflow-hidden rounded-[20px]"
      style={{ opacity: reveal, y: rise }}
    >
      <img
        src={step.image}
        alt={step.alt}
        loading="lazy"
        className="block w-full object-contain bg-[#f7f1e4]"
        style={{ height: 'clamp(180px, 26vw, 240px)' }}
      />
    </motion.div>
  )

  return (
    <div
      className="grid grid-cols-1 items-center md:grid-cols-2"
      style={{
        paddingTop: index === 0 ? 12 : 44,
        paddingBottom: 44,
        columnGap: 52,
        rowGap: 28,
      }}
    >
      {imageOnLeft ? (
        <>
          <div className="min-w-0">{media}</div>
          <div className="min-w-0">{copy}</div>
        </>
      ) : (
        <>
          <div className="min-w-0">{copy}</div>
          <div className="min-w-0">{media}</div>
        </>
      )}
    </div>
  )
}

export default function AboutJourneyFlow() {
  const hostRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: hostRef,
    offset: ['start 0.9', 'end 0.55'],
  })
  const led = useTransform(scrollYProgress, [0, 0.88], [0, 1], { clamp: true })
  const progress = useSpring(led, SPRING)

  return (
    <section
      id="journey"
      className="relative isolate z-20 w-full bg-white px-4 py-12 sm:px-8 sm:py-16"
      aria-label="Our licenses and recognitions"
    >
      <div className="mx-auto w-full max-w-[860px]">
        <p
          className="m-0 text-center text-[0.6rem] font-semibold tracking-[0.18em] uppercase"
          style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
        >
          Trusted credentials
        </p>
        <h3
          className="mt-1.5 m-0 text-center text-[clamp(1.2rem,3.5vw,1.75rem)] leading-tight"
          style={{ color: INK, fontFamily: '"Permanent Marker", cursive' }}
        >
          Our Licenses
        </h3>
        <p
          className="mx-auto mt-2 mb-10 max-w-md text-center text-[0.8rem] leading-relaxed opacity-80"
          style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
        >
          Awards, trade-fair certificates, and industry honours that mark our journey in quality food craft.
        </p>

        <div
          ref={hostRef}
          className="relative min-h-[480px] px-8 py-3 sm:px-11 md:px-12"
        >
          <ContinuousGoldLine hostRef={hostRef} />

          <div className="relative z-[2]">
            {STEPS.map((step, index) => (
              <JourneyStep
                key={step.title}
                step={step}
                index={index}
                total={COUNT}
                progress={progress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
