import type { CSSProperties, ForwardRefExoticComponent, RefAttributes } from 'react'

export interface OrbitProjectItem {
  image?: string
  label?: string
  link?: string | { url?: string; href?: string }
}

export interface OrbitProjectProps {
  /**
   * Projects — pass as `items` not `projects`.
   */
  items?: OrbitProjectItem[]
  /**
   * Background
   * @default "#D4D4D4"
   */
  background?: string
  /**
   * Content
   */
  content?: Record<string, unknown>
  /**
   * Cards
   */
  cards?: Record<string, unknown>
  /**
   * Motion
   */
  motion?: Record<string, unknown>
  /**
   * Desktop grid — pass as `grid` not `desktopGrid`.
   */
  grid?: Record<string, unknown>
  /**
   * Responsive
   */
  responsive?: Record<string, unknown>
  /**
   * Canvas
   */
  canvas?: Record<string, unknown>
  style?: CSSProperties
  /** Additional properties */
  [key: string]: unknown
}

declare const OrbitProject: ForwardRefExoticComponent<
  OrbitProjectProps & RefAttributes<HTMLElement>
>
export default OrbitProject
