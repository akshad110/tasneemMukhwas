import { lazy, Suspense, useEffect } from 'react'
import { useLenis } from 'lenis/react'
import Hero from '../components/hero/Hero'
import Navbar from '../components/nav/Navbar'
import PopularProducts from '../components/products/PopularProducts'
import FloatingActions from '../components/shared/FloatingActions'
import DiscountPromoPopup from '../components/shared/DiscountPromoPopup'
import SiteFooter from '../components/shared/SiteFooter'
import TrustBadges from '../components/shared/TrustBadges'
import DeferredMount from '../components/shared/DeferredMount'
import SectionPlaceholder from '../components/shared/SectionPlaceholder'
import { scrollToSection, type SectionId } from '../lib/sectionNav'

const OrbitShowcase = lazy(() => import('../components/orbit/OrbitShowcase'))
const AboutZoom = lazy(() => import('../components/about/AboutZoom'))
const AboutJourneyFlow = lazy(() => import('../components/about/AboutJourneyFlow'))
const ContactSection = lazy(() => import('../components/contact/ContactSection'))
const HomeTestimonials = lazy(() => import('../components/testimonials/HomeTestimonials'))
const HomeReviewStrip = lazy(() => import('../components/reviews/HomeReviewStrip'))

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
    <main className="bg-white">
      <Navbar />
      <Hero />
      <TrustBadges />

      <DeferredMount minHeight="85vh" fallback={<SectionPlaceholder minHeight="85vh" className="bg-[#0a2e22]" />}>
        <Suspense fallback={<SectionPlaceholder minHeight="85vh" className="bg-[#0a2e22]" />}>
          <OrbitShowcase />
        </Suspense>
      </DeferredMount>

      <div id="about">
        <DeferredMount minHeight="70vh" fallback={<SectionPlaceholder minHeight="70vh" />}>
          <Suspense fallback={<SectionPlaceholder minHeight="70vh" />}>
            <AboutZoom />
          </Suspense>
        </DeferredMount>
        <DeferredMount minHeight="60vh" fallback={<SectionPlaceholder minHeight="60vh" />}>
          <Suspense fallback={<SectionPlaceholder minHeight="60vh" />}>
            <AboutJourneyFlow />
          </Suspense>
        </DeferredMount>
      </div>

      <PopularProducts />

      <DeferredMount minHeight="55vh" fallback={<SectionPlaceholder minHeight="55vh" className="bg-[#f2f4f5]" />}>
        <Suspense fallback={<SectionPlaceholder minHeight="55vh" className="bg-[#f2f4f5]" />}>
          <ContactSection />
        </Suspense>
      </DeferredMount>

      <DeferredMount minHeight="40vh" fallback={<SectionPlaceholder minHeight="40vh" />}>
        <Suspense fallback={<SectionPlaceholder minHeight="40vh" />}>
          <HomeTestimonials />
        </Suspense>
      </DeferredMount>

      <DeferredMount minHeight="28vh" fallback={<SectionPlaceholder minHeight="28vh" />}>
        <Suspense fallback={<SectionPlaceholder minHeight="28vh" />}>
          <HomeReviewStrip />
        </Suspense>
      </DeferredMount>

      <SiteFooter />

      <FloatingActions />
      {ready ? <DiscountPromoPopup /> : null}
    </main>
  )
}
