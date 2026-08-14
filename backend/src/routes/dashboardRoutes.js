import { Router } from 'express'
import { getDashboard } from '../controllers/dashboardController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, requireAdmin, getDashboard)

export default router
