import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 10,
    },
  },
}

/**
 * Props for the BentoGridShowcase component.
 * Each prop represents a "slot" in the grid.
 */
interface BentoGridShowcaseProps {
  /** Slot for the top-left card (Integrations) */
  integrations: React.ReactNode
  /** Slot for the top-right card (Feature Tags) */
  featureTags: React.ReactNode
  /** Slot for the tall middle card (Main Feature) */
  mainFeature: React.ReactNode
  /** Slot for the middle-left card (Secondary Feature) */
  secondaryFeature: React.ReactNode
  /** Slot for the middle-right card (Statistic) */
  statistic: React.ReactNode
  /** Slot for the bottom-left card (Journey) */
  journey: React.ReactNode
  /** Optional class names for the grid container */
  className?: string
}

/**
 * A responsive, animated 3-column bento grid layout component.
 * It arranges six content slots in a specific 3-row vertical layout.
 */
export const BentoGridShowcase = ({
  integrations,
  featureTags,
  mainFeature,
  secondaryFeature,
  statistic,
  journey,
  className,
}: BentoGridShowcaseProps) => {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className={cn(
        'grid w-full grid-cols-1 gap-3 md:grid-cols-3 md:gap-3.5',
        'md:grid-rows-[repeat(3,minmax(0,1fr))]',
        'auto-rows-[minmax(120px,auto)] md:auto-rows-fr md:h-[min(440px,56vh)]',
        className,
      )}
    >
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {integrations}
      </motion.div>

      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-3">
        {mainFeature}
      </motion.div>

      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {featureTags}
      </motion.div>

      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {secondaryFeature}
      </motion.div>

      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-2">
        {statistic}
      </motion.div>

      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {journey}
      </motion.div>
    </motion.section>
  )
}
