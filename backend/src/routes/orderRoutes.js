import { Router } from 'express'
import {
  advanceOrderStatus,
  createOrder,
  createOrderSchema,
  getOrder,
  listMyOrders,
  listOrders,
  updateOrderStatus,
} from '../controllers/orderController.js'
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.post('/', optionalAuth, validate(createOrderSchema), createOrder)
router.get('/mine', authenticate, listMyOrders)
router.get('/', authenticate, requireAdmin, listOrders)
router.get('/:id', authenticate, requireAdmin, getOrder)
router.patch('/:id/advance', authenticate, requireAdmin, advanceOrderStatus)
router.patch('/:id/status', authenticate, requireAdmin, updateOrderStatus)

export default router
