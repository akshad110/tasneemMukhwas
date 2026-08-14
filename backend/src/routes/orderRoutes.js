import { Router } from 'express'
import {
  advanceOrderStatus,
  createOrder,
  createOrderSchema,
  getOrder,
  listOrders,
  updateOrderStatus,
} from '../controllers/orderController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.post('/', validate(createOrderSchema), createOrder)
router.get('/', authenticate, requireAdmin, listOrders)
router.get('/:id', authenticate, requireAdmin, getOrder)
router.patch('/:id/advance', authenticate, requireAdmin, advanceOrderStatus)
router.patch('/:id/status', authenticate, requireAdmin, updateOrderStatus)

export default router
