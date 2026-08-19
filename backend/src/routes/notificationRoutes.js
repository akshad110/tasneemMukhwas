import { Router } from 'express'
import {
  listAdminNotifications,
  listMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../controllers/notificationController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/mine', authenticate, listMyNotifications)
router.patch('/mine/read-all', authenticate, markAllNotificationsRead)
router.patch('/:id/read', authenticate, markNotificationRead)

router.get('/admin', authenticate, requireAdmin, listAdminNotifications)

export default router
