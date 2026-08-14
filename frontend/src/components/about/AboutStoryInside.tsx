import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BentoGridShowcase } from '@/components/ui/bento-grid'
import { Leaf, Package, Plus, ShieldCheck, Sparkles } from 'lucide-react'

const INK = '#0a2e22'

const SISTER_BRANDS = [
  {
    name: 'Tasneem Spices Co.',
    blurb: 'Premium whole & ground spices for kitchens and food brands.',
    href: '#wholesale',
    mark: 'TS',
  },
  {
    name: 'FreshBite Snacks',
    blurb: 'Ready-to-serve traditional namkeens with modern hygiene standards.',
    href: '#wholesale',
    mark: 'FB',
  },
  {
    name: 'GreenLeaf Exports',
    blurb: 'Export-ready packaged foods with global logistics support.',
    href: '#wholesale',
    mark: 'GL',
  },
] as const

const JOURNEY = [
  {
    step: '01',
    title: 'Sourcing',
    body: 'Hand-picked seeds & spices from trusted regional farms.',
  },
  {
    step: '02',
    title: 'Cleaning',
    body: 'Multi-stage sorting and cleaning for purity.',
  },
  {
    step: '03',
    title: 'Blending',
    body: 'Time-honored recipes balanced for everyday freshness.',
  },
  {
    step: '04',
    title: 'Hygiene Pack',
    body: 'Sealed packing in FSSAI-aligned facilities.',
  },
] as const

const TAGS = ['100% Natural', 'FSSAI Approved', 'Hygienically Packed'] as const


