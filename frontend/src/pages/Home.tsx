import { useEffect } from 'react'
import { useLenis } from 'lenis/react'
import AboutJourneyFlow from '../components/about/AboutJourneyFlow'
import AboutZoom from '../components/about/AboutZoom'
import Hero from '../components/hero/Hero'
import Navbar from '../components/nav/Navbar'
import OrbitShowcase from '../components/orbit/OrbitShowcase'
import ContactSection from '../components/contact/ContactSection'
import HomeTestimonials from '../components/testimonials/HomeTestimonials'
import PopularProducts from '../components/products/PopularProducts'
import FloatingActions from '../components/shared/FloatingActions'
import SiteFooter from '../components/shared/SiteFooter'
import TrustBadges from '../components/shared/TrustBadges'
import { scrollToSection, type SectionId } from '../lib/sectionNav'

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
    <main className="bg-[#0a2e22]">
      <Navbar />
      <Hero active={ready} />
      <TrustBadges />
      <OrbitShowcase />
      <div id="about">
        <AboutZoom />
        <AboutJourneyFlow />
      </div>
      <PopularProducts />
      <ContactSection />
      <HomeTestimonials />
      <SiteFooter />

      <FloatingActions />
    </main>
  )
}
