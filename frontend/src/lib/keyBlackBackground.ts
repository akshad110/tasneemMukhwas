/**
 * Remove studio / export backgrounds so the site green shows through.
 *
 * Modes (auto-detected from corner pixels):
 *  - flood: textured/solid green (or any) bg matching the frame edges
 *  - black: near-black studio void
 *  - checker: gray/white checkerboard JPG exports
 */

export type KeyBackgroundOptions = {
  /** Downscale long edge before keying (keeps scroll smooth on 1080p+). */
  maxEdge?: number
}

function chroma(r: number, g: number, b: number) {
  return Math.max(r, g, b) - Math.min(r, g, b)
}

function colorDist(
  a: [number, number, number],
  b: [number, number, number],
) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])
}

function sampleCorners(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): [number, number, number] {
  const at = (x: number, y: number): [number, number, number] => {
    const i = (y * width + x) * 4
    return [data[i], data[i + 1], data[i + 2]]
  }
  const samples = [
    at(0, 0),
    at(width - 1, 0),
    at(0, height - 1),
    at(width - 1, height - 1),
    at(12, 12),
    at(width - 13, 12),
    at(Math.floor(width / 2), 8),
  ]
  const r = Math.round(samples.reduce((s, p) => s + p[0], 0) / samples.length)
  const g = Math.round(samples.reduce((s, p) => s + p[1], 0) / samples.length)
  const b = Math.round(samples.reduce((s, p) => s + p[2], 0) / samples.length)
  return [r, g, b]
}

function detectMode(bg: [number, number, number]): 'flood' | 'black' | 'checker' {
  const [r, g, b] = bg
  const avg = (r + g + b) / 3
  const c = chroma(r, g, b)
  if (avg <= 40 && c <= 20) return 'black'
  if (c <= 14 && avg >= 170) return 'checker'
  return 'flood'
}

function keyByThreshold(
  data: Uint8ClampedArray,
  mode: 'black' | 'checker',
) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]
    const c = chroma(r, g, b)
    const avg = (r + g + b) / 3

    if (mode === 'black') {
      if (avg <= 36 && c <= 18) data[i + 3] = 0
      else if (avg < 55 && c <= 28) {
        data[i + 3] = Math.round(a * Math.min(1, (avg - 36) / 20))
      }
      continue
    }

    if (c <= 14 && avg >= 170 && avg <= 245) data[i + 3] = 0
    else if (c <= 22 && avg >= 155 && avg <= 250) {
      const chromaT = Math.min(1, c / 22)
      const bandDist =
        avg < 170 ? (170 - avg) / 15 : avg > 245 ? (avg - 245) / 10 : 0
      const keep = Math.max(chromaT, Math.min(1, bandDist))
      data[i + 3] = Math.round(a * keep)
    }
  }
}

/**
 * Flood-fill from the frame border. Tuned for textured green studio plates.
 */
function keyByFlood(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  bg: [number, number, number],
) {
  // Looser thresholds — leather/green texture varies a lot frame-to-frame
  const hard = 62
  const soft = 105
  const n = width * height
  const matched = new Uint8Array(n)
  const queue = new Int32Array(n)
  let qh = 0
  let qt = 0

  const tryPush = (x: number, y: number) => {
    const idx = y * width + x
    if (matched[idx]) return
    const i = idx * 4
    const p: [number, number, number] = [data[i], data[i + 1], data[i + 2]]
    const d = colorDist(p, bg)
    // Prefer greenish low-chroma noise as background when close enough
    const c = chroma(p[0], p[1], p[2])
    const greenish = p[1] >= p[0] - 8 && p[1] >= p[2] - 4
    const allow = d <= soft || (greenish && c <= 55 && d <= soft + 28)
    if (allow) {
      matched[idx] = 1
      queue[qt++] = idx
    }
  }

  for (let x = 0; x < width; x += 1) {
    tryPush(x, 0)
    tryPush(x, height - 1)
  }
  for (let y = 0; y < height; y += 1) {
    tryPush(0, y)
    tryPush(width - 1, y)
  }

  while (qh < qt) {
    const idx = queue[qh++]
    const x = idx % width
    const y = (idx / width) | 0
    if (x > 0) tryPush(x - 1, y)
    if (x + 1 < width) tryPush(x + 1, y)
    if (y > 0) tryPush(x, y - 1)
    if (y + 1 < height) tryPush(x, y + 1)
  }

  for (let idx = 0; idx < n; idx += 1) {
    if (!matched[idx]) continue
    const i = idx * 4
    const d = colorDist([data[i], data[i + 1], data[i + 2]], bg)
    if (d <= hard) data[i + 3] = 0
    else {
      const t = (d - hard) / (soft - hard)
      data[i + 3] = Math.round(data[i + 3] * Math.min(1, Math.max(0, t)))
    }
  }

  // Remove isolated sparkles sitting on keyed void
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const avg = (r + g + b) / 3
    const c = chroma(r, g, b)
    if (avg > 200 && c < 40) {
      const idx = (i / 4) | 0
      const x = idx % width
      const y = (idx / width) | 0
      let voidN = 0
      for (let dy = -2; dy <= 2; dy += 1) {
        for (let dx = -2; dx <= 2; dx += 1) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          if (data[(ny * width + nx) * 4 + 3] === 0) voidN += 1
        }
      }
      if (voidN >= 10) data[i + 3] = 0
    }
  }
}

export function keyBlackToCanvas(
  source: CanvasImageSource & {
    width?: number
    naturalWidth?: number
    height?: number
    naturalHeight?: number
  },
  options: KeyBackgroundOptions = {},
): HTMLCanvasElement {
  const { maxEdge = 1100 } = options

  const srcW =
    'naturalWidth' in source && source.naturalWidth
      ? source.naturalWidth
      : (source as HTMLCanvasElement).width
  const srcH =
    'naturalHeight' in source && source.naturalHeight
      ? source.naturalHeight
      : (source as HTMLCanvasElement).height

  const scale = Math.min(1, maxEdge / Math.max(srcW, srcH))
  const width = Math.max(1, Math.round(srcW * scale))
  const height = Math.max(1, Math.round(srcH * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return canvas

  ctx.drawImage(source, 0, 0, width, height)
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const bg = sampleCorners(data, width, height)
  const mode = detectMode(bg)

  if (mode === 'flood') keyByFlood(data, width, height, bg)
  else keyByThreshold(data, mode)

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

export const removeFrameBackground = keyBlackToCanvas
