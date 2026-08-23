/** Lightweight placeholder while lazy routes or sections load. */
export default function PageFallback({ label = 'Loading' }: { label?: string }) {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center bg-white"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0a2e22]/20 border-t-[#0a2e22]" />
    </div>
  )
}
