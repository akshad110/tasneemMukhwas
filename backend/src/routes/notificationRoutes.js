import { Router } from 'express'
import {
  deleteAllMyNotifications,
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
router.patch('/:id/read', authenticate, markNotificationRead)
router.delete('/:id', authenticate, deleteNotification)

router.get('/admin', authenticate, requireAdmin, listAdminNotifications)

export default router
