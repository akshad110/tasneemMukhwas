import { z } from 'zod'
import { Notification } from '../models/Notification.js'
import { User } from '../models/User.js'
import { ApiError, asyncHandler, sendSuccess } from '../utils/asyncHandler.js'
import { isMailConfigured } from '../services/mail.js'
import { ADMIN_IN_APP_TYPES, TWO_DAYS_MS } from '../services/notificationService.js'

export const listMyNotifications = asyncHandler(async (req, res) => {
  const cutoff = new Date(Date.now() - TWO_DAYS_MS)
  await Notification.deleteMany({ user: req.user._id, createdAt: { $lt: cutoff } })

  const items = await Notification.find({
    user: req.user._id,
    createdAt: { $gte: cutoff },
  })
    .sort({ createdAt: -1 })
    .limit(50)

  const unread = await Notification.countDocuments({
    user: req.user._id,
    read: false,
    createdAt: { $gte: cutoff },
  })

  return sendSuccess(res, {
    data: {
      items: items.map((n) => n.toPublicJSON()),
      unread,
      mailConfigured: isMailConfigured(),
    },
  })
})

export const listAdminNotifications = asyncHandler(async (req, res) => {
  const { type } = req.query
  const adminIds = await User.find({ role: 'admin', isActive: true }).distinct('_id')

  const filter = {
    user: { $in: adminIds },
    channel: 'in_app',
    type: { $in: ADMIN_IN_APP_TYPES },
  }
  if (type && type !== 'all') filter.type = type

  const items = await Notification.find(filter).sort({ createdAt: -1 }).limit(100)
  const counts = await Notification.aggregate([
    { $match: { user: { $in: adminIds }, channel: 'in_app', type: { $in: ADMIN_IN_APP_TYPES } } },
    { $group: { _id: '$type', count: { $sum: 1 } } },
  ]).then((rows) =>
    rows.reduce((acc, r) => {
      acc[r._id] = r.count
      return acc
    }, {}),
  )

  return sendSuccess(res, {
    data: {
      items: items.map((n) => n.toPublicJSON()),
      counts,
      mailConfigured: isMailConfigured(),
    },
  })
})

export const markNotificationRead = asyncHandler(async (req, res) => {
  const note = await Notification.findOne({ _id: req.params.id, user: req.user._id })
  if (!note) throw new ApiError(404, 'Notification not found')

  note.read = true
  await note.save()

  return sendSuccess(res, { data: note.toPublicJSON() })
})

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true })
  return sendSuccess(res, { message: 'All notifications marked read' })
})

const readSchema = z.object({
  ids: z.array(z.string()).optional(),
})

export const markNotificationsReadBulk = asyncHandler(async (req, res) => {
  const body = readSchema.parse(req.body)
  const filter = { user: req.user._id, read: false }
  if (body.ids?.length) filter._id = { $in: body.ids }

  await Notification.updateMany(filter, { read: true })
  return sendSuccess(res, { message: 'Notifications updated' })
})
