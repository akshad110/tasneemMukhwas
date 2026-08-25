import { motion } from 'framer-motion'
import { BRAND_CREAM, BRAND_CREAM_LIGHT } from '../../lib/brand'

const OUTER_BORDER = '2px solid rgba(184,134,11,0.42)'
const INNER_BORDER = '1px solid rgba(184,134,11,0.26)'

type ProductCardSkeletonProps = {
  index?: number
}

/** Placeholder card — shimmer blocks matching ShopProductCard layout. */
export default function ProductCardSkeleton({ index = 0 }: ProductCardSkeletonProps) {
  return (
    <motion.article
      className="flex min-w-0 flex-col overflow-hidden rounded-[1.05rem] p-[4px] min-[480px]:rounded-[1.35rem] min-[480px]:p-[5px]"
      style={{
        backgroundColor: BRAND_CREAM_LIGHT,
        border: OUTER_BORDER,
        boxShadow: '0 18px 40px -28px rgba(10,46,34,0.18)',
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      aria-hidden
    >
      <div
        className="flex flex-1 flex-col rounded-[0.9rem] p-[3px] min-[480px]:rounded-[1.12rem] min-[480px]:p-[4px]"
        style={{
          backgroundColor: BRAND_CREAM_LIGHT,
          border: INNER_BORDER,
        }}
      >
        <div className="flex flex-col rounded-[0.8rem] p-1.5 min-[480px]:p-2 sm:p-2.5">
          <div
            className="product-skeleton-block h-[108px] w-full rounded-md min-[480px]:h-[118px] min-[480px]:rounded-lg sm:h-[128px]"
            style={{ backgroundColor: BRAND_CREAM }}
          />
          <div className="product-skeleton-block mt-1.5 h-3 w-[55%] self-center rounded-md min-[480px]:mt-2 min-[480px]:h-4" />
          <div className="product-skeleton-block mt-1 h-4 w-[85%] self-center rounded-md min-[480px]:mt-1.5" />
          <div className="mt-1.5 flex flex-col items-center gap-1 min-[480px]:flex-row min-[480px]:justify-between">
            <div className="product-skeleton-block h-3 w-[40%] rounded-full min-[480px]:h-3.5 min-[480px]:w-[45%]" />
            <div className="product-skeleton-block h-3 w-[28%] rounded-md" />
          </div>
          <div className="mt-1.5 flex flex-col gap-1.5 min-[480px]:flex-row min-[480px]:justify-between">
            <div className="product-skeleton-block h-5 w-[35%] rounded-md" />
            <div className="product-skeleton-block h-5 w-[50%] rounded-full min-[480px]:w-[45%]" />
          </div>
          <div className="mt-auto grid grid-cols-2 gap-1 pt-1.5 min-[480px]:gap-1.5">
            <div className="product-skeleton-block min-h-[40px] rounded-full min-[480px]:min-h-[36px]" />
            <div className="product-skeleton-block min-h-[40px] rounded-full min-[480px]:min-h-[36px]" />
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export function ProductCardSkeletonGrid({
  count = 4,
  className = 'grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 min-[480px]:gap-3 md:grid-cols-3 xl:grid-cols-4 items-stretch',
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={className} aria-busy aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} index={i} />
      ))}
    </div>
  )
}
