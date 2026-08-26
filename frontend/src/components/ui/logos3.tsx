import AutoScroll from 'embla-carousel-auto-scroll'

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { BRAND_CREAM_LIGHT, BRAND_INK, BRAND_MUTED, BRAND_SANS, BRAND_DISPLAY } from '@/lib/brand'
import { cn } from '@/lib/utils'

export interface PartnerLogo {
  id: string
  description: string
  image: string
  /** Optional visual scale tweak for uneven source assets (0.6–1.2). */
  scale?: number
}

export interface Logos3Props {
  heading?: string
  subheading?: string
  logos?: PartnerLogo[]
  className?: string
}

export function Logos3({
  heading = 'Our Partners',
  subheading,
  logos = [],
  className,
}: Logos3Props) {
  const track = logos.length > 1 ? [...logos, ...logos] : logos

  return (
    <section className={cn('relative w-full overflow-hidden', className)} aria-label={heading} style={{ backgroundColor: BRAND_CREAM_LIGHT }}>
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
        <header className="mb-8 text-center md:mb-10">
          <h2
            className="m-0 uppercase"
            style={{
              color: BRAND_INK,
              fontFamily: BRAND_DISPLAY,
              fontSize: 'clamp(1.5rem, 3.8vw, 2.65rem)',
              fontWeight: 400,
              letterSpacing: '0.06em',
              lineHeight: 1.05,
            }}
          >
            {heading}
          </h2>
          {subheading ? (
            <p
              className="mx-auto mt-3 max-w-xl text-sm md:text-base"
              style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
            >
              {subheading}
            </p>
          ) : null}
        </header>

        <div className="partners-carousel-shell relative mx-auto lg:max-w-6xl">
          <Carousel
            opts={{
              loop: true,
              align: 'start',
              dragFree: false,
              containScroll: 'trimSnaps',
            }}
            plugins={[
              AutoScroll({
                playOnInit: true,
                speed: 0.65,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="partners-carousel-track ml-0 items-center">
              {track.map((logo, index) => (
                <CarouselItem
                  key={`${logo.id}-${index}`}
                  className="partners-carousel-slide flex shrink-0 basis-auto grow-0 justify-center pl-0"
                >
                  <div className="partner-logo-slot">
                    <img
                      src={logo.image}
                      alt={logo.description}
                      title={logo.description}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="partner-logo-slot__img"
                      style={
                        logo.scale && logo.scale !== 1
                          ? { transform: `scale(${logo.scale})` }
                          : undefined
                      }
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-12 bg-gradient-to-r from-[#FFFEF2] to-transparent sm:w-16"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-12 bg-gradient-to-l from-[#FFFEF2] to-transparent sm:w-16"
          />
        </div>
      </div>
    </section>
  )
}
