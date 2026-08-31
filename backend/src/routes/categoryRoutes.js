import { Router } from 'express'
import { createCategory, deleteCategory, listCategories } from '../controllers/categoryController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', listCategories)
router.post('/', authenticate, requireAdmin, createCategory)
router.delete('/:id', authenticate, requireAdmin, deleteCategory)

export default router
