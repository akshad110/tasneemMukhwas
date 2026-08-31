import { Router } from 'express'
import authRoutes from './authRoutes.js'
import productRoutes from './productRoutes.js'
import orderRoutes from './orderRoutes.js'
import paymentRoutes from './paymentRoutes.js'
import reviewRoutes from './reviewRoutes.js'
import wishlistRoutes from './wishlistRoutes.js'
import customerRoutes from './customerRoutes.js'
import transactionRoutes from './transactionRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
import couponRoutes from './couponRoutes.js'
import campaignRoutes from './campaignRoutes.js'
import notificationRoutes from './notificationRoutes.js'
import categoryRoutes from './categoryRoutes.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API healthy', data: { uptime: process.uptime() } })
})

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/orders', orderRoutes)
router.use('/payments', paymentRoutes)
router.use('/reviews', reviewRoutes)
router.use('/wishlist', wishlistRoutes)
router.use('/customers', customerRoutes)
router.use('/transactions', transactionRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/coupons', couponRoutes)
router.use('/campaigns', campaignRoutes)
router.use('/notifications', notificationRoutes)

export default router
