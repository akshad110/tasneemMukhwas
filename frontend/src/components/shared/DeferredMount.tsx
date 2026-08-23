import { useEffect, useRef, useState, type ReactNode } from 'react'

type DeferredMountProps = {
  children: ReactNode
  fallback?: ReactNode
  /** IntersectionObserver root margin — load slightly before entering viewport */
  rootMargin?: string
  minHeight?: string | number
  className?: string
}

/**
 * Mount children only when the placeholder nears the viewport.
 * Keeps heavy below-the-fold sections off the main thread until needed.
 */
export default function DeferredMount({
  children,
  fallback = null,
  rootMargin = '320px 0px',
  minHeight,
  className,
}: DeferredMountProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) return
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [visible, rootMargin])

  return (
    <div ref={ref} className={className} style={minHeight !== undefined ? { minHeight } : undefined}>
      {visible ? children : fallback}
    </div>
  )
}