const SisterBrandsCard = () => (
  <Card className="flex h-full flex-col justify-center overflow-hidden border-[#0a2e22]/10 bg-[#0a2e22] text-[#f3e6c8] shadow-none">
    <CardHeader className="space-y-1 p-3 pb-1 sm:p-4">
      <p className="m-0 text-[0.58rem] font-semibold tracking-[0.16em] uppercase text-[#b8860b]">
        Sister concerns
      </p>
      <CardTitle
        className="text-[0.95rem] leading-tight text-[#f3e6c8] sm:text-base"
        style={{ fontFamily: '"Permanent Marker", cursive' }}
      >
        Our Sister Brands
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-1 flex-col justify-center gap-2 p-3 pt-1 sm:p-4 sm:pt-1">
      <div className="flex items-center justify-center gap-2">
        {SISTER_BRANDS.map((brand) => (
          <a
            key={brand.mark}
            href={brand.href}
            title={brand.name}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3e6c8] text-[0.7rem] font-bold text-[#0a2e22] no-underline transition-transform hover:-translate-y-0.5"
          >
            {brand.mark}
          </a>
        ))}
      </div>
      <ul className="m-0 hidden list-none space-y-0.5 p-0 sm:block">
        {SISTER_BRANDS.map((brand) => (
          <li key={brand.name} className="truncate text-[0.68rem] leading-snug text-[#f3e6c8]/85">
            <span className="font-semibold text-[#b8860b]">{brand.mark}</span> — {brand.name}
          </li>
        ))}
      </ul>
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

const MainFeatureCard = () => (
  <Card className="relative h-full min-h-[160px] w-full overflow-hidden border-0 shadow-none md:min-h-0">
    <div className="absolute top-3 left-3 z-10 rounded-md bg-[#f3e6c8]/90 px-2 py-1 backdrop-blur-sm">
      <p
        className="m-0 text-sm font-bold tracking-tighter text-[#0a2e22] sm:text-base"
        style={{ fontFamily: '"Permanent Marker", cursive' }}
      >
        Tasneem Mukhwas
      </p>
    </div>
    <img
      src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80"
      alt="Traditional spices and mukhwas ingredients"
      className="h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#0a2e22]/75 via-transparent to-transparent" />
    <p className="absolute bottom-3 left-3 right-3 z-10 m-0 text-[0.72rem] leading-snug text-[#f3e6c8] sm:text-xs">
      Freshness, tradition, and trust in every pinch.
    </p>
  </Card>
)

const SecondaryFeatureCard = () => {
  const brand = SISTER_BRANDS[1]
  return (
    <Card className="relative h-full min-h-[120px] w-full overflow-hidden border-0 shadow-none md:min-h-0">
      <img
        src="https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=900&q=80"
        alt={brand.name}
        className="h-28 w-full object-cover md:h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a2e22]/85 via-[#0a2e22]/25 to-transparent" />
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
        <p
          className="m-0 text-sm font-bold text-white sm:text-base"
          style={{ fontFamily: '"Permanent Marker", cursive' }}
        >
          {brand.name}
        </p>
        <p className="mt-0.5 m-0 line-clamp-2 text-[0.68rem] text-white/90">{brand.blurb}</p>
      </div>
    </Card>
  )
}

const StatCard = () => (
  <Card className="flex h-full flex-col justify-between overflow-hidden border-0 bg-[#f3e6c8] p-3 shadow-none sm:p-4">
    <Sparkles className="h-5 w-5 text-[#b8860b] sm:h-6 sm:w-6" />
    <div>
      <p
        className="m-0 text-4xl font-bold leading-none text-[#0a2e22] sm:text-5xl"
        style={{ fontFamily: '"Permanent Marker", cursive' }}
      >
        25+
      </p>
      <p className="mt-1.5 m-0 text-[0.7rem] leading-snug text-[#0a2e22]/85 sm:text-xs">
        Export countries · 500+ wholesale distributors.
      </p>
      <p className="mt-1.5 m-0 text-[0.65rem] font-semibold tracking-wide text-[#0a2e22]/70">
        12+ years · 40+ SKUs
      </p>
    </div>
  </Card>
)

const JourneyCard = () => (
  <Card className="relative h-full overflow-hidden border-[#0a2e22]/10 p-3 shadow-none sm:p-4">
    <p className="m-0 text-[0.58rem] font-semibold tracking-[0.16em] uppercase text-[#b8860b]">
      From farm to pack
    </p>
    <CardTitle className="mt-0.5 text-[0.95rem] leading-tight text-[#0a2e22] sm:text-base">
      Quality Journey
    </CardTitle>
    <CardDescription className="mt-0.5 line-clamp-2 text-[0.68rem] text-[#0a2e22]/70">
      From sourcing raw spices to hygienic packaging — a clear path to every bite.
    </CardDescription>
    <div className="mt-2 flex flex-wrap gap-1">
      {JOURNEY.map((step) => (
        <span
          key={step.step}
          className="inline-flex items-center gap-0.5 rounded-full bg-[#0a2e22] px-2 py-0.5 text-[0.62rem] text-[#f3e6c8]"
          title={step.body}
        >
          <span className="text-[#b8860b]">{step.step}</span>
          {step.title}
        </span>
      ))}
    </div>
    <div className="pointer-events-none absolute -right-2 -bottom-2 hidden gap-1.5 opacity-80 sm:flex">
      <Avatar className="h-8 w-8 border-2 border-[#f3e6c8] bg-[#0a2e22]">
        <AvatarFallback className="bg-[#0a2e22] text-[#f3e6c8]">
          <Leaf className="h-3 w-3" />
        </AvatarFallback>
      </Avatar>
      <Avatar className="mt-4 h-8 w-8 border-2 border-[#f3e6c8] bg-[#0a2e22]">
        <AvatarFallback className="bg-[#0a2e22] text-[#f3e6c8]">
          <Package className="h-3 w-3" />
        </AvatarFallback>
      </Avatar>
      <Avatar className="h-8 w-8 border-2 border-[#f3e6c8] bg-[#0a2e22]">
        <AvatarFallback className="bg-[#0a2e22] text-[#f3e6c8]">
          <ShieldCheck className="h-3 w-3" />
        </AvatarFallback>
      </Avatar>
    </div>
  </Card>
)

/**
 * About story — same brand data, structured as the bento-grid showcase.
 */
export default function AboutStoryInside() {
  return (
    <div id="about-story" className="mx-auto w-full max-w-6xl px-4 pb-8 pt-0 sm:px-8 sm:pb-10">
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
        style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
      >
        Our story
      </p>
      <p
        className="mx-auto mt-1.5 max-w-xl text-center text-[0.82rem] leading-relaxed opacity-80"
        style={{ color: INK, fontFamily: 'Inter, sans-serif' }}
      >
        Sister brands, craft, and a farm-to-pack journey — built on freshness, tradition, and trust.
      </p>

      <div className="mt-5">
        <BentoGridShowcase
          integrations={<SisterBrandsCard />}
          featureTags={<FeatureTagsCard />}
          mainFeature={<MainFeatureCard />}
          secondaryFeature={<SecondaryFeatureCard />}
          statistic={<StatCard />}
          journey={<JourneyCard />}
        />
      </div>
    </div>
  )
}
