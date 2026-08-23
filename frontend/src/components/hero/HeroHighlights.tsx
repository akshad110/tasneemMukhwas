type Highlight = {
  title: string
  body: string
  side: 'left' | 'right'
  slot: 'mid' | 'low'
}

const HIGHLIGHTS: Highlight[] = [
  {
    title: 'Premium Quality',
    body: 'Carefully selected ingredients for authentic taste and freshness.',
    side: 'left',
    slot: 'mid',
  },
  {
    title: 'Traditional Goodness',
    body: 'Rooted in Indian traditions, crafted with time-honored recipes.',
    side: 'left',
    slot: 'low',
  },
  {
    title: 'Hygienic Processing',
    body: 'Modern facilities ensuring cleanliness, safety, and consistent quality.',
    side: 'right',
    slot: 'mid',
  },
  {
    title: 'Customer Delight',
    body: 'Committed to delivering freshness that brings a smile every time.',
    side: 'right',
    slot: 'low',
  },
]

/** Appear order: left mid → right mid → left low → right low */
const ORDER = [0, 2, 1, 3] as const

const PARA_WHITE = '#ffffff'

function HighlightCard({
  item,
  align,
}: {
  item: Highlight
  align: 'left' | 'right'
}) {
  const isRight = align === 'right'

  return (
    <article
      className={`w-full max-w-[18.5rem] ${isRight ? 'ml-auto text-right' : 'mr-auto text-left'}`}
      style={{ textAlign: isRight ? 'right' : 'left' }}
    >
      <h3
        className="permanent-marker-regular m-0 text-[1.35rem] leading-[1.15] tracking-wide text-[#f2f4f5] md:text-[1.5rem]"
        style={{ textAlign: isRight ? 'right' : 'left' }}
      >
        {item.title}
      </h3>
      <p
        className="mt-2 text-[1rem] leading-relaxed md:text-[1.05rem]"
        style={{
          fontFamily: 'Inter, sans-serif',
          color: PARA_WHITE,
          textAlign: isRight ? 'right' : 'left',
        }}
      >
        {item.body}
      </p>
    </article>
  )
}

export default function HeroHighlights() {
  const leftMid = HIGHLIGHTS[0]
  const leftLow = HIGHLIGHTS[1]
  const rightMid = HIGHLIGHTS[2]
  const rightLow = HIGHLIGHTS[3]

  return (
    <>
      <aside className="pointer-events-none absolute inset-y-[2%] left-0 z-[2] hidden w-[min(24vw,280px)] lg:block">
        <div className="absolute top-[6%] left-2 xl:left-4">
          <HighlightCard item={leftMid} align="left" />
        </div>
        <div className="absolute bottom-[12%] left-2 xl:left-4">
          <HighlightCard item={leftLow} align="left" />
        </div>
      </aside>

      <aside className="pointer-events-none absolute inset-y-[2%] right-0 z-[2] hidden w-[min(24vw,280px)] lg:block">
        <div className="absolute top-[6%] right-2 left-2 xl:right-4 xl:left-4">
          <HighlightCard item={rightMid} align="right" />
        </div>
        <div className="absolute bottom-[12%] right-2 left-2 xl:right-4 xl:left-4">
          <HighlightCard item={rightLow} align="right" />
        </div>
      </aside>

      <div className="relative z-[2] mt-8 grid w-full grid-cols-1 gap-10 px-1 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-12 lg:hidden">
        {ORDER.map((idx) => {
          const item = HIGHLIGHTS[idx]
          return (
            <HighlightCard
              key={item.title}
              item={item}
              align={item.side}
            />
          )
        })}
      </div>
    </>
  )
}
