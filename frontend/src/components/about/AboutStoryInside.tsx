import { useEffect, useRef, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { APP_ROUTES, navigateApp } from '@/lib/appRoutes'
import { Leaf, Package, ShieldCheck, Sparkles } from 'lucide-react'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const GOLD_BRIGHT = '#d4a017'
const CREAM = '#f2f4f5'
const STAT_SHADOW = '0 2px 16px rgba(255,255,255,0.95), 0 1px 0 rgba(255,255,255,0.85)'
const WHO_GMP_IMG = encodeURI('/FINAL-FRUT GRUH(WHO GMP)_page-0001.jpg')
const SERIF = '"Playfair Display", Georgia, serif'
const SANS = 'Montserrat, sans-serif'

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
        className="m-0 text-[clamp(1.65rem,4vw,2.35rem)] font-extrabold leading-none tracking-tight"
        style={{ color: INK, fontFamily: SANS, textShadow: STAT_SHADOW }}
      >
        {n}
        <span className="text-[0.72em] font-bold" style={{ color: GOLD_BRIGHT, textShadow: STAT_SHADOW }}>
          {suffix}
        </span>
      </p>
      <p
        className="mt-2 m-0 text-[0.72rem] font-semibold tracking-[0.08em] uppercase sm:text-[0.78rem]"
        style={{ color: INK, fontFamily: SANS, textShadow: STAT_SHADOW }}
      >
        {label}
      </p>
    </div>
  )
}

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="m-0 text-[0.58rem] font-semibold tracking-[0.16em] uppercase" style={{ color: GOLD }}>
      {children}
    </p>
  )
}

function OriginCard() {
  return (
    <Card className="overflow-hidden rounded-2xl border-[#0a2e22]/10 bg-[#0a2e22] text-[#f2f4f5] shadow-[0_12px_32px_-20px_rgba(10,46,34,0.55)]">
      <CardContent className="flex flex-col gap-2.5 p-5 sm:p-6">
        <Eyebrow>Since Chhapi</Eyebrow>
        <CardTitle className="text-[1.05rem] leading-snug text-[#f2f4f5] sm:text-[1.1rem]" style={{ fontFamily: SERIF }}>
          Crafted for everyday freshness
        </CardTitle>
        <p className="m-0 text-[0.78rem] leading-relaxed text-[#f2f4f5]/88" style={{ fontFamily: SANS }}>
          Tasneem Mukhwas blends traditional Gujarati recipes with modern hygiene — from carefully
          sourced seeds to sealed, retail-ready packs for homes and counters.
        </p>
      </CardContent>
    </Card>
  )
}

function CraftCard() {
  return (
    <Card className="overflow-hidden rounded-2xl border-0 bg-[#1a3d32] shadow-[0_12px_32px_-20px_rgba(10,46,34,0.5)]">
      <CardContent className="flex flex-col gap-2.5 p-5 sm:p-6">
        <Eyebrow>Our craft</Eyebrow>
        <p className="m-0 text-[1.05rem] font-semibold leading-snug text-[#f2f4f5] sm:text-[1.1rem]" style={{ fontFamily: SERIF }}>
          Farm to pack, every day
        </p>
        <p className="m-0 text-[0.78rem] leading-relaxed text-[#f2f4f5]/88" style={{ fontFamily: SANS }}>
          Seeds cleaned, blended, and sealed in Banaskantha — aromatic, pure, and ready for homes,
          hotels, and wholesale partners across Gujarat.
        </p>
      </CardContent>
    </Card>
  )
}

