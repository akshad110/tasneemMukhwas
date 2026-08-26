import { lazy, Suspense, useEffect } from 'react'
import { useLenis } from 'lenis/react'
import Hero from '../components/hero/Hero'
import Navbar from '../components/nav/Navbar'
import OurProductsCarousel from '../components/products/OurProductsCarousel'
import OurPartnersMarquee from '../components/partners/OurPartnersMarquee'
import GlobalReachSection from '../components/partners/GlobalReachSection'
import QualityPromiseSection from '../components/home/QualityPromiseSection'
import BeOurPartner from '../components/partners/BeOurPartner'
import FloatingActions from '../components/shared/FloatingActions'
import DiscountPromoPopup from '../components/shared/DiscountPromoPopup'
import SiteFooter from '../components/shared/SiteFooter'
import TrustBadges from '../components/shared/TrustBadges'
import DeferredMount from '../components/shared/DeferredMount'
import SectionPlaceholder from '../components/shared/SectionPlaceholder'
import { scrollToSection, type SectionId } from '../lib/sectionNav'

const AboutZoom = lazy(() => import('../components/about/AboutZoom'))

type HomeProps = {
  ready?: boolean
}

export default function Home({ ready = true }: HomeProps) {
  const lenis = useLenis()

  useEffect(() => {
    if (!ready) return
    const pending = sessionStorage.getItem('tm-pending-section') as SectionId | null
    if (!pending) return
    sessionStorage.removeItem('tm-pending-section')
    const t = window.setTimeout(() => {
      scrollToSection(pending, lenis)
    }, 80)
    return () => window.clearTimeout(t)
  }, [ready, lenis])

  return (
    <main className="overflow-x-clip" style={{ backgroundColor: '#F8F3E7' }}>
      <Navbar />
      <Hero />
      <TrustBadges />
      <OurProductsCarousel />
      <OurPartnersMarquee />
      <GlobalReachSection />

      <DeferredMount fallback={<SectionPlaceholder minHeight="40vh" className="bg-[#FFFEF2]" />}>
        <Suspense fallback={<SectionPlaceholder minHeight="40vh" className="bg-[#FFFEF2]" />}>
          <AboutZoom />
        </Suspense>
      </DeferredMount>

      <QualityPromiseSection />
      <BeOurPartner />
      <SiteFooter />

      <FloatingActions />
      {ready ? <DiscountPromoPopup /> : null}
    </main>
  )
}
