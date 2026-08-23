const MAX_EDGE = 720
const JPEG_QUALITY = 0.82

/** Resize and compress uploads so shop cards load faster. */
export async function compressProductImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    return readFileAsDataUrl(file)
  }

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      return readFileAsDataUrl(file)
    }

    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const compressed = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
    if (compressed.length < file.size || compressed.startsWith('data:image/jpeg')) {
      return compressed
    }
    return readFileAsDataUrl(file)
  } catch {
    return readFileAsDataUrl(file)
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
