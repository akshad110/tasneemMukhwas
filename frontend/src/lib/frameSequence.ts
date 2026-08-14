/**
 * Build an ordered list of frame URLs.
 * Easy to swap sequences later by changing start/end or folder.
 */
export function buildNumberedFrames(options: {
  folder: string
  prefix: string
  start: number
  end: number
  extension?: string
  pad?: number
}): string[] {
  const { folder, prefix, start, end, extension = 'jpg', pad = 3 } = options
  const frames: string[] = []
  const from = Math.min(start, end)
  const to = Math.max(start, end)

  for (let i = from; i <= to; i += 1) {
    const n = String(i).padStart(pad, '0')
    frames.push(`${folder}/${prefix}${n}.${extension}`)
  }

  return frames
}

/**
 * Full pouch open/reveal sequence.
 * Folder numbering starts at 001 (no 000) → treat as frames 0…300 for UX.
 */
export const PRODUCT_REVEAL_FRAMES = buildNumberedFrames({
  folder: '/ezgif-285eda13a89a4d70-jpg',
  prefix: 'ezgif-frame-',
  start: 1,
  end: 300,
  extension: 'jpg',
  pad: 3,
})
