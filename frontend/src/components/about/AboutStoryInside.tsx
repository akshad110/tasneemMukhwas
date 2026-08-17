import { useEffect, useRef, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BentoGridShowcase } from '@/components/ui/bento-grid'
import { APP_ROUTES, navigateApp } from '@/lib/appRoutes'
import { Leaf, Package, Plus, ShieldCheck, Sparkles } from 'lucide-react'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const CREAM = '#f3e6c8'
const WHO_GMP_IMG = encodeURI('/FINAL-FRUT GRUH(WHO GMP)_page-0001.jpg')

const TAGS = ['100% Natural', 'FSSAI Approved', 'Hygienically Packed'] as const

const COUNTERS = [
  { label: 'Total happy customers', value: 5, suffix: ' Lakh+', decimals: 0 },
  { label: 'Years of experience', value: 12, suffix: ' Years', decimals: 0 },
  { label: 'Product SKUs', value: 40, suffix: '+', decimals: 0 },
  { label: 'Wholesale partners', value: 500, suffix: '+', decimals: 0 },
] as const

function useCountUp(target: number, active: boolean, playKey: number, duration = 1600) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) {
      setValue(0)
      return
    }

    let frame = 0
    setValue(0)
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setValue(Math.round(target * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, playKey, target, duration])

  return value
}

function CounterStat({
  label,
  value,
  suffix,
  active,
  playKey,
}: {
  label: string
  value: number
  suffix: string
  active: boolean
  playKey: number
}) {
  const n = useCountUp(value, active, playKey)
  return (
    <div className="text-center">
      <p
        className="m-0 text-[clamp(1.65rem,4vw,2.35rem)] font-bold leading-none tracking-tight"
        style={{ color: INK, fontFamily: 'Montserrat, sans-serif' }}
      >
        {n}
        <span className="text-[0.72em] font-semibold" style={{ color: GOLD }}>
          {suffix}
        </span>
      </p>
      <p
        className="mt-2 m-0 text-[0.72rem] font-medium tracking-[0.06em] uppercase opacity-70 sm:text-[0.78rem]"
        style={{ color: INK, fontFamily: 'Montserrat, sans-serif' }}
      >
        {label}
      </p>
    </div>
  )
}

/** Top-left — brand promise text (replaces sister brands). */
const OriginCard = () => (
  <Card className="flex h-full flex-col justify-center overflow-hidden border-[#0a2e22]/10 bg-[#0a2e22] text-[#f3e6c8] shadow-none">
    <CardContent className="flex flex-1 flex-col justify-center gap-2 p-3 sm:p-4">
      <p className="m-0 text-[0.58rem] font-semibold tracking-[0.16em] uppercase text-[#b8860b]">
        Since Chhapi
      </p>
      <CardTitle
        className="text-[0.95rem] leading-tight text-[#f3e6c8] sm:text-base"
        style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
      >
        Crafted for everyday freshness
      </CardTitle>
      <p
        className="m-0 text-[0.7rem] leading-relaxed text-[#f3e6c8]/85 sm:text-[0.74rem]"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        Tasneem Mukhwas blends traditional Gujarati mouth-freshener recipes with modern hygiene —
        from carefully sourced seeds to sealed, retail-ready packs.
      </p>
    </CardContent>
  </Card>
)

const FeatureTagsCard = () => (
  <Card className="h-full overflow-hidden border-[#0a2e22]/10 shadow-none">
    <CardContent className="flex h-full flex-col justify-center gap-1.5 p-3 sm:gap-2 sm:p-4">
      {TAGS.map((tag, i) => (
        <Badge
          key={tag}
          variant={i === 1 ? 'secondary' : 'outline'}
          className={
            i === 1
              ? 'w-fit items-center gap-1 border-transparent bg-[#f3e6c8] py-1 px-2.5 text-[0.68rem] text-[#0a2e22]'
              : 'w-fit items-center gap-1 border-[#b8860b]/50 py-1 px-2.5 text-[0.68rem] text-[#0a2e22]'
          }
        >
          {tag}
          {i !== 1 ? <Plus className="h-3 w-3 text-[#b8860b]" /> : null}
        </Badge>
      ))}
    </CardContent>
  </Card>
)

/** Center tall cell — WHO-GMP certificate. */
const MainFeatureCard = () => (
  <Card className="relative h-full min-h-[200px] w-full overflow-hidden border-0 shadow-none md:min-h-0">
    <div className="absolute top-3 left-3 z-10 rounded-md bg-[#f3e6c8]/95 px-2 py-1 backdrop-blur-sm">
      <p
        className="m-0 text-[0.7rem] font-bold tracking-tight text-[#0a2e22] sm:text-sm"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        WHO-GMP Certified
      </p>
    </div>
    <img
      src={WHO_GMP_IMG}
      alt="Furat Gruh Udhyog WHO-GMP certificate"
      className="h-full w-full object-cover object-top"
    />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a2e22]/80 via-transparent to-transparent" />
    <p
      className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 m-0 text-[0.72rem] leading-snug text-[#f3e6c8] sm:text-xs"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      Furat Gruh Udhyog — World Health Organization Good Manufacturing Practice standards.
    </p>
  </Card>
)

