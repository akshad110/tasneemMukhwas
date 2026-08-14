/**
 * Native character reveal — Framer workaround #10.
 * Replaces RichText character-tokenization that lays glyphs off-screen.
 */
import { motion } from 'framer-motion'

type BrandRevealProps = {
  text: string
  color?: string
}

export default function BrandReveal({
  text,
  color = 'rgb(0, 0, 0)',
}: BrandRevealProps) {
  return (
    <h2
      aria-label={text}
      className="m-0 flex overflow-hidden whitespace-pre"
      style={{
        color,
        fontFamily: '"Inter Display", "Inter Display Placeholder", sans-serif',
        fontSize: 24,
        fontWeight: 400,
        letterSpacing: '-0.05em',
        lineHeight: 1,
      }}
    >
      {Array.from(text).map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          initial={{ opacity: 0.001, y: 10, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 40,
            mass: 1,
            delay: i * 0.05,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </h2>
  )
}
