import { Router } from 'express'
import { getCustomer, listCustomers } from '../controllers/customerController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.use(authenticate, requireAdmin)
router.get('/', listCustomers)
router.get('/:id', getCustomer)

export default router
