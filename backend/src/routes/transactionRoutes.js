import { Router } from 'express'
import { getTransaction, listTransactions } from '../controllers/transactionController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.use(authenticate, requireAdmin)
router.get('/', listTransactions)
router.get('/:id', getTransaction)

export default router
