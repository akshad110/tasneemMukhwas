import type { ReactNode } from 'react'

export type WellnessBenefit = {
  label: string
  icon: ReactNode
}

const ICON_STROKE = '#4a4a4a'

function IconWrap({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" className="wellness-benefits__icon-svg" fill="none" aria-hidden>
      {children}
    </svg>
  )
}

export const WELLNESS_BENEFITS: WellnessBenefit[] = [
  {
    label: 'Stress Relief',
    icon: (
      <IconWrap>
        <circle cx="24" cy="28" r="7" stroke={ICON_STROKE} strokeWidth="1.6" />
        <path
          d="M24 21v-2.5M18.5 23.5l-1.8-1.8M29.5 23.5l1.8-1.8M17 29h-2.2M33 29h2.2"
          stroke={ICON_STROKE}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16 14c1.2-2.2 3.4-3.5 5.8-3.5M32 14c-1.2-2.2-3.4-3.5-5.8-3.5"
          stroke={ICON_STROKE}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M19 11.5c.8-1.4 2.2-2.3 3.8-2.3M29 11.5c-.8-1.4-2.2-2.3-3.8-2.3"
          stroke={ICON_STROKE}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M21.5 9.5c.4-.8 1.2-1.3 2.1-1.3M26.5 9.5c-.4-.8-1.2-1.3-2.1-1.3"
          stroke={ICON_STROKE}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </IconWrap>
    ),
  },
  {
    label: 'Boost Energy',
    icon: (
      <IconWrap>
        <path
          d="M26.5 8 18 26h7.5l-1.5 14 10-19.5H24.5L26.5 8Z"
          stroke={ICON_STROKE}
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </IconWrap>
    ),
  },
  {
    label: 'Immunity',
    icon: (
      <IconWrap>
        <path
          d="M24 8 14 12.5v8.8c0 6.2 4.2 10.5 10 12.2 5.8-1.7 10-6 10-12.2v-8.8L24 8Z"
          stroke={ICON_STROKE}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M24 18v10M19 23h10" stroke={ICON_STROKE} strokeWidth="1.8" strokeLinecap="round" />
      </IconWrap>
    ),
  },
  {
    label: 'Digestive Aid',
    icon: (
      <IconWrap>
        <path
          d="M18 16c0-3.3 2.7-6 6-6s6 2.7 6 6c0 2.2-1.2 4.1-3 5.2v2.3c0 2.8-2.2 5-5 5h-4c-2.8 0-5-2.2-5-5v-2.3c-1.8-1.1-3-3-3-5.2Z"
          stroke={ICON_STROKE}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M21 31.5c1.2 1.8 3 3 5 3.2M27 34.7c1.2.8 2.6 1.3 4.2 1.3"
          stroke={ICON_STROKE}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </IconWrap>
    ),
  },
  {
    label: 'Healing',
    icon: (
      <IconWrap>
        <path
          d="M14 30c2.5-4 6.5-6.5 10-6.5s7.5 2.5 10 6.5"
          stroke={ICON_STROKE}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16.5 30c1.8-2.8 4.5-4.5 7.5-4.5s5.7 1.7 7.5 4.5"
          stroke={ICON_STROKE}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M24 18v8" stroke={ICON_STROKE} strokeWidth="1.6" strokeLinecap="round" />
        <path
          d="M20.5 21.5 24 18l3.5 3.5"
          stroke={ICON_STROKE}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 14.5c.8-.8 1.9-1.3 3-1.3s2.2.5 3 1.3"
          stroke={ICON_STROKE}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </IconWrap>
    ),
  },
  {
    label: 'Nutrition Boost',
    icon: (
      <IconWrap>
        <rect x="13" y="11" width="17" height="22" rx="2" stroke={ICON_STROKE} strokeWidth="1.6" />
        <path d="M17 17h9M17 22h9M17 27h5.5" stroke={ICON_STROKE} strokeWidth="1.6" strokeLinecap="round" />
        <path
          d="M33.5 27.5c0-2.5 1.8-3.8 3.2-3.8 1.8 0 2.8 1.4 2.8 3.2 0 2.6-2.4 4.8-4.2 6.2-.4.3-.8.3-1.2 0-1.8-1.4-4.6-3.6-4.6-6.2 0-1.8 1-3.2 2.8-3.2 1.4 0 3.2 1.3 3.2 3.8Z"
          stroke={ICON_STROKE}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M36.8 24.2v1.2" stroke={ICON_STROKE} strokeWidth="1.4" strokeLinecap="round" />
      </IconWrap>
    ),
  },
  {
    label: 'Healthy Lifestyle',
    icon: (
      <IconWrap>
        <circle cx="24" cy="14.5" r="3" stroke={ICON_STROKE} strokeWidth="1.6" />
        <path
          d="M18.5 34c1.2-5.5 3.2-8.5 5.5-8.5s4.3 3 5.5 8.5M24 18.5v6"
          stroke={ICON_STROKE}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 24.5 24 18.5l4 6"
          stroke={ICON_STROKE}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 16.5 13.8 18M36 16.5 34.2 18M11 24.5h2M35 24.5h2M13 31.5l1.6-1.2M35 31.5l-1.6-1.2"
          stroke={ICON_STROKE}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </IconWrap>
    ),
  },
  {
    label: 'Weight Management',
    icon: (
      <IconWrap>
        <rect x="12" y="16" width="24" height="18" rx="3" stroke={ICON_STROKE} strokeWidth="1.6" />
        <circle cx="24" cy="25" r="5.5" stroke={ICON_STROKE} strokeWidth="1.6" />
        <path d="M24 19.5v11" stroke={ICON_STROKE} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M21.5 25h5" stroke={ICON_STROKE} strokeWidth="1.6" strokeLinecap="round" />
      </IconWrap>
    ),
  },
]
