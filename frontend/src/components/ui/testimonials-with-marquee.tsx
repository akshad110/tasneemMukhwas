import { cn } from '@/lib/utils'
import { TestimonialCard, type TestimonialAuthor } from '@/components/ui/testimonial-card'

const SECTION_BG = '#F8F3E7'

export interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    rating?: number
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({
  title,
  description,
  testimonials,
  className,
}: TestimonialsSectionProps) {
  if (!testimonials.length) return null

  return (
    <section
      id="testimonials"
      className={cn('text-foreground', 'px-0 py-12 sm:py-20 md:py-24', className)}
      style={{ backgroundColor: SECTION_BG }}
    >
      <div className="mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-14">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-6">
          <p
            className="m-0 text-[0.68rem] font-semibold tracking-[0.2em] uppercase"
            style={{ color: '#b8860b', fontFamily: 'Montserrat, system-ui, sans-serif' }}
          >
            Real reviews
          </p>
          <h2
            className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight"
            style={{ color: '#0a2e22', fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {title}
          </h2>
          <p
            className="text-md max-w-[640px] font-medium sm:text-xl"
            style={{ color: 'rgba(10,46,34,0.62)', fontFamily: 'Montserrat, system-ui, sans-serif' }}
          >
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex w-full overflow-hidden p-2 [--duration:45s] [--gap:1rem]">
            <div className="flex min-w-max shrink-0 animate-marquee flex-row [gap:var(--gap)] group-hover:[animation-play-state:paused]">
              {[...testimonials, ...testimonials].map((testimonial, i) => (
                <TestimonialCard key={`marquee-${i}`} {...testimonial} />
              ))}
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 sm:block"
            style={{ background: `linear-gradient(to right, ${SECTION_BG}, transparent)` }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/4 sm:block"
            style={{ background: `linear-gradient(to left, ${SECTION_BG}, transparent)` }}
          />
        </div>
      </div>
    </section>
  )
}