const CraftCard = () => (
  <Card className="flex h-full flex-col justify-center overflow-hidden border-0 bg-[#1a3d32] p-3 shadow-none sm:p-4">
    <p className="m-0 text-[0.58rem] font-semibold tracking-[0.16em] uppercase text-[#b8860b]">
      Our craft
    </p>
    <p
      className="mt-1 m-0 text-[0.95rem] font-semibold leading-tight text-[#f3e6c8] sm:text-base"
      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
    >
      Farm to pack, every day
    </p>
    <p
      className="mt-1.5 m-0 text-[0.7rem] leading-relaxed text-[#f3e6c8]/88"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      Seeds cleaned, blended, and sealed in Banaskantha so every pinch stays aromatic, pure, and
      ready for homes, hotels, and wholesale counters.
    </p>
  </Card>
)

const StatCard = () => (
  <Card className="flex h-full flex-col items-center justify-center overflow-hidden border-0 bg-transparent p-3 text-center shadow-none sm:p-4">
    <Sparkles className="mb-2 h-5 w-5 text-[#b8860b] sm:h-6 sm:w-6" />
    <p
      className="m-0 text-4xl font-bold leading-none text-[#0a2e22] sm:text-5xl"
      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
    >
      Trust
    </p>
    <p
      className="mt-2 m-0 max-w-[16rem] text-[0.7rem] leading-snug text-[#0a2e22]/85 sm:text-xs"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      Parent company Furat Gruh Udhyog powers Tasneem Mukhwas with export-ready quality systems.
    </p>
    <p className="mt-2 m-0 text-[0.65rem] font-semibold tracking-wide text-[#0a2e22]/70">
      Chhapi · Gujarat · India
    </p>
  </Card>
)

const PromiseCard = () => (
  <Card className="relative h-full overflow-hidden border-[#0a2e22]/10 p-3 shadow-none sm:p-4">
    <p className="m-0 text-[0.58rem] font-semibold tracking-[0.16em] uppercase text-[#b8860b]">
      Why choose us
    </p>
    <CardTitle className="mt-0.5 text-[0.95rem] leading-tight text-[#0a2e22] sm:text-base">
      Tradition, sealed with care
    </CardTitle>
    <CardDescription
      className="mt-0.5 line-clamp-3 text-[0.68rem] text-[#0a2e22]/70"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      Natural ingredients, FSSAI-aligned packing, and a family legacy of mouth fresheners trusted
      across Gujarat and beyond.
    </CardDescription>
    <div className="mt-2 flex flex-wrap gap-1.5">
      {[
        { icon: Leaf, label: 'Natural' },
        { icon: Package, label: 'Sealed' },
        { icon: ShieldCheck, label: 'Certified' },
      ].map(({ icon: Icon, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1 rounded-full bg-[#0a2e22] px-2 py-0.5 text-[0.62rem] text-[#f3e6c8]"
        >
          <Icon className="h-3 w-3 text-[#b8860b]" />
          {label}
        </span>
      ))}
    </div>
  </Card>
)

/**
 * About story — bento grid + animated counters + know-more CTA.
 */
export default function AboutStoryInside() {
  const countersRef = useRef<HTMLDivElement>(null)
  const [countersActive, setCountersActive] = useState(false)
  const [countersPlayKey, setCountersPlayKey] = useState(0)

  useEffect(() => {
    const el = countersRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setCountersPlayKey((k) => k + 1)
          setCountersActive(true)
        } else {
          setCountersActive(false)
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div id="about-story" className="mx-auto w-full max-w-6xl px-4 pb-8 pt-4 sm:px-8 sm:pb-10 sm:pt-6">
      <h2
        className="m-0 text-center text-[clamp(1.75rem,5vw,3rem)] leading-none tracking-[0.02em]"
        style={{
          color: '#000',
          fontFamily: 'Anton, Impact, sans-serif',
          fontWeight: 400,
        }}
      >
        About Us
      </h2>
      <p
        className="mt-2 m-0 text-center text-[clamp(0.95rem,2.4vw,1.15rem)] font-bold tracking-tight"
        style={{ color: INK, fontFamily: 'Montserrat, sans-serif' }}
      >
        Our story
      </p>
      <p
        className="mx-auto mt-1.5 max-w-xl text-center text-[0.82rem] leading-relaxed opacity-80"
        style={{ color: INK, fontFamily: '"Playfair Display", Georgia, serif' }}
      >
        Freshness, tradition, and trust — mukhwas crafted in Chhapi under Furat Gruh Udhyog.
      </p>

      <div className="mt-5">
        <BentoGridShowcase
          integrations={<OriginCard />}
          featureTags={<FeatureTagsCard />}
          mainFeature={<MainFeatureCard />}
          secondaryFeature={<CraftCard />}
          statistic={<StatCard />}
          journey={<PromiseCard />}
        />
      </div>

      <div
        ref={countersRef}
        className="mt-8 grid grid-cols-2 gap-6 border-t border-[#0a2e22]/10 pt-8 sm:grid-cols-4 sm:gap-4"
      >
        {COUNTERS.map((c) => (
          <CounterStat
            key={c.label}
            label={c.label}
            value={c.value}
            suffix={c.suffix}
            active={countersActive}
            playKey={countersPlayKey}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => navigateApp(APP_ROUTES.knowMore)}
          className="cursor-pointer rounded-full border-0 px-8 py-3 text-[0.82rem] font-semibold tracking-[0.08em] uppercase transition hover:brightness-110"
          style={{
            backgroundColor: INK,
            color: CREAM,
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Know more about us
        </button>
      </div>
    </div>
  )
}
