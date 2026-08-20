import { useEffect, useRef, useState } from 'react'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'
import { useNotifications } from '../../context/NotificationsContext'
import { useLenisLock } from '../scroll/SmoothScroll'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const CREAM = '#f2f4f5'
const MUTED = 'rgba(10,46,34,0.58)'

function BellIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" strokeLinecap="round" />
    </svg>
  )
}

function typeLabel(type: string) {
  if (type === 'order_placed') return 'Order confirmed'
  if (type === 'payment_received') return 'Payment'
  if (type === 'payment_pending') return 'Payment pending'
  if (type === 'order_shipped') return 'Shipped'
  if (type === 'order_completed') return 'Delivered'
  if (type === 'discount_campaign' || type === 'discount_available') return 'Offer'
  return 'Update'
}

export default function NavbarNotifications({ ink }: { ink: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const { items, unread, refresh, markRead, markAllRead, removeOne, removeAll } = useNotifications()

  useLenisLock(open)

  useEffect(() => {
    if (!open) return
    void refresh(true)
  }, [open, refresh])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const deleteAll = async () => {
    if (!items.length) return
    if (!window.confirm('Delete all notifications?')) return
    await removeAll()
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md"
        style={{ color: ink }}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
      >
        <BellIcon className="h-5 w-5" />
        {unread > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[0.62rem] font-bold leading-none"
            style={{ backgroundColor: GOLD, color: INK }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed left-1/2 top-[calc(env(safe-area-inset-top,0px)+3.25rem)] z-[80] w-[min(calc(100vw-1.5rem),20rem)] -translate-x-1/2 overflow-hidden rounded-xl border shadow-lg md:absolute md:right-0 md:top-[calc(100%+8px)] md:w-[min(92vw,20rem)] md:translate-x-0"
          style={{ backgroundColor: CREAM, borderColor: 'rgba(10,46,34,0.12)' }}
        >
          <div
            className="flex items-center justify-between gap-2 border-b px-3 py-2.5"
            style={{ borderColor: 'rgba(10,46,34,0.08)' }}
          >
            <p className="m-0 text-[0.78rem] font-bold" style={{ color: INK }}>
              Notifications
            </p>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  type="button"
                  onClick={() => void markAllRead()}
                  className="cursor-pointer border-0 bg-transparent text-[0.68rem] font-semibold"
                  style={{ color: GOLD }}
                >
                  Mark all read
                </button>
              )}
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => void deleteAll()}
                  className="cursor-pointer border-0 bg-transparent text-[0.68rem] font-semibold"
                  style={{ color: 'rgba(163,32,32,0.85)' }}
                >
                  Delete all
                </button>
              )}
            </div>
          </div>

          <ul
            ref={listRef}
            className="max-h-[min(60vh,320px)] list-none overflow-y-auto overscroll-y-contain p-0 m-0 touch-pan-y"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {items.length === 0 && (
              <li className="px-4 py-8 text-center text-[0.78rem]" style={{ color: MUTED }}>
                No notifications in the last 2 days.
              </li>
            )}
            {items.map((n) => (
              <li
                key={n.id}
                className="border-b px-3 py-2.5"
                style={{
                  borderColor: 'rgba(10,46,34,0.06)',
                  backgroundColor: n.read ? 'transparent' : 'rgba(184,134,11,0.08)',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-wide" style={{ color: GOLD }}>
                      {typeLabel(n.type)}
                    </p>
                    <p className="mt-0.5 m-0 text-[0.78rem] font-semibold leading-snug" style={{ color: INK }}>
                      {n.title}
                    </p>
                    <p className="mt-0.5 m-0 text-[0.68rem] leading-snug" style={{ color: MUTED }}>
                      {n.body}
                    </p>
                    {n.orderNumber && (
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false)
                          navigateApp(APP_ROUTES.myOrders)
                        }}
                        className="mt-1 cursor-pointer border-0 bg-transparent p-0 text-[0.66rem] font-semibold underline"
                        style={{ color: INK }}
                      >
                        View order {n.orderNumber}
                      </button>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => void markRead(n.id)}
                        className="cursor-pointer border-0 bg-transparent text-[0.62rem] font-semibold"
                        style={{ color: GOLD }}
                      >
                        Read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void removeOne(n.id)}
                      className="cursor-pointer border-0 bg-transparent text-[0.62rem] font-semibold"
                      style={{ color: 'rgba(163,32,32,0.75)' }}
                      aria-label="Delete notification"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t px-3 py-2" style={{ borderColor: 'rgba(10,46,34,0.08)' }}>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                navigateApp(APP_ROUTES.settings)
              }}
              className="cursor-pointer border-0 bg-transparent text-[0.68rem] font-semibold"
              style={{ color: INK }}
            >
              All alerts in Settings →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
