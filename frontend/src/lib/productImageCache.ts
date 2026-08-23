import { productsApi } from './services'

const cache = new Map<string, { image: string; images: string[] }>()
const inflight = new Map<string, Promise<{ image: string; images: string[] }>>()

export async function loadProductImages(productId: string) {
  const cached = cache.get(productId)
  if (cached) return cached

  const pending = inflight.get(productId)
  if (pending) return pending

  const promise = productsApi
    .getImages(productId)
    .then((data) => {
      cache.set(productId, data)
      inflight.delete(productId)
      return data
    })
    .catch((err) => {
      inflight.delete(productId)
      throw err
    })

  inflight.set(productId, promise)
  return promise
}
