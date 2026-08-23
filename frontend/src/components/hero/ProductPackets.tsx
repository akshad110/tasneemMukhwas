import gsap from 'gsap'
import { useLenis } from 'lenis/react'
import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { HERO_PACKETS } from '../../lib/products'
import { scrollToSection } from '../../lib/sectionNav'

const FAN = [
  { xPercent: -92, rotate: -14, z: 1, y: 12, scale: 0.92 },
  { xPercent: -50, rotate: 0, z: 3, y: -8, scale: 1.08 },
  { xPercent: -8, rotate: 14, z: 2, y: 12, scale: 0.92 },
] as const

const CREAM = '#f2f4f5'
const INK = '#0a2e22'

export default function ProductPackets() {
  const rootRef = useRef<HTMLDivElement>(null)
  const floatTweens = useRef<gsap.core.Tween[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const lenis = useLenis()

  const goProducts = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToSection('products', lenis)
  }

  useLayoutEffect(() => {
    if (!rootRef.current) return

    const packets = rootRef.current.querySelectorAll<HTMLElement>('[data-packet]')
    floatTweens.current = []

    const ctx = gsap.context(() => {
      gsap.set(packets, {
        opacity: 1,
        y: (i) => FAN[i]?.y ?? 0,
        scale: (i) => FAN[i]?.scale ?? 1,
        rotate: (i) => FAN[i]?.rotate ?? 0,
        xPercent: (i) => FAN[i]?.xPercent ?? -50,
        transformOrigin: '50% 100%',
      })

      packets.forEach((el, i) => {
        const tween = gsap.to(el, {
          y: (FAN[i]?.y ?? 0) - (i === 1 ? 10 : 6),
          duration: 2.1 + i * 0.18,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.4 + i * 0.15,
        })
        floatTweens.current.push(tween)
      })
    }, rootRef)

    return () => {
      floatTweens.current = []
      ctx.revert()
    }
  }, [])

  const handleEnter = (id: string, index: number) => {
    setHoveredId(id)
    floatTweens.current[index]?.pause()
  }

  const handleLeave = (index: number) => {
    setHoveredId(null)
    floatTweens.current[index]?.resume()
  }

  return (
    <div
      ref={rootRef}
      className="relative mx-auto flex h-[min(42vh,380px)] w-full max-w-5xl items-center justify-center sm:h-[min(48vh,440px)] md:h-[min(50vh,460px)]"
      aria-label="Featured mukhwas packets"
    >
      {HERO_PACKETS.map((packet, i) => {
        const isHovered = hoveredId === packet.id
        const baseZ = FAN[i].z

        return (
          <div
            key={packet.id}
            data-packet
            className="absolute bottom-[16%] left-1/2 w-[min(36vw,200px)] will-change-transform sm:w-[min(40vw,240px)] md:w-[min(42vw,280px)]"
            style={{
              zIndex: isHovered ? 20 : baseZ,
              opacity: 1,
              transform: `translate(-50%, ${FAN[i].y}px) translateX(${FAN[i].xPercent}%) rotate(${FAN[i].rotate}deg) scale(${FAN[i].scale})`,
            }}
            onMouseEnter={() => handleEnter(packet.id, i)}
            onMouseLeave={() => handleLeave(i)}
          >
            <div
              className="pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: `translate(-50%, ${isHovered ? '-0.35rem' : '0.4rem'})`,
                transition:
                  'opacity 220ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              role="tooltip"
              aria-hidden={!isHovered}
            >
              <div
                className="relative whitespace-nowrap rounded-2xl px-3.5 py-2 text-center shadow-[0_8px_24px_rgba(0,0,0,0.28)]"
                style={{
                  backgroundColor: CREAM,
                  color: INK,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <p className="m-0 text-[0.78rem] font-semibold leading-tight tracking-wide">
                  {packet.name}
                </p>
                <p className="m-0 mt-0.5 text-[0.68rem] font-medium tracking-wide opacity-80">
                  Order now
                </p>
                <span
                  aria-hidden
                  className="absolute left-1/2 top-full -mt-px -translate-x-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: `7px solid ${CREAM}`,
                  }}
                />
              </div>
            </div>

            <a
              href="/products"
              onClick={goProducts}
              className="relative block cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#f2f4f5]/70"
              aria-label={`Order ${packet.name} now`}
              onFocus={() => handleEnter(packet.id, i)}
              onBlur={() => handleLeave(i)}
            >
              <img
                src={packet.src}
                alt={packet.alt}
                draggable={false}
                decoding="sync"
                fetchPriority={i === 1 ? 'high' : 'auto'}
                loading="eager"
                className="h-auto w-full select-none drop-shadow-[0_28px_40px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out"
                style={{
                  transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                }}
              />
            </a>
          </div>
        )
      })}
    </div>
  )
}
