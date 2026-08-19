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
      className="flex flex-col overflow-hidden rounded-xl border p-2.5 sm:p-3"
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
      <div className="product-skeleton-block aspect-[4/3] max-h-[148px] w-full rounded-lg sm:max-h-[160px]" />
      <div className="product-skeleton-block mt-2 h-4 w-[78%] rounded-md" />
      <div className="product-skeleton-block mt-1.5 h-4 w-[42%] rounded-full" />
      <div className="product-skeleton-block mt-1.5 h-3 w-[55%] rounded-md" />
      <div className="product-skeleton-block mt-1.5 h-5 w-[38%] rounded-md" />
      <div className="product-skeleton-block mt-2.5 h-8 w-full rounded-md" />
    </motion.article>
  )
}

export function ProductCardSkeletonGrid({
  count = 4,
  className = 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3',
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
