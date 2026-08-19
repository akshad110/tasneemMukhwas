import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

export type ShowcaseProduct = {
  id: string
  name: string
  description: string
  image: string
  fill: string
  lightText?: boolean
  /** Optional decorative panel pattern (sits behind content) */
  panelBg?: string
  panelBgOpacity?: number
  ingredients?: string
}

export const PRODUCTS: ShowcaseProduct[] = [
  {
    id: 'shahi',
    name: 'Shahi Mukhwas',
    description:
      'Premium quality digestive mouth freshener. Tradition that freshens every bite.',
    image: '/products/shahi-mukhwas.png',
    fill: '#6b1018',
    lightText: true,
    panelBg: '/products/shahi-pattern-bg.jpeg',
    panelBgOpacity: 0.28,
    ingredients:
      'Sesame Seeds, Coriander Seeds, Fennel Seeds, Dil Seeds, Rock Salt, Turmeric.',
  },
  {
    id: 'mango-slice',
    name: 'Mango Slice Mukhwas',
    description:
      'Bright mango-slice crunch with classic mukhwas warmth. Tradition that freshens every bite.',
    image: '/products/mango-slice-mukhwas.png',
    fill: '#eab126',
    lightText: false,
    panelBg: '/products/mango-slice-pattern-bg.jpeg',
    panelBgOpacity: 0.28,
    ingredients:
      'Dried Mango Pulp, Sugar, Dry Mango Powder, Salt, Black Pepper, Cumin, Black Salt.',
  },
  {
    id: 'paan-shots',
    name: 'Paan Shots Mukhwas',
    description:
      'Glossy paan shots in a premium mix — fun, fresh, and flavourful after every feast.',
    image: '/products/paan-shots-mukhwas.png',
    fill: '#c8e6d1',
    lightText: false,
    panelBg: '/products/paan-shots-pattern-bg.png',
    panelBgOpacity: 0.28,
    ingredients:
      'Betel Leaves, Gulkand, Fennel Seeds, Desiccated Coconut, Dried Fruits, Rose Petals, Melon Seeds, Paan Masala, Edible Green Colored Desiccated Coconut.',
  },
  {
    id: 'mouth-freshener',
    name: 'Mouth Freshener Mukhwas',
    description:
      'Fun. Fresh. Flavourful. Tradition that freshens every bite.',
    image: '/products/mouth-freshener-mukhwas.png',
    fill: '#004865',
    lightText: true,
    panelBg: '/products/mouth-freshener-pattern-bg.jpeg',
    panelBgOpacity: 0.28,
    ingredients:
      'Coriander Seeds, Fennel Seeds, Sweet Vermicelli, Sugar Coated Fennel Seeds, Lovely.',
  },
  {
    id: 'alsi-til',
    name: 'Alsi Til Mukhwas',
    description:
      'Flax and sesame seeds in a timeless blend. Tradition that freshens every bite.',
    image: '/products/alsi-til-mukhwas.png',
    fill: '#4b1916',
    lightText: true,
    panelBg: '/products/alsi-til-pattern-bg.png',
    panelBgOpacity: 0.28,
    ingredients: 'Sesame Seeds, Dry Mango Seeds, Rock Salt.',
  },
]

type PanelProps = {
  product: ShowcaseProduct
  open: boolean
  onOpen: () => void
}

/** ~4–5 words per line for narrow copy columns. */
function wrapWords(text: string, wordsPerLine = 4): string {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(' '))
  }
  return lines.join('\n')
}

