import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { couponsApi } from '../../lib/services'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { getActiveSectionId } from '../../lib/sectionNav'
import { BRAND_CREAM, BRAND_GOLD, BRAND_INK, BRAND_SERIF } from '../../lib/brand'

const PANEL = '#1e4a38'
const FRAME = '#ebe4d8'

type Promo = {
  id: string
  scope: string
  productId?: string
  title: string
  label: string
  productName?: string
  productImage?: string
  discountType?: string
  value?: number
}

function discountDisplay(promo: Promo) {
  if (promo.discountType === 'percent' && promo.value != null) {
    return { main: String(promo.value), suffix: '%' }
  }
  if (promo.value != null) {
    return { main: `₹${promo.value}`, suffix: '' }
  }
  const pct = promo.label.match(/(\d+)\s*%/)
  if (pct) return { main: pct[1], suffix: '%' }
  const flat = promo.label.match(/₹(\d+)/)
  if (flat) return { main: `₹${flat[1]}`, suffix: '' }
  return { main: promo.label.split(' ')[0] || 'OFF', suffix: '' }
}

/** Looping discount banner — home hero section only. */
export default function DiscountPromoPopup() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [onHero, setOnHero] = useState(() => getActiveSectionId() === 'home')
  const [dismissed, setDismissed] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [heroCycle, setHeroCycle] = useState(0)
  const wasOnHeroRef = useRef(onHero)

  const promo = useMemo(
    () => promos.find((p) => p.scope === 'product' && p.productImage) || null,
    [promos],
  )

  useLenis(() => {
    setOnHero(getActiveSectionId() === 'home')
  })

  useEffect(() => {
    couponsApi
      .activePromos()
      .then((res) => setPromos(res.items as Promo[]))
      .catch(() => setPromos([]))
  }, [])

  useEffect(() => {
    let ticking = false
    const update = () => {
      setOnHero(getActiveSectionId() === 'home')
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('popstate', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('popstate', update)
    }
  }, [])

  useEffect(() => {
    if (onHero && !wasOnHeroRef.current) {
      setHeroCycle((c) => c + 1)
      setDismissed(false)
    }
    wasOnHeroRef.current = onHero
  }, [onHero])

  useEffect(() => {
    if (!onHero || !promo || dismissed) {
      setShowBanner(false)
      return
    }
    const t = window.setTimeout(() => setShowBanner(true), 500)
    return () => window.clearTimeout(t)
  }, [onHero, promo, dismissed, heroCycle])

  if (!promo || !onHero || !showBanner || dismissed) return null

  const { main, suffix } = discountDisplay(promo)

  return (
    <div
      className="pointer-events-none fixed right-0 z-[110] w-[min(calc(100vw-1rem),21.5rem)] overflow-hidden px-3 max-md:bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-8 md:px-5"
      aria-live="polite"
    >
      <motion.aside
        key={heroCycle}
        role="dialog"
        aria-label="Special discount offer"
        className="pointer-events-auto relative flex overflow-hidden rounded-[1.1rem] shadow-[0_18px_48px_-16px_rgba(10,46,34,0.55)]"
        style={{ minHeight: '6.75rem' }}
        initial={{ x: '110%' }}
        animate={{ x: ['110%', '0%', '0%', '110%'] }}
        transition={{
          duration: 11,
          times: [0, 0.22, 0.72, 1],
          repeat: Infinity,
          repeatDelay: 0.35,
          ease: ['easeOut', 'linear', 'easeIn'],
        }}
      >
        <div
          className="flex w-[38%] shrink-0 items-center justify-center p-2.5 sm:p-3"
          style={{ backgroundColor: FRAME }}
        >
          <div
            className="flex aspect-square w-full max-w-[5.5rem] items-center justify-center overflow-hidden rounded-md border-2 p-1.5 sm:max-w-[6rem]"
            style={{ borderColor: BRAND_CREAM, backgroundColor: '#fff' }}
          >
            <img src={promo.productImage} alt="" className="h-full w-full object-contain" />
          </div>
        </div>

        <div
          className="relative flex min-w-0 flex-1 flex-col justify-center gap-2 px-3 py-3 sm:px-4 sm:py-3.5"
          style={{ backgroundColor: PANEL }}
        >
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="absolute right-2 top-1.5 cursor-pointer border-0 bg-transparent p-0 text-[1rem] leading-none opacity-70 transition hover:opacity-100"
            style={{ color: BRAND_CREAM }}
            aria-label="Dismiss offer"
          >
            ×
          </button>

          <p
            className="m-0 pr-5 text-[0.58rem] font-medium tracking-[0.22em] uppercase sm:text-[0.62rem]"
            style={{ fontFamily: BRAND_SERIF, color: BRAND_CREAM }}
          >
            Special discount
          </p>

          <div className="flex items-end gap-2 pr-1">
            <p className="m-0 leading-none" style={{ color: BRAND_CREAM }}>
              <span
                className="text-[2.35rem] font-bold tracking-tight sm:text-[2.65rem]"
                style={{ fontFamily: BRAND_SERIF }}
              >
                {main}
              </span>
              {suffix && (
                <span className="ml-0.5 text-[1.15rem] font-semibold sm:text-[1.25rem]" style={{ color: BRAND_GOLD }}>
                  {suffix}
                </span>
              )}
            </p>
          </div>

          {promo.productName && (
            <p className="m-0 truncate pr-1 text-[0.62rem] opacity-80 sm:text-[0.68rem]" style={{ color: BRAND_CREAM }}>
              on {promo.productName}
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              setDismissed(true)
              navigateApp(APP_ROUTES.shop)
            }}
            className="mt-0.5 w-fit cursor-pointer rounded-md border-0 px-3.5 py-1.5 text-[0.68rem] font-semibold tracking-wide transition hover:scale-[1.02] sm:text-[0.72rem]"
            style={{ backgroundColor: BRAND_CREAM, color: BRAND_INK }}
          >
            Shop now
          </button>
        </div>
      </motion.aside>
    </div>
  )
}
