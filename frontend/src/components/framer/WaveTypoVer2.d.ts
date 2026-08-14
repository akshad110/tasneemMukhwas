import type { CSSProperties, FC } from 'react'

export type WaveTypoFont = {
  fontFamily?: string
  fontWeight?: number | string
  fontSize?: number | string
  lineHeight?: number | string
  letterSpacing?: number | string
}

export interface WaveTypoVer2Props {
  text?: string
  /** Font style object (despite export typing it as string). */
  font?: WaveTypoFont | string
  fontSize?: number
  initialColor?: string
  hoverColor?: string
  hoverScale?: number
  metaballIntensity?: number
  metaballThreshold?: number
  transitionSpeed?: number
  mobileThreshold?: number
  style?: CSSProperties
  className?: string
  [key: string]: unknown
}

declare const WaveTypoVer2: FC<WaveTypoVer2Props>
export default WaveTypoVer2
