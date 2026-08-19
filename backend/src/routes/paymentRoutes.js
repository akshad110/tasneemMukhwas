import { Router } from 'express'
import {
  cancelRazorpayPayment,
  verifyRazorpayPayment,
} from '../controllers/paymentController.js'
import { optionalAuth } from '../middleware/auth.js'

const router = Router()

router.post('/razorpay/verify', optionalAuth, verifyRazorpayPayment)
router.post('/razorpay/cancel', optionalAuth, cancelRazorpayPayment)

export default router
