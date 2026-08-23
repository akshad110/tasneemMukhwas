import { Router } from 'express'
import {
  deleteAllAdminNotifications,
  deleteAllMyNotifications,
  deleteAdminNotification,
  deleteNotification,
  listAdminNotifications,
  listMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../controllers/notificationController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/mine', authenticate, listMyNotifications)
router.patch('/mine/read-all', authenticate, markAllNotificationsRead)
router.delete('/mine', authenticate, deleteAllMyNotifications)

router.get('/admin', authenticate, requireAdmin, listAdminNotifications)
router.delete('/admin', authenticate, requireAdmin, deleteAllAdminNotifications)
router.delete('/admin/:id', authenticate, requireAdmin, deleteAdminNotification)

router.patch('/:id/read', authenticate, markNotificationRead)
router.delete('/:id', authenticate, deleteNotification)

export default router
