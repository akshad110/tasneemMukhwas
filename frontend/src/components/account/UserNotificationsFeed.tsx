import { useEffect, useState } from 'react'
import { useNotifications } from '../../context/NotificationsContext'
import { ACCOUNT_GOLD, ACCOUNT_MUTED } from '../../lib/accountTheme'
import DeleteNotificationDialog from '../shared/DeleteNotificationDialog'
import type { AppNotification } from '../../lib/services'

function typeLabel(type: string) {
  if (type === 'payment_received') return 'Payment'
  if (type === 'payment_pending') return 'Payment pending'
  if (type === 'order_shipped' || type === 'order_status') return 'Shipped'
  if (type === 'order_completed') return 'Delivered'
  if (type === 'order_placed' || type === 'order_confirmed') return 'Order confirmed'
  if (type === 'discount_campaign' || type === 'discount_available') return 'Offer'
  return 'Update'
}

type PendingDelete =
  | { mode: 'one'; notification: AppNotification }
  | { mode: 'all' }
  | null

/** In-app notification feed for order & payment tracking */
export default function UserNotificationsFeed() {
  const { items, unread, loading, refresh, markRead, markAllRead, removeOne, removeAll } =
    useNotifications()
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    void refresh(true)
  }, [refresh])

  const confirmDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      if (pendingDelete.mode === 'one') {
        await removeOne(pendingDelete.notification.id)
      } else {
        await removeAll()
      }
      setPendingDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  const deleteMessage =
    pendingDelete?.mode === 'all'
      ? 'This will permanently remove all your notifications. This cannot be undone.'
      : pendingDelete?.mode === 'one'
        ? `Remove "${pendingDelete.notification.title}"? This cannot be undone.`
        : ''

  if (loading && items.length === 0) {
    return (
      <p className="m-0 py-4 text-[0.85rem]" style={{ color: ACCOUNT_MUTED }}>
        Loading your notifications…
      </p>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-[0.82rem]" style={{ color: ACCOUNT_MUTED }}>
          {unread > 0 ? `${unread} unread · ` : ''}
          Auto-removed after 2 days · delete anytime below.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {unread > 0 ? (
            <button
              type="button"
              onClick={() => void markAllRead()}
              className="settings-main-card__link-btn"
            >
              Mark all read
            </button>
          ) : null}
          {items.length > 0 ? (
            <button
              type="button"
              onClick={() => setPendingDelete({ mode: 'all' })}
              className="settings-main-card__link-btn"
              style={{ color: '#a32020' }}
            >
              Delete all
            </button>
          ) : null}
        </div>
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
              <button
                type="button"
                onClick={() => setPendingDelete({ mode: 'one', notification: n })}
                className="settings-main-card__link-btn mt-2 ml-3"
                style={{ color: '#a32020' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <DeleteNotificationDialog
        open={Boolean(pendingDelete)}
        title={pendingDelete?.mode === 'all' ? 'Delete all notifications?' : 'Delete notification?'}
        message={deleteMessage}
        deleting={deleting}
        onCancel={() => {
          if (!deleting) setPendingDelete(null)
        }}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  )
}
