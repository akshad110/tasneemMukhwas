import { useEffect, useState } from 'react'
import { ApiRequestError } from '../../lib/api'
import { notificationsApi, type AppNotification } from '../../lib/services'
import { ACCOUNT_GOLD, ACCOUNT_MUTED } from '../../lib/accountTheme'

function typeLabel(type: string) {
  if (type === 'payment_received') return 'Payment'
  if (type === 'payment_pending') return 'Payment pending'
  if (type === 'order_shipped' || type === 'order_status') return 'Shipped'
  if (type === 'order_completed') return 'Delivered'
  if (type === 'order_placed' || type === 'order_confirmed') return 'Order confirmed'
  if (type === 'discount_campaign' || type === 'discount_available') return 'Offer'
  return 'Update'
}

/** In-app notification feed for order & payment tracking */
export default function UserNotificationsFeed() {
  const [items, setItems] = useState<AppNotification[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    notificationsApi
      .mine()
      .then((res) => {
        setItems(res.items)
        setUnread(res.unread)
      })
      .catch((err) => {
        setError(err instanceof ApiRequestError ? err.message : 'Could not load notifications')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const markAllRead = async () => {
    try {
      await notificationsApi.readAll()
      setItems((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnread(0)
    } catch {
      /* ignore */
    }
  }

  const markRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id)
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      setUnread((u) => Math.max(0, u - 1))
    } catch {
      /* ignore */
    }
  }

  if (loading) {
    return (
      <p className="m-0 py-4 text-[0.85rem]" style={{ color: ACCOUNT_MUTED }}>
        Loading your notifications…
      </p>
    )
  }

  if (error) {
    return (
      <p className="m-0 py-4 text-[0.85rem]" style={{ color: '#a32020' }}>
        {error}
      </p>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-[0.82rem]" style={{ color: ACCOUNT_MUTED }}>
          {unread > 0 ? `${unread} unread · ` : ''}
          Track payments, shipping, and offers in one place.
        </p>
        {unread > 0 ? (
          <button
            type="button"
            onClick={() => void markAllRead()}
            className="settings-main-card__link-btn"
          >
            Mark all read
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="m-0 py-6 text-center text-[0.85rem]" style={{ color: ACCOUNT_MUTED }}>
          No notifications yet. When you place an order or receive a payment update, it will show here.
        </p>
      ) : (
        <ul className="m-0 list-none space-y-0 p-0">
          {items.map((n) => (
            <li
              key={n.id}
              className={`settings-notif-row ${n.read ? '' : 'settings-notif-row--unread'}`}
            >
              <div className="settings-notif-row__meta">
                <span className="settings-notif-row__type">{typeLabel(n.type)}</span>
                <time className="settings-notif-row__time">
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                </time>
              </div>
              <p className="settings-notif-row__title">{n.title}</p>
              <p className="settings-notif-row__body">{n.body}</p>
              {n.orderNumber ? (
                <p className="settings-notif-row__order">Order {n.orderNumber}</p>
              ) : null}
              {n.couponCode ? (
                <p className="settings-notif-row__code" style={{ color: ACCOUNT_GOLD }}>
                  Code: {n.couponCode}
                </p>
              ) : null}
              {!n.read ? (
                <button
                  type="button"
                  onClick={() => void markRead(n.id)}
                  className="settings-main-card__link-btn mt-2"
                >
                  Mark read
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
