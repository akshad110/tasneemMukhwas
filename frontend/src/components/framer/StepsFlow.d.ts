import type { CSSProperties, ForwardRefExoticComponent, RefAttributes } from 'react'

export interface StepsFlowStep {
  number?: string
  title?: string
  text?: string
  image?: string
}

export interface StepsFlowProps {
  steps?: StepsFlowStep[]
  accentColor?: string
  lineColor?: string
  cornerMaskColor?: string
  numberFont?: Record<string, unknown>
  numberColor?: string
  titleFont?: Record<string, unknown>
  titleColor?: string
  textFont?: Record<string, unknown>
  textColor?: string
  numberTitleGap?: number
  titleTextGap?: number
  gridGap?: number
  imageRadius?: number
  mobileBreakpoint?: number
  imageAnimation?: 'none' | 'fade' | 'slideUp'
  mobileImageGap?: number
  lineWidth?: number
  dotSize?: number
  showDots?: boolean
  cornerRadius?: number
  style?: CSSProperties
  className?: string
  [key: string]: unknown
}

declare const StepsFlow: ForwardRefExoticComponent<
  StepsFlowProps & RefAttributes<HTMLElement>
>
export default StepsFlow
