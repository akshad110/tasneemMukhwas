import { Router } from 'express'
import authRoutes from './authRoutes.js'
import productRoutes from './productRoutes.js'
import orderRoutes from './orderRoutes.js'
import reviewRoutes from './reviewRoutes.js'
import wishlistRoutes from './wishlistRoutes.js'
import customerRoutes from './customerRoutes.js'
import transactionRoutes from './transactionRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API healthy', data: { uptime: process.uptime() } })
})

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/orders', orderRoutes)
router.use('/reviews', reviewRoutes)
router.use('/wishlist', wishlistRoutes)
router.use('/customers', customerRoutes)
router.use('/transactions', transactionRoutes)
router.use('/dashboard', dashboardRoutes)

export default router
