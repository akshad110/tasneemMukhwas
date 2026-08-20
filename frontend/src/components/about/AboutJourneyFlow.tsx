import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { BRAND_CREAM, BRAND_INK, BRAND_TEXTURE } from '../../lib/brand'

const INK = BRAND_INK
const CREAM = BRAND_CREAM
const GOLD = '#b8860b'
const TEXT = 'rgba(242,244,245,0.78)'
const TRACK = 'rgba(224,210,184,0.5)'
const STROKE = 3.5
const COUNT = 4

const STEPS = [
  {
    number: 1,
    title: 'Trade Fair 2016',
    text: 'Participation certificate for M/s. Tasneem Mukhwas — Pirojpura at the Maktabah Jafariyah Trade Fair (24 Nov – 31 Dec 2016).',
    image: '/license-trade-fair-2016.png',
    alt: 'Trade Fair 2016 participation certificate for Tasneem Mukhwas Pirojpura',
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
    rotateLeft: true,
  },
  {
    number: 4,
    title: 'Trade Fair 2026',
    text: 'Certificate of participation for M/s. Tasneem Mukhwas — Chappi at Maktabah Jafariyah Trade Fair 2026 (Stall No. 45 & 46).',
    image: '/license-trade-fair-2026.png',
    alt: 'Trade Fair 2026 participation certificate for Tasneem Mukhwas Chappi',
  },
] as const

const SPRING = { stiffness: 105, damping: 24, mass: 0.28 }

type StepBounds = { bottom: number }

type PipeGeom = {
  d: string
  width: number
  height: number
  left: number
  right: number
  top: number
  bottom: number
  endOnRight: boolean
}

/** Fallback when step refs are not measured yet */
function buildUniformPipePath(w: number, h: number, count: number, narrow: boolean): PipeGeom {
  const width = Math.max(w, 320)
  const height = Math.max(h, 480)
  const insetX = pipeInsetX(width, narrow)
  const insetY = narrow ? 28 : 24
  const left = insetX
  const right = width - insetX
  const top = insetY
  const bottom = height - insetY
  const band = (bottom - top) / count
  const turnYs = Array.from({ length: count - 1 }, (_, i) => top + (i + 1) * band)
  return buildMeasuredPipePath(width, height, left, right, top, bottom, turnYs, count)
}

function pipeInsetX(width: number, narrow: boolean) {
  return narrow ? Math.max(30, width * 0.09) : Math.max(36, width * 0.055)
}

/** Serpentine: straight vertical + horizontal segments with sharp 90° corners */
function buildMeasuredPipePath(
  width: number,
  height: number,
  left: number,
  right: number,
  top: number,
  bottom: number,
  turnYs: number[],
  count: number,
): PipeGeom {
  let d = `M ${left} ${top}`
  let x = left

  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1
    const yEnd = isLast
      ? bottom
      : Math.min(Math.max(turnYs[i] ?? bottom, top + 56), bottom - 24)

    d += ` L ${x} ${yEnd}`
    if (isLast) break

    const nextX = i % 2 === 0 ? right : left
    d += ` L ${nextX} ${yEnd}`
    x = nextX
  }

  return { d, width, height, left, right, top, bottom, endOnRight: count % 2 === 0 }
}

function buildPipePath(
  w: number,
  h: number,
  count: number,
  stepBounds: StepBounds[],
  narrow: boolean,
): PipeGeom {
  const width = Math.max(w, 320)
  const height = Math.max(h, 480)
  const insetX = pipeInsetX(width, narrow)
  const insetY = narrow ? 28 : 24
  const left = insetX
  const right = width - insetX
  const top = insetY
  const bottom = height - insetY

  const measured =
    stepBounds.length === count && stepBounds.every((b) => b.bottom > top + 40)

  if (!measured) {
    return buildUniformPipePath(w, h, count, narrow)
  }

  const turnYs = stepBounds.slice(0, count - 1).map((b) => b.bottom - (narrow ? 12 : 8))
  return buildMeasuredPipePath(width, height, left, right, top, bottom, turnYs, count)
}

