import { useEffect, useMemo, useRef, type CSSProperties } from 'react'
import { useFramePreloader } from '../../hooks/useFramePreloader'
import { keyBlackToCanvas } from '../../lib/keyBlackBackground'

export type ScrollFrameSequenceProps = {
  frames: string[]
  backgroundSrc?: string
  scrollHeightVh?: number
  fitScale?: number
  /** Punch out the frame plate so only the product sits on the page green. */
  removeBackground?: boolean
  alt?: string
  className?: string
  style?: CSSProperties
  onFrameChange?: (frameIndex: number, progress: number) => void
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

/**
 * Scroll-scrubbed frame sequence.
 * Background keying runs once per loaded frame (cached, downscaled) — not on every scroll tick.
 */
export default function ScrollFrameSequence({
  frames,
  backgroundSrc,
  scrollHeightVh,
  fitScale = 0.72,
  removeBackground = true,
  alt = 'Product animation',
  className = '',
  style,
  onFrameChange,
}: ScrollFrameSequenceProps) {
  const trackRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameIndexRef = useRef(0)
  const rafRef = useRef(0)
  const keyRafRef = useRef(0)
  const keyedRef = useRef<(HTMLCanvasElement | null)[]>([])
  const keyingRef = useRef<Set<number>>(new Set())
  const onFrameChangeRef = useRef(onFrameChange)
  const fitScaleRef = useRef(fitScale)
  const removeBgRef = useRef(removeBackground)
  const ensureWindowRef = useRef<(center: number) => void>(() => {})
  const drawRef = useRef<(index: number) => void>(() => {})

  const frameKey = useMemo(() => frames.join('|'), [frames])
  const stableFrames = useMemo(() => frames, [frameKey])

  const { imagesRef, isReady, readyCount, total, ensureWindow } =
    useFramePreloader(stableFrames)

  const totalFrames = stableFrames.length
  const travelVh =
    scrollHeightVh ?? Math.max(380, Math.round(totalFrames * 2.2))

  onFrameChangeRef.current = onFrameChange
  fitScaleRef.current = fitScale
  removeBgRef.current = removeBackground
  ensureWindowRef.current = ensureWindow

  useEffect(() => {
    keyedRef.current = stableFrames.map(() => null)
    keyingRef.current.clear()
  }, [stableFrames])

  useEffect(() => {
    const track = trackRef.current
    const canvas = canvasRef.current
    if (!track || !canvas || totalFrames < 1) return

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctx) return

    const resizeIfNeeded = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      if (!cssW || !cssH) return false
      const tw = Math.round(cssW * dpr)
      const th = Math.round(cssH * dpr)
      if (canvas.width !== tw || canvas.height !== th) {
        canvas.width = tw
        canvas.height = th
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      return true
    }

    const drawSource = (
      source: CanvasImageSource & { width: number; height: number },
    ) => {
      if (!resizeIfNeeded()) return
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      ctx.clearRect(0, 0, cssW, cssH)
      const scale =
        Math.min(cssW / source.width, cssH / source.height) * fitScaleRef.current
      const w = source.width * scale
      const h = source.height * scale
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'medium'
      ctx.drawImage(source, (cssW - w) / 2, (cssH - h) / 2, w, h)
    }

    const paintImg = (img: HTMLImageElement) => {
      if (!resizeIfNeeded()) return
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      ctx.clearRect(0, 0, cssW, cssH)
      const scale =
        Math.min(cssW / img.naturalWidth, cssH / img.naturalHeight) *
        fitScaleRef.current
      ctx.drawImage(
        img,
        (cssW - img.naturalWidth * scale) / 2,
        (cssH - img.naturalHeight * scale) / 2,
        img.naturalWidth * scale,
        img.naturalHeight * scale,
      )
    }

    const queueKey = (index: number) => {
      if (!removeBgRef.current) return
      if (keyedRef.current[index] || keyingRef.current.has(index)) return
      const img = imagesRef.current[index]
      if (!img?.complete || !img.naturalWidth) return

      keyingRef.current.add(index)
      const run = () => {
        try {
          if (!imagesRef.current[index]) {
            keyingRef.current.delete(index)
            return
          }
          keyedRef.current[index] = keyBlackToCanvas(img, { maxEdge: 960 })
          keyingRef.current.delete(index)
          if (frameIndexRef.current === index) drawClean(index)
        } catch {
          keyingRef.current.delete(index)
        }
      }

      const ric = (
        window as Window & {
          requestIdleCallback?: (
            cb: () => void,
            opts?: { timeout: number },
          ) => number
        }
      ).requestIdleCallback
      if (typeof ric === 'function') ric(run, { timeout: 90 })
      else globalThis.setTimeout(run, 0)
    }

    const drawClean = (index: number) => {
      const keyed = keyedRef.current[index]
      if (keyed) {
        drawSource(keyed)
        return
      }

      const img = imagesRef.current[index]
      if (img?.complete && img.naturalWidth) {
        paintImg(img)
        queueKey(index)
        return
      }

      for (let d = 1; d < 16; d += 1) {
        const ka = keyedRef.current[index - d]
        const kb = keyedRef.current[index + d]
        if (ka) return drawSource(ka)
        if (kb) return drawSource(kb)
        const a = imagesRef.current[index - d]
        const b = imagesRef.current[index + d]
        if (a?.complete && a.naturalWidth) return paintImg(a)
        if (b?.complete && b.naturalWidth) return paintImg(b)
      }
    }

    drawRef.current = drawClean

    const prefetchKeys = (center: number) => {
      if (!removeBgRef.current) return
      if (keyRafRef.current) return
      keyRafRef.current = window.requestAnimationFrame(() => {
        keyRafRef.current = 0
        for (let d = 0; d <= 5; d += 1) {
          const i = center + d
          if (i >= 0 && i < totalFrames) queueKey(i)
          if (d > 0) {
            const j = center - d
            if (j >= 0) queueKey(j)
          }
        }
      })
    }

    const readFrame = () => {
      const scrollable = track.offsetHeight - window.innerHeight
      if (scrollable <= 0) return 0
      const progress = clamp01(-track.getBoundingClientRect().top / scrollable)
      return totalFrames === 1
        ? 0
        : Math.min(totalFrames - 1, Math.floor(progress * (totalFrames - 1)))
    }

    const sync = (force = false) => {
      const next = readFrame()
      ensureWindowRef.current(next)

      for (let i = 0; i < totalFrames; i += 1) {
        if (!imagesRef.current[i] && keyedRef.current[i]) {
          keyedRef.current[i] = null
        }
      }

      if (!force && next === frameIndexRef.current) {
        prefetchKeys(next)
        return
      }
      frameIndexRef.current = next
      drawClean(next)
      prefetchKeys(next)

      const scrollable = track.offsetHeight - window.innerHeight
      const progress =
        scrollable <= 0
          ? 0
          : clamp01(-track.getBoundingClientRect().top / scrollable)
      onFrameChangeRef.current?.(next, progress)
    }

    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0
        sync(false)
      })
    }

    const onResize = () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0
        sync(true)
      })
    }

    ensureWindowRef.current(0)
    sync(true)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
      if (keyRafRef.current) window.cancelAnimationFrame(keyRafRef.current)
    }
  }, [imagesRef, isReady, totalFrames])

  useEffect(() => {
    if (!isReady && readyCount === 0) return
    drawRef.current(frameIndexRef.current)
  }, [readyCount, isReady])

  return (
    <section
      ref={trackRef}
      className={`relative bg-[#0a2e22] ${className}`}
      style={{ height: `${travelVh}vh`, ...style }}
      aria-label={alt}
    >
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden">
        {backgroundSrc ? (
          <img
            src={backgroundSrc}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(20,40,32,0.1), rgba(6,12,10,0.4) 75%)',
          }}
        />

        <canvas
          ref={canvasRef}
          className="relative z-[1] h-full w-full"
          role="img"
          aria-label={alt}
        />

        {!isReady ? (
          <div className="pointer-events-none absolute bottom-6 left-1/2 z-[2] -translate-x-1/2 text-xs tracking-wide text-[#f3e6c8]/50">
            Loading {Math.min(readyCount, total)}/{total}
          </div>
        ) : null}
      </div>
    </section>
  )
}
