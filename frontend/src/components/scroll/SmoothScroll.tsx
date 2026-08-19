import { ReactLenis, useLenis } from 'lenis/react'
import type { LenisOptions } from 'lenis'
import { useEffect, type ReactNode } from 'react'
import { refreshScrollLayout, scrollAppToTop, setScrollController } from '../../lib/scrollControl'

/** Cap wheel delta so scroll-driven home sections stay readable without feeling sluggish site-wide. */
const MAX_WHEEL_DELTA = 80

const LENIS_OPTIONS: LenisOptions = {
  autoRaf: true,
  smoothWheel: true,
  lerp: 0.12,
  wheelMultiplier: 0.92,
  touchMultiplier: 1,
  syncTouch: true,
  respectReducedMotion: true,
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

    setScrollController(lenis)
    clearOverflowLocks()
    lenis.start()
    lenis.resize()

    const refresh = () => {
      clearOverflowLocks()
      if (lenis.isStopped) lenis.start()
      lenis.resize()
    }

    const onLoad = () => refresh()
    window.addEventListener('load', onLoad)
    window.addEventListener('resize', refresh)

    const ro = new ResizeObserver(() => refresh())
    ro.observe(document.body)

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
      setScrollController(null)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('resize', refresh)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', onWheel)
      ro.disconnect()
    }
  }, [lenis])

  return null
}

/** Reset scroll position when SPA route changes. */
export function RouteScrollReset({ routeKey }: { routeKey: string }) {
  useEffect(() => {
    scrollAppToTop(true)
    const id = window.requestAnimationFrame(() => {
      scrollAppToTop(true)
      refreshScrollLayout()
    })
    return () => window.cancelAnimationFrame(id)
  }, [routeKey])

  return null
}

type SmoothScrollProps = {
  children: ReactNode
  enabled?: boolean
}

/** App-wide Lenis smooth scroll — wraps every page for consistent feel. */
export default function SmoothScroll({ children, enabled = true }: SmoothScrollProps) {
  useEffect(() => {
    if (!enabled) {
      setScrollController(null)
      clearOverflowLocks()
    }
  }, [enabled])

  if (!enabled) return children

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <KeepLenisHealthy />
      {children}
    </ReactLenis>
  )
}

/** Pause smooth scroll while modals / drawers are open. */
export function useLenisLock(locked: boolean) {
  const lenis = useLenis()
  useEffect(() => {
    if (locked) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      lenis?.stop()
    } else {
      document.documentElement.style.removeProperty('overflow')
      document.body.style.removeProperty('overflow')
      lenis?.start()
      lenis?.resize()
    }
    return () => {
      document.documentElement.style.removeProperty('overflow')
      document.body.style.removeProperty('overflow')
      lenis?.start()
      lenis?.resize()
    }
  }, [lenis, locked])
}
