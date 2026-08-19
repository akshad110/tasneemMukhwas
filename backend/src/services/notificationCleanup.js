import { Notification } from '../models/Notification.js'

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000

/** Remove user notifications older than 2 days. */
export async function purgeExpiredUserNotifications() {
  const cutoff = new Date(Date.now() - TWO_DAYS_MS)
  const result = await Notification.deleteMany({
    user: { $exists: true, $ne: null },
    createdAt: { $lt: cutoff },
  })
  if (result.deletedCount > 0) {
    console.log(`[notifications] Purged ${result.deletedCount} expired user notification(s)`)
  }
  return result.deletedCount
}

export function startNotificationCleanupJob() {
  void purgeExpiredUserNotifications()
  const id = setInterval(() => {
    void purgeExpiredUserNotifications()
  }, 60 * 60 * 1000)
  return id
}

export { TWO_DAYS_MS }
