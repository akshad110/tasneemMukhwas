import { ApiRequestError } from './api'
import { productsApi } from './services'
import { getProductImages, type ShopProduct } from './shopCatalog'

type ImagePayload = { image: string; images: string[] }

const imageCache = new Map<string, ImagePayload>()
const imageInflight = new Map<string, Promise<ImagePayload>>()
const listeners = new Set<(productId: string) => void>()

let prefetchGen = 0
let prefetchPromise: Promise<void> | null = null

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function notify(productId: string) {
  listeners.forEach((fn) => fn(productId))
}

function store(productId: string, data: ImagePayload) {
  imageCache.set(productId, data)
  notify(productId)
}

export function getCachedProductImages(productId: string): string[] {
  const cached = imageCache.get(productId)
  if (!cached) return []
  return (cached.images?.length ? cached.images : cached.image ? [cached.image] : []).filter(Boolean)
}

export function subscribeProductImages(listener: (productId: string) => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function productNeedsImageFetch(product: ShopProduct) {
  if (getCachedProductImages(product.id).length) return false
  if (getProductImages(product).length) return false
  return product.hasStoredImage !== false
}

export function whenImagesPrefetchDone() {
  return prefetchPromise ?? Promise.resolve()
}

async function fetchBatchWithRetry(ids: string[]) {
  const MAX_ATTEMPTS = 6
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      return await productsApi.batchImages(ids)
    } catch (err) {
      const status = err instanceof ApiRequestError ? err.status : 0
      const retryable = status === 503 || status === 502 || status === 504 || status === 0
      if (retryable && attempt < MAX_ATTEMPTS - 1) {
        await sleep(Math.min(400 * 2 ** attempt, 3000))
        continue
      }
      throw err
    }
  }
  return {}
}

export async function loadProductImages(productId: string) {
  const cached = imageCache.get(productId)
  if (cached) return cached

  const pending = imageInflight.get(productId)
  if (pending) return pending

  const promise = productsApi
    .getImages(productId)
    .then((data) => {
      store(productId, data)
      imageInflight.delete(productId)
      return data
    })
    .catch((err) => {
      imageInflight.delete(productId)
      throw err
    })

  imageInflight.set(productId, promise)
  return promise
}

/** Warm the cache for shop cards — small batches, retry while DB connects. */
export function prefetchProductImages(products: ShopProduct[]) {
  const gen = ++prefetchGen
  const missing = products.filter(productNeedsImageFetch).map((p) => p.id)
  if (!missing.length) {
    prefetchPromise = Promise.resolve()
    return prefetchPromise
  }

  prefetchPromise = (async () => {
    const CHUNK = 4
    for (let i = 0; i < missing.length; i += CHUNK) {
      if (gen !== prefetchGen) return
      const chunk = missing.slice(i, i + CHUNK)
      try {
        const batch = await fetchBatchWithRetry(chunk)
        if (gen !== prefetchGen) return
        for (const [id, payload] of Object.entries(batch)) {
          store(id, payload)
        }
      } catch {
        for (const id of chunk) {
          if (gen !== prefetchGen) return
          try {
            await loadProductImages(id)
          } catch {
            /* try next product */
          }
          await sleep(120)
        }
      }
    }
  })()

  return prefetchPromise
}

export function primeProductImages(productId: string, data: ImagePayload) {
  store(productId, data)
}

export function resolveProductThumb(product: ShopProduct, fallback = '/products/shahi-mukhwas.png') {
  const cached = getCachedProductImages(product.id)
  if (cached[0]) return cached[0]
  const inline = getProductImages(product)
  if (inline[0]) return inline[0]
  return fallback
}