function CertificateCard() {
  return (
    <Card className="relative min-h-[320px] overflow-hidden rounded-2xl border border-[#0a2e22]/10 shadow-[0_16px_40px_-24px_rgba(10,46,34,0.45)] sm:min-h-[380px] lg:min-h-[100%] lg:h-full">
      <div className="absolute top-3 left-3 z-10 rounded-full bg-[#f2f4f5]/95 px-3 py-1 backdrop-blur-sm">
        <p className="m-0 text-[0.68rem] font-bold tracking-tight text-[#0a2e22] sm:text-[0.72rem]" style={{ fontFamily: SANS }}>
          WHO-GMP Certified
        </p>
      </div>
      <img
        src={WHO_GMP_IMG}
        alt="Tasneem Mukhwas WHO-GMP certificate"
        className="h-full min-h-[320px] w-full object-cover object-top sm:min-h-[380px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a2e22]/92 via-[#0a2e22]/25 to-transparent" />
      <p
        className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 m-0 text-[0.76rem] leading-relaxed text-[#f2f4f5] sm:text-[0.8rem]"
        style={{ fontFamily: SANS }}
      >
        World Health Organization Good Manufacturing Practice standards at our Chhapi facility.
      </p>
    </Card>
  )
}

function PromiseStrip() {
  return (
    <div className="rounded-2xl border border-[#0a2e22]/10 bg-[#f8faf9] p-4 shadow-[0_10px_28px_-18px_rgba(10,46,34,0.28)] sm:p-5">
      <Eyebrow>Our promise</Eyebrow>
      <div className="mt-3 flex flex-wrap gap-2">
        {TAGS.map((tag, i) => (
          <span
            key={tag}
            className={
              i === 1
                ? 'inline-flex items-center rounded-full bg-[#0a2e22] px-3.5 py-1.5 text-[0.72rem] font-semibold text-[#f2f4f5]'
                : 'inline-flex items-center rounded-full border border-[#b8860b]/45 bg-white px-3.5 py-1.5 text-[0.72rem] font-semibold text-[#0a2e22]'
            }
            style={{ fontFamily: SANS }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function PromiseCard() {
  return (
    <Card className="overflow-hidden rounded-2xl border-[#0a2e22]/10 bg-white shadow-[0_10px_28px_-18px_rgba(10,46,34,0.28)]">
      <CardContent className="p-5 sm:p-6">
        <Eyebrow>Why choose us</Eyebrow>
        <CardTitle className="mt-1.5 text-[1.05rem] leading-snug text-[#0a2e22] sm:text-[1.1rem]">
          Tradition, sealed with care
        </CardTitle>
        <CardDescription className="mt-2 text-[0.78rem] leading-relaxed text-[#0a2e22]/72" style={{ fontFamily: SANS }}>
          Natural ingredients, FSSAI-aligned packing, and a family legacy of mouth fresheners trusted
          across Gujarat and beyond.
        </CardDescription>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { icon: Leaf, label: 'Natural' },
            { icon: Package, label: 'Sealed' },
            { icon: ShieldCheck, label: 'Certified' },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0a2e22] px-3 py-1.5 text-[0.68rem] text-[#f2f4f5]"
            >
              <Icon className="h-3.5 w-3.5 text-[#b8860b]" />
              {label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function TrustCard() {
  return (
    <Card className="overflow-hidden rounded-2xl border border-[#0a2e22]/10 bg-gradient-to-b from-[#f8faf9] to-[#eef3f0] shadow-[0_10px_28px_-18px_rgba(10,46,34,0.28)]">
      <CardContent className="flex flex-col items-center p-5 text-center sm:p-6">
        <Sparkles className="mb-3 h-6 w-6 text-[#b8860b]" />
        <p className="m-0 text-[2rem] font-bold leading-none text-[#0a2e22] sm:text-[2.25rem]" style={{ fontFamily: SERIF }}>
          Trust
        </p>
        <p className="mt-3 m-0 max-w-[16rem] text-[0.78rem] leading-relaxed text-[#0a2e22]/82" style={{ fontFamily: SANS }}>
          Retail and export lines backed by certified, export-ready quality systems you can rely on.
        </p>
        <p className="mt-3 m-0 text-[0.64rem] font-semibold tracking-[0.12em] uppercase text-[#0a2e22]/62">
          Chhapi · Gujarat · India
        </p>
      </CardContent>
    </Card>
  )
}

/**
 * About story — readable grid + animated counters + know-more CTA.
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
    <div id="about-story" className="mx-auto w-full max-w-6xl px-4 pb-10 pt-5 sm:px-8 sm:pb-12 sm:pt-7">
      <p
        className="m-0 text-center text-[0.62rem] font-semibold tracking-[0.22em] uppercase"
        style={{ color: GOLD, fontFamily: SANS }}
      >
        Our roots
      </p>
      <h2
        className="mt-2 m-0 text-center text-[clamp(1.65rem,4.2vw,2.5rem)] leading-none tracking-[0.03em]"
        style={{ color: INK, fontFamily: 'Anton, Impact, sans-serif', fontWeight: 400 }}
      >
        About Us
      </h2>
      <p
        className="mt-2 m-0 text-center text-[clamp(0.88rem,2vw,1rem)] font-semibold tracking-tight"
        style={{ color: INK, fontFamily: SANS }}
      >
        Our story
      </p>
      <p
        className="mx-auto mt-2 max-w-lg text-center text-[0.84rem] leading-relaxed"
        style={{ color: 'rgba(10,46,34,0.72)', fontFamily: SERIF }}
      >
        Freshness, tradition, and trust — mukhwas crafted in Chhapi under Tasneem Mukhwas.
      </p>

      {/* Main story — certificate + content (natural height, no cramped bento) */}
      <div className="mt-7 grid gap-4 lg:grid-cols-12 lg:items-stretch lg:gap-5">
        <div className="lg:col-span-5">
          <CertificateCard />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-7 lg:gap-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            <OriginCard />
            <CraftCard />
          </div>

          <PromiseStrip />

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            <PromiseCard />
            <TrustCard />
          </div>
        </div>
      </div>

      <div
        ref={countersRef}
        className="mt-8 grid grid-cols-2 gap-5 rounded-2xl border border-[#0a2e22]/10 bg-white/92 px-4 py-7 shadow-[0_14px_36px_-24px_rgba(10,46,34,0.35)] backdrop-blur-sm sm:grid-cols-4 sm:gap-4 sm:px-6"
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
          style={{ backgroundColor: INK, color: CREAM, fontFamily: SANS }}
        >
          Know more about us
        </button>
      </div>
    </div>
  )
}
