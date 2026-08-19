import { Router } from 'express'
import {
  createCoupon,
  deleteCoupon,
  listActivePromos,
  listCoupons,
  regenerateCouponCode,
  updateCoupon,
  validateCoupon,
} from '../controllers/couponController.js'
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/active', listActivePromos)
router.post('/validate', optionalAuth, validateCoupon)

router.get('/', authenticate, requireAdmin, listCoupons)
router.post('/', authenticate, requireAdmin, createCoupon)
router.patch('/:id', authenticate, requireAdmin, updateCoupon)
router.delete('/:id', authenticate, requireAdmin, deleteCoupon)
router.post('/:id/regenerate-code', authenticate, requireAdmin, regenerateCouponCode)

export default router
