import { ApiRequestError } from './api'
import { productsApi } from './services'
import { getProductImages, type ShopProduct } from './shopCatalog'

type ImagePayload = { image: string; images: string[] }

const imageCache = new Map<string, ImagePayload>()
const imageInflight = new Map<string, Promise<ImagePayload>>()
const listeners = new Set<(productId: string) => void>()

const IMAGE_SESSION_KEY = 'tm-product-images-v1'
const IMAGE_SESSION_TTL_MS = 15 * 60_000
const BATCH_CHUNK = 24
const BATCH_CONCURRENCY = 3

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

function readImageSession(): Record<string, ImagePayload> {
  try {
    const raw = sessionStorage.getItem(IMAGE_SESSION_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as { ts?: number; items?: Record<string, ImagePayload> }
    if (!parsed.ts || Date.now() - parsed.ts > IMAGE_SESSION_TTL_MS) return {}
    return parsed.items ?? {}
  } catch {
    return {}
  }
}

function writeImageSession() {
  try {
    const items: Record<string, ImagePayload> = {}
    imageCache.forEach((value, key) => {
      items[key] = value
    })
    sessionStorage.setItem(IMAGE_SESSION_KEY, JSON.stringify({ ts: Date.now(), items }))
  } catch {
    /* quota / private mode */
  }
}

function restoreImageSession(ids?: string[]) {
  const saved = readImageSession()
  const keys = ids?.length ? ids : Object.keys(saved)
  for (const id of keys) {
    const payload = saved[id]
    if (payload?.image || payload?.images?.length) {
      imageCache.set(id, payload)
    }
  }
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

const adminQueue: string[] = []
let adminActive = 0
const ADMIN_CONCURRENCY = 4

function pumpAdminImageQueue() {
  while (adminActive < ADMIN_CONCURRENCY && adminQueue.length) {
    const id = adminQueue.shift()!
    if (imageCache.has(id) || imageInflight.has(id)) continue
    adminActive += 1
    loadProductImages(id)
      .catch(() => {})
      .finally(() => {
        adminActive -= 1
        pumpAdminImageQueue()
      })
  }
}

/** Queue a single product image for admin thumbs — low concurrency, no batch API. */
export function queueAdminProductImage(productId: string) {
  if (!productId || imageCache.has(productId) || imageInflight.has(productId)) return
  if (adminQueue.includes(productId)) return
  adminQueue.push(productId)
  pumpAdminImageQueue()
}

/** Batch-load admin thumbs — faster than one-by-one queue. */
export function prefetchAdminProductImages(productIds: string[]) {
  const missing = productIds.filter((id) => id && !imageCache.has(id))
  if (!missing.length) return Promise.resolve()
  return prefetchIds(missing)
}

export function whenImagesPrefetchDone() {
  return prefetchPromise ?? Promise.resolve()
}

async function fetchBatchWithRetry(ids: string[]) {
  const MAX_ATTEMPTS = 4
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      const batch = await productsApi.batchImages(ids)
      for (const [id, payload] of Object.entries(batch)) {
        store(id, payload)
      }
      writeImageSession()
      return batch
    } catch (err) {
      const status = err instanceof ApiRequestError ? err.status : 0
      const retryable = status === 503 || status === 502 || status === 504 || status === 0
      if (retryable && attempt < MAX_ATTEMPTS - 1) {
        await sleep(Math.min(250 * 2 ** attempt, 1200))
        continue
      }
      throw err
    }
  }
  return {}
}

async function prefetchIds(ids: string[]) {
  const chunks: string[][] = []
  for (let i = 0; i < ids.length; i += BATCH_CHUNK) {
    chunks.push(ids.slice(i, i + BATCH_CHUNK))
  }

  let cursor = 0
  async function worker() {
    while (cursor < chunks.length) {
      const index = cursor
      cursor += 1
      const chunk = chunks[index]
      if (!chunk?.length) continue
      try {
        await fetchBatchWithRetry(chunk)
      } catch {
        for (const id of chunk) {
          try {
            await loadProductImages(id)
          } catch {
            /* try next product */
          }
        }
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(BATCH_CONCURRENCY, chunks.length) }, () => worker()))
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
      writeImageSession()
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

/** Warm the cache for shop cards — parallel batches with session restore. */
export function prefetchProductImages(products: ShopProduct[]) {
  const gen = ++prefetchGen
  restoreImageSession(products.map((p) => p.id))

  const missing = products.filter(productNeedsImageFetch).map((p) => p.id)
  if (!missing.length) {
    prefetchPromise = Promise.resolve()
    return prefetchPromise
  }

  prefetchPromise = (async () => {
    if (gen !== prefetchGen) return
    await prefetchIds(missing)
  })()

  return prefetchPromise
}

export function primeProductImages(productId: string, data: ImagePayload) {
  store(productId, data)
  writeImageSession()
}

export function resolveProductThumb(product: ShopProduct, fallback = '') {
  const cached = getCachedProductImages(product.id)
  if (cached[0]) return cached[0]
  const inline = getProductImages(product)
  if (inline[0]) return inline[0]
  return fallback
}

restoreImageSession()
