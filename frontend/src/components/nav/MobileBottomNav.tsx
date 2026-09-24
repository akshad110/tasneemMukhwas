import type { ReactElement } from 'react'
import { BRAND_GOLD } from '../../lib/brand'
import type { SectionId } from '../../lib/sectionNav'

const GOLD = BRAND_GOLD
const MUTED = 'rgba(10,46,34,0.52)'

type TabItem = {
  id: SectionId
  label: string
  Icon: ({ active }: { active: boolean }) => ReactElement
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" strokeLinejoin="round" />
    </svg>
  )
}

function ShopIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M6 6h15l-1.4 8.2H7.4L6 6Z" strokeLinejoin="round" />
      <path d="M6 6 5 3H2" strokeLinecap="round" />
      <circle cx="9.5" cy="19.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="19.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function AboutIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 10.5v5" strokeLinecap="round" />
      <circle cx="12" cy="7.75" r="0.85" fill="currentColor" stroke="none" />
    </svg>
  )
}

function WholesaleIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" strokeLinejoin="round" />
      <path d="M12 12v8M4 8.5 12 12l8-3.5 8 3.5" strokeLinejoin="round" />
    </svg>
  )
}

function ContactIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M4 6.5h16v11H4z" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" strokeLinejoin="round" />
    </svg>
  )
}

const TABS: TabItem[] = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'products', label: 'Shop', Icon: ShopIcon },
  { id: 'about', label: 'About Us', Icon: AboutIcon },
  { id: 'wholesale', label: 'Dealership', Icon: WholesaleIcon },
  { id: 'contact', label: 'Contact', Icon: ContactIcon },
]

type MobileBottomNavProps = {
  activeId: SectionId | null
  onNavigate: (id: SectionId) => void
}

export default function MobileBottomNav({ activeId, onNavigate }: MobileBottomNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[55] m-0 border-t md:hidden"
      style={{
        borderColor: 'rgba(10,46,34,0.08)',
        backgroundColor: '#ffffff',
        boxShadow: '0 -4px 20px rgba(10,46,34,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      aria-label="Mobile primary navigation"
    >
      <ul className="m-0 grid list-none grid-cols-5 px-1 py-1">
        {TABS.map((tab) => {
          const isActive = activeId === tab.id
          const { Icon } = tab
          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => onNavigate(tab.id)}
                className="flex w-full cursor-pointer flex-col items-center gap-0.5 rounded-xl border-0 bg-transparent px-0.5 py-1.5 transition"
                style={{ color: isActive ? GOLD : MUTED }}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon active={isActive} />
                <span
                  className="max-w-full truncate text-[0.58rem] font-semibold leading-none tracking-wide"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
