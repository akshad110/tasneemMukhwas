import { useEffect, useState } from 'react'
import {
  getCachedProductImages,
  loadProductImages,
  productNeedsImageFetch,
  subscribeProductImages,
  whenImagesPrefetchDone,
} from '../../lib/productImageCache'
import { getProductImages, getProductPanelFill, type ShopProduct } from '../../lib/shopCatalog'

type ProductThumbnailProps = {
  product: ShopProduct
  alt?: string
  className?: string
  imgClassName?: string
}

function firstProductImage(product: ShopProduct) {
  const cached = getCachedProductImages(product.id)
  if (cached[0]) return cached[0]
  return getProductImages(product)[0] || ''
}

export default function ProductThumbnail({
  product,
  alt,
  className = '',
  imgClassName = 'h-full w-full object-contain object-center',
}: ProductThumbnailProps) {
  const [src, setSrc] = useState(() => firstProductImage(product))

  useEffect(() => {
    const apply = () => {
      const next = firstProductImage(product)
      if (next) {
        setSrc(next)
        return true
      }
      return false
    }

    if (apply()) return

    const unsub = subscribeProductImages((id) => {
      if (id === product.id) apply()
    })

    let cancelled = false
    void whenImagesPrefetchDone().then(() => {
      if (cancelled || apply()) return
      if (!productNeedsImageFetch(product)) return
      return loadProductImages(product.id)
        .then((data) => {
          if (cancelled) return
          const next = (data.images?.length ? data.images : data.image ? [data.image] : []).filter(
            Boolean,
          )[0]
          if (next) setSrc(next)
        })
        .catch(() => {
          /* prefetch + retry handle transient failures */
        })
    })

    return () => {
      cancelled = true
      unsub()
    }
  }, [product])

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor: getProductPanelFill(product) }}
    >
      {src ? (
        <img src={src} alt={alt ?? product.name} className={imgClassName} draggable={false} />
      ) : (
        <div className="h-full w-full animate-pulse bg-black/5" aria-hidden />
      )}
    </div>
  )
}
