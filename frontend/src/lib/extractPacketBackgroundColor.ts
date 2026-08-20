function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')}`
}

const DEFAULT_FILL = '#0a2e22'

/**
 * Sample border pixels from a product pack shot and return the dominant
 * background color (the studio / packet plate color behind the pouch).
 */
export function extractPacketBackgroundColor(
  src: string,
  options?: { maxEdge?: number },
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const maxEdge = options?.maxEdge ?? 160
      const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight, 1))
      const w = Math.max(1, Math.round(img.naturalWidth * scale))
      const h = Math.max(1, Math.round(img.naturalHeight * scale))

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) {
        resolve(DEFAULT_FILL)
        return
      }

      ctx.drawImage(img, 0, 0, w, h)
      const { data } = ctx.getImageData(0, 0, w, h)
      const border = Math.max(2, Math.round(Math.min(w, h) * 0.05))
      const buckets = new Map<string, { count: number; r: number; g: number; b: number }>()

      const sample = (x: number, y: number) => {
        const i = (y * w + x) * 4
        const a = data[i + 3]
        if (a < 140) return

        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const qr = Math.round(r / 10) * 10
        const qg = Math.round(g / 10) * 10
        const qb = Math.round(b / 10) * 10
        const key = `${qr},${qg},${qb}`
        const bucket = buckets.get(key) ?? { count: 0, r: 0, g: 0, b: 0 }
        bucket.count += 1
        bucket.r += r
        bucket.g += g
        bucket.b += b
        buckets.set(key, bucket)
      }

      for (let x = 0; x < w; x += 1) {
        for (let y = 0; y < border; y += 1) sample(x, y)
        for (let y = h - border; y < h; y += 1) sample(x, y)
      }
      for (let y = border; y < h - border; y += 1) {
        for (let x = 0; x < border; x += 1) sample(x, y)
        for (let x = w - border; x < w; x += 1) sample(x, y)
      }

      let best: { count: number; r: number; g: number; b: number } | null = null
      for (const bucket of buckets.values()) {
        if (!best || bucket.count > best.count) best = bucket
      }

      if (!best) {
        resolve(DEFAULT_FILL)
        return
      }

      resolve(
        rgbToHex(
          Math.round(best.r / best.count),
          Math.round(best.g / best.count),
          Math.round(best.b / best.count),
        ),
      )
    }
    img.onerror = () => resolve(DEFAULT_FILL)
    img.src = src
  })
}

/** Whether light-colored text reads well on this panel fill. */
export function fillUsesLightText(hex: string): boolean {
  const normalized = hex.trim()
  if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) return true
  const r = parseInt(normalized.slice(1, 3), 16)
  const g = parseInt(normalized.slice(3, 5), 16)
  const b = parseInt(normalized.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.58
}
