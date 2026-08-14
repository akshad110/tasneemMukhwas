import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  productCreateSchema,
  productUpdateSchema,
  updateProduct,
} from '../controllers/productController.js'
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.get('/', optionalAuth, listProducts)
router.get('/:id', optionalAuth, getProduct)
router.post('/', authenticate, requireAdmin, validate(productCreateSchema), createProduct)
router.patch('/:id', authenticate, requireAdmin, validate(productUpdateSchema), updateProduct)
router.delete('/:id', authenticate, requireAdmin, deleteProduct)

export default router
