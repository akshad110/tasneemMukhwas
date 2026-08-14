import type { CSSProperties, ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react'

export interface OrbitDotGlobeLocation {
  name?: string
  /** Format: "Latitude, Longitude" */
  coordinates?: string
  color?: string
  pulse?: boolean
  showLabel?: boolean
  action?: 'none' | 'link' | 'popover'
  url?: string
  newTab?: boolean
}

export interface OrbitDotGlobeProps {
  oceanColor?: string
  landColor?: string
  dotSize?: number
  dotDensity?: number
  autoRotate?: boolean
  labelStyle?: 'auto' | 'marker'
  showQuickStart?: boolean
  locations?: OrbitDotGlobeLocation[]
  popovers?: ReactNode[]
  style?: CSSProperties
}

declare const OrbitDotGlobe: ForwardRefExoticComponent<
  OrbitDotGlobeProps & RefAttributes<HTMLElement>
>

export default OrbitDotGlobe