function ProductPanel({ product, open, onOpen }: PanelProps) {
  const ink = product.lightText ? '#f2f4f5' : '#111111'
  const hasIngredients = Boolean(product.ingredients)

  return (
    <motion.button
      type="button"
      layout
      onClick={onOpen}
      className="relative min-h-[170px] overflow-hidden border-0 p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#f2f4f5]/60 md:min-h-0 md:h-full"
      style={{
        backgroundColor: product.fill,
        flexGrow: open ? 3.1 : 0.72,
        flexShrink: 1,
        flexBasis: 0,
        cursor: open ? 'default' : 'pointer',
      }}
      transition={{ type: 'spring', stiffness: 120, damping: 22, mass: 0.7 }}
      aria-expanded={open}
      aria-label={product.name}
    >
      {product.panelBg && (
        <img
          src={product.panelBg}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ opacity: product.panelBgOpacity ?? 0.28 }}
          draggable={false}
        />
      )}
      <div
        className={`relative z-10 flex h-full min-h-0 w-full ${
          open
            ? 'flex-col items-stretch justify-start px-2 pb-3 pt-2 md:px-3 md:pb-4 md:pt-3'
            : 'flex-col items-center justify-end px-1 pb-3 pt-2'
        }`}
      >
        {/* 1 — Product name */}
        <motion.h3
          layout="position"
          className={`m-0 max-w-full shrink-0 text-center font-semibold uppercase ${
            open
              ? 'mb-1 w-full px-1 text-[clamp(0.68rem,1.1vw,0.95rem)] leading-[1.15] tracking-wide'
              : 'mb-0 text-[0.72rem] leading-none tracking-[0.1em] md:text-[0.82rem] lg:text-[0.9rem]'
          }`}
          style={{
            color: ink,
            fontFamily: 'Poppins, Inter, sans-serif',
            writingMode: open ? 'horizontal-tb' : 'vertical-rl',
            transform: open ? undefined : 'rotate(180deg)',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
            hyphens: 'auto',
          }}
        >
          {product.name}
        </motion.h3>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="body"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="grid min-h-0 w-full flex-1 grid-cols-[minmax(0,52%)_minmax(0,1fr)] items-stretch gap-2 px-0.5 pb-1 pt-1 md:gap-2.5 md:px-1 md:pb-2 md:pt-1.5"
            >
              {/* Image — left column */}
              <div className="flex min-h-[190px] min-w-0 items-center justify-center self-stretch md:min-h-[260px]">
                <img
                  src={product.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full max-h-[210px] w-auto max-w-[min(100%,195px)] object-contain object-center drop-shadow-lg md:max-h-[290px] md:max-w-[min(100%,250px)]"
                  draggable={false}
                />
              </div>

              {/* Copy — right column */}
              <div className="flex min-w-0 flex-col justify-center gap-1.5 pr-0.5 text-left md:gap-2 md:pr-1">
                <p
                  className="m-0 text-[0.52rem] leading-[1.45] md:text-[0.58rem]"
                  style={{
                    color: ink,
                    fontFamily: 'Poppins, Inter, sans-serif',
                    opacity: 0.9,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {wrapWords(product.description, 5)}
                </p>
                {hasIngredients && (
                  <p
                    className="m-0 text-[0.48rem] leading-[1.45] md:text-[0.52rem]"
                    style={{
                      color: ink,
                      fontFamily: 'Poppins, Inter, sans-serif',
                      opacity: 0.88,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    <span className="font-semibold uppercase tracking-[0.06em]">Ingredients:</span>
                    {'\n'}
                    {wrapWords(product.ingredients!, 4)}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}

/**
 * 5-product expandable showcase — Framer Team Showcase interaction pattern
 * (one open column + collapsed siblings), content order: name → image → description.
 */
export default function ProductAccordion() {
  const [openId, setOpenId] = useState(PRODUCTS[0].id)

  return (
    <div
      className="flex w-full flex-col overflow-hidden md:h-[min(420px,42vw)] md:min-h-[320px] md:max-h-[440px] md:flex-row md:flex-nowrap"
      role="list"
      aria-label="Product showcase"
    >
      {PRODUCTS.map((product) => (
        <ProductPanel
          key={product.id}
          product={product}
          open={openId === product.id}
          onOpen={() => setOpenId(product.id)}
        />
      ))}
    </div>
  )
}
