import { Logos3 } from '@/components/ui/logos3'
import { PARTNER_LOGOS } from '@/lib/partners'

export default function OurPartnersMarquee() {
  return (
    <div id="partners">
      <Logos3
        heading="Our Partners"
        subheading="Available through leading retail and quick-commerce platforms across India."
        logos={PARTNER_LOGOS}
        className="px-0 py-10 sm:py-12 md:py-14"
      />
    </div>
  )
}
