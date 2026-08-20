import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useLayoutEffect, useMemo, useState } from 'react'

export type ShowcaseProduct = {
  id: string
  name: string
  description: string
  image: string
  fill: string
  lightText?: boolean
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

const PANEL_SPRING = { type: 'spring' as const, stiffness: 90, damping: 20, mass: 0.85 }
const CONTENT_EASE = [0.22, 1, 0.36, 1] as const

function wrapWords(text: string, wordsPerLine = 4): string {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(' '))
  }
  return lines.join('\n')
}

function PanelBackground({ product }: { product: ShowcaseProduct }) {
  if (!product.panelBg) return null
  return (
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
  )
}

function ProductDetailBody({
  product,
  stacked = false,
}: {
  product: ShowcaseProduct
  stacked?: boolean
}) {
  const ink = product.lightText ? '#f2f4f5' : '#111111'
  const hasIngredients = Boolean(product.ingredients)

  return (
    <div
      className={`relative z-10 grid w-full grid-cols-1 items-stretch gap-4 px-3 pb-4 pt-3 md:gap-5 md:px-4 md:pb-5 md:pt-4 ${
        stacked ? '' : 'lg:grid-cols-[minmax(0,52%)_minmax(0,1fr)] lg:gap-2.5 lg:px-1 lg:pb-2 lg:pt-1.5'
      }`}
    >
      <div
        className={`flex min-w-0 items-center justify-center self-stretch ${
          stacked ? 'min-h-[200px] md:min-h-[240px]' : 'min-h-[200px] md:min-h-[240px] lg:min-h-[260px]'
        }`}
      >
        <motion.img
          layoutId={`product-image-${product.id}`}
          src={product.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full max-h-[220px] w-auto max-w-[min(100%,220px)] object-contain object-center drop-shadow-lg md:max-h-[260px] md:max-w-[min(100%,240px)] lg:max-h-[290px] lg:max-w-[min(100%,250px)]"
          draggable={false}
          transition={PANEL_SPRING}
        />
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-2 px-1 text-left md:gap-2.5 md:px-2 lg:gap-2 lg:pr-1">
        <p
          className="m-0 text-[0.72rem] leading-[1.5] md:text-[0.78rem] lg:text-[0.58rem] lg:leading-[1.45]"
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
            className="m-0 text-[0.68rem] leading-[1.5] md:text-[0.72rem] lg:text-[0.52rem] lg:leading-[1.45]"
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
    </div>
  )
}

function StackedProductTabs({
  openId,
  onSelect,
}: {
  openId: string
  onSelect: (id: string) => void
}) {
  const active = PRODUCTS.find((p) => p.id === openId) ?? PRODUCTS[0]

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-2" role="tablist" aria-label="Choose a product">
        {PRODUCTS.map((product) => {
          const selected = openId === product.id
          const ink = product.lightText ? '#f2f4f5' : '#111111'
          return (
            <motion.button
              key={product.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onSelect(product.id)}
              className="relative min-h-[52px] overflow-hidden border-0 px-3 py-3 text-center outline-none focus-visible:ring-2 focus-visible:ring-[#f2f4f5]/60"
              style={{ backgroundColor: product.fill }}
              animate={{ opacity: selected ? 1 : 0.92 }}
              whileTap={{ scale: 0.995 }}
              transition={{ duration: 0.2 }}
            >
              <PanelBackground product={product} />
              <span
                className="relative z-10 text-[0.78rem] font-semibold uppercase leading-snug tracking-[0.06em] md:text-[0.82rem]"
                style={{ color: ink, fontFamily: 'Poppins, Inter, sans-serif' }}
              >
                {product.name}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="relative min-h-[min(380px,68vh)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            role="tabpanel"
            aria-label={active.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.38, ease: CONTENT_EASE }}
            className="relative overflow-hidden"
            style={{ backgroundColor: active.fill }}
          >
            <PanelBackground product={active} />
            <h3
              className="relative z-10 m-0 px-3 pt-4 text-center text-[clamp(0.85rem,2.5vw,1.05rem)] font-semibold uppercase leading-[1.2] tracking-wide md:px-4 md:pt-5"
              style={{
                color: active.lightText ? '#f2f4f5' : '#111111',
                fontFamily: 'Poppins, Inter, sans-serif',
              }}
            >
              {active.name}
            </h3>
            <ProductDetailBody product={active} stacked />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

type PanelProps = {
  product: ShowcaseProduct
  open: boolean
  onOpen: () => void
}

function DesktopProductPanel({ product, open, onOpen }: PanelProps) {
  const ink = product.lightText ? '#f2f4f5' : '#111111'

  return (
    <motion.button
      type="button"
      layout
      onClick={onOpen}
      className="relative h-full min-h-0 overflow-hidden border-0 p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#f2f4f5]/60"
      style={{
        backgroundColor: product.fill,
        flexGrow: open ? 3.1 : 0.72,
        flexShrink: 1,
        flexBasis: 0,
        cursor: open ? 'default' : 'pointer',
      }}
      transition={PANEL_SPRING}
      aria-expanded={open}
      aria-label={product.name}
    >
      <PanelBackground product={product} />
      <div
        className={`relative z-10 flex h-full min-h-0 w-full ${
          open
            ? 'flex-col items-stretch justify-start px-3 pb-4 pt-3'
            : 'flex-col items-center justify-end px-1 pb-3 pt-2'
        }`}
      >
        <motion.h3
          layout="position"
          className={`m-0 max-w-full shrink-0 text-center font-semibold uppercase ${
            open
              ? 'mb-2 w-full px-1 text-[clamp(0.68rem,1.1vw,0.95rem)] leading-[1.15] tracking-wide'
              : 'mb-0 text-[0.82rem] leading-none tracking-[0.1em] xl:text-[0.9rem]'
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
          transition={PANEL_SPRING}
        >
          {product.name}
        </motion.h3>

        <AnimatePresence initial={false} mode="wait">
          {open && (
            <motion.div
              key="body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: CONTENT_EASE }}
              className="min-h-0 w-full flex-1"
            >
              <ProductDetailBody product={product} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}

export default function ProductAccordion() {
  const [openId, setOpenId] = useState(PRODUCTS[0].id)
  const [stacked, setStacked] = useState(false)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const update = () => setStacked(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const desktop = useMemo(
    () =>
      stacked ? null : (
        <LayoutGroup id="popular-products">
          <div
            className="flex h-[min(420px,42vw)] min-h-[320px] max-h-[440px] w-full flex-row flex-nowrap overflow-hidden"
            role="list"
            aria-label="Product showcase"
          >
            {PRODUCTS.map((product) => (
              <DesktopProductPanel
                key={product.id}
                product={product}
                open={openId === product.id}
                onOpen={() => setOpenId(product.id)}
              />
            ))}
          </div>
        </LayoutGroup>
      ),
    [openId, stacked],
  )

  if (stacked) {
    return <StackedProductTabs openId={openId} onSelect={setOpenId} />
  }

  return desktop
}
