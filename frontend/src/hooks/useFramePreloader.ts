import { useEffect, useRef, useState, type RefObject } from 'react'

export type PreloadedFrames = {
  imagesRef: RefObject<(HTMLImageElement | null)[]>
  readyCount: number
  total: number
  /** True once the first frame is available to paint. */
  isReady: boolean
  /** Ensure frames around `center` are loading / loaded; unload far frames. */
  ensureWindow: (center: number) => void
}

const WINDOW_RADIUS = 24
const EVICT_RADIUS = 48
const CONCURRENCY = 6

/**
 * Windowed frame loader — only keeps nearby frames decoded
 * so 300×1080p sequences don't freeze the tab.
 */
export function useFramePreloader(srcs: string[]): PreloadedFrames {
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const loadingRef = useRef<Set<number>>(new Set())
  const loadedRef = useRef<Set<number>>(new Set())
  const queueRef = useRef<number[]>([])
  const activeRef = useRef(0)
  const srcsRef = useRef(srcs)
  const [readyCount, setReadyCount] = useState(0)
  const [isReady, setIsReady] = useState(false)

  srcsRef.current = srcs

  useEffect(() => {
    imagesRef.current = srcs.map(() => null)
    loadingRef.current = new Set()
    loadedRef.current = new Set()
    queueRef.current = []
    activeRef.current = 0
    setReadyCount(0)
    setIsReady(false)

    return () => {
      imagesRef.current.forEach((img) => {
        if (!img) return
        img.onload = null
        img.onerror = null
        img.src = ''
      })
      imagesRef.current = []
      loadingRef.current.clear()
      loadedRef.current.clear()
      queueRef.current = []
    }
  }, [srcs])

  const pump = () => {
    const list = srcsRef.current
    while (activeRef.current < CONCURRENCY && queueRef.current.length > 0) {
      const i = queueRef.current.shift()
      if (i === undefined) break
      if (loadedRef.current.has(i) || loadingRef.current.has(i)) continue
      if (i < 0 || i >= list.length) continue

      loadingRef.current.add(i)
      activeRef.current += 1

      const img = new Image()
      img.decoding = 'async'
      imagesRef.current[i] = img

      const settle = () => {
        loadingRef.current.delete(i)
        activeRef.current = Math.max(0, activeRef.current - 1)
        loadedRef.current.add(i)
        setReadyCount(loadedRef.current.size)
        if (i === 0 || loadedRef.current.size === 1) setIsReady(true)
        pump()
      }

      img.onload = settle
      img.onerror = settle
      img.src = list[i]
    }
  }

  const ensureWindow = (center: number) => {
    const list = srcsRef.current
    if (list.length === 0) return

    const mid = Math.max(0, Math.min(list.length - 1, center))
    const want = new Set<number>()
    for (
      let i = Math.max(0, mid - WINDOW_RADIUS);
      i <= Math.min(list.length - 1, mid + WINDOW_RADIUS);
      i += 1
    ) {
      want.add(i)
    }

    // Evict far frames to free decoded bitmap memory
    for (const i of [...loadedRef.current]) {
      if (Math.abs(i - mid) > EVICT_RADIUS) {
        const img = imagesRef.current[i]
        if (img) {
          img.onload = null
          img.onerror = null
          img.src = ''
        }
        imagesRef.current[i] = null
        loadedRef.current.delete(i)
      }
    }

    // Prefer closest-to-playhead first
    const ordered = [...want].sort(
      (a, b) => Math.abs(a - mid) - Math.abs(b - mid),
    )
    for (const i of ordered) {
      if (loadedRef.current.has(i) || loadingRef.current.has(i)) continue
      if (!queueRef.current.includes(i)) queueRef.current.push(i)
    }

    // Re-sort queue by distance to playhead
    queueRef.current.sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid))
    pump()
    setReadyCount(loadedRef.current.size)
  }

  // Kick first window on mount
  useEffect(() => {
    ensureWindow(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcs])

  return {
    imagesRef,
    readyCount,
    total: srcs.length,
    isReady,
    ensureWindow,
  }
}
