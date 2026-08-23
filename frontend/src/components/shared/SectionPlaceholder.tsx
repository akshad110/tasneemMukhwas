type SectionPlaceholderProps = {
  minHeight?: string | number
  className?: string
}

/** Reserved space for deferred home sections — avoids layout shift. */
export default function SectionPlaceholder({
  minHeight = '50vh',
  className = 'bg-white',
}: SectionPlaceholderProps) {
  return (
    <div
      className={className}
      style={{ minHeight }}
      aria-hidden
    />
  )
}