function ContinuousGoldLine({
  hostRef,
  stepBounds,
}: {
  hostRef: RefObject<HTMLDivElement | null>
  stepBounds: StepBounds[]
}) {
  const measurePathRef = useRef<SVGPathElement>(null)
  const [box, setBox] = useState({ w: 640, h: 900 })
  const [narrow, setNarrow] = useState(false)
  const [pathLen, setPathLen] = useState(0)

  useLayoutEffect(() => {
    const el = hostRef.current
    if (!el) return
    const measure = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      if (w > 0 && h > 0) {
        setBox({ w, h })
        setNarrow(w < 768)
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    const t1 = window.setTimeout(measure, 50)
    const t2 = window.setTimeout(measure, 400)
    return () => {
      ro.disconnect()
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [hostRef, stepBounds])

  const pipe = useMemo(
    () => buildPipePath(box.w, box.h, COUNT, stepBounds, narrow),
    [box.w, box.h, stepBounds, narrow],
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
      className="pointer-events-none absolute left-0 top-0 z-[3]"
      width={pipe.width}
      height={pipe.height}
      viewBox={`0 0 ${pipe.width} ${pipe.height}`}
      shapeRendering="geometricPrecision"
    >
      <path ref={measurePathRef} d={pipe.d} fill="none" stroke="none" />
      <path
        d={pipe.d}
        fill="none"
        stroke={TRACK}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
      />
      <motion.path
        d={pipe.d}
        fill="none"
        stroke={GOLD}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
        strokeDasharray={pathLen > 0 ? pathLen : undefined}
        style={pathLen > 0 ? { strokeDashoffset: dashOffset } : undefined}
      />
      <circle cx={pipe.left} cy={pipe.top} r={3.5} fill={GOLD} />
      <motion.circle
        cx={endX}
        cy={pipe.bottom}
        r={3.5}
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
  stepRef,
}: {
  step: (typeof STEPS)[number]
  index: number
  total: number
  progress: MotionValue<number>
  stepRef: (el: HTMLDivElement | null) => void
}) {
  const imageOnLeft = index % 2 === 1
  const pipeOnLeft = index % 2 === 0
  const label = String(step.number).padStart(2, '0')

  const enter = (index + 0.18) / total
  const mid = (index + 0.38) / total

  const rawReveal = useTransform(progress, [enter, mid], [0, 1])
  const reveal = useSpring(rawReveal, SPRING)
  const rise = useTransform(reveal, [0, 1], [22, 0])

  const pipeSideMd = pipeOnLeft
    ? 'md:pl-10 lg:pl-12'
    : 'md:pr-10 lg:pr-12'

  const mobileLayout = pipeOnLeft
    ? 'max-md:justify-start max-md:pl-[clamp(3.25rem,12vw,5rem)]'
    : 'max-md:justify-center max-md:pl-[clamp(2.25rem,9vw,3.75rem)] max-md:pr-[clamp(3.25rem,12vw,5rem)]'

  const copy = (
    <motion.div
      className={`flex w-full max-w-[280px] flex-col justify-center md:max-w-[300px] ${
        pipeOnLeft ? '' : 'max-md:items-center max-md:text-center'
      }`}
      style={{ opacity: reveal, y: rise }}
    >
      <p
        className="m-0 leading-none"
        style={{
          color: GOLD,
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
          fontWeight: 400,
        }}
      >
        {label}
      </p>
      <h4
        className="m-0 mt-3 text-[1.1rem] font-bold tracking-tight md:mt-4 md:text-[1.25rem]"
        style={{ color: CREAM, fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {step.title}
      </h4>
      <p
        className="m-0 mt-2.5 text-[0.84rem] leading-[1.65] md:text-[0.875rem]"
        style={{ color: TEXT, fontFamily: 'Inter, sans-serif' }}
      >
        {step.text}
      </p>
    </motion.div>
  )

  const rotateLeft = 'rotateLeft' in step && step.rotateLeft

  const media = (
    <motion.div style={{ opacity: reveal, y: rise }}>
      <div
        className="relative overflow-hidden rounded-2xl bg-[rgba(242,244,245,0.94)] p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
        style={{
          width: 'clamp(118px, 28vw, 168px)',
          aspectRatio: rotateLeft ? '3/4' : '4/3',
        }}
      >
        <img
          src={step.image}
          alt={step.alt}
          loading="lazy"
          className="h-full w-full object-contain"
          style={{
            transform: rotateLeft ? 'rotate(-90deg)' : undefined,
            transformOrigin: 'center center',
          }}
        />
      </div>
    </motion.div>
  )

  const copyCell = (
    <div
      className={`flex min-w-0 items-center ${mobileLayout} ${pipeSideMd} ${
        imageOnLeft ? 'md:justify-start md:pl-2' : 'md:justify-end md:pr-2'
      }`}
    >
      {copy}
    </div>
  )

  const mediaCell = (
    <div
      className={`flex min-w-0 items-center max-md:mt-1 ${mobileLayout} ${
        imageOnLeft ? 'md:justify-end md:pr-2' : 'md:justify-start md:pl-2'
      }`}
    >
      {media}
    </div>
  )

  return (
    <div
      ref={stepRef}
      className="grid grid-cols-1 items-center gap-4 md:grid-cols-2 md:gap-x-3 md:gap-y-6"
      style={{
        paddingTop: index === 0 ? 8 : 48,
        paddingBottom: 48,
      }}
    >
      <div className="contents md:hidden">
        {imageOnLeft ? (
          <>
            {mediaCell}
            {copyCell}
          </>
        ) : (
          <>
            {copyCell}
            {mediaCell}
          </>
        )}
      </div>

      <div className="hidden md:contents">
        {imageOnLeft ? (
          <>
            {mediaCell}
            {copyCell}
          </>
        ) : (
          <>
            {copyCell}
            {mediaCell}
          </>
        )}
      </div>
    </div>
  )
}

export default function AboutJourneyFlow() {
  const hostRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [stepBounds, setStepBounds] = useState<StepBounds[]>([])

  const measureSteps = useCallback(() => {
    const host = hostRef.current
    if (!host) return
    const hostTop = host.getBoundingClientRect().top
    const bounds = STEPS.map((_, i) => {
      const el = stepRefs.current[i]
      if (!el) return { bottom: 0 }
      const rect = el.getBoundingClientRect()
      return { bottom: rect.bottom - hostTop }
    })
    if (bounds.some((b) => b.bottom <= 0)) return
    setStepBounds(bounds)
  }, [])

  useLayoutEffect(() => {
    measureSteps()
    const host = hostRef.current
    if (!host) return
    const ro = new ResizeObserver(() => measureSteps())
    ro.observe(host)
    stepRefs.current.forEach((el) => {
      if (el) ro.observe(el)
    })
    const t1 = window.setTimeout(measureSteps, 80)
    const t2 = window.setTimeout(measureSteps, 500)
    window.addEventListener('load', measureSteps)
    return () => {
      ro.disconnect()
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.removeEventListener('load', measureSteps)
    }
  }, [measureSteps])

  const { scrollYProgress } = useScroll({
    target: hostRef,
    offset: ['start 0.9', 'end 0.55'],
  })
  const led = useTransform(scrollYProgress, [0, 0.88], [0, 1], { clamp: true })
  const progress = useSpring(led, SPRING)

  const setStepRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stepRefs.current[index] = el
      if (el) window.requestAnimationFrame(() => measureSteps())
    },
    [measureSteps],
  )

  return (
    <section
      id="journey"
      className="relative isolate z-20 w-full overflow-x-clip px-4 py-12 sm:px-8 sm:py-16"
      style={{ backgroundColor: INK }}
      aria-label="Our licenses and recognitions"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src={BRAND_TEXTURE}
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

      <div className="relative z-10 mx-auto w-full max-w-[980px]">
        <p
          className="m-0 text-center text-[0.6rem] font-semibold tracking-[0.18em] uppercase"
          style={{ color: GOLD, fontFamily: 'Inter, sans-serif' }}
        >
          Trusted credentials
        </p>
        <h3
          className="mt-1.5 m-0 text-center text-[clamp(1.2rem,3.5vw,1.75rem)] leading-tight"
          style={{ color: CREAM, fontFamily: '"Permanent Marker", cursive' }}
        >
          Our Licenses
        </h3>
        <p
          className="mx-auto mt-2 mb-10 max-w-md text-center text-[0.8rem] leading-relaxed"
          style={{ color: TEXT, fontFamily: 'Inter, sans-serif' }}
        >
          Awards, trade-fair certificates, and industry honours that mark our journey in quality food craft.
        </p>

        <div ref={hostRef} className="relative min-h-[520px] px-1 py-6 md:px-4 md:py-8">
          <ContinuousGoldLine hostRef={hostRef} stepBounds={stepBounds} />

          <div className="relative z-[2]">
            {STEPS.map((step, index) => (
              <JourneyStep
                key={step.title}
                step={step}
                index={index}
                total={COUNT}
                progress={progress}
                stepRef={setStepRef(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
