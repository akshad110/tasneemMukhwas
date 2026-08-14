import { HERO_BACKGROUND } from '../../lib/products'
import HeroHeading from './HeroHeading'
import HeroHighlights from './HeroHighlights'
import ProductPackets from './ProductPackets'

type HeroProps = {
  active: boolean
}

export default function Hero({ active }: HeroProps) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <img
        src={HERO_BACKGROUND}
        alt=""
        aria-hidden
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover brightness-[0.72] saturate-[0.88]"
      />

      {/* Soft veil: lighter at packet center, deeper at sides for text */}
      <div
        aria-hidden
        className="absolute inset-0 z-[2]"
        style={{
          background:
            'linear-gradient(rgba(6,12,10,0.18), rgba(6,12,10,0.18)), radial-gradient(ellipse 55% 50% at 50% 58%, rgba(8,16,12,0.08) 0%, rgba(6,12,10,0.32) 55%, rgba(4,10,8,0.48) 100%)',
        }}
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col px-3 pb-5 pt-2 sm:px-4 sm:pb-6 sm:pt-3 md:px-8 md:pt-4 lg:px-10">
        <div className="mx-auto w-full max-w-5xl pt-0 text-center md:pt-1">
          <HeroHeading active={active} />
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col pb-3 pt-0 md:pb-8">
          <div className="relative flex min-h-[min(48vh,440px)] flex-1 flex-col items-center justify-start sm:min-h-[min(52vh,520px)] lg:block lg:pt-2">
            <div className="relative z-[1] mx-auto flex w-full max-w-5xl flex-1 items-start justify-center pt-1 sm:pt-2 lg:absolute lg:inset-0 lg:max-w-none lg:items-center lg:pt-0 lg:-translate-y-8">
              <ProductPackets active={active} />
            </div>
            <HeroHighlights active={active} />
          </div>
        </div>
      </div>
    </section>
  )
}
