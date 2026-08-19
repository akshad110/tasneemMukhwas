import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { couponsApi } from '../../lib/services'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const CREAM = '#f2f4f5'

type Promo = {
  id: string
  scope: string
  productId?: string
  title: string
  label: string
  productName?: string
  productImage?: string
}

const DISMISS_KEY = 'tm-promo-dismissed'

function loadDismissed(): Set<string> {
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

function dismissPromo(id: string) {
  const set = loadDismissed()
  set.add(id)
  sessionStorage.setItem(DISMISS_KEY, JSON.stringify([...set]))
}

/** Slide-in product discount popup when a product-specific offer is active. */
export default function DiscountPromoPopup() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [visible, setVisible] = useState(false)

  const promo = useMemo(() => {
    const dismissed = loadDismissed()
    return promos.find((p) => p.scope === 'product' && p.productImage && !dismissed.has(p.id)) || null
  }, [promos])

  useEffect(() => {
    couponsApi
      .activePromos()
      .then((res) => setPromos(res.items as Promo[]))
      .catch(() => setPromos([]))
  }, [])

  useEffect(() => {
    if (!promo) return
    const t = window.setTimeout(() => setVisible(true), 800)
    return () => window.clearTimeout(t)
  }, [promo])

  const close = () => {
    if (!promo) return
    dismissPromo(promo.id)
    setVisible(false)
  }

  const goShop = () => {
    close()
    navigateApp(APP_ROUTES.shop)
  }

  return (
    <AnimatePresence>
      {promo && visible && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[5.5rem] sm:justify-end sm:px-6 sm:pt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-live="polite"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default border-0 bg-[#0a2e22]/28 backdrop-blur-[2px]"
            aria-label="Dismiss offer backdrop"
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-label="Special discount offer"
            initial={{ x: 120, opacity: 0, scale: 0.94 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 140, opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="relative w-full max-w-[min(100%,22rem)] overflow-hidden rounded-2xl border shadow-[0_24px_60px_-20px_rgba(10,46,34,0.55)]"
            style={{ borderColor: 'rgba(184,134,11,0.45)', backgroundColor: CREAM }}
          >
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ backgroundColor: INK, color: CREAM }}
            >
              <span className="text-[0.62rem] font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>
                Special offer
              </span>
              <button
                type="button"
                onClick={close}
                className="cursor-pointer border-0 bg-transparent text-[1.1rem] leading-none"
                style={{ color: CREAM }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-[88px_1fr] gap-3 p-4">
              <div
                className="overflow-hidden rounded-xl border p-1.5"
                style={{ borderColor: 'rgba(10,46,34,0.1)', backgroundColor: '#fff' }}
              >
                <img src={promo.productImage} alt="" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="m-0 text-[0.62rem] font-semibold tracking-[0.14em] uppercase" style={{ color: GOLD }}>
                  {promo.label}
                </p>
                <p className="mt-1 m-0 text-[0.95rem] font-bold leading-snug" style={{ color: INK }}>
                  {promo.title}
                </p>
                {promo.productName && (
                  <p className="mt-1 m-0 text-[0.72rem]" style={{ color: 'rgba(10,46,34,0.62)' }}>
                    on {promo.productName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 px-4 pb-4">
              <button
                type="button"
                onClick={goShop}
                className="flex-1 cursor-pointer rounded-full border-0 py-2.5 text-[0.72rem] font-bold tracking-[0.1em] uppercase"
                style={{ backgroundColor: INK, color: CREAM }}
              >
                Shop now
              </button>
              <button
                type="button"
                onClick={close}
                className="cursor-pointer rounded-full border px-4 py-2.5 text-[0.72rem] font-semibold"
                style={{ borderColor: 'rgba(10,46,34,0.18)', color: INK, backgroundColor: 'transparent' }}
              >
                Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
