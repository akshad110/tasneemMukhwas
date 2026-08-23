import { motion } from 'framer-motion'

const CARD_BG = '#f8f9fa'
const BORDER = 'rgba(10,46,34,0.1)'

type ProductCardSkeletonProps = {
  index?: number
}

/** Placeholder card — shimmer blocks matching ShopProductCard layout. */
export default function ProductCardSkeleton({ index = 0 }: ProductCardSkeletonProps) {
  return (
    <motion.article
      className="flex min-w-0 flex-col overflow-hidden rounded-[1.05rem] border p-1.5 min-[480px]:rounded-xl min-[480px]:p-2.5 sm:p-3"
      style={{
        backgroundColor: CARD_BG,
        borderColor: BORDER,
        boxShadow: '0 18px 40px -28px rgba(10,46,34,0.2)',
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      aria-hidden
    >
      <div className="product-skeleton-block h-[108px] w-full rounded-md min-[480px]:h-[118px] min-[480px]:rounded-lg sm:h-[128px]" />
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
