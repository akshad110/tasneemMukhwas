import type { CSSProperties, ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react'

export interface ScrollZoomRevealImage {
  src?: string
  srcSet?: string
  alt?: string
}

export interface ScrollZoomRevealProps {
  videoUrl?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  image?: ScrollZoomRevealImage | string
  leftText?: string
  rightText?: string
  buttonText?: string
  leftFont?: Record<string, unknown> | string
  rightFont?: Record<string, unknown> | string
  buttonFont?: Record<string, unknown> | string
  buttonLink?: string
  textColor?: string
  buttonTextColor?: string
  buttonBgColor?: string
  animationStiffness?: number
  animationDamping?: number
  animationMass?: number
  iconType?: 'play' | 'arrow' | 'image' | 'none'
  customIconImage?: string
  style?: CSSProperties
  className?: string
  children?: ReactNode
  [key: string]: unknown
}

declare const ScrollZoomReveal: ForwardRefExoticComponent<
  ScrollZoomRevealProps & RefAttributes<HTMLElement>
>
export default ScrollZoomReveal
