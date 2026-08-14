import { ReactLenis, useLenis } from 'lenis/react'
import type { LenisOptions } from 'lenis'
import { useEffect, type ReactNode } from 'react'

/** Cap a single wheel tick so fast flicks can't jump past scroll-driven sections. */
const MAX_WHEEL_DELTA = 48

const LENIS_OPTIONS: LenisOptions = {
  autoRaf: true,
  smoothWheel: true,
  lerp: 0.08,
  wheelMultiplier: 0.6,
  touchMultiplier: 0.85,
  syncTouch: false,
  respectReducedMotion: true,
  // Prevent Lenis from fighting native overflow lock leftovers
  allowNestedScroll: true,
  virtualScroll: (data) => {
    if (Math.abs(data.deltaY) > MAX_WHEEL_DELTA) {
      data.deltaY = Math.sign(data.deltaY) * MAX_WHEEL_DELTA
    }
    if (Math.abs(data.deltaX) > MAX_WHEEL_DELTA) {
      data.deltaX = Math.sign(data.deltaX) * MAX_WHEEL_DELTA
    }
    return true
  },
}

function clearOverflowLocks() {
  document.documentElement.style.removeProperty('overflow')
  document.body.style.removeProperty('overflow')
  document.documentElement.classList.remove('lenis-stopped')
  document.body.classList.remove('lenis-stopped')
}

function KeepLenisHealthy() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    clearOverflowLocks()
    lenis.start()
    lenis.scrollTo(0, { immediate: true })
    lenis.resize()

    const refresh = () => {
      clearOverflowLocks()
      if (lenis.isStopped) lenis.start()
      lenis.resize()
    }

    // Images / sticky sections change page height after mount — Lenis must remeasure
    const onLoad = () => refresh()
    window.addEventListener('load', onLoad)
    window.addEventListener('resize', refresh)

    const ro = new ResizeObserver(() => refresh())
    ro.observe(document.body)

    // Periodic safety net if scroll feels frozen mid-page
    const id = window.setInterval(() => {
      if (document.body.style.overflow === 'hidden') return
      if (lenis.isStopped) lenis.start()
      lenis.resize()
    }, 2500)

    // Recover if wheel events fire but Lenis is stopped unexpectedly
    const onWheel = () => {
      if (document.body.style.overflow === 'hidden') return
      if (lenis.isStopped) {
        clearOverflowLocks()
        lenis.start()
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchmove', onWheel, { passive: true })

    return () => {
      window.removeEventListener('load', onLoad)
      window.removeEventListener('resize', refresh)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', onWheel)
      ro.disconnect()
      window.clearInterval(id)
    }
  }, [lenis])

  return null
}

type SmoothScrollProps = {
  children: ReactNode
  enabled?: boolean
}

/**
 * Page-wide smooth scroll — damps fast wheel/trackpad so Orbit / About zoom stay readable.
 */
export default function SmoothScroll({
  children,
  enabled = true,
}: SmoothScrollProps) {
  useEffect(() => {
    if (!enabled) clearOverflowLocks()
  }, [enabled])

  if (!enabled) return children

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <KeepLenisHealthy />
      {children}
    </ReactLenis>
  )
}

/** Optional helper for modals that need to pause smooth scroll. */
export function useLenisLock(locked: boolean) {
  const lenis = useLenis()
  useEffect(() => {
    if (!lenis) {
      if (locked) document.body.style.overflow = 'hidden'
      else document.body.style.removeProperty('overflow')
      return
    }
    if (locked) lenis.stop()
    else {
      document.body.style.removeProperty('overflow')
      lenis.start()
      lenis.resize()
    }
    return () => {
      document.body.style.removeProperty('overflow')
      lenis.start()
    }
  }, [lenis, locked])
}
