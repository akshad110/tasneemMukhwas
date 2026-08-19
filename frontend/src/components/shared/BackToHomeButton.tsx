import { motion } from 'framer-motion'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'

const INK = '#0a2e22'
const CREAM = '#f2f4f5'
const GOLD = '#b8860b'
const EASE = [0.22, 1, 0.36, 1] as const

type BackToHomeButtonProps = {
  variant?: 'light' | 'dark'
  className?: string
}

/** Return / Back to home — matches know-more page pattern. */
export default function BackToHomeButton({ variant = 'light', className = 'mb-8' }: BackToHomeButtonProps) {
  const isDark = variant === 'dark'

  return (
    <motion.button
      type="button"
      onClick={() => navigateApp(APP_ROUTES.home)}
      className={`group inline-flex shrink-0 cursor-pointer items-center gap-3 border-0 bg-transparent px-0 py-0 ${className}`}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
          isDark
            ? 'border-white/20 bg-white/8 backdrop-blur-sm group-hover:border-white/40'
            : 'border-[rgba(10,46,34,0.22)] bg-white group-hover:border-[rgba(10,46,34,0.35)]'
        }`}
        style={{ color: isDark ? CREAM : INK }}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="flex flex-col items-start gap-0.5 text-left">
        <span
          className="text-[0.62rem] font-semibold tracking-[0.16em] uppercase"
          style={{ color: isDark ? 'rgba(242,244,245,0.55)' : GOLD, fontFamily: 'Inter, sans-serif' }}
        >
          Return
        </span>
        <span
          className="text-[0.88rem] font-semibold"
          style={{ color: isDark ? CREAM : INK, fontFamily: 'Inter, sans-serif' }}
        >
          Back to home
        </span>
      </span>
    </motion.button>
  )
}
