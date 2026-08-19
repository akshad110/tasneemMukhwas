import { motion, useSpring } from 'framer-motion'
import type { ButtonHTMLAttributes, InputHTMLAttributes, MouseEvent, ReactNode } from 'react'

const MAX_TILT = 14

type TiltGlassProps = {
  children: ReactNode
  className?: string
  depth?: number
  glow?: boolean
}

/** Interactive glass slab — mouse-driven 3D tilt. */
export function TiltGlass({ children, className = '', depth = 28, glow = true }: TiltGlassProps) {
  const rotateX = useSpring(0, { stiffness: 180, damping: 22 })
  const rotateY = useSpring(0, { stiffness: 180, damping: 22 })

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * MAX_TILT * 2)
    rotateX.set(-py * MAX_TILT * 2)
  }

  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div className={`account-tilt-wrap ${className}`} style={{ perspective: '1100px' }}>
      <motion.div
        className={`account-tilt-panel ${glow ? 'account-tilt-panel--glow' : ''}`}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          z: depth,
        }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <span className="account-tilt-edge account-tilt-edge--top" aria-hidden />
        <span className="account-tilt-edge account-tilt-edge--left" aria-hidden />
        {children}
      </motion.div>
    </div>
  )
}

type FloatStatProps = {
  label: string
  value: string | number
  hint: string
  onClick?: () => void
  delay?: number
  axis?: 'left' | 'center' | 'right'
}

/** Floating stat monolith with depth offset. */
export function FloatStat({ label, value, hint, onClick, delay = 0, axis = 'center' }: FloatStatProps) {
  const Tag = onClick ? 'button' : 'div'
  const rotY = axis === 'left' ? 8 : axis === 'right' ? -8 : 0
  const shiftX = axis === 'left' ? -6 : axis === 'right' ? 6 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 18, rotateY: rotY }}
      animate={{ opacity: 1, y: 0, rotateX: 6, rotateY: rotY }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className="account-tilt-wrap h-full"
      style={{ perspective: '900px', transform: `translateX(${shiftX}px)` }}
    >
      <Tag
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={`account-float-stat ${onClick ? 'cursor-pointer' : ''}`}
        style={{ transform: `rotateX(8deg) rotateY(${rotY}deg) translateZ(24px)` }}
      >
        <span className="account-float-stat__beam" aria-hidden />
        <span className="account-float-stat__label">{label}</span>
        <span className="account-float-stat__value">{value}</span>
        <span className="account-float-stat__hint">{hint}</span>
      </Tag>
    </motion.div>
  )
}

type OrbitTabProps = {
  label: string
  desc?: string
  active: boolean
  onClick: () => void
  index: number
}

export function OrbitTab({ label, desc, active, onClick, index }: OrbitTabProps) {
  const z = active ? 48 : 12 + index * 4
  const rotY = (index - 1) * 6

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`account-orbit-tab ${active ? 'account-orbit-tab--active' : ''}`}
      style={{
        transform: `rotateY(${rotY}deg) translateZ(${z}px)`,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ translateZ: z + 10 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <span className="account-orbit-tab__label">{label}</span>
      {desc ? <span className="account-orbit-tab__desc">{desc}</span> : null}
    </motion.button>
  )
}

type PortalLinkProps = {
  title: string
  desc: string
  onClick: () => void
  delay?: number
}

export function PortalLink({ title, desc, onClick, delay = 0 }: PortalLinkProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="account-portal-link"
      initial={{ opacity: 0, x: 24, rotateY: -12 }}
      animate={{ opacity: 1, x: 0, rotateY: -6 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotateY: 0, translateZ: 16 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <span className="account-portal-link__ring" aria-hidden />
      <span className="account-portal-link__core" aria-hidden />
      <span className="block text-left">
        <span className="account-portal-link__title">{title}</span>
        <span className="account-portal-link__desc">{desc}</span>
      </span>
    </motion.button>
  )
}

export function AccountScene({ children }: { children: ReactNode }) {
  return (
    <div className="account-scene">
      <div className="account-scene__grid" aria-hidden />
      <div className="account-scene__glow account-scene__glow--a" aria-hidden />
      <div className="account-scene__glow account-scene__glow--b" aria-hidden />
      <div className="account-scene__content">{children}</div>
    </div>
  )
}

export function VaultInput({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="account-vault-field">
      <span className="account-vault-field__label">{label}</span>
      <input className="account-vault-field__input" {...props} />
    </label>
  )
}

export function VaultButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: { children: ReactNode; variant?: 'primary' | 'danger' | 'ghost'; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`account-vault-btn account-vault-btn--${variant} ${className}`.trim()} {...props}>
      <span className="account-vault-btn__shine" aria-hidden />
      {children}
    </button>
  )
}
